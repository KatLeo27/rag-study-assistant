import os
import uuid
import json
import sqlite3
import hashlib
import secrets
import logging
import datetime
from typing import List, Dict, Any
from config import settings

logger = logging.getLogger("ExamPrepAI.VectorDB")

try:
    import chromadb
    CHROMA_AVAILABLE = True
except ImportError:
    CHROMA_AVAILABLE = False
    logger.info("ChromaDB is not installed. Application will use the SQLite Vector Fallback.")

def hash_password(password: str) -> str:
    salt = secrets.token_hex(16)
    pwd_bytes = password.encode('utf-8')
    salt_bytes = salt.encode('utf-8')
    db_hash = hashlib.pbkdf2_hmac('sha256', pwd_bytes, salt_bytes, 100000)
    return f"{salt}:{db_hash.hex()}"

def verify_password(password: str, hashed_str: str) -> bool:
    try:
        salt, stored_hash = hashed_str.split(":")
        pwd_bytes = password.encode('utf-8')
        salt_bytes = salt.encode('utf-8')
        db_hash = hashlib.pbkdf2_hmac('sha256', pwd_bytes, salt_bytes, 100000)
        return secrets.compare_digest(db_hash.hex(), stored_hash)
    except Exception:
        return False

class SQLiteVectorDBService:
    """
    SQLite Vector Fallback database service supporting subject partitions and user separation.
    """
    def __init__(self, db_path: str):
        self.db_path = db_path

    def add_chunks(self, chunks: List[str], embeddings: List[List[float]], doc_name: str, subject: str = "General", user_id: int = 1) -> None:
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        for chunk, emb in zip(chunks, embeddings):
            chunk_id = f"{doc_name}_{uuid.uuid4()}"
            cursor.execute(
                "INSERT INTO chunks (id, text, source, subject, user_id, embedding) VALUES (?, ?, ?, ?, ?, ?)",
                (chunk_id, chunk, doc_name, subject, user_id, json.dumps(emb))
            )
        conn.commit()
        conn.close()
        logger.info(f"[SQLite Fallback] Added {len(chunks)} chunks for user '{user_id}', subject '{subject}', doc '{doc_name}'")

    def query(self, query_embedding: List[float], subject: str = "General", user_id: int = 1, top_k: int = 4) -> List[Dict[str, Any]]:
        if not query_embedding:
            return []

        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute("SELECT id, text, source, embedding FROM chunks WHERE subject = ? AND user_id = ?", (subject, user_id))
        rows = cursor.fetchall()
        conn.close()

        results = []
        for chunk_id, text, source, emb_str in rows:
            emb = json.loads(emb_str)
            distance = sum((x - y) ** 2 for x, y in zip(query_embedding, emb))
            results.append({
                "id": chunk_id,
                "text": text,
                "source": source,
                "distance": distance
            })

        results.sort(key=lambda item: item["distance"])
        return results[:top_k]

    def get_all_document_names(self, subject: str = "General", user_id: int = 1) -> List[str]:
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute("SELECT DISTINCT source FROM chunks WHERE subject = ? AND user_id = ?", (subject, user_id))
        rows = cursor.fetchall()
        conn.close()
        return sorted([row[0] for row in rows])

    def delete_document_chunks(self, doc_name: str, subject: str = "General", user_id: int = 1) -> int:
        """
        Deletes all chunks belonging to a document under the specified subject and user.
        """
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute("DELETE FROM chunks WHERE source = ? AND subject = ? AND user_id = ?", (doc_name, subject, user_id))
        deleted_count = cursor.rowcount
        conn.commit()
        conn.close()
        logger.info(f"[SQLite Fallback] Deleted {deleted_count} chunks for doc '{doc_name}' under subject '{subject}' (user '{user_id}')")
        return deleted_count


class VectorDBService:
    def __init__(self):
        self.use_fallback = not CHROMA_AVAILABLE
        self.chroma_client = None
        self.collection = None
        self.fallback_service = None
        
        self.sqlite_db_path = os.path.join(settings.CHROMA_DB_DIR, "sqlite_vector_store.db")
        self._init_auth_and_schemas()

        if CHROMA_AVAILABLE:
            try:
                self.chroma_client = chromadb.PersistentClient(path=settings.CHROMA_DB_DIR)
                self.collection = self.chroma_client.get_or_create_collection(
                    name=settings.COLLECTION_NAME
                )
                logger.info("ChromaDB persistent client successfully initialized.")
            except Exception as e:
                logger.warning(f"Failed to initialize ChromaDB. Falling back to SQLite: {str(e)}")
                self.use_fallback = True

        if self.use_fallback:
            self.fallback_service = SQLiteVectorDBService(self.sqlite_db_path)
            logger.info("Initialized local SQLite Vector Database Service.")

    def _init_auth_and_schemas(self):
        os.makedirs(settings.CHROMA_DB_DIR, exist_ok=True)
        conn = sqlite3.connect(self.sqlite_db_path)
        cursor = conn.cursor()
        
        # 1. Users table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL
            )
        """)
        
        # Initialize default user guest (ID = 1)
        cursor.execute("SELECT id FROM users WHERE id = 1")
        if not cursor.fetchone():
            cursor.execute(
                "INSERT INTO users (id, username, password_hash) VALUES (1, 'guest', ?)",
                (hash_password("guest123"),)
            )
            
        # 2. Sessions table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS sessions (
                token TEXT PRIMARY KEY,
                user_id INTEGER NOT NULL,
                expires_at DATETIME NOT NULL,
                FOREIGN KEY(user_id) REFERENCES users(id)
            )
        """)
        
        # Initialize default Google Scholar user and session for mock google auth
        cursor.execute("SELECT id FROM users WHERE username = 'Google Scholar'")
        row = cursor.fetchone()
        if not row:
            cursor.execute(
                "INSERT INTO users (username, password_hash) VALUES ('Google Scholar', ?)",
                (hash_password("google123"),)
            )
            google_user_id = cursor.lastrowid
        else:
            google_user_id = row[0]
            
        cursor.execute("SELECT token FROM sessions WHERE token = 'google_mock_token_123'")
        if not cursor.fetchone():
            expires_at = (datetime.datetime.utcnow() + datetime.timedelta(days=3650)).isoformat()
            cursor.execute(
                "INSERT INTO sessions (token, user_id, expires_at) VALUES ('google_mock_token_123', ?, ?)",
                (google_user_id, expires_at)
            )
        
        # 3. Create or migrate subjects table to contain user_id
        cursor.execute("PRAGMA table_info(subjects)")
        subj_cols = [row[1] for row in cursor.fetchall()]
        if not subj_cols:
            cursor.execute("""
                CREATE TABLE subjects (
                    name TEXT,
                    user_id INTEGER NOT NULL,
                    PRIMARY KEY (name, user_id),
                    FOREIGN KEY(user_id) REFERENCES users(id)
                )
            """)
            cursor.execute("INSERT OR IGNORE INTO subjects (name, user_id) VALUES ('General', 1)")
        elif "user_id" not in subj_cols:
            logger.info("Database migration: migrating subjects table for user separation.")
            cursor.execute("CREATE TABLE subjects_new (name TEXT, user_id INTEGER NOT NULL, PRIMARY KEY (name, user_id), FOREIGN KEY(user_id) REFERENCES users(id))")
            cursor.execute("INSERT OR IGNORE INTO subjects_new (name, user_id) SELECT name, 1 FROM subjects")
            cursor.execute("DROP TABLE subjects")
            cursor.execute("ALTER TABLE subjects_new RENAME TO subjects")
        
        cursor.execute("INSERT OR IGNORE INTO subjects (name, user_id) VALUES ('General', 1)")
        cursor.execute("INSERT OR IGNORE INTO subjects (name, user_id) VALUES ('General', ?)", (google_user_id,))
        cursor.execute("INSERT OR IGNORE INTO subjects (name, user_id) VALUES ('DBMS', ?)", (google_user_id,))
        
        # 4. Migrate chunks table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS chunks (
                id TEXT PRIMARY KEY,
                text TEXT NOT NULL,
                source TEXT NOT NULL,
                embedding TEXT NOT NULL
            )
        """)
        cursor.execute("PRAGMA table_info(chunks)")
        columns = [row[1] for row in cursor.fetchall()]
        if "user_id" not in columns:
            logger.info("Database migration: adding 'user_id' column to chunks table.")
            cursor.execute("ALTER TABLE chunks ADD COLUMN user_id INTEGER NOT NULL DEFAULT 1")
        if "subject" not in columns:
            logger.info("Database migration: adding 'subject' column to chunks table.")
            cursor.execute("ALTER TABLE chunks ADD COLUMN subject TEXT NOT NULL DEFAULT 'General'")
            
        conn.commit()
        conn.close()

    def register_user(self, username: str, password: str) -> int:
        username = username.strip()
        if not username or not password:
            raise ValueError("Username and password cannot be empty.")
            
        conn = sqlite3.connect(self.sqlite_db_path)
        cursor = conn.cursor()
        
        cursor.execute("SELECT id FROM users WHERE username = ?", (username,))
        if cursor.fetchone():
            conn.close()
            raise ValueError(f"Username '{username}' is already taken.")
            
        pwd_hash = hash_password(password)
        cursor.execute("INSERT INTO users (username, password_hash) VALUES (?, ?)", (username, pwd_hash))
        user_id = cursor.lastrowid
        
        # Create default 'General' subject for this new user
        cursor.execute("INSERT OR IGNORE INTO subjects (name, user_id) VALUES ('General', ?)", (user_id,))
        
        conn.commit()
        conn.close()
        return user_id

    def authenticate_user(self, username: str, password: str) -> str:
        username = username.strip()
        conn = sqlite3.connect(self.sqlite_db_path)
        cursor = conn.cursor()
        cursor.execute("SELECT id, password_hash FROM users WHERE username = ?", (username,))
        row = cursor.fetchone()
        if not row:
            conn.close()
            raise ValueError("Invalid username or password.")
            
        user_id, pwd_hash = row
        if not verify_password(password, pwd_hash):
            conn.close()
            raise ValueError("Invalid username or password.")
            
        token = secrets.token_hex(32)
        expires_at = (datetime.datetime.utcnow() + datetime.timedelta(days=7)).isoformat()
        cursor.execute("INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)", (token, user_id, expires_at))
        conn.commit()
        conn.close()
        return token

    def get_user_by_token(self, token: str) -> Dict[str, Any]:
        conn = sqlite3.connect(self.sqlite_db_path)
        cursor = conn.cursor()
        now = datetime.datetime.utcnow().isoformat()
        cursor.execute("""
            SELECT u.id, u.username 
            FROM sessions s 
            JOIN users u ON s.user_id = u.id 
            WHERE s.token = ? AND s.expires_at > ?
        """, (token, now))
        row = cursor.fetchone()
        conn.close()
        if row:
            return {"id": row[0], "username": row[1]}
        return None

    def logout_user(self, token: str) -> None:
        conn = sqlite3.connect(self.sqlite_db_path)
        cursor = conn.cursor()
        cursor.execute("DELETE FROM sessions WHERE token = ?", (token,))
        conn.commit()
        conn.close()

    def add_subject(self, name: str, user_id: int = 1) -> None:
        conn = sqlite3.connect(self.sqlite_db_path)
        cursor = conn.cursor()
        cursor.execute("INSERT OR IGNORE INTO subjects (name, user_id) VALUES (?, ?)", (name, user_id))
        conn.commit()
        conn.close()

    def get_all_subjects(self, user_id: int = 1) -> List[str]:
        conn = sqlite3.connect(self.sqlite_db_path)
        cursor = conn.cursor()
        cursor.execute("SELECT name FROM subjects WHERE user_id = ?", (user_id,))
        rows = cursor.fetchall()
        conn.close()
        
        subjects = [row[0] for row in rows]
        if "General" not in subjects:
            subjects.append("General")
        return sorted(subjects)

    def add_chunks(self, chunks: List[str], embeddings: List[List[float]], doc_name: str, subject: str = "General", user_id: int = 1) -> None:
        self.add_subject(subject, user_id)
        
        if self.use_fallback:
            self.fallback_service.add_chunks(chunks, embeddings, doc_name, subject, user_id)
        else:
            if not chunks:
                return
            ids = [f"{doc_name}_{uuid.uuid4()}" for _ in chunks]
            tagged_subject = f"{user_id}_{subject}"
            metadatas = [{"source": doc_name, "subject": tagged_subject} for _ in chunks]
            self.collection.add(
                ids=ids,
                embeddings=embeddings,
                metadatas=metadatas,
                documents=chunks
            )
            logger.info(f"[ChromaDB] Added {len(chunks)} chunks for user '{user_id}', subject '{subject}', doc '{doc_name}'")

    def query(self, query_embedding: List[float], subject: str = "General", user_id: int = 1, top_k: int = 4) -> List[Dict[str, Any]]:
        if self.use_fallback:
            return self.fallback_service.query(query_embedding, subject, user_id, top_k)
        
        if not query_embedding:
            return []

        tagged_subject = f"{user_id}_{subject}"
        results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=top_k,
            where={"subject": tagged_subject}
        )

        formatted_results = []
        if not results or not results["documents"] or len(results["documents"]) == 0:
            return []

        docs = results["documents"][0]
        metas = results["metadatas"][0]
        ids = results["ids"][0]
        distances = results["distances"][0] if "distances" in results and results["distances"] else [0.0] * len(docs)

        for i in range(len(docs)):
            formatted_results.append({
                "id": ids[i],
                "text": docs[i],
                "source": metas[i].get("source", "Unknown") if metas[i] else "Unknown",
                "distance": distances[i]
            })

        return formatted_results

    def get_all_document_names(self, subject: str = "General", user_id: int = 1) -> List[str]:
        if self.use_fallback:
            return self.fallback_service.get_all_document_names(subject, user_id)

        tagged_subject = f"{user_id}_{subject}"
        results = self.collection.get(
            where={"subject": tagged_subject},
            include=["metadatas"]
        )
        if not results or not results["metadatas"]:
            return []

        doc_names = set()
        for meta in results["metadatas"]:
            if meta and "source" in meta:
                doc_names.add(meta["source"])

        return sorted(list(doc_names))

    def delete_document(self, doc_name: str, subject: str = "General", user_id: int = 1) -> None:
        """
        Deletes all vector chunks belonging to the document under the given subject and user.
        """
        if self.use_fallback:
            self.fallback_service.delete_document_chunks(doc_name, subject, user_id)
        else:
            tagged_subject = f"{user_id}_{subject}"
            self.collection.delete(
                where={"source": doc_name, "subject": tagged_subject}
            )
            logger.info(f"[ChromaDB] Deleted chunks for doc '{doc_name}' under subject '{subject}' (user '{user_id}')")

vector_db_service = VectorDBService()

import os
import shutil
import logging
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, status, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any

from config import settings
from services.pdf_service import extract_text_from_pdf, chunk_text
from services.gemini_service import generate_embedding, generate_answer
from services.vector_service import vector_db_service

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("ExamPrepAI")

app = FastAPI(title="ExamPrep AI Backend", version="1.0.0")

# Enable CORS for frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Auth schemas
class AuthRequest(BaseModel):
    username: str
    password: str

class AuthResponse(BaseModel):
    token: str
    username: str

class UserProfileResponse(BaseModel):
    id: int
    username: str

# RAG schemas
class ChatRequest(BaseModel):
    question: str
    subject: str = "General"

class ChatResponse(BaseModel):
    answer: str
    sources: List[Dict[str, Any]]

class DocumentListResponse(BaseModel):
    documents: List[str]

class SubjectListResponse(BaseModel):
    subjects: List[str]

class SubjectCreateRequest(BaseModel):
    name: str

# Authentication Dependency
async def get_current_user(authorization: str = Header(None)) -> Dict[str, Any]:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid authentication credentials."
        )
    token = authorization.split(" ")[1]
    user = vector_db_service.get_user_by_token(token)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session has expired or is invalid."
        )
    return user


# Auth Routes
@app.post("/api/auth/register", status_code=status.HTTP_201_CREATED)
async def register(request: AuthRequest):
    username = request.username.strip()
    password = request.password
    if len(username) < 3:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username must be at least 3 characters long."
        )
    if len(password) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 6 characters long."
        )
    try:
        user_id = vector_db_service.register_user(username, password)
        # Auto-login after registration and return token
        token = vector_db_service.authenticate_user(username, password)
        return AuthResponse(token=token, username=username)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Error registering user: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error occurred."
        )

@app.post("/api/auth/login", response_model=AuthResponse)
async def login(request: AuthRequest):
    try:
        token = vector_db_service.authenticate_user(request.username, request.password)
        return AuthResponse(token=token, username=request.username)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Error authenticating user: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error occurred."
        )

@app.post("/api/auth/logout")
async def logout(authorization: str = Header(None)):
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ")[1]
        vector_db_service.logout_user(token)
    return {"status": "success", "message": "Successfully logged out."}

@app.get("/api/auth/me", response_model=UserProfileResponse)
async def get_me(current_user: Dict[str, Any] = Depends(get_current_user)):
    return UserProfileResponse(id=current_user["id"], username=current_user["username"])


# RAG Routes
@app.post("/api/upload", status_code=status.HTTP_201_CREATED)
async def upload_pdf(
    file: UploadFile = File(...),
    subject: str = Form("General"),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF files are supported."
        )

    filename = os.path.basename(file.filename)
    file_path = os.path.join(settings.UPLOAD_DIR, filename)

    try:
        logger.info(f"Saving uploaded PDF locally to {file_path}")
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        logger.info(f"Extracting text from {filename}")
        text = extract_text_from_pdf(file_path)
        if not text.strip():
            os.remove(file_path)
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Successfully saved PDF, but no text could be extracted from it."
            )

        logger.info(f"Chunking extracted text")
        chunks = chunk_text(text)
        logger.info(f"Generated {len(chunks)} chunks from {filename}")

        if not chunks:
            os.remove(file_path)
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Document text is too short or empty. Failed to chunk."
            )

        logger.info("Generating embeddings for chunks using Gemini API")
        embeddings = generate_embedding(chunks, is_query=False)

        logger.info(f"Storing chunks in Vector Store for user '{current_user['username']}' (ID: {current_user['id']}), subject '{subject}'")
        vector_db_service.add_chunks(
            chunks=chunks,
            embeddings=embeddings,
            doc_name=filename,
            subject=subject,
            user_id=current_user["id"]
        )

        return {
            "status": "success",
            "message": f"Successfully processed '{filename}' and stored {len(chunks)} chunks under subject '{subject}'.",
            "chunks_count": len(chunks)
        }

    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Error processing PDF upload: {str(e)}", exc_info=True)
        if os.path.exists(file_path):
            try:
                os.remove(file_path)
            except Exception:
                pass
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while processing the PDF: {str(e)}"
        )

@app.post("/api/chat", response_model=ChatResponse)
async def chat_with_docs(
    request: ChatRequest,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    question = request.question.strip()
    subject = request.subject.strip() or "General"
    
    if not question:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Question cannot be empty."
        )

    try:
        # Check if we have any documents indexed for this subject and user
        documents = vector_db_service.get_all_document_names(subject, user_id=current_user["id"])
        if not documents:
            return ChatResponse(
                answer=f"No study documents have been uploaded for the subject '{subject}' yet. Please upload a PDF study guide in the sidebar to get started!",
                sources=[]
            )

        # 1. Convert question to embedding
        logger.info(f"Generating embedding for query: '{question}'")
        query_embedding = generate_embedding(question, is_query=True)

        # 2. Retrieve relevant chunks from vector db (filtered by subject and user_id)
        logger.info(f"Querying Vector DB for relevant chunks under subject '{subject}' (user '{current_user['username']}')")
        relevant_chunks = vector_db_service.query(query_embedding, subject=subject, user_id=current_user["id"], top_k=4)

        if not relevant_chunks:
            return ChatResponse(
                answer=f"I couldn't find any relevant sections in the uploaded documents for the subject '{subject}' to answer your question.",
                sources=[]
            )

        # 3. Extract text from retrieved chunks for the prompt context
        context_texts = [chunk["text"] for chunk in relevant_chunks]

        # 4. Generate answer using Gemini
        logger.info("Generating response from Gemini based on retrieved context")
        answer = generate_answer(question, context_texts)

        # Format sources response
        sources = [
            {
                "id": chunk["id"],
                "text": chunk["text"],
                "source": chunk["source"],
                "score": float(chunk["distance"])
            }
            for chunk in relevant_chunks
        ]

        return ChatResponse(answer=answer, sources=sources)

    except Exception as e:
        logger.error(f"Error in chat workflow: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while processing your question: {str(e)}"
        )

@app.get("/api/documents", response_model=DocumentListResponse)
async def list_documents(
    subject: str = "General",
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    try:
        docs = vector_db_service.get_all_document_names(subject, user_id=current_user["id"])
        return DocumentListResponse(documents=docs)
    except Exception as e:
        logger.error(f"Error fetching document list: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch document list: {str(e)}"
        )

@app.get("/api/subjects", response_model=SubjectListResponse)
async def list_subjects(current_user: Dict[str, Any] = Depends(get_current_user)):
    try:
        subjects = vector_db_service.get_all_subjects(user_id=current_user["id"])
        return SubjectListResponse(subjects=subjects)
    except Exception as e:
        logger.error(f"Error fetching subjects list: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch subjects list: {str(e)}"
        )

@app.post("/api/subjects", status_code=status.HTTP_201_CREATED)
async def create_subject(
    request: SubjectCreateRequest,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    name = request.name.strip()
    if not name:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Subject name cannot be empty."
        )
    try:
        vector_db_service.add_subject(name, user_id=current_user["id"])
        return {"status": "success", "message": f"Subject '{name}' successfully registered."}
    except Exception as e:
        logger.error(f"Error creating subject: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create subject: {str(e)}"
        )

@app.delete("/api/documents")
async def delete_document(
    filename: str,
    subject: str = "General",
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    filename = os.path.basename(filename)
    try:
        logger.info(f"Deleting vector chunks for doc '{filename}' under subject '{subject}' (user '{current_user['username']}')")
        vector_db_service.delete_document(filename, subject, user_id=current_user["id"])

        # Check if reference exists in other subjects for this user
        used_elsewhere = False
        subjects = vector_db_service.get_all_subjects(user_id=current_user["id"])
        for subj in subjects:
            docs = vector_db_service.get_all_document_names(subj, user_id=current_user["id"])
            if filename in docs:
                used_elsewhere = True
                break
        
        # Delete file if not used elsewhere by anyone
        conn = sqlite3.connect(vector_db_service.sqlite_db_path)
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM chunks WHERE source = ?", (filename,))
        count = cursor.fetchone()[0]
        conn.close()
        
        if count == 0:
            file_path = os.path.join(settings.UPLOAD_DIR, filename)
            if os.path.exists(file_path):
                os.remove(file_path)
                logger.info(f"Deleted physical file '{file_path}' since it is no longer referenced by any chunk.")
            else:
                logger.warning(f"Physical file '{file_path}' not found, chunks deleted.")
        else:
            logger.info(f"Physical file '{filename}' kept because it is still referenced by other users or subjects ({count} references left).")

        return {"status": "success", "message": f"Successfully deleted '{filename}' from subject '{subject}'."}
    except Exception as e:
        logger.error(f"Error deleting document '{filename}': {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete document: {str(e)}"
        )

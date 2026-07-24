import os
import sys

# Ensure backend directory is in the path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

def test_imports():
    print("Checking backend imports...")
    required_ok = True
    try:
        import fastapi
        import uvicorn
        import pypdf
        import google.generativeai as genai
        import dotenv
        print("[OK] Required packages (fastapi, uvicorn, pypdf, google-generativeai, python-dotenv) successfully imported!")
    except ImportError as e:
        print(f"[FAIL] Required import failed: {str(e)}")
        print("Please run: pip install -r requirements.txt")
        required_ok = False

    # Check chromadb separately as it is optional (falls back to SQLite)
    try:
        import chromadb
        print("[OK] ChromaDB is installed and available.")
    except ImportError:
        print("[WARN] ChromaDB is not installed. Will use SQLite vector store fallback.")
        
    return required_ok

def test_chunking():
    print("\nTesting text chunking algorithm...")
    from services.pdf_service import chunk_text
    
    # 1200 character dummy text
    sample_text = (
        "ExamPrep AI is a powerful study assistant. " * 20
    )
    print(f"Sample text length: {len(sample_text)} characters.")
    
    chunks = chunk_text(sample_text, chunk_size=300, chunk_overlap=50)
    print(f"Generated {len(chunks)} chunks.")
    
    for i, chunk in enumerate(chunks):
        print(f"Chunk {i+1} (length {len(chunk)}): {chunk[:60]}...")
        
    if len(chunks) > 1:
        print("[OK] Chunking logic works properly!")
        return True
    else:
        print("[FAIL] Chunking failed to split text.")
        return False

def check_env():
    print("\nChecking environment configurations...")
    from config import settings
    
    print(f"Upload Directory: {settings.UPLOAD_DIR}")
    print(f"ChromaDB Directory: {settings.CHROMA_DB_DIR}")
    print(f"Chunk Size: {settings.CHUNK_SIZE}")
    print(f"Chunk Overlap: {settings.CHUNK_OVERLAP}")
    
    if settings.GEMINI_API_KEY:
        masked_key = settings.GEMINI_API_KEY[:4] + "..." + settings.GEMINI_API_KEY[-4:] if len(settings.GEMINI_API_KEY) > 8 else "Set (too short)"
        print(f"[OK] GEMINI_API_KEY is configured: {masked_key}")
    else:
        print("[WARN] GEMINI_API_KEY is NOT set in environment. Set it in backend/.env to use Gemini API.")

if __name__ == "__main__":
    print("=== ExamPrep AI Backend Verification ===")
    imports_ok = test_imports()
    if imports_ok:
        test_chunking()
        check_env()

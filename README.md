# ExamPrep AI - RAG-Powered Study Assistant

ExamPrep AI is a full-stack web application designed to help students study more efficiently. By uploading PDF textbooks, lecture notes, or study guides, users can interact with a ChatGPT-style interface that answers questions based **only** on the content of their uploaded materials.

The application leverages a RAG (Retrieval-Augmented Generation) pipeline using the Google Gemini API for text embeddings and answer generation, and a dual-mode Vector Database matching ChromaDB with a lightweight SQLite fallback for Windows environments.

---

## Key Features

1. **Local PDF Processing**: Upload one or more PDF documents. Files are stored locally and text is extracted using `PyPDF`.
2. **Smart Chunking**: Text is split into overlapping chunks of 500-1000 characters to preserve structural context.
3. **Embeddings & Vector Search**: Generates vector embeddings via the Gemini Embeddings API (`text-embedding-004`).
4. **Dual Vector Database**:
   - **ChromaDB**: Used as the default primary database.
   - **SQLite Fallback**: Automatically activates if ChromaDB cannot compile (e.g., if Microsoft Visual C++ Build Tools are missing on Windows), calculating L2 distance using optimized Python matrix-like math.
5. **ChatGPT-Style Chat Panel**: Clean, responsive layout with auto-scroll and quick-prompt suggestions.
6. **Context References**: Below each response, an expandable drawer shows the specific document chunks used to build the answer.

---

## Project Structure

```text
RAG-Based Study Assistant/
├── backend/
│   ├── config.py                 # Environment configurations & constants
│   ├── main.py                   # FastAPI backend endpoints
│   ├── requirements.txt          # Python dependencies
│   ├── verify_backend.py         # Diagnostic utility script
│   └── services/
│       ├── pdf_service.py        # PDF text extraction & chunker
│       ├── gemini_service.py     # Gemini Embedding & LLM client wrapper
│       └── vector_service.py     # Dual-mode Vector DB (ChromaDB + SQLite Fallback)
├── frontend/
│   ├── index.html
│   ├── package.json              # Node dependencies
│   ├── tailwind.config.js        # Tailwind CSS config
│   ├── postcss.config.js         # PostCSS plugins (Tailwind, Autoprefixer)
│   └── src/
│       ├── main.tsx
│       ├── App.tsx               # Orchestrator & State Coordinator
│       ├── index.css             # Main stylesheet (Tailwind & Fonts)
│       └── components/
│           ├── DocumentSidebar.tsx  # Document list & upload manager
│           ├── ChatInterface.tsx    # Message threads & chat input
│           └── SourceReference.tsx  # Context source accordion
└── README.md
```

---

## Setup & Running Guide

### Prerequisites
- **Python**: 3.10 or higher (Python 3.12 verified)
- **Node.js**: 18.x or higher

### 1. Backend Setup

1. Open a terminal in the `backend` folder:
   ```bash
   cd backend
   ```

2. Create a Python Virtual Environment:
   ```bash
   python -m venv .venv
   ```

3. Activate the virtual environment:
   - **Windows (PowerShell)**:
     ```powershell
     .\.venv\Scripts\Activate.ps1
     ```
   - **macOS / Linux**:
     ```bash
     source .venv/bin/activate
     ```

4. Install the backend dependencies:
   ```bash
   pip install -r requirements.txt
   ```
   *Note: If you have Microsoft C++ Build Tools installed and wish to run ChromaDB in full native mode, you can install it using `pip install chromadb`.*

5. Create a `.env` file in the `backend` directory:
   ```env
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   ```
   *(Get your free API Key from [Google AI Studio](https://aistudio.google.com/))*

6. Start the FastAPI backend server:
   ```bash
   uvicorn main:app --reload
   ```
   The backend server will start at [http://localhost:8000](http://localhost:8000).

### 2. Frontend Setup

1. Open a new terminal in the `frontend` folder:
   ```bash
   cd frontend
   ```

2. Install the frontend dependencies:
   ```bash
   npm install
   ```

3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
   The frontend application will start at [http://localhost:5173](http://localhost:5173).

---

## How to Test the Application

1. Open your browser and navigate to [http://localhost:5173](http://localhost:5173).
2. Look at the sidebar on the left. Click **"Upload PDF Document"** and select a study document (e.g., a syllabus, study notes, or textbook chapter).
3. Wait for the upload indicator to complete. You will see the document appear under the **"Study Materials"** list in the sidebar.
4. Type a question related specifically to the document in the bottom input bar (e.g., *"What is the main topic of chapter 1?"* or click one of the quick suggestions).
5. The assistant will answer your question using **only** details in the document.
6. Click **"RELEVANT CONTEXT SOURCES"** underneath the answer bubble to inspect the exact sentences and chunks retrieved from the PDF that informed the answer.

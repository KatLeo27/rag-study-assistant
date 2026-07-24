import pypdf
from typing import List
from config import settings

def extract_text_from_pdf(file_path: str) -> str:
    """
    Extracts plain text from a local PDF file path.
    """
    reader = pypdf.PdfReader(file_path)
    text = ""
    for page in reader.pages:
        extracted = page.extract_text()
        if extracted:
            text += extracted + "\n"
    return text

def chunk_text(text: str, chunk_size: int = None, chunk_overlap: int = None) -> List[str]:
    """
    Splits text into chunks of roughly chunk_size characters with chunk_overlap overlap.
    Tries to split on whitespaces to avoid cutting words in half.
    """
    if chunk_size is None:
        chunk_size = settings.CHUNK_SIZE
    if chunk_overlap is None:
        chunk_overlap = settings.CHUNK_OVERLAP

    if not text:
        return []

    # If the text is smaller than the chunk size, return it as a single chunk
    if len(text) <= chunk_size:
        return [text.strip()]

    chunks = []
    start = 0
    text_len = len(text)

    while start < text_len:
        end = start + chunk_size
        
        # If we aren't at the end of the text, try to find a space near the boundary
        if end < text_len:
            # Look backwards up to 50 characters for a whitespace
            boundary = text.rfind(' ', end - 50, end)
            if boundary != -1:
                end = boundary

        chunk = text[start:end].strip()
        if chunk:
            chunks.append(chunk)
            
        # Move the window
        step = chunk_size - chunk_overlap
        if step <= 0:
            # Fallback if overlap is equal to or larger than chunk size
            step = chunk_size // 2
            
        start += step

    return chunks

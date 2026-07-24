import google.generativeai as genai
from typing import List, Union
from config import settings

# Configure Gemini API
genai.configure(api_key=settings.GEMINI_API_KEY)

def generate_embedding(text: Union[str, List[str]], is_query: bool = False) -> Union[List[float], List[List[float]]]:
    """
    Generates embedding vectors using Gemini Embeddings API (models/text-embedding-004).
    Supports single text (string) or list of texts (List[str]).
    """
    if not settings.GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY is not set. Please configure it in your environment.")

    task_type = "retrieval_query" if is_query else "retrieval_document"
    
    response = genai.embed_content(
        model="models/gemini-embedding-001",
        content=text,
        task_type=task_type
    )
    
    return response['embedding']

def generate_answer(question: str, context_chunks: List[str]) -> str:
    """
    Generates an answer using gemini-2.5-flash based ON the retrieved context chunks.
    """
    if not settings.GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY is not set. Please configure it in your environment.")

    # Combine chunks into context block
    context_text = "\n\n".join([f"Source Content Chunk {i+1}:\n{chunk}" for i, chunk in enumerate(context_chunks)])
    
    prompt = f"""You are ExamPrep AI, an intelligent study assistant.
Answer the user's question using the provided retrieved context below.
Your responses must be grounded strictly on the facts and information present in the context. Do not introduce outside knowledge or facts that are not supported by the context.
However, if the user asks you to perform a task based on the context—such as generating practice questions, summarizing key concepts, creating study questions, flashcards, or explaining a topic in different words—you should fully perform that task using the information in the context as your source material.

If the user asks you to generate practice questions or study questions:
- Formulate high-quality conceptual, analytical, or practical questions that test comprehension of the subject matter.
- Focus on core definitions, principles, mechanisms, and comparison of concepts.
- NEVER generate trivial meta-questions about the document itself (such as asking for the author's name, document title, module numbers, headings, copyright info, page numbers, or file names).
- Ensure the questions generated test real understanding of the technical or academic material.

If the retrieved context is completely irrelevant to the question, or if there is no way to answer or address the request using the context (for example, if the context is about Math and the user asks about French History), state: "I cannot find the answer in the uploaded documents." and briefly explain what information is missing.

Retrieved Context:
---
{context_text}
---

Question: {question}

Please cite your explanations clearly where possible (e.g., mentioning which Source Content Chunk was used) and keep the response structured, clear, and modern.

Answer:"""

    model = genai.GenerativeModel("gemini-2.5-flash")
    
    response = model.generate_content(prompt)
    return response.text

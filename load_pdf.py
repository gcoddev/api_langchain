import os
import pickle
from PyPDF2 import PdfReader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.vectorstores import FAISS


def create_embeddings(pdf_directory, embedding_file):
    # try:
    if os.path.exists(embedding_file):
        os.remove(
            embedding_file
        )

    pdf_files = [f for f in os.listdir(pdf_directory) if f.endswith(".pdf")]
    if not pdf_files:
        print("No PDF files found in the directory.")
        return None

    text = ""
    for pdf_file in pdf_files:
        pdf_path = os.path.join(pdf_directory, pdf_file)
        print(f"Loading PDF: {pdf_path}")
        pdf_reader = PdfReader(pdf_path)
        for page in pdf_reader.pages:
            text += page.extract_text()

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=800, chunk_overlap=100, length_function=len
    )
    chunks = text_splitter.split_text(text)

    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
    )
    knowledge_base = FAISS.from_texts(chunks, embeddings)

    with open(embedding_file, "wb") as f:
        pickle.dump(knowledge_base, f)
    print("Embeddings created and saved to file.")

    return knowledge_base
    # except ImportError as e:
    #     print(f"Error importing necessary libraries: {e}")
    # except Exception as e:
    #     print(f"An error occurred: {e}")


pdf_directory = "./public/documentos/"
embedding_file = "./public/embeddings/embedding_base.pkl"

knowledge_base = create_embeddings(pdf_directory, embedding_file)

import os
import pickle
import sys
from PyPDF2 import PdfReader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.vectorstores import FAISS

pdf_obj = sys.argv[1]

def create_embeddings(pdf, embedding_file):
    try:
        if not os.path.exists(os.path.dirname(embedding_file)):
            os.makedirs(os.path.dirname(embedding_file))

        if os.path.exists(embedding_file):
            with open(embedding_file, 'rb') as f:
                knowledge_base = pickle.load(f)
            print("Embeddings loaded from file.")
        else:
            pdf_reader = PdfReader(pdf)
            text = ""
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

            with open(embedding_file, 'wb') as f:
                pickle.dump(knowledge_base, f)
            print("Embeddings created and saved to file.")

        return knowledge_base
    except ImportError as e:
        print(f"Error importing necessary libraries: {e}")
    except Exception as e:
        print(f"An error occurred: {e}")

if pdf_obj:
    name = pdf_obj.split('/')
    embedding_dir = "./public/embeddings/"
    embedding_file = os.path.join(embedding_dir, f"embeddings_{name[-1]}.pkl")

    knowledge_base = create_embeddings(pdf_obj, embedding_file)
else:
    print("No PDF file selected")
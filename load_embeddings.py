import sys
import os
import pickle
from langchain.chat_models import ChatOpenAI
from langchain.chains.question_answering import load_qa_chain
from dotenv import load_dotenv
load_dotenv()

OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')

def load_all_embeddings(embedding_dir):
    knowledge_base = None
    try:
        embedding_files = [f for f in os.listdir(embedding_dir) if f.endswith('.pkl')]

        for embedding_file in embedding_files:
            with open(os.path.join(embedding_dir, embedding_file), 'rb') as f:
                kb = pickle.load(f)
                if knowledge_base is None:
                    knowledge_base = kb
                else:
                    knowledge_base.merge_from(kb)
        print("Loaded embedding files")
        return knowledge_base
    except Exception as e:
        print(f"An error occurred while loading embeddings: {e}")
        return None

if len(sys.argv) > 1:
    user_question = sys.argv[1]
    embedding_dir = "./public/embeddings"
    knowledge_base = load_all_embeddings(embedding_dir)

    if knowledge_base:
        os.environ["OPENAI_API_KEY"] = OPENAI_API_KEY
        docs = knowledge_base.similarity_search(user_question, 3)
        llm = ChatOpenAI(model_name="gpt-3.5-turbo")
        chain = load_qa_chain(llm, chain_type="stuff")
        respuesta = chain.run(input_documents=docs, question=user_question)
        print(respuesta)
    else:
        print("No knowledge base")
else:
    print("No user question")

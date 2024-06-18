import sys
import os
import pickle
import json
from sentence_transformers import SentenceTransformer
from langchain.chat_models import ChatOpenAI
from langchain.chains.question_answering import load_qa_chain
from dotenv import load_dotenv

load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")


def save_conversation(conversation, user_id):
    filename = f"conversations/conv_{user_id}.pkl"
    with open(filename, "wb") as f:
        pickle.dump(conversation, f)


def load_conversation(user_id):
    filename = f"conversations/conv_{user_id}.pkl"
    if os.path.exists(filename):
        with open(filename, "rb") as f:
            conversation = pickle.load(f)
            context = [
                {"user_question": item.get("user_question", "")}
                for item in conversation
            ]
            return context
    else:
        return []


if len(sys.argv) > 2:
    user_question = sys.argv[1]
    user_id = sys.argv[2]

    embedding_file = "./public/embeddings/embedding_base.pkl"
    if not os.path.exists(embedding_file):
        result = {"error_message": "Embedding file not found"}
        sys.exit(json.dumps(result))

    with open(embedding_file, "rb") as f:
        knowledge_base = pickle.load(f)

    # Mensaje de embeddings cargados
    result = {"status": "success", "message": "Embeddings loaded successfully"}

    conversation = load_conversation(user_id)
    conversation.append({"user_question": user_question})

    if knowledge_base:
        os.environ["OPENAI_API_KEY"] = OPENAI_API_KEY
        try:
            docs = knowledge_base.similarity_search(user_question, 3)
            if not docs:
                result = {"error_message": "No documents found for the given query."}
                sys.exit(json.dumps(result))

            llm = ChatOpenAI(model_name="gpt-3.5-turbo")
            chain = load_qa_chain(llm, chain_type="stuff")

            respuesta = chain.run(input_documents=docs, question=user_question)
            result["respuesta"] = (
                respuesta  # Agregar la respuesta del embedding al resultado
            )
        except Exception as e:
            result = {"error_message": f"An error occurred during the QA process: {e}"}
    else:
        result = {"error_message": "No knowledge base"}

    save_conversation(conversation, user_id)
    print(json.dumps(result))

else:
    result = {"error_message": "Insufficient arguments"}
    print(json.dumps(result))

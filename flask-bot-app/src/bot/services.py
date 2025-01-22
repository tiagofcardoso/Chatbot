from langchain.document_loaders import WebBaseLoader, PyPDFLoader, YoutubeLoader
from langchain_groq import ChatGroq
from langchain.prompts import ChatPromptTemplate
import os
from dotenv import load_dotenv
import pytesseract
from PIL import Image

load_dotenv()

# Initialize Groq
api_key = os.getenv('GROQ_API_KEY')
if not api_key:
    raise ValueError("GROQ_API_KEY not found in environment variables")

os.environ['GROQ_API_KEY'] = api_key
chat = ChatGroq(model='llama-3.1-70b-versatile')

def get_bot_response(messages, document):
    """Generate bot response using the chat model"""
    system_message = '''Você é um assistente inteligente.
    Você utiliza as seguintes informações para formular as suas respostas: {informacoes}'''
    model_messages = [('system', system_message)]
    model_messages += messages
    template = ChatPromptTemplate.from_messages(model_messages)
    chain = template | chat
    return chain.invoke({'informacoes': document}).content

def load_documents_from_url(url):
    """Load and process documents from URL"""
    try:
        if not url.startswith(('http://', 'https://')):
            url = f"https://{url}"
        loader = WebBaseLoader(url)
        documents = loader.load()
        return ' '.join(doc.page_content for doc in documents)
    except Exception as e:
        return f"Error loading URL: {str(e)}"

def load_documents_from_pdf(pdf_path):
    """Load and process documents from PDF"""
    try:
        loader = PyPDFLoader(pdf_path)
        documents = loader.load()
        return ' '.join(doc.page_content for doc in documents)
    except Exception as e:
        return f"Error loading PDF: {str(e)}"

def load_documents_from_youtube(url):
    try:
        loader = YoutubeLoader.from_youtube_url(url, language=['pt'])
        documents = loader.load()
        return ' '.join(doc.page_content for doc in documents)
    except Exception as e:
        return f"Error loading YouTube video: {str(e)}"

def load_documents_from_image(image_path):
    try:
        image = Image.open(image_path)
        text = pytesseract.image_to_string(image, lang='por')
        return text
    except Exception as e:
        return f"Error processing image: {str(e)}"

def process_user_input(user_input, context=None):
    """Process user input and generate response"""
    try:
        messages = [('human', user_input)]
        document = context or "No additional context provided."
        return get_bot_response(messages, document)
    except Exception as e:
        print(f"Error in process_user_input: {str(e)}")
        raise
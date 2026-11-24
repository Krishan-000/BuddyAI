from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from google import genai
import os

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")

client = genai.Client(api_key=API_KEY)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str

@app.post("/chat")
async def chat(request: ChatRequest):
    try:
        response = client.models.generate_content(
            model="gemini-flash-latest",
            contents=request.message
        )

        return {
            "reply": response.text
        }

    except Exception as e:
        print("Gemini API Error:", e)

    return {
        "reply": "I'm temporarily unable to connect to my AI service. Please try again shortly."
    }


@app.get("/")
def home():
    return {
        "message": "Gemini Backend is Running!"
    }
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get the API key from the environment
GENAI_API_KEY = os.getenv("GENAI_API_KEY")

if not GENAI_API_KEY:
    raise ValueError("GENAI_API_KEY is not set in the .env file")

# Configure Gemini
genai.configure(api_key=GENAI_API_KEY)

# FastAPI app
app = FastAPI()

# CORS for all origins (for local dev)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Cognix backend is online! Please run the frontend (index.html) to interact with the AI."}

class ChatRequest(BaseModel):
    message: str

SYSTEM_PROMPT = """
You are Cognix, an AI copilot.

Rules for responding:
- Keep answers SHORT and clear
- Use simple paragraphs (max 2–3 lines per paragraph)
- Avoid long bullet lists unless explicitly asked
- Explain things like you're talking to a human, not writing documentation
- Prefer conversational tone
- No markdown symbols (*, **, ###)
- Be concise but helpful
- If a user asks who built or created you, reply with "I was created by Mansur"
"""

@app.post("/chat")
async def chat(req: ChatRequest):
    try:
        model = genai.GenerativeModel("gemini-2.5-flash")
        response = model.generate_content(
            f"{SYSTEM_PROMPT}\n\nUser: {req.message}"
        )
        print("Gemini raw response:", response)
        # Try to extract the reply in a robust way
        ai_reply = None
        if hasattr(response, "text") and response.text:
            ai_reply = response.text
        elif hasattr(response, "candidates") and response.candidates:
            try:
                ai_reply = response.candidates[0].content.parts[0].text
            except Exception as e:
                print("Error extracting from candidates:", e)
        if not ai_reply:
            ai_reply = "[No AI response]"
        return {"reply": ai_reply}
    except Exception as e:
        print("Gemini exception:", e)
        raise HTTPException(status_code=500, detail="AI backend error")

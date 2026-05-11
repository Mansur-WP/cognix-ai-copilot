import os
import logging
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
from dotenv import load_dotenv


# Load environment variables from .env file
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Get the API key from the environment
GENAI_API_KEY = os.getenv("GENAI_API_KEY")

if not GENAI_API_KEY:
    logger.error("GENAI_API_KEY is not set in the .env file")
    raise ValueError("GENAI_API_KEY is not set. Please configure it in .env or environment variables.")

# Configure Gemini
genai.configure(api_key=GENAI_API_KEY)

# FastAPI app
app = FastAPI(title="Cognix AI Backend", version="1.0.0")

# CORS Configuration
# In production, this should be set to your specific frontend domain
# For Netlify deployment: https://your-cognix-app.netlify.app
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://127.0.0.1:5500").split(",")

logger.info(f"CORS allowed origins: {ALLOWED_ORIGINS}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://cognix-copilot.netlify.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    """Health check endpoint"""
    return {"message": "Cognix backend is online!"}

@app.get("/health")
def health_check():
    """Health check for deployment monitoring"""
    return {"status": "healthy"}

class ChatRequest(BaseModel):
    """Request model for chat endpoint"""
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
- If a user asks who built or created you, or who's your boss, reply with "I was created by Mansur - Founder of Smart Automations. Check out https://smartautomations.page.gd for more."
"""

@app.post("/chat")
async def chat(req: ChatRequest):
    """Process user message and return AI response"""
    try:
        logger.info(f"Chat request received: {req.message[:50]}...")
        model = genai.GenerativeModel("gemini-2.5-flash")
        response = model.generate_content(
            f"{SYSTEM_PROMPT}\n\nUser: {req.message}"
        )
        
        # Extract the reply in a robust way
        ai_reply = None
        if hasattr(response, "text") and response.text:
            ai_reply = response.text
        elif hasattr(response, "candidates") and response.candidates:
            try:
                ai_reply = response.candidates[0].content.parts[0].text
            except Exception as e:
                logger.error(f"Error extracting from candidates: {e}")
                ai_reply = "[Unable to extract response]"
        
        if not ai_reply:
            ai_reply = "[No AI response]"
        
        logger.info(f"Chat response generated successfully")
        return {"reply": ai_reply}
        
    except Exception as e:
        logger.error(f"Gemini exception: {e}")
        raise HTTPException(status_code=500, detail="AI backend error. Please try again later.")

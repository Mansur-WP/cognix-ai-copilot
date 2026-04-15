# Cognix – AI Copilot

Cognix is a lightweight full-stack web application that serves as a landing page and an AI-powered conversational copilot. The frontend provides a simple, clean UI with a chat interface, while the backend is powered by FastAPI and Google's Gemini LLM (gemini-2.5-flash).

## Project Structure

```text
Cognix/
├── frontend/
│   ├── index.html   # The main landing page and chat UI
│   ├── style.css    # UI styling and layout (Flexbox)
│   └── app.js       # Chat logic and API connection
└── backend/
    ├── .cvenv/ 
    ├── .env         # Environment variables (API Key)
    └── main.py      # FastAPI server handling Gemini AI requests 
```

## Prerequisites

- **Python 3.8+** installed
- **Node.js/Live Server** (optional, but recommended for serving the frontend)
- A **Google Gemini API Key**

## Setup & Installation

### 1. Backend Setup

The backend handles the chat generation via the Gemini API.

1. **Open a terminal** and navigate to the `backend` folder:
   ```cmd
   cd backend
   ```

2. **Activate the virtual environment** (if not already activated):
   ```cmd
   .cvenv\Scripts\activate
   ```

3. **Install the required dependencies** (if you haven't already):
   ```cmd
   pip install fastapi uvicorn google-generativeai pydantic python-dotenv
   ```
   
4. **Configure your API Key**: 
   Create a `.env` file in the `backend/` directory (if not present) and add your actual Google Gemini API key:
   ```env
   GENAI_API_KEY="your_api_key_here"
   ```

5. **Run the backend server**:
   ```cmd
   uvicorn main:app --reload --port 8000
   ```
   The backend will start running at `http://127.0.0.1:8000`.

### 2. Frontend Setup

The frontend is a static web page that can be served easily.

1. Navigate to the `frontend` directory.
2. Open `index.html` in your web browser. 
   *(For the best experience and to avoid any potential CORS/protocol issues, it is recommended to use the **Live Server** extension in VS Code to run it on a local port like `http://127.0.0.1:5500`)*.

## Usage

1. Ensure the FastAPI backend is running.
2. Open the frontend in your browser.
3. Scroll down to the **"Chat with Cognix"** section.
4. Type your message and hit **Send**. The app will automatically interface with the Gemini model on the backend and stream the AI's response to your chat box.

## Future Improvements

- Move `main.py` out of the `.cvenv` folder and into the root `backend/` folder for better structure.
- Move the `GENAI_API_KEY` to a separate `.env` file so it is not hardcoded into the script.
- Add conversational memory (context retention) to the backend.

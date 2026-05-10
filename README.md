# Cognix – AI Copilot

Cognix is a lightweight full-stack web application that serves as an AI-powered conversational copilot. The frontend provides a clean, modern UI with a chat interface, while the backend is powered by FastAPI and Google's Gemini LLM (gemini-2.5-flash).

## Project Structure

```
Cognix/
├── backend/
│   ├── main.py              # FastAPI server
│   ├── requirements.txt      # Python dependencies
│   ├── .env                  # Environment variables (API Key)
│   └── .gitignore
│
├── frontend/
│   ├── index.html            # Landing page and chat UI
│   ├── style.css             # Styling (Flexbox, animations)
│   └── app.js                # Chat logic and API calls
│
├── .venv/                    # Python virtual environment
├── .gitignore
├── README.md
└── package.json
```

## Prerequisites

- **Python 3.8+** installed
- A **Google Gemini API Key** (free tier available)
- **Git** (for deployment)

## Local Setup

### 1. Backend Setup

1. **Navigate to the backend folder:**
   ```bash
   cd backend
   ```

2. **Activate the Python virtual environment** (Windows):
   ```bash
   ..\\.venv\Scripts\activate
   ```
   Or on macOS/Linux:
   ```bash
   source ../.venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Create a `.env` file** in the `backend/` folder with your Gemini API key:
   ```env
   GENAI_API_KEY=your_actual_api_key_here
   ```
   
   > Get your free API key from [Google AI Studio](https://aistudio.google.com/)

5. **Run the backend server:**
   ```bash
   python -m uvicorn main:app --reload --port 8000
   ```
   The server will start at `http://127.0.0.1:8000`

### 2. Frontend Setup

1. **Open `frontend/index.html`** directly in your browser, or use a local server:
   - Option A: Use VS Code Live Server extension
   - Option B: Use Python's built-in server:
     ```bash
     python -m http.server 5500 --directory frontend
     ```
   - Option C: Use Node's http-server (if installed):
     ```bash
     npx http-server frontend -p 5500
     ```

2. **Test the chat:** Open the browser and chat with Cognix!

## Free Deployment (Render + Netlify)

### Deploy Backend to Render

1. **Create a GitHub repository** and push your code:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Create a Render account** at [render.com](https://render.com)

3. **Create a new Web Service:**
   - Connect your GitHub repository
   - Set the start command:
     ```
     cd backend && python -m uvicorn main:app --host 0.0.0.0 --port $PORT
     ```
   - Add environment variable:
     - `GENAI_API_KEY`: Your Gemini API key
     - `ALLOWED_ORIGINS`: Leave blank (defaults to localhost)

4. **Deploy** and note the backend URL (e.g., `https://cognix-backend.onrender.com`)

### Deploy Frontend to Netlify

1. **Update the backend URL** in `frontend/index.html`:
   Replace this line:
   ```javascript
   // window.BACKEND_URL = 'https://cognix-backend.onrender.com/chat';
   ```
   With your actual Render backend URL:
   ```javascript
   window.BACKEND_URL = 'https://your-app-name.onrender.com/chat';
   ```

2. **Create a Netlify account** at [netlify.com](https://netlify.com)

3. **Deploy the frontend:**
   - Connect your GitHub repository
   - Set the publish directory to `frontend/`
   - Deploy

4. **Update backend CORS** on Render:
   - Set environment variable `ALLOWED_ORIGINS` to your Netlify URL:
     ```
     https://your-app-name.netlify.app
     ```

## Usage

1. Start the backend (local or deployed)
2. Open the frontend (local or deployed)
3. Type messages in the chat box
4. Receive AI responses from Cognix

## Environment Variables

### Backend (.env)
```env
GENAI_API_KEY=your_api_key_here        # Required: Google Gemini API key
ALLOWED_ORIGINS=http://localhost:3000   # Optional: Comma-separated CORS origins
```

### Frontend (index.html)
```javascript
// Uncomment and update for production:
window.BACKEND_URL = 'https://your-backend-url.com/chat';
```

## Important Notes

- **Free Tier Limits**: Google Gemini API free tier allows 20 requests per day
- **API Key Security**: Never commit `.env` to Git (already in `.gitignore`)
- **CORS Configuration**: Ensure backend CORS matches your frontend domain
- **Render Cold Start**: Free tier on Render may have delays after inactivity

## Customization

### Change AI Personality
Edit the `SYSTEM_PROMPT` in `backend/main.py`

### Update Creator Info
In `backend/main.py`, modify:
```python
"I was created by Mansur - Founder of Smart Automations. Check out https://smartautomations.page.gd for more."
```

### Modify UI Design
Update colors and styles in `frontend/style.css`

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "API key not set" | Ensure `.env` file exists in `backend/` with `GENAI_API_KEY` |
| CORS errors | Update `ALLOWED_ORIGINS` in backend or set to `*` for testing |
| Quota exceeded | Free tier limited to 20 requests/day; upgrade or wait 24 hours |
| Chat not sending | Ensure backend is running and API URL is correct |

## Tech Stack

- **Backend**: FastAPI, Python
- **Frontend**: HTML, CSS, JavaScript
- **AI**: Google Gemini API
- **Deployment**: Render (backend), Netlify (frontend)

## License

Created by Mansur - Founder of Smart Automations

## Support

For issues or questions, refer to:
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Google Gemini API Docs](https://ai.google.dev/gemini-api/)
- [Render Documentation](https://render.com/docs)
- [Netlify Documentation](https://docs.netlify.com/)


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

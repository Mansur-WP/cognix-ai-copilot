# Cognix Deployment Guide

This guide walks you through deploying Cognix to production using:
- **Backend**: Render (free tier)
- **Frontend**: Netlify (free tier)

## Prerequisites

Before you start, ensure:
- [ ] Code is pushed to GitHub
- [ ] You have a Google Gemini API Key
- [ ] You have Render and Netlify accounts (both free)

---

## Step 1: Prepare Your Repository

1. **Create `.env.example`** (already done in this project):
   ```bash
   # Copy this template to your .env file locally
   cp backend/.env.example backend/.env
   ```

2. **Verify `.gitignore`** includes:
   - `backend/.env` ✓
   - `.venv/` ✓
   - `__pycache__/` ✓
   - `node_modules/` ✓

3. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Production deployment setup"
   git push origin main
   ```

---

## Step 2: Deploy Backend to Render

### Option A: Automatic Deployment (Recommended)

1. **Go to [Render Dashboard](https://dashboard.render.com/)**

2. **Create New Web Service:**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository

3. **Configure Service:**
   - **Name**: `cognix-backend` (or your preferred name)
   - **Environment**: `Python`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `cd backend && python -m uvicorn main:app --host 0.0.0.0 --port $PORT`

4. **Add Environment Variables:**
   - Click "Advanced" → "Environment"
   - Add new variable:
     - **Key**: `GENAI_API_KEY`
     - **Value**: Your Google Gemini API Key
   - Add optional variable:
     - **Key**: `ALLOWED_ORIGINS`
     - **Value**: `https://your-app.netlify.app` (update after frontend deployment)

5. **Deploy:**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Copy your backend URL (e.g., `https://cognix-backend.onrender.com`)

### Render Free Tier Notes:
- **Sleep after inactivity**: Service will sleep after 15 min of inactivity
- **Cold start**: First request after sleep takes ~10-30 seconds
- **Performance**: Sufficient for small-to-medium traffic
- **Limits**: 750 free hours per month

---

## Step 3: Deploy Frontend to Netlify

### Step-by-Step:

1. **Update Backend URL in Frontend:**
   - Open `frontend/index.html`
   - Find this line (around line 70):
     ```javascript
     // window.BACKEND_URL = 'https://cognix-backend.onrender.com/chat';
     ```
   - Uncomment and update with your Render URL:
     ```javascript
     window.BACKEND_URL = 'https://cognix-backend.onrender.com/chat';
     ```
   - Commit and push to GitHub:
     ```bash
     git add frontend/index.html
     git commit -m "Update backend URL for production"
     git push
     ```

2. **Go to [Netlify Dashboard](https://app.netlify.com/)**

3. **Create New Site:**
   - Click "Add new site" → "Import an existing project"
   - Choose "GitHub"
   - Select your repository

4. **Configure Build:**
   - **Base directory**: Leave blank
   - **Publish directory**: `frontend`
   - **Build command**: Leave blank (static site)

5. **Deploy:**
   - Click "Deploy site"
   - Wait for deployment
   - Copy your site URL (e.g., `https://cognix-app.netlify.app`)

### Netlify Free Tier:
- **Bandwidth**: 100 GB/month
- **Build minutes**: 300/month
- **Perfect for**: Static frontends like ours

---

## Step 4: Update CORS on Render

Now that your frontend is deployed, update the backend's CORS settings:

1. **Go to Render Dashboard** → Your `cognix-backend` service

2. **Update Environment Variables:**
   - Edit `ALLOWED_ORIGINS`:
     - **Old**: `http://localhost:3000,http://127.0.0.1:5500`
     - **New**: `https://your-app.netlify.app` (replace with your actual URL)

3. **Save and restart service**

---

## Step 5: Test Your Deployment

1. **Open your Netlify URL** in browser (e.g., `https://cognix-app.netlify.app`)

2. **Test the chat:**
   - Scroll to chat section
   - Type a message
   - You should receive a response from Cognix

3. **If it doesn't work:**
   - Check browser console for errors (F12)
   - Check Render logs: Dashboard → Your service → "Logs"
   - Ensure API key is valid and quota not exceeded
   - Verify CORS is correctly configured

---

## Step 6: Custom Domain (Optional)

### Add Custom Domain to Netlify:

1. **Domain Setup:**
   - Go to Site Settings → Domain management
   - Add custom domain
   - Follow DNS configuration instructions

2. **Update Backend CORS:**
   - Go to Render backend settings
   - Update `ALLOWED_ORIGINS` to include new domain:
     ```
     https://your-domain.com,https://www.your-domain.com
     ```

---

## Monitoring & Maintenance

### Check Backend Health:

```bash
curl https://cognix-backend.onrender.com/health
```

You should get: `{"status":"healthy"}`

### View Logs:

- **Render**: Dashboard → Service → "Logs" tab
- **Netlify**: Site settings → "Deploys" → Click recent deploy

### Update Backend Code:

Any push to GitHub automatically triggers redeployment on both services.

---

## Troubleshooting

| Error | Solution |
|-------|----------|
| **CORS error in browser** | Verify `ALLOWED_ORIGINS` on Render includes your Netlify URL |
| **Quota exceeded (429)** | Free tier: 20 requests/day limit. Upgrade or wait 24 hours |
| **Chat not responding** | Check Render logs for API errors; verify API key is valid |
| **Netlify can't find frontend** | Ensure publish directory is set to `frontend` |
| **Slow responses** | Normal for Render free tier during cold starts (first request after sleep) |

---

## Upgrade to Paid (Optional)

### Render Paid Tier:
- **Starts at**: $7/month
- **Benefits**: No sleep, better performance, custom domains

### Netlify Paid Tier:
- **Starts at**: $19/month
- **Benefits**: Custom domain, higher bandwidth, more build minutes

---

## Quick Checklist

- [ ] GitHub repository set up with all files
- [ ] `.env` file created locally (not committed)
- [ ] Backend deployed to Render with API key
- [ ] Frontend URL updated in `frontend/index.html`
- [ ] Frontend deployed to Netlify
- [ ] Backend CORS updated with Netlify URL
- [ ] Chat tested and working
- [ ] Logs checked for any errors

---

## Support

For issues, check:
- [Render Docs](https://render.com/docs)
- [Netlify Docs](https://docs.netlify.com/)
- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [Google Gemini API](https://ai.google.dev/)

Happy deploying! 🚀

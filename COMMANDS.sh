#!/bin/bash
# Cognix Quick Commands

# ============================================
# LOCAL DEVELOPMENT COMMANDS
# ============================================

# 1. Setup (first time only)
echo "Setting up Cognix development environment..."
python -m venv .venv
source .venv/bin/activate  # On Windows: .\.venv\Scripts\activate
pip install -r backend/requirements.txt

# 2. Create .env file
echo "Creating .env file..."
cp backend/.env.example backend/.env
# ⚠️  Edit backend/.env and add your GENAI_API_KEY

# 3. Start backend server
echo "Starting backend..."
cd backend
python -m uvicorn main:app --reload --port 8000
# Server runs at: http://127.0.0.1:8000

# 4. Start frontend (in another terminal)
echo "Starting frontend..."
cd frontend
python -m http.server 5500
# Open browser at: http://127.0.0.1:5500

# ============================================
# GIT COMMANDS
# ============================================

# Initialize git
git init
git add .
git commit -m "Initial commit: Cognix AI chatbot project"

# Push to GitHub
git remote add origin https://github.com/yourusername/cognix.git
git branch -M main
git push -u origin main

# ============================================
# DEPLOYMENT COMMANDS
# ============================================

# Deploy to Render (via GitHub)
# See DEPLOYMENT.md for step-by-step instructions

# Deploy to Netlify (via GitHub)
# See DEPLOYMENT.md for step-by-step instructions

# ============================================
# MAINTENANCE COMMANDS
# ============================================

# Update Python dependencies
pip install --upgrade -r backend/requirements.txt

# Check backend health
curl https://cognix-backend.onrender.com/health

# View requirements (for deployment)
pip freeze > backend/requirements.txt

# ============================================
# CLEANUP COMMANDS
# ============================================

# Remove Python cache
find . -type d -name __pycache__ -exec rm -rf {} +

# Remove virtual environment (if needed)
rm -rf .venv

# Clear node modules (if using Node)
rm -rf node_modules

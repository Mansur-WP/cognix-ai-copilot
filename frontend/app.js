// app.js – Cognix UI Logic
// Handles chat UI logic, message rendering, typing indicators, and API calls

// Select chat elements
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatBox = document.getElementById('chat-box');

// Determine the API URL based on environment
// For development: http://localhost:8000 or http://127.0.0.1:8000
// For production: Set the RENDER_BACKEND_URL environment variable or update this URL
const getAPIUrl = () => {
  // Check if running in development (localhost)
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://127.0.0.1:8000/chat';
  }
  
  // For production, use the Render backend URL
  // Update this with your actual Render backend URL when deploying to Netlify
  // Example: https://cognix-backend.onrender.com/chat
  const backendUrl = window.BACKEND_URL || 'https://cognix-backend.onrender.com/chat';
  return backendUrl;
};

const API_URL = getAPIUrl();

// Log the API endpoint being used (remove in production for security)
console.log('Using API endpoint:', API_URL);

// Add initial AI message
addMessage("Hello! I am Cognix. How can I assist you today?", 'ai');

// Function to add a message bubble to chat
function addMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', sender);
    msgDiv.textContent = text;
    chatBox.appendChild(msgDiv);
    scrollToBottom();
}

// Function to show animated typing indicator
function showTypingIndicator() {
    const indicatorDiv = document.createElement('div');
    indicatorDiv.classList.add('message', 'ai', 'typing-indicator');
    indicatorDiv.id = 'typing-indicator';
    indicatorDiv.innerHTML = '<span></span><span></span><span></span>';
    chatBox.appendChild(indicatorDiv);
    scrollToBottom();
}

// Function to remove animated typing indicator
function removeTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) {
        indicator.remove();
    }
}

function scrollToBottom() {
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Handle chat form submit
chatForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const userMsg = chatInput.value.trim();
    if (!userMsg) return;
    
    addMessage(userMsg, 'user');
    chatInput.value = '';
    chatInput.focus();
    
    // Send user message to backend API
    sendMessageToAPI(userMsg);
});

// Send user message to backend API and display response
function sendMessageToAPI(userMsg) {
    // Show animated typing indicator
    showTypingIndicator();
    
    fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: userMsg })
    })
    .then(response => response.json())
    .then(data => {
        removeTypingIndicator();
        addMessage(data.reply || 'No response from AI.', 'ai');
    })
    .catch(error => {
        removeTypingIndicator();
        addMessage('Error: Unable to connect to AI backend. Make sure the server is running on port 8000.', 'ai');
        console.error('API error:', error);
    });
}

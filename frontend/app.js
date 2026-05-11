// app.js – Cognix UI Logic
// Handles chat UI logic, message rendering, typing indicators, and API calls

// Select chat elements
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatMessages = document.getElementById('chat-box');
const sendBtn = document.querySelector('.send-btn');

// Determine the API URL based on environment
// For development: http://localhost:8000 or http://127.0.0.1:8000
// For production: Set the RENDER_BACKEND_URL environment variable or update this URL
const getAPIUrl = () => {
  // Check if running in development (localhost)
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://127.0.0.1:8001/chat';
  }

  // For production, use the Render backend URL.
  // Update this with your actual Render backend URL when deploying to Netlify.
  // Example: https://cognix-backend.onrender.com/chat
  const backendUrl = window.BACKEND_URL || 'https://cognix-ai-copilot.onrender.com/chat';
  return backendUrl;
};

const API_URL = getAPIUrl();

// Log the API endpoint being used (remove in production for security)
console.log('Using API endpoint:', API_URL);

// State management
let isTyping = false;

// Add initial AI message
addMessage("Hello! I am Cognix, your intelligent AI copilot. How can I assist you today?", 'ai');

// Function to add a message bubble to chat
function addMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', sender);
    msgDiv.textContent = text;
    chatMessages.appendChild(msgDiv);
    scrollToBottom();
}

// Function to show animated typing indicator
function showTypingIndicator() {
    if (isTyping) return;

    isTyping = true;
    const indicatorDiv = document.createElement('div');
    indicatorDiv.classList.add('message', 'ai', 'typing-indicator');
    indicatorDiv.id = 'typing-indicator';
    indicatorDiv.innerHTML = '<span></span><span></span><span></span>';
    chatMessages.appendChild(indicatorDiv);
    scrollToBottom();
    updateSendButton();
}

// Function to remove animated typing indicator
function removeTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) {
        indicator.remove();
    }
    isTyping = false;
    updateSendButton();
}

// Function to update send button state
function updateSendButton() {
    if (sendBtn) {
        sendBtn.disabled = isTyping;
    }
}

// Function to scroll to bottom smoothly
function scrollToBottom() {
    setTimeout(() => {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 100);
}

// Function to auto-resize textarea
function autoResizeTextarea() {
    chatInput.style.height = 'auto';
    chatInput.style.height = Math.min(chatInput.scrollHeight, 120) + 'px';
}

// Function to handle input changes
function handleInputChange() {
    autoResizeTextarea();
    updateSendButton();
}

// Handle chat form submit
chatForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const userMsg = chatInput.value.trim();
    if (!userMsg || isTyping) return;

    addMessage(userMsg, 'user');
    chatInput.value = '';
    autoResizeTextarea();
    chatInput.focus();

    // Send user message to backend API
    sendMessageToAPI(userMsg);
});

// Handle textarea key events
chatInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        if (e.shiftKey) {
            // Shift+Enter: allow newline
            return;
        } else {
            // Enter: send message
            e.preventDefault();
            chatForm.dispatchEvent(new Event('submit'));
        }
    }
});

chatInput.addEventListener('input', handleInputChange);

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
        addMessage('Error: Unable to connect to Cognix AI backend. Please try again.', 'ai');
        console.error('API error:', error);
    });
}

// Initialize on load
document.addEventListener('DOMContentLoaded', function() {
    autoResizeTextarea();
    updateSendButton();

    // Focus on input
    chatInput.focus();
});

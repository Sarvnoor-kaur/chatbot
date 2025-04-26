// DOM elements
const userInput = document.getElementById("user-input");
const chatBox = document.getElementById("chat-box");
const sendButton = document.getElementById("send-btn");
const quickOptions = document.querySelectorAll(".quick-option");
const fileUpload = document.querySelector(".file-upload input");
const emojiToggle = document.querySelector(".emoji-toggle");

// Add missing message classes from HTML
const styleElement = document.createElement('style');
styleElement.textContent = `
  .user-message {
    background: linear-gradient(135deg, #007bff, #1a8cff);
    color: white;
    margin-left: auto;
    border-radius: 18px 18px 0 18px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }
  
  .bot-message {
    background: #e9ecef;
    color: #343a40;
    margin-right: auto;
    border-radius: 18px 18px 18px 0;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }
  
  .bot-message:hover::after {
    content: "AI response";
    position: absolute;
    font-size: 10px;
    bottom: -15px;
    left: 10px;
    color: #6c757d;
  }
`;
document.head.appendChild(styleElement);

// Process user message and get response from API
function fetch_api(prom, callback) {
  console.log("Sending request with prompt:", prom);
  
  // Show typing indicator
  showTypingIndicator();
  
  fetch("http://localhost:3000/api/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt: prom }),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      return res.text();
    })
    .then((data) => {
      console.log("Received response:", data);
      hideTypingIndicator();
      callback(data);
    })
    .catch((err) => {
      console.error("Fetch error:", err);
      hideTypingIndicator();
      callback("I'm having trouble connecting to the server. Please try again later.");
    });
}

// Add new message to chat
function addMessage(message, isUser = false) {
  const newMessage = document.createElement("div");
  newMessage.classList.add("message");
  newMessage.classList.add(isUser ? "user-message" : "bot-message");
  newMessage.innerText = message;
  
  // Animation effect
  newMessage.style.opacity = "0";
  newMessage.style.transform = "translateY(10px)";
  
  chatBox.appendChild(newMessage);
  
  // Force reflow to ensure animation works
  void newMessage.offsetWidth;
  
  // Apply animation
  newMessage.style.transition = "opacity 0.3s ease, transform 0.3s ease";
  newMessage.style.opacity = "1";
  newMessage.style.transform = "translateY(0)";
  
  scrollToBottom();
}

// Show typing indicator
function showTypingIndicator() {
  // Check if typing indicator already exists
  const existingIndicator = document.querySelector(".typing-indicator");
  if (existingIndicator) return;
  
  const indicator = document.createElement("div");
  indicator.classList.add("typing-indicator");
  chatBox.appendChild(indicator);
  scrollToBottom();
}

// Hide typing indicator
function hideTypingIndicator() {
  const indicator = document.querySelector(".typing-indicator");
  if (indicator) {
    indicator.remove();
  }
}

// Scroll chat to bottom
function scrollToBottom() {
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Handle user message submission
function handleUserMessage() {
  const message = userInput.value.trim();
  if (message === "") return;
  
  // Clear input
  userInput.value = "";
  
  // Add user message to chat
  addMessage(message, true);
  
  // Get bot response
  fetch_api(message, function(response) {
    addMessage(response, false);
  });
}

// Event listeners
userInput.addEventListener("keyup", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    handleUserMessage();
  }
});

// Add send button click handler
sendButton.addEventListener("click", function() {
  handleUserMessage();
});

// Quick option buttons
quickOptions.forEach(option => {
  option.addEventListener("click", function() {
    const symptom = this.textContent;
    addMessage(symptom, true);
    
    // Get bot response for the selected symptom
    fetch_api(symptom, function(response) {
      addMessage(response, false);
    });
  });
});

// File upload handling
fileUpload.addEventListener("change", function() {
  if (this.files && this.files[0]) {
    const fileName = this.files[0].name;
    addMessage(`I'm uploading an image: ${fileName}`, true);
    
    // Simulate processing file
    showTypingIndicator();
    setTimeout(() => {
      hideTypingIndicator();
      addMessage("I've received your image, but I'm not able to process images at this time. Could you please describe your symptoms in text instead?", false);
    }, 1500);
  }
});

// Emoji toggle functionality
const emojis = ["😊", "😷", "🤒", "🤕", "🤢", "🤮", "😢", "😰", "🤧"];
let emojiMenuOpen = false;
let emojiMenu = null;

emojiToggle.addEventListener("click", function() {
  if (emojiMenuOpen) {
    if (emojiMenu) {
      emojiMenu.remove();
      emojiMenu = null;
    }
    emojiMenuOpen = false;
  } else {
    // Create emoji menu
    emojiMenu = document.createElement("div");
    emojiMenu.style.position = "absolute";
    emojiMenu.style.bottom = "70px";
    emojiMenu.style.left = "10px";
    emojiMenu.style.background = "white";
    emojiMenu.style.padding = "10px";
    emojiMenu.style.borderRadius = "8px";
    emojiMenu.style.boxShadow = "0 0 10px rgba(0,0,0,0.1)";
    emojiMenu.style.display = "grid";
    emojiMenu.style.gridTemplateColumns = "repeat(3, 1fr)";
    emojiMenu.style.gap = "5px";
    emojiMenu.style.zIndex = "100";
    
    // Add emojis
    emojis.forEach(emoji => {
      const emojiBtn = document.createElement("div");
      emojiBtn.textContent = emoji;
      emojiBtn.style.fontSize = "20px";
      emojiBtn.style.padding = "5px";
      emojiBtn.style.cursor = "pointer";
      emojiBtn.style.textAlign = "center";
      emojiBtn.style.transition = "transform 0.2s";
      
      emojiBtn.addEventListener("mouseover", function() {
        this.style.transform = "scale(1.2)";
      });
      
      emojiBtn.addEventListener("mouseout", function() {
        this.style.transform = "scale(1)";
      });
      
      emojiBtn.addEventListener("click", function() {
        userInput.value += emoji;
        userInput.focus();
        emojiMenu.remove();
        emojiMenu = null;
        emojiMenuOpen = false;
      });
      
      emojiMenu.appendChild(emojiBtn);
    });
    
    document.querySelector(".chat-container").appendChild(emojiMenu);
    emojiMenuOpen = true;
  }
});

// Close emoji menu when clicking outside
document.addEventListener("click", function(event) {
  if (emojiMenuOpen && emojiMenu && !emojiToggle.contains(event.target) && !emojiMenu.contains(event.target)) {
    emojiMenu.remove();
    emojiMenu = null;
    emojiMenuOpen = false;
  }
});

// Add visual feedback for input field
userInput.addEventListener("focus", function() {
  this.style.boxShadow = "0 0 0 3px rgba(0, 123, 255, 0.25)";
});

userInput.addEventListener("blur", function() {
  this.style.boxShadow = "none";
});

// Add visual feedback when typing
userInput.addEventListener("input", function() {
  if (this.value.trim() !== "") {
    sendButton.style.background = "linear-gradient(135deg, #0069d9, #004494)";
  } else {
    sendButton.style.background = "linear-gradient(135deg, #007bff, #0056b3)";
  }
});

// Add welcome animation
window.addEventListener("load", function() {
  const container = document.querySelector(".chat-container");
  container.style.opacity = "0";
  container.style.transform = "translateY(20px)";
  
  setTimeout(() => {
    container.style.transition = "opacity 0.5s ease, transform 0.5s ease";
    container.style.opacity = "1";
    container.style.transform = "translateY(0)";
  }, 100);
});
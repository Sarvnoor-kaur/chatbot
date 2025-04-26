const chatMessages = document.getElementById('chat-messages');
const symptomInput = document.getElementById('symptom-input');

function addMessage(message, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.classList.add(isUser ? 'user-message' : 'bot-message');
    messageDiv.textContent = message;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function getBotResponse(prompt) {
    try {
        const response = await fetch("http://localhost:3000/api/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ prompt: prompt })
        });
        
        const data = response;
        return data;
    } catch (error) {
        console.error('Error:', error);
        return "Sorry, I'm having trouble connecting to the medical database. Please try again.";
    }
}

async function sendMessage() {
    const message = symptomInput.value.trim();
    if (!message) return;

    // Add user message to chat
    addMessage(message, true);
    symptomInput.value = '';

    // Show typing indicator
    addMessage("Thinking...");

    // Get and display bot response
    const botResponse = await getBotResponse(message);
    chatMessages.lastChild.remove(); // Remove typing indicator
    addMessage(botResponse);
}

// Handle Enter key press
symptomInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Example of direct API call (you can call this separately if needed)
function testDirectApiCall() {
    fetch("http://localhost:3000/api/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: "I have a stomach pain recommend medicine" })
    })
    .then((res) => res.text())
    .then((data) => console.log(data))
    .catch((err) => console.error(err));
}

// Uncomment the line below to test the direct API call when the page loads
// testDirectApiCall();
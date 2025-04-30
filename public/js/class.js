console.log("Hello from class.js");
console.log(window.location.host);
console.log(window.location.protocol);

// Determine WebSocket protocol based on current protocol
const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
const ws = new WebSocket(`${wsProtocol}//${window.location.host}`);
const messagesContainer = document.getElementById('messages');

// Handle WebSocket connection
ws.onopen = () => {
    console.log('Class is connected to WebSocket server');
};

ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    
    if (data.type === 'history') {
        // Display message history
        data.messages.forEach(message => {
            appendMessage(message);
        });
    } else if (data.type === 'message') {
        // Display new message
        appendMessage(data);
    }
};

ws.onerror = (error) => {
    console.error('WebSocket error:', error);
};

ws.onclose = () => {
    console.log('Disconnected from WebSocket server');
};

// Function to append a message to the chat
function appendMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.className = `message ${message.sender === 'office' ? 'office' : 'class'}`;
    
    const content = document.createElement('div');
    content.textContent = message.content;
    
    const timestamp = document.createElement('div');
    timestamp.className = 'message-timestamp';
    timestamp.textContent = message.timestamp;
    
    messageElement.appendChild(content);
    messageElement.appendChild(timestamp);
    messagesContainer.appendChild(messageElement);
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

console.log("Hello from office.js");
console.log(window.location.host);
console.log(window.location.protocol);

// Untuk menyesuaikan websocket dengan protokol yang dipakai
const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
const ws = new WebSocket(`${wsProtocol}//${window.location.host}`);

const messagesContainer = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const clearHistoryButton = document.getElementById('clearHistory');

// Websocket
ws.onopen = () => {
    console.log('Office is connected to WebSocket server');
};

ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    
    if (data.type === 'history') {
        // Display history panggilan
        data.messages.forEach(message => {
            appendMessage(message);
        });
    } else if (data.type === 'message') {
        // Display panggilan terbaru
        appendMessage(data);
    } else if (data.type === 'clear_history') {
        // Clear messages when server broadcasts clear
        messagesContainer.innerHTML = '';
    }
};

ws.onerror = (error) => {
    console.error('WebSocket error:', error);
};

ws.onclose = () => {
    console.log('Disconnected from WebSocket server');
};

//  Function untuk menambahkan panggilan ke chat
function appendMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.className = `message office`;
    
    const content = document.createElement('div');
    content.textContent = message.content;
    
    const timestamp = document.createElement('div');
    timestamp.className = 'message-timestamp';
    timestamp.textContent = message.timestamp;
    
    messageElement.appendChild(content);
    messageElement.appendChild(timestamp);
    messagesContainer.appendChild(messageElement);
    

    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// mengirim panggilan
function sendMessage() {
    const content = messageInput.value.trim();
    if (content) {
        ws.send(JSON.stringify({
            type: 'message',
            content: content,
            sender: 'office'
        }));
        messageInput.value = '';
    }
}

// Event listeners
sendButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Clear history functionality
clearHistoryButton.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all message history?')) {
        ws.send(JSON.stringify({
            type: 'clear_history',
            sender: 'office'
        }));
        messagesContainer.innerHTML = '';
    }
});
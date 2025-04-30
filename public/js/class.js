console.log("Hello from class.js");
console.log(window.location.host);
console.log(window.location.protocol);

// Untuk menyesuaikan websocket dengan protokol yang dipakai
const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
const wsUrl = `${wsProtocol}//${window.location.host}`;
console.log('Connecting to WebSocket:', wsUrl);
const ws = new WebSocket(wsUrl);
const messagesContainer = document.getElementById('messages');

// Websocket
ws.onopen = () => {
    console.log('Class is connected to WebSocket server');
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
        // menghapus history
        messagesContainer.innerHTML = '';
    }
};

ws.onerror = (error) => {
    console.error('WebSocket error:', error);
};

ws.onclose = () => {
    console.log('Disconnected from WebSocket server');
    // Try to reconnect after 5 seconds
    setTimeout(() => {
        console.log('Attempting to reconnect...');
        window.location.reload();
    }, 5000);
};

// Function untuk menambahkan panggilan ke chat
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
    
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

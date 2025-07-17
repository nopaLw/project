console.log("Hello from class.js");
console.log(window.location.host);
console.log(window.location.protocol);


const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
const ws = new WebSocket(`${wsProtocol}//${window.location.host}`);

// untuk menampilkan chat dari element dengan id messages
const messagesContainer = document.getElementById('messages');

// websocket
ws.onopen = () => {
    console.log('Class is connected to WebSocket server');
};


ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    
    if (data.type === 'history') {
        data.messages.forEach(message => {
            appendMessage(message);
        });
    } else if (data.type === 'message') {
        appendMessage(data);
    } else if (data.type === 'clear_history') {
        messagesContainer.innerHTML = '';
    }
};

ws.onerror = (error) => {
    console.error('WebSocket error:', error);
};

ws.onclose = () => {
    console.log('Disconnected from WebSocket server');
};

// untuk menampilkan atau menambahkan chat ke web
function appendMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.className = 'message office';
    
    // untuk menampilkan nama pengirim
    const senderDiv = document.createElement('div');
    senderDiv.className = 'message-sender';
    senderDiv.textContent = message.sender ? message.sender : 'Pengirim';
    messageElement.appendChild(senderDiv);

    // menampilkan isi chat
    const content = document.createElement('div');
    content.textContent = message.content;
    
    // untuk menampilkan waktu pengiriman
    const timestamp = document.createElement('div');
    timestamp.className = 'message-timestamp';
    timestamp.textContent = message.timestamp;
    
    messageElement.appendChild(content);
    messageElement.appendChild(timestamp);
    messagesContainer.appendChild(messageElement);
    
   // agar chat tidak saling tumpang tindih
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}
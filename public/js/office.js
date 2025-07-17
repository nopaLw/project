console.log("Hello from office.js");
console.log(window.location.host);
console.log(window.location.protocol);

const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
const ws = new WebSocket(`${wsProtocol}//${window.location.host}`);

// websocket
ws.onopen = () => {
    console.log('Office is connected to WebSocket server');
};

ws.onerror = (error) => {
    console.error('WebSocket error:', error);
};

ws.onclose = () => {
    console.log('Disconnected from WebSocket server');
};

// function chat
const messagesContainer = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const clearHistoryButton = document.getElementById('clearHistory');
const pengirim = document.getElementById('pengirim');

// untuk websocket ketika menerima chat
ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    
    if (data.type === 'history') {
        // menampilkan semuai chat
        data.messages.forEach(message => {
            appendMessage(message);
        });
    } else if (data.type === 'message') {
        // menampilkan chat terbaru
        appendMessage(data);
    } else if (data.type === 'clear_history') {
        // clear chat
        messagesContainer.innerHTML = '';
    }
};



// untuk menampilkan atau menambahkan chat ke web
function appendMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.className = `message office`;
    
    // untuk menampilkan nama pengirim
    const senderDiv = document.createElement('div');
    senderDiv.className = 'message-sender';
    senderDiv.textContent = message.sender ? message.sender : 'Pengirim';
    messageElement.appendChild(senderDiv);

    // untuk menampilkan isi chat
    const content = document.createElement('div');
    content.textContent = message.content;
    
    // untuk menampilkan waktu pengiriman
    const timestamp = document.createElement('div');
    timestamp.className = 'message-timestamp';
    timestamp.textContent = message.timestamp;
    
    // untuk memasukkan div kecil kedalam div utama
    messageElement.appendChild(content);
    messageElement.appendChild(timestamp);
    messagesContainer.appendChild(messageElement);
    
    // agar chat tidak saling tumpang tindih
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// function mengirim chat
function sendMessage() {
    const content = messageInput.value.trim();
    const sender = pengirim ? pengirim.value : 'office';
    if (content) {
        ws.send(JSON.stringify({
            type: 'message',
            content: content,
            sender: sender
        }));
        messageInput.value = '';
    }
}


// untuk kirim chat pakai event listener
sendButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// untuk clear chat
clearHistoryButton.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all message history?')) {
        ws.send(JSON.stringify({
            type: 'clear_history',
            sender: 'office'
        }));
        messagesContainer.innerHTML = '';
    }
});
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const port = process.env.PORT || 3456;

// untuk menyimpan chat
const messageHistory = [];

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/office', (req, res) => {
  res.sendFile(__dirname + '/public/office.html');
});

app.get('/class', (req, res) => {
  res.sendFile(__dirname + '/public/class.html');
});

// websocket
wss.on('connection', (ws) => {
    console.log('New client connected');

    // menyimpan history ke koneksi baru
    if (messageHistory.length > 0) {
        ws.send(JSON.stringify({
            type: 'history',
            messages: messageHistory
        }));
    }

    ws.on('message', (message) => {
        const data = JSON.parse(message);
        
        if (data.type === 'clear_history') {
            // Only allow office to clear history
            if (data.sender === 'office') {
                // Clear message history
                messageHistory.length = 0;
                
                // Broadcast clear history to all clients
                wss.clients.forEach((client) => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({
                            type: 'clear_history'
                        }));
                    }
                });
            }
            return;
        }
        
        // menambahkan waktu chat dikirim
        const messageWithTimestamp = {
            ...data,
            timestamp: new Date().toLocaleTimeString()
        };
        
        // menyimpan history 
        messageHistory.push(messageWithTimestamp);
        
        // broadcast chat ke semua display yang connect
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({
                    type: 'message',
                    ...messageWithTimestamp
                }));
            }
        });
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

server.listen(port, () => {
  console.log(`Student Caller running on port http://0.0.0.0:${port}`)
});
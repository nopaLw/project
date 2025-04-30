const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const port = process.env.PORT || 3456;

// untuk menyimpan chat
const messageHistory = [];

// Serve static files from the public directory
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/class', (req, res) => {
  res.sendFile(__dirname + '/public/class.html');
});

app.get('/office', (req, res) => {
  res.sendFile(__dirname + '/public/office.html');
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

// Start server only if not in production (Vercel)
if (process.env.NODE_ENV !== 'production') {
    server.listen(port, () => {
        console.log(`Student Caller running on port http://0.0.0.0:${port}`);
    });
}

// Export for Vercel
module.exports = app;
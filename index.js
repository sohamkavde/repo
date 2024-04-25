const http = require('http');
const express = require('express');
const WebSocket = require('ws');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws) {
  console.log('A client has connected.');

  ws.on('message', function incoming(message) {
    console.log('Message from client:', message);

    try {
      const data = JSON.parse(message);

      if (data.Protocol === 'jsonPTS' && Array.isArray(data.Packets)) {
        data.Packets.forEach(packet => {
          if (packet.Id === 1 && packet.Type === 'GetUniqueIdentifier') {
            const response = {
              Protocol: 'JsonPTS',
              Packets: [{
                Id: 1,
                Type: 'UniqueIdentifier',
                Data: {
                  Id: '004600223131510131343538'
                }
              }]
            };
            ws.send(JSON.stringify(response));
          }
        });
      }
    } catch (error) {
      console.error('Error parsing or handling message:', error);
    }
  });

  ws.on('close', function close() {
    console.log('A client has disconnected.');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

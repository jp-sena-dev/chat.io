const express = require('express');
const http = require('http');

const ioServer = require('socket.io');
const roomSocket = require('./sockets/room')

const app = express();
const server = http.createServer(app);

const io = ioServer(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

roomSocket(io);

app.get('/', (_req, res) => {
  res.sendFile(__dirname + '/index.html');
});

server.listen(3000, () => {
  console.log('server is listening on port 3000');
});

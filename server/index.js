const express = require('express');
const http = require('http');

const ioServer = require('socket.io');
const roomSocket = require('./sockets/room')

const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);

const io = ioServer(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST'],
  },
});

roomSocket(io);

app.get('/', (_req, res) => {
  res.sendFile(__dirname + '/index.html');
});

server.listen(port, () => {
  console.log(`server is listening on port ${port}`);
});

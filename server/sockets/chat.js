module.exports = (io) => io.on('connection', (socket) => {
  socket.emit('serverMessage', 'Wealcome!');
  socket.broadcast.emit('serverMessage', `${socket.id} entrou!`);
  socket.on('clientMessage', (message) => {
    console.log(`Message: ${message}`);
    io.emit('serverMessage', message);
  });
  socket.on('disconnect', () => {
    socket.broadcast.emit('serverMessage', `Xiii! ${socket.id} acabou de se desconectar!`)
  });
});

module.exports = (io) => io.on('connection', (socket) => {
  socket.on('joinRoom', ({username, room}) => {
    socket.join(room);

    socket.emit('serverMessage', `Boas vindas ${username} a sala sobre ${room}`);
  
    socket.broadcast.emit('serverMessage', `${username} acabou de entrar na sala`);
    
    socket.on('roomClientMessage', ({message, room}) => {
      io.to(room).emit('comunitMessage', {
        id: socket.id,
        username,
        message,
        date: new Date().toISOString(),
      });
    });
  });
});

module.exports = (io) => io.on('connection', (socket) => {
  socket.on('joinRoom', ({username, userId, room}) => {
    socket.join(room);

    socket.emit('userEntered', `${username}`);

    socket.on('updateRoom', (room) => {
      io.to(room).emit('updateRoom');
    })
  
    socket.on('roomClientMessage', ({message, room}) => {
      io.to(room).emit('comunitMessage', {
        id: userId,
        username,
        message,
        date: new Date().toISOString(),
      });
    });
  });
});

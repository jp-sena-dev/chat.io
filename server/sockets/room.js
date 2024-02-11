module.exports = (io) => io.on('connection', (socket) => {
  socket.on('updateRoom', (room) => {
    socket.broadcast.emit('updateRoom', room);
  })

  socket.on('joinRoom', ({username, userId, room}) => {
    socket.removeAllListeners('roomClientMessage');
    socket.join(room);
     
    socket.on('roomClientMessage', ({message, room}) => {
      io.to(room).emit('comunitMessage', {
        id: userId,
        username,
        message,
        createdAt: new Date().toISOString(),
      });
    });
  });

  socket.on('leaveRoom', (roomId) => {
    socket.leave(roomId);
  });
});

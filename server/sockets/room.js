module.exports = (io) => io.on('connection', (socket) => {
  socket.on('joinRoom', ({username, userId, room}) => {
    socket.removeAllListeners('roomClientMessage');
    socket.join(room);
     

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

  socket.on('leaveRoom', (roomId) => {
    socket.leave(roomId);
  });
});

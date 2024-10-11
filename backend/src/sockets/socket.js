// sockets.js
const socketIo = require('socket.io');

let io; // Định nghĩa biến io toàn cục

module.exports = (server) => {
  io = socketIo(server);

  io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('likePost', (postId) => {
      socket.broadcast.emit('postUpdated', postId);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });
};

// Hàm để lấy đối tượng io
module.exports.getIo = () => {
  if (!io) {
    throw new Error('Socket not initialized!');
  }
  return io;
};

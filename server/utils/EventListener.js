export default class EventListener {
  users = [];

  constructor(io, socket) {
    socket.once(':init', (userId) => {
      if (this.users.find((user) => user.userId == userId)) return;
      this.users.push({
        socketId: socket.id,
        userId: userId,
      });
      io.except(socket.id).emit('user:online', userId);
    });
  }
}

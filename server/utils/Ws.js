class Ws {
  users = [];

  connect(socket) {
    socket.on('user:init', (data) => this.userOnInit(socket, data));

    socket.on('chat:init', (data) => this.chatOnInit(socket, data));
    socket.on('chat:send_message', (data) => this.chatOnSendMessage(socket, data));
  }

  userOnInit(socket, data) {
    console.log('user:init');

    const userAlreadyOnline = this.users.find((u) => u.userId == data.userId);
    if (userAlreadyOnline) {
      console.log('userAlreadyOnline - no add new');
      console.log(this.users);
      return;
    }

    this.users.push({
      socketId: socket.id,
      userId: data.userId,
    });

    socket.broadcast.emit('user:online', data);
    console.log(this.users);
  }

  chatOnInit(socket, data) {
    socket.join(data.r);
  }

  chatOnSendMessage(socket, data) {
    const partner = this.users.find((u) => u.userId == data.partnerid);
    console.log(data);
    console.log(partner);
    socket.to(data.r).emit('chat:new_message', data);
  }
}

export default new Ws();

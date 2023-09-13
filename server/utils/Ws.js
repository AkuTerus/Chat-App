class Ws {
  users = [];

  connect(socket) {
    socket.on('disconnect', () => this.def__OnDisconnect(socket));
    socket.on('__:init', (data) => this.def__OnInit(socket, data));
    socket.on('__:user_init_rooms', (data) => this.def__OnUserInitRooms(socket, data));

    socket.on('chat:init', (data) => this.chatOnInit(socket, data));
    socket.on('chat:send_message', (data) => this.chatOnSendMessage(socket, data));
  }

  def__OnInit(socket, data) {
    console.log('✅✅✅__:init');
    socket.userId = data.userId;
    console.log(`| socket.userId = ${socket.userId}`);

    // let userData = this.users.find((u) => u.userId == data.userId);
    // if (!userData) {
    const userData = {
      socketId: socket.id,
      userId: data.userId,
      userName: data.userName,
    };
    this.users.push(userData);
    // }

    socket.broadcast.emit('user:online', userData);
    console.log('| this.users');
    console.log(this.users);
  }

  def__OnDisconnect(socket) {
    console.log('❌❌❌ on disconnect');
    console.log(`| socket.userId = ${socket.userId}`);
    console.log(`| before remove (this.users) :`);
    console.log(this.users);

    const userData = this.users.find((u) => u.userId == socket.userId && u.socketId == socket.id); // save user data for emitting
    console.log('userData');
    console.log(userData);

    this.users = this.users.filter((u) => u.socketId != userData.socketId); // remove socket from users

    console.log(`| after remove (this.users) :`);
    console.log(this.users);

    socket.broadcast.emit('user:offline', userData);
  }

  def__OnUserInitRooms(socket, data) {
    // console.log('__:user_init_rooms');
    socket.join(data.socketRooms);
  }

  chatOnInit(socket, data) {
    socket.join(data.socketRoom);
  }

  chatOnSendMessage(socket, data) {
    const partner = this.users.find((u) => u.userId == data.partnerid);
    console.log(data);
    console.log(partner);
    socket.to(data.socketRoom).emit('chat:new_message', data);
  }
}

export default new Ws();

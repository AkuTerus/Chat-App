class Ws {
  users = [];

  connect(socket) {
    socket.on('disconnect', () => {
      console.log('❌❌❌ on disconnect');
      console.log(`| socket.userId = ${socket.userId}`);
      console.log(`| before remove (this.users) :`);
      console.log(this.users);

      const userData = this.users.find((u) => u.userId == socket.userId && u.socketId == socket.id); // save user data for emitting
      if (!userData) return;

      console.log('userData');
      console.log(userData);

      this.users = this.users.filter((u) => u.socketId != userData.socketId); // remove socket from users

      console.log(`| after remove (this.users) :`);
      console.log(this.users);

      socket.broadcast.emit('user:offline', userData);
    });

    socket.on('__:init', (data) => {
      socket.emit('emit1', 'test');

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
    });

    socket.on('__:init_rooms', (data) => {
      console.log('✅✅✅__:init_rooms');
      console.log(data);
      const rooms = data.rooms.map((room) => room.roomname);
      socket.join(rooms);

      const roomuserids = data.rooms.map((room) => room.roomuserid);
      const roomuseridonlines = this.users.filter((u) => roomuserids.includes(u.userId)).map((u) => u.userId);
      socket.emit('user:get_user_online', roomuseridonlines);
    });

    socket.on('chat:init', (data) => {
      socket.join(data.socketRoom);
    });

    socket.on('chat:send_message', (data) => {
      const partner = this.users.find((u) => u.userId == data.partnerid);
      console.log(data);
      console.log(partner);
      socket.to(data.socketRoom).emit('chat:new_message', data);
    });
  }
}

export default new Ws();

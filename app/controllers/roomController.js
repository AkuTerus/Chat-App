import roomModel from './../models/roomModel.js';

export default {
  getRoomById: async (req, res) => {
    const room = await roomModel.getRoomById(req.params.roomid);
    if (!room) {
      return res.sendStatus(403);
    }

    const user = await roomModel.getUserByToken(req.session.token);
    const partner = await roomModel.getPartnerByRoomId(room.id, user.id);
    const messages = await roomModel.getMessagesByRoomId(room.id);
    // console.log(messages);
    res.render('chat', {
      title: 'Chat',
      room: room,
      user: user,
      partner: partner,
      messages: messages,
    });
  },

  getLatestMessageByLastMessageId: async (req, res) => {
    const { roomid, lastMessageId } = req.params;
    if (!req.session.token) {
      return res.status(401).json({ code: 403, message: 'Unauthorized' });
    }

    const latestMessage = await roomModel.getLatestMessageByLastMessageId(roomid, lastMessageId);
    return res.status(200).json(latestMessage);
  },

  initiate: async (req, res) => {
    const { partnerid } = req.body;
    if (!partnerid) {
      return res.status(401).json({ success: false, message: 'Invalid Format' });
    }

    const user = await roomModel.getUserByToken(req.session.token);
    if (!user) {
      return res.status(403).json({ success: false, message: 'Unknown user' });
    }

    const partner = await roomModel.getPartnerById(partnerid);
    if (!partner) {
      return res.status(403).json({ success: false, message: 'Unknown partner user' });
    }

    const createRoomRes = await roomModel.createRoom(user.id, partner.id);
    res.status(200).json(createRoomRes);
  },

  postMessage: async (req, res) => {
    const { roomid, message } = req.body;
    if (!roomid || !message) {
      return res.status(401).json({ success: false, message: 'Invalid Format' });
    }

    const user = await roomModel.getUserByToken(req.session.token);
    if (!user) {
      return res.status(403).json({ success: false, message: 'Unknown User' });
    }
    console.log(user);

    const isUserValidRoom = await roomModel.getUserByRoomId(roomid, user.id);
    if (!isUserValidRoom) {
      return res.status(403).json({ success: false, message: 'Unauthorized User' });
    }

    const userid = user.id;
    const createMessageRes = await roomModel.createMessage(roomid, userid, message);
    res.status(200).json(createMessageRes);
  },
};

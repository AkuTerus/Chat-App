import express from 'express';
import chatModel from '../models/chatModel.js';

const router = express.Router();

router.get('/:roomid', async (req, res) => {
  const room = await chatModel.getRoomById(req.params.roomid);
  if (!room) {
    res.sendStatus(403);
  }

  const user = await chatModel.getUserByToken(req.session.token);
  const partner = await chatModel.getPartnerByRoomId(room.id, user.id);
  const messages = await chatModel.getMessagesByRoomId(room.id);
  console.log(messages);
  res.render('chat', {
    title: 'Chat',
    room: room,
    user: user,
    partner: partner,
    messages: messages,
  });
});

router.get('/:roomid/latestMessage/:lastMessageId', async (req, res) => {
  const { roomid, lastMessageId } = req.params;
  if (!req.session.token) {
    return {
      code: 403,
      message: 'Unauthorized',
    };
  }

  const latestMessage = await chatModel.getLatestMessageByLastMessageId(roomid, lastMessageId);
  return res.status(200).json(latestMessage);
});

router.post('/room', async (req, res) => {
  const { partnerid } = req.body;
  if (!req.session.token || !partnerid) {
    return {
      code: 403,
      message: 'Invalid Format',
    };
  }

  const user = await chatModel.getUserByToken(req.session.token);
  if (!user) {
    return {
      code: 403,
      message: 'Unauthorized User',
    };
  }

  const partner = await chatModel.getPartnerById(partnerid);
  if (!partner) {
    return {
      code: 403,
      message: 'Unknown partner user',
    };
  }

  const createRoomRes = await chatModel.createRoom(user.id, partner.id);
  res.status(200).json(createRoomRes);
});

router.post('/message', async (req, res) => {
  const { roomid, message } = req.body;
  if (!req.session.token || !roomid || !message) {
    return {
      code: 403,
      message: 'Invalid Format',
    };
  }

  const user = await chatModel.getUserByToken(req.session.token);
  if (!user) {
    return {
      code: 403,
      message: 'Unauthorized User',
    };
  }

  const isUserValidRoom = await chatModel.getUserByRoomId(roomid, user.id);
  if (!isUserValidRoom) {
    return {
      code: 403,
      message: 'Unauthorized User',
    };
  }

  const createMessageRes = await chatModel.createMessage(roomid, user.id, message);
  res.status(200).json(createMessageRes);
});

export default router;

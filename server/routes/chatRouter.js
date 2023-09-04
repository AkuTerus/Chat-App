import express from 'express';
import {
  createRoom,
  getRoomById,
  getUserByRoomId,
  getUserByToken,
  getPartnerById,
  getMessagesByRoomId,
  getPartnerByRoomId,
  createMessage,
} from '../models/chatModel.js';

const router = express.Router();

router.get('/:roomid', async (req, res) => {
  const room = await getRoomById(req.params.roomid);
  if (!room) {
    res.sendStatus(403);
  }

  const user = await getUserByToken(req.session.token);
  const partner = await getPartnerByRoomId(room.id, user.id);
  const messages = await getMessagesByRoomId(room.id);
  console.log(messages);
  res.render('chat', {
    title: 'Chat',
    room: room,
    user: user,
    partner: partner,
    messages: messages,
  });
});

router.post('/room', async (req, res) => {
  const { partnerid } = req.body;
  if (!req.session.token || !partnerid) {
    return {
      code: 403,
      message: 'Invalid Format',
    };
  }

  const user = await getUserByToken(req.session.token);
  if (!user) {
    return {
      code: 403,
      message: 'Unauthorized User',
    };
  }

  const partner = await getPartnerById(partnerid);
  if (!partner) {
    return {
      code: 403,
      message: 'Unknown partner user',
    };
  }

  const createRoomRes = await createRoom(user.id, partner.id);
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

  const user = await getUserByToken(req.session.token);
  if (!user) {
    return {
      code: 403,
      message: 'Unauthorized User',
    };
  }

  const isUserValidRoom = await getUserByRoomId(roomid, user.id);
  if (!isUserValidRoom) {
    return {
      code: 403,
      message: 'Unauthorized User',
    };
  }

  const createMessageRes = await createMessage(roomid, user.id, message);
  res.status(200).json(createMessageRes);
});

export default router;

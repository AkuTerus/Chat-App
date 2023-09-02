import express from 'express';
import {
  createRoom,
  getMessagesByRoomId,
  getPartnerByRoomId,
  getRoomByName,
  getUserByToken,
} from '../models/chatModel.js';

const router = express.Router();

router.get('/:roomName', async (req, res) => {
  const room = await getRoomByName(req.params.roomName);
  if (!room) {
    res.sendStatus(403);
  }

  const user = await getUserByToken(req.session.token);
  const partner = await getPartnerByRoomId(room.id, user.id);
  const messages = await getMessagesByRoomId(room.id);
  console.log(messages);
  res.render('chat', {
    title: 'Chat',
    user: user,
    partner: partner,
    messages: messages,
  });
});

router.post('/room', async (req, res) => {
  const createRoomRes = await createRoom(req.session.token, req.body.partnerid);
  res.json(createRoomRes);
});

export default router;

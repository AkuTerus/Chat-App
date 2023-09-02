import express from 'express';
import { createRoom } from '../models/chatModel.js';

const router = express.Router();

router.get('/:roomName', (req, res) => {
  res.render('chat', {
    title: 'Chat',
  });
});

router.post('/room', async (req, res) => {
  const createRoomRes = await createRoom(req.session.token, req.body.partnerid);
  res.json(createRoomRes);
});

export default router;

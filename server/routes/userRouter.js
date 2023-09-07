import express from 'express';
import userModel from '../models/userModel.js';

const router = express.Router();

router.get('/', async (req, res) => {
  // user data
  const user = await userModel.getUserByEmail(req.session.userEmail);

  // query get data has chat and no chat
  const hasChat = await userModel.getHasChat(user.id);
  const hasNoChat = await userModel.getHasNoChat(user.id);

  res.render('user', {
    title: 'User',
    user,
    chats: {
      hasChat,
      hasNoChat,
    },
  });
});

export default router;

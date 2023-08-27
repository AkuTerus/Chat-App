import express from 'express';
import { getHasChat, getHasNoChat, getUserByEmail } from '../models/userModel.js';

const router = express.Router();
const defaultAvatar = 'default/1.png';

router.get('/', async (req, res) => {
  // user data
  const user = await getUserByEmail(req.session.userEmail);

  // query get data has chat and no chat
  const hasChat = await getHasChat(user.id);
  const hasNoChat = await getHasNoChat(user.id);

  res.render('user', {
    title: 'User',
    user,
    defaultAvatar,
    chats: {
      hasChat,
      hasNoChat,
    },
  });
});

export default router;

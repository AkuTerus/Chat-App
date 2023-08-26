import express from 'express';
import { getUserByEmail } from '../models/userModel.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const user = await getUserByEmail(req.session.userEmail);
  res.render('user', {
    title: 'User',
    user: user,
  });
});

export default router;

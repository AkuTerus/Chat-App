import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.render('chat', {
    title: 'Chat',
  });
});

export default router;

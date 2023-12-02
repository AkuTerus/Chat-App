import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  req.session.login = undefined;
  req.session.destroy((err) => console.error(err));
  res.redirect('/login');
});

export default router;

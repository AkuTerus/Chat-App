import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.render('login');
});

router.post('/', (req, res) => {
  console.log(req.url);
});

export default router;

import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.render('login', {
    title: 'Login',
  });
});

router.post('/', (req, res) => {
  console.log(req.url);
});

export default router;

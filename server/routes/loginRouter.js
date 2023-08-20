import express from 'express';

const loginRouter = express.Router();

loginRouter.get('/', (req, res) => {
  res.render('login');
});

export default loginRouter;

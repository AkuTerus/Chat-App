import express from 'express';

const userRouter = express.Router();

userRouter.get('/', (req, res) => {
  res.render('register');
});

export default userRouter;

import { randomBytes, createHash } from 'node:crypto';
import express from 'express';
import { matchedData } from 'express-validator';
import bcryptjs from 'bcryptjs';
import { loginValidations } from '../middlewares/validations.js';
import { getUserByEmail } from '../models/loginModel.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.render('login', {
    title: 'Login',
    errors: req.flash('login_error'),
  });
});

router.post('/', loginValidations, async (req, res) => {
  // get validated data (from req.body)
  const body = matchedData(req);

  // query to database to check if user with such email exists
  const user = await getUserByEmail(body.email);

  // if user falsy(undefined in this case), redirect with error msg
  if (!user) {
    req.flash('login_error', 'Unauthorized User to Login');
    return res.redirect('/login');
  }

  // if password doesn't match, redirect with error msg
  const verifyPassword = user ? await bcryptjs.compare(body.password, user.password) : false;
  if (!verifyPassword) {
    req.flash('login_error', 'Unauthorized User to Login');
    return res.redirect('/login');
  }

  // login success, create session login and redirect to root
  req.session.login = createHash('sha256').update(randomBytes(32)).digest('base64');
  res.redirect('/');
});

export default router;

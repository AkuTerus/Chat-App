import { randomBytes, createHash } from 'node:crypto';
import express from 'express';
import { checkSchema, matchedData, validationResult } from 'express-validator';
import bcryptjs from 'bcryptjs';
import { loginSchemas } from '../middlewares/validationSchemas.js';
import { getUserByEmail } from '../models/loginModel.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.render('login', {
    title: 'Login',
    errors: req.flash('validation_errors'),
  });
});

router.post(
  '/',
  [
    checkSchema(loginSchemas, ['body']),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        req.flash('validation_errors', errors.array());
        return res.redirect(req.originalUrl);
      }
      next();
    },
  ],
  async (req, res) => {
    // get validated data (from req.body)
    const body = matchedData(req);

    // query to database to check if user with such email exists
    const user = await getUserByEmail(body.email);

    // if user falsy(undefined in this case), redirect with error msg
    if (!user) {
      req.flash('validation_errors', 'Unauthorized User to Login');
      return res.redirect('/login');
    }

    // if password doesn't match, redirect with error msg
    const verifyPassword = user ? await bcryptjs.compare(body.password, user.password) : false;
    if (!verifyPassword) {
      req.flash('validation_errors', 'Unauthorized User to Login');
      return res.redirect('/login');
    }

    // login success, create session login and redirect to root
    req.session.login = createHash('sha256').update(randomBytes(32)).digest('base64');
    res.redirect('/');
  }
);

export default router;

import express from 'express';
import { checkSchema, matchedData, validationResult } from 'express-validator';
import { loginSchemas } from './../../config/validations.js';
import loginModel from './../models/loginModel.js';
import { createTokenOnSuccessLogin } from './../middleware/loginAuth.js';

const router = express.Router();

// GET /login
router.get('/', (req, res) => {
  res.render('login', {
    title: 'Login',
    errors: req.flash('validation_errors'),
  });
});

// POST /login
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
  createTokenOnSuccessLogin,
  async (req, res) => {
    // login success
    // insert login_details
    const data = [req.body.email, req.session.token, req.ip];
    const insert = await loginModel.insertLoginDetails(data);

    res.redirect('/');
  }
);

export default router;

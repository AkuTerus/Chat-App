import { randomBytes, createHash } from 'node:crypto';
import express from 'express';
import { checkSchema, matchedData, validationResult } from 'express-validator';
import bcryptjs from 'bcryptjs';
import { loginSchemas } from '../config/validations.js';
import { getUserByEmail } from '../models/loginModel.js';

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
  async (req, res) => {
    // get validated data (from req.body)
    const body = matchedData(req);

    // login success, create session login and redirect to root
    req.session.login = createHash('sha256').update(randomBytes(32)).digest('base64');
    res.redirect('/');
  }
);

export default router;

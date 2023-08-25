import fs from 'node:fs/promises';
import { randomBytes, createHash } from 'node:crypto';
import express from 'express';
import { checkSchema, matchedData, validationResult } from 'express-validator';
import bcryptjs from 'bcryptjs';
import upload from '../config/upload.js';
import { registerSchemas } from '../config/validations.js';
import { createUser } from '../models/registerModel.js';
import { createTokenOnSuccessLogin } from '../middlewares/loginAuth.js';

const router = express.Router();

// GET /register
router.get('/', (req, res) => {
  res.render('register', {
    title: 'Register',
    errors: req.flash('validation_errors'),
  });
});

// POST /register
router.post(
  '/',
  [
    upload.single('avatar'),
    checkSchema(registerSchemas, ['body']),
    async (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        await fs.unlink(req.file.path);
        req.flash('validation_errors', errors.array());
        return res.redirect(req.originalUrl);
      }
      next();
    },
  ],
  createTokenOnSuccessLogin,
  async (req, res) => {
    const name = req.body.firstname + ' ' + req.body.lastname;
    const email = req.body.email;
    const passwordHashed = bcryptjs.hashSync(req.body.password);
    const avatar = req.file ? req.file.filename : null;

    const data = [name, email, passwordHashed, avatar];
    const insert = await createUser(data);

    req.session.token = createHash('sha256').update(randomBytes(32)).digest('base64');
    return res.redirect('/');
  }
);

export default router;

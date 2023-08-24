import fs from 'node:fs/promises';
import { randomBytes, createHash } from 'node:crypto';
import express from 'express';
import { checkSchema, matchedData, validationResult } from 'express-validator';
import bcryptjs from 'bcryptjs';
import upload from '../config/upload.js';
import { registerSchemas } from '../config/validations.js';
import { createUser } from '../models/registerModel.js';

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
  async (req, res) => {
    const body = matchedData(req);
    const name = body.firstname + ' ' + body.lastname;
    const email = body.email;
    const passwordHashed = bcryptjs.hashSync(body.password);
    const avatar = req.file ? req.file.filename : null;

    const data = [name, email, passwordHashed, avatar];
    const insert = await createUser(data);

    req.session.login = createHash('sha256').update(randomBytes(32)).digest('base64');
    return res.redirect('/');
  }
);

export default router;

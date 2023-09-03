import fs from 'node:fs/promises';
import { randomBytes, createHash } from 'node:crypto';
import express from 'express';
import { checkSchema, matchedData, validationResult } from 'express-validator';
import bcryptjs from 'bcryptjs';
import upload from '../config/upload.js';
import { registerSchemas } from '../config/validations.js';
import { createUser, insertLoginDetails } from '../models/registerModel.js';
import { createTokenOnSuccessLogin } from '../middlewares/loginAuth.js';

const router = express.Router();

// GET /register
router.get('/', async (req, res) => {
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
        if (req.file) { // if chose file (uploaded)
          await fs.unlink(req.file.path); // remove previously uploaded file
        }
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

    // if no uploaded files, set default avatar
    let avatar = req.file?.filename;
    if (!avatar) {
      const dir = '../uploads/default';
      const availableFiles = await fs.readdir(dir);
      if (availableFiles.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableFiles.length);
        const randomFileName = availableFiles[randomIndex];
        avatar = 'default/' + randomFileName;
      }
    }

    const data = [name, email, passwordHashed, avatar];
    const insert = await createUser(data);

    const dataLogin = [req.body.email, req.session.token, req.ip];
    const insertLoginDetail = await insertLoginDetails(dataLogin);
    return res.redirect('/');
  }
);

export default router;

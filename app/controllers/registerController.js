import fs from 'node:fs/promises';
import bcryptjs from 'bcryptjs';

import registerModel from './../models/registerModel.js';

export default {
  // GET /register
  index: async (req, res) => {
    res.render('register', {
      title: 'Register',
      errors: req.flash('validation_errors'),
    });
  },

  // POST /register
  store: async (req, res) => {
    const name = req.body.firstname + ' ' + req.body.lastname;
    const email = req.body.email;
    const passwordHashed = bcryptjs.hashSync(req.body.password);

    let avatar = req.file?.filename;
    // if no uploaded files, set default avatar
    if (!avatar) {
      const defaultImageDirname = './uploads/default';
      const availableFiles = await fs.readdir(defaultImageDirname); // absolute from process.cwd()
      if (availableFiles.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableFiles.length);
        const randomFileName = availableFiles[randomIndex];
        avatar = 'default/' + randomFileName;
      }
    }

    const data = [name, email, passwordHashed, avatar];
    const insert = await registerModel.createUser(data);

    const dataLogin = [req.body.email, req.session.token, req.ip];
    const insertLoginDetail = await registerModel.insertLoginDetails(dataLogin);
    return res.redirect('/');
  },
};

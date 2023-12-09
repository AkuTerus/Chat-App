import bcryptjs from 'bcryptjs';

import registerModel from '../models/registerModel.js';
import loginModel from '../models/loginModel.js';

export default {
  isEmailExist: async (email) => {
    const user = await loginModel.getUserByEmail(email);
    return user ? true : false;
  },

  isPasswordMatchByEmail: async (email, password) => {
    const user = await loginModel.getUserByEmail(email);
    if (!user) {
      return false;
    }
    if (!bcryptjs.compareSync(password, user.password)) {
      return false;
    }
    return true;
  },
};

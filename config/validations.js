import bcryptjs from 'bcryptjs';

import registerModel from '../app/models/registerModel.js';
import loginModel from '../app/models/loginModel.js';

const loginSchema = {
  email: {
    notEmpty: { errorMessage: 'Email cannot be empty', bail: true },
    isEmail: { errorMessage: 'Invalid Email format', bail: true },
    _isEmailExist: {
      custom: async (value, { req }) => {
        const user = await loginModel.getUserByEmail(value);
        if (!user || (user && !bcryptjs.compareSync(req.body.password, user?.password))) {
          throw new Error('Unauthorized User to Login');
        }
        return true;
      },
    },
  },
  password: {
    notEmpty: { errorMessage: 'Password cannot be empty', bail: true },
  },
};

const registerSchema = {
  firstname: {
    escape: true,
    notEmpty: {
      errorMessage: 'First Name cannot be empty',
      bail: true,
    },
    isLength: {
      errorMessage: 'First Name must be at least 2 characters',
      options: {
        min: 2,
      },
    },
  },
  lastname: {
    escape: true,
    notEmpty: {
      errorMessage: 'Last Name cannot be empty',
      bail: true,
    },
    isLength: {
      errorMessage: 'Last Name must be at least 2 characters',
      options: {
        min: 2,
      },
    },
  },
  email: {
    notEmpty: { errorMessage: 'Email cannot be empty', bail: true },
    isEmail: { errorMessage: 'Invalid Email format' },
    _isNewEmail: {
      custom: async (value, { req }) => {
        const checkIsNewEmail = await registerModel.isNewEmail(value);
        if (!checkIsNewEmail) {
          throw new Error('Email is already registered');
        }
        return true;
      },
    },
  },
  password: {
    escape: true,
    notEmpty: { errorMessage: 'Password cannot be empty', bail: true },
    isLength: {
      errorMessage: 'Password must be at least 3 characters',
      options: {
        min: 3,
      },
    },
  },
  avatar: {
    _maxSize: {
      custom: async (value, { req }) => {
        if (!req.file) return true;

        const maxSize = 3 * 1024 * 1024; // 3MB
        if (req.file.size > maxSize) {
          throw new Error(`File cannot exceed 3 MB`);
        }
        return true;
      },
      bail: true,
    },
    _allowedFileTypes: {
      custom: async (value, { req }) => {
        if (!req.file) return true;

        const allowedFileTypes = ['image/png', 'image/jpg', 'image/jpeg'];
        if (!allowedFileTypes.includes(req.file.mimetype)) {
          throw new Error('Invalid file type. Allowed types: png, jpg, jpeg');
        }
        return true;
      },
    },
  },
};

export { loginSchema, registerSchema };

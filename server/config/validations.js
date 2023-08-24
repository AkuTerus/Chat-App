import fs from 'node:fs/promises';
import { body } from 'express-validator';
import bcryptjs from 'bcryptjs';
import { isNewEmail } from '../models/registerModel.js';
import { getUserByEmail } from '../models/loginModel.js';

export const loginSchemas = {
  email: {
    notEmpty: { errorMessage: 'Email cannot be empty', bail: true },
    isEmail: { errorMessage: 'Invalid Email format' },
  },
  password: {
    notEmpty: { errorMessage: 'Password cannot be empty' },
  },
};

export const registerSchemas = {
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
        const checkIsNewEmail = await isNewEmail(value);
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
          await fs.unlink(req.file.path);
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
          await fs.unlink(req.file.path);
          throw new Error('Invalid file type. Allowed types: png, jpg, jpeg');
        }
        return true;
      },
    },
  },
};

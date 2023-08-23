import { body, checkSchema, validationResult } from 'express-validator';

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
  first_name: {
    notEmpty: {
      errorMessage: 'First Name cannot be empty',
    },
    isLength: {
      options: {
        min: 3,
        max: 20,
      },
    },
    errorMessage: 'Last Name should be 3-20 characters',
  },
  last_name: {
    notEmpty: {
      errorMessage: 'Last Name cannot be empty',
    },
    isLength: {
      options: {
        min: 3,
        max: 20,
      },
      errorMessage: 'Last Name should be 3-20 characters',
    },
  },
  email: {
    notEmpty: { errorMessage: 'Email cannot be empty', bail: true },
    isEmail: { errorMessage: 'Invalid Email format' },
  },
  password: {
    notEmpty: { errorMessage: 'Password cannot be empty', bail: true },
    isEmail: { errorMessage: 'Invalid Email format' },
  },
};

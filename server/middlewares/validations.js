import { body, checkSchema, validationResult } from 'express-validator';

export const loginValidations = [
  // rules
  checkSchema(
    {
      email: {
        notEmpty: { errorMessage: 'Email cannot be empty', bail: true },
        isEmail: { errorMessage: 'Invalid Email format' },
      },
      password: {
        notEmpty: { errorMessage: 'Password cannot be empty' },
      },
    },
    ['body']
  ),
  // error handler
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('login_error', errors.array());
      return res.redirect(req.originalUrl);
    }
    next();
  },
];

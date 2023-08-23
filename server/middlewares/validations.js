import { body, validationResult } from 'express-validator';

export const loginValidations = [
  body('email')
    .notEmpty()
    .withMessage('Email cannot be empty')
    .bail()
    .isEmail()
    .withMessage('Invalid Email'),
  body('password').notEmpty().withMessage('Password cannot be empty'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('login_error', errors.array());
      return res.redirect(req.originalUrl);
    }
    next();
  },
];

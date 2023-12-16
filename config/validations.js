import authService from './../app/services/authService.js';

/* loginSchema */
const loginSchema = {
  email: {
    notEmpty: { errorMessage: 'Email cannot be empty' },
    isEmail: { errorMessage: 'Invalid Email format' },
    _isEmailExist: {
      custom: async (value, { req }) => {
        const isEmailExist = await authService.isEmailExist(value);
        if (!isEmailExist) {
          throw new Error('Invalid Email');
        }
      },
    },
  },
  password: {
    notEmpty: { errorMessage: 'Password cannot be empty' },
    _isPasswordMatchByEmail: {
      custom: async (value, { req }) => {
        const isPasswordMatchByEmail = await authService.isPasswordMatchByEmail(req.body.email, value);
        if (!isPasswordMatchByEmail) {
          throw new Error('Invalid Password');
        }
      },
    },
  },
};

/* registerSchema */
const registerSchema = {
  firstname: {
    escape: true,
    notEmpty: {
      errorMessage: 'First Name cannot be empty',
    },
    isLength: {
      errorMessage: 'First Name must be at least 2 characters',
      options: { min: 2 },
    },
  },
  lastname: {
    escape: true,
    notEmpty: {
      errorMessage: 'Last Name cannot be empty',
    },
    isLength: {
      errorMessage: 'Last Name must be at least 2 characters',
      options: { min: 2 },
    },
  },
  email: {
    notEmpty: { errorMessage: 'Email cannot be empty' },
    isEmail: { errorMessage: 'Invalid Email format' },
    _isEmailExist: {
      custom: async (value, { req }) => {
        const isEmailExist = await authService.isEmailExist(value);
        console.log('isEmailExist');
        if (isEmailExist) {
          throw new Error('Email is already registered');
        }
      },
    },
  },
  password: {
    // escape: true,
    notEmpty: {
      errorMessage: 'Password cannot be empty',
    },
    isLength: {
      errorMessage: 'Password must be at least 3 characters',
      options: { min: 3 },
    },
  },
  avatar: {
    _allowedFileTypes: {
      if: (value, { req }) => req.file,

      custom: async (value, { req }) => {
        const allowedFileTypes = ['image/png', 'image/jpg', 'image/jpeg'];
        if (!allowedFileTypes.includes(req.file.mimetype)) {
          throw new Error('Invalid file type. Allowed types: png, jpg, jpeg');
        }
      },
    },

    _maxSize: {
      custom: async (value, { req }) => {
        const maxSize = 3 * 1024 * 1024; // 3MB
        if (req.file.size > maxSize) {
          throw new Error('File cannot exceed 3 MB');
        }
      },
    },
  },
};

export { loginSchema, registerSchema };

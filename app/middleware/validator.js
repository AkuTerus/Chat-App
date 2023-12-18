import fs from 'node:fs/promises';
import { validationResult } from 'express-validator';

const validate = async (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  // if there was file uploaded
  if (req.file) {
    await fs.unlink(req.file.path); // remove previously uploaded file
    console.log('### validator.validate: removed uploaded file');
  }
  req.flash('validation_errors', errors.array({ onlyFirstError: true }));
  return res.redirect(req.originalUrl);
};
export { validate };

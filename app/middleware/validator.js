import fs from 'node:fs/promises';
import { validationResult } from 'express-validator';

const validate = async (req, res, next) => {
  console.log('### validator.validate -- req.body : ');
  console.log(req.body);
  console.log('### validator.validate -- req.file : ');
  console.log(req.file);
  const errors = validationResult(req);
  console.log('### validator.validate -- validationResult errors : ');
  console.log(errors.array());
  if (errors.isEmpty()) {
    return next();
  }

  // if there was file uploaded
  if (req.file) {
    await fs.unlink(req.file.path); // remove previously uploaded file
    console.log('### validator.validate: removed uploaded file');
  }
  req.flash('validation_errors', errors.array());
  return res.redirect(req.originalUrl);
};
export { validate };

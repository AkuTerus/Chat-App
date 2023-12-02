import { validationResult } from 'express-validator';

const validate = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // if there was file uploaded
    if (req.file) {
      await fs.unlink(req.file.path); // remove previously uploaded file
    }
    req.flash('validation_errors', errors.array());
    return res.redirect(req.originalUrl);
  }
  next();
};
export { validate };

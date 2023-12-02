import path from 'node:path';
import { randomBytes } from 'node:crypto';

import multer from 'multer';

const renameUploadedFile = async (req, newFilename) => {
  const { filename, filepath } = req.file;
  const newFilePath = filepath.replace(filename, newFilename + path.extname(filename));
  const move = await fs.rename(filepath, newFilePath);
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '../uploads');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = randomBytes(16).toString('hex') + ext;
    cb(null, filename);
  },
});

const upload = multer({
  storage,
  limits: {
    fieldNameSize: 100,
    fieldSize: 1 * 1024 * 1024, // 1MB
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});
export default upload;

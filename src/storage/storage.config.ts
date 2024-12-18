import * as multer from 'multer';
import { join } from 'path';

export const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = join(__dirname, '..', '..', 'uploads'); // Папка для файлов
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${file.originalname}`;
    cb(null, uniqueSuffix);
  },
});

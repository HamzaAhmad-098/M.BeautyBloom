import multer from 'multer';
import path from 'path';

// Local storage for development
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), 'uploads')); // make sure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

export const upload = multer({ storage });

// Dummy export for cloudinary so other imports don't break
const cloudinary = {};
export default cloudinary;

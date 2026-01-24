import express from 'express';
import asyncHandler from 'express-async-handler';
import { protect, admin } from '../middleware/authMiddleware.js';
import { upload, uploadToUploadcare } from '../config/uploadcare.js';

const router = express.Router();

// Admin image upload route (Uploadcare)
router.post(
  '/admin/upload/images',
  protect,
  admin,
  upload.array('images', 5),
  asyncHandler(async (req, res) => {
    if (!req.files || !req.files.length) {
      return res.status(400).json({ message: 'No files provided' });
    }

    // Upload each buffer to Uploadcare
    const uploaded = await Promise.all(
      req.files.map((file) => uploadToUploadcare(file.buffer, file.originalname))
    );

    const images = uploaded.map((u) => ({
      url: u.url || u.secure_url,
      public_id: u.public_id || u.file_id,
      file_id: u.file_id,
    }));

    res.json(images);
  })
);

export default router;
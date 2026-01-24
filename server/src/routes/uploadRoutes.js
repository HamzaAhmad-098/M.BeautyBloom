import express from 'express';
import asyncHandler from 'express-async-handler';
import { protect, admin } from '../middleware/authMiddleware.js';
import { upload, uploadToCloudinary } from '../config/cloudinary.js';

const router = express.Router();

// Admin image upload route (Cloudinary)
router.post(
  '/admin/upload/images',
  protect,
  admin,
  upload.array('images', 5),
  asyncHandler(async (req, res) => {
    if (!req.files || !req.files.length) {
      return res.status(400).json({ message: 'No files provided' });
    }

    // upload each buffer to Cloudinary
    const uploaded = await Promise.all(
      req.files.map((file) => uploadToCloudinary(file.buffer))
    );

    const images = uploaded.map((u) => ({
      url: u.secure_url || u.url,
      public_id: u.public_id,
    }));

    res.json(images);
  })
);

export default router;
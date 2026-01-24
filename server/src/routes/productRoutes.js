import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
  getFeaturedProducts,
  getNewProducts,
  getProductsByCategory,
  getBrands,
  getCategories,
  deleteProductReview,
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { upload, uploadToCloudinary } from '../config/cloudinary.js';

const router = express.Router();

router.route('/').get(getProducts).post(protect, admin, createProduct);

router.route('/top').get(getTopProducts);
router.route('/featured').get(getFeaturedProducts);
router.route('/new').get(getNewProducts);
router.route('/brands').get(getBrands);
router.route('/categories').get(getCategories);

router.route('/:id/reviews').post(protect, createProductReview);

// Admin can delete a specific review
router.delete('/:id/reviews/:reviewId', protect, admin, deleteProductReview);

router
  .route('/:id')
  .get(getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

router.route('/category/:category').get(getProductsByCategory);

// Image upload route — accepts up to 5 images in memory and uploads to Cloudinary
router.post(
  '/upload',
  protect,
  admin,
  upload.array('images', 5),
  async (req, res, next) => {
    try {
      if (!req.files || !req.files.length) {
        return res.status(400).json({ message: 'No files provided' });
      }

      const uploaded = await Promise.all(req.files.map((file) => uploadToCloudinary(file.buffer)));

      const images = uploaded.map((r) => ({ url: r.secure_url, public_id: r.public_id }));

      res.json(images);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
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
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

router.route('/')
  .get(getProducts)
  .post(protect, admin, createProduct);

router.route('/top').get(getTopProducts);
router.route('/featured').get(getFeaturedProducts);
router.route('/new').get(getNewProducts);
router.route('/brands').get(getBrands);
router.route('/categories').get(getCategories);

router.route('/:id/reviews')
  .post(protect, createProductReview);

router.route('/:id')
  .get(getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

router.route('/category/:category')
  .get(getProductsByCategory);

// Image upload route
router.post('/upload', protect, admin, upload.array('images', 5), (req, res) => {
  const images = req.files.map(file => file.path);
  res.json(images);
});

export default router;
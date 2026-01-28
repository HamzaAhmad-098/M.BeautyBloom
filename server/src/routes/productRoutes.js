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
// Remove upload imports - handled by separate uploadRoutes

const router = express.Router();

router.route('/')
  .get(getProducts)
  .post(protect, admin, createProduct);

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

// REMOVE the upload route - it's already handled by uploadRoutes.js
// Image upload should be done via /api/upload or /api/admin/upload/images

export default router;
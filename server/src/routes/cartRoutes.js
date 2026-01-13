import express from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  syncCart,
} from '../controllers/cartController.js';
import { protect, guestCheckout } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(guestCheckout, getCart)
  .post(guestCheckout, addToCart)
  .delete(protect, clearCart);

router.route('/sync')
  .post(protect, syncCart);

router.route('/:itemId')
  .put(protect, updateCartItem)
  .delete(protect, removeFromCart);

export default router;
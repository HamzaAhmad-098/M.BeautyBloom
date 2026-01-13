import express from 'express';
import rateLimit from 'express-rate-limit';
import {
  register,
  verifyEmail,
  resendVerificationEmail,
  login,
  logout,
  getMe,
  updateDetails,
  updatePassword,
  forgotPassword,
  resetPassword,
  deleteAccount,
  checkEmailAvailability,
} from '../controllers/authController.js';
import {
  protect,
  admin,
  verified,
  authLimiter,
  refreshToken,
} from '../middleware/authMiddleware.js';

const router = express.Router();

// Rate limiting for auth routes
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: 'Too many login attempts from this IP, please try again after 15 minutes',
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  message: 'Too many accounts created from this IP, please try again after an hour',
});

const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3,
  message: 'Too many password reset requests from this IP, please try again after 15 minutes',
});

// Public routes
router.post('/register', registerLimiter, register);
router.post('/login', loginLimiter, login);
router.post('/forgot-password', forgotPasswordLimiter, forgotPassword);
router.put('/reset-password/:resettoken', resetPassword);
router.get('/verify-email/:token', verifyEmail);
router.post('/check-email', checkEmailAvailability);

// Protected routes (require authentication)
router.use(protect);
router.use(refreshToken); // Refresh token if needed

router.post('/logout', logout);
router.get('/me', getMe);
router.put('/updatedetails', updateDetails);
router.put('/updatepassword', updatePassword);
router.post('/resend-verification', resendVerificationEmail);
router.delete('/deleteaccount', deleteAccount);
router.post('/check-email', checkEmailAvailability);
// Admin routes
router.use(admin);

// Example admin-only routes
router.get('/admin/users', async (req, res) => {
  // Get all users logic
});

export default router;
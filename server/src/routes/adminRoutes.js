import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getBrands,
  getCategories,
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

// All routes require admin access
router.use(protect, admin);

// Product routes
router.route('/products')
  .get(getProducts)
  .post(createProduct);

router.route('/products/:id')
  .get(getProductById)
  .put(updateProduct)
  .delete(deleteProduct);

// Upload routes for Cloudinary
router.post('/upload/images', upload.array('images', 10), (req, res) => {
  try {
    const files = req.files;
    if (!files || files.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'No files uploaded' 
      });
    }

    // Extract URLs from Cloudinary response
    const images = files.map(file => file.path);
    
    res.json({
      success: true,
      images: images,
      message: 'Images uploaded successfully to Cloudinary',
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Error uploading images' 
    });
  }
});

// Get brands
router.get('/brands', getBrands);

// Get categories
router.get('/categories', getCategories);

export default router;
import express from 'express';
import asyncHandler from 'express-async-handler';
import Category from '../models/Category.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
router.get('/', asyncHandler(async (req, res) => {
  const categories = await Category.find({ isActive: true }).sort('order');
  res.json(categories);
}));

// @desc    Create a category
// @route   POST /api/categories
// @access  Private/Admin
router.post('/', protect, admin, asyncHandler(async (req, res) => {
  const { name, description, image, parentCategory, order, isActive } = req.body;
  
  // Validate required fields
  if (!name || name.trim() === '') {
    res.status(400);
    throw new Error('Category name is required');
  }
  
  // Generate slug with proper validation
  let slug = name.toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-+/, '') // Remove leading hyphens
    .replace(/-+$/, ''); // Remove trailing hyphens
  
  // If slug is empty after processing (e.g., name is only special chars)
  if (!slug || slug === '') {
    // Generate a unique slug with timestamp
    slug = `category-${Date.now()}`;
  }
  
  // Check if slug already exists
  const slugExists = await Category.findOne({ slug });
  if (slugExists) {
    // Append timestamp to make it unique
    slug = `${slug}-${Date.now()}`;
  }
  
  const category = new Category({
    name: name.trim(),
    slug,
    description: description?.trim() || '',
    image: image?.trim() || '',
    parentCategory: parentCategory || null,
    order: order || 0,
    isActive: isActive !== undefined ? isActive : true,
  });
  
  const createdCategory = await category.save();
  res.status(201).json(createdCategory);
}));

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private/Admin
router.put('/:id', protect, admin, asyncHandler(async (req, res) => {
  const { name, description, image, parentCategory, order, isActive } = req.body;
  
  const category = await Category.findById(req.params.id);
  
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }
  
  // Update fields
  if (name && name !== category.name) {
    category.name = name.trim();
    
    // Generate new slug when name changes
    let slug = name.toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
    
    if (!slug || slug === '') {
      slug = `category-${Date.now()}`;
    }
    
    // Check if new slug already exists (excluding current category)
    const slugExists = await Category.findOne({ slug, _id: { $ne: category._id } });
    if (slugExists) {
      slug = `${slug}-${Date.now()}`;
    }
    
    category.slug = slug;
  }
  
  category.description = description?.trim() || category.description;
  category.image = image?.trim() || category.image;
  category.parentCategory = parentCategory !== undefined ? parentCategory : category.parentCategory;
  category.order = order !== undefined ? order : category.order;
  category.isActive = isActive !== undefined ? isActive : category.isActive;
  
  const updatedCategory = await category.save();
  res.json(updatedCategory);
}));

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }
  
  // Check if category has products
  const Product = (await import('../models/Product.js')).default;
  const productsCount = await Product.countDocuments({ category: category.name });
  
  if (productsCount > 0) {
    res.status(400);
    throw new Error(`Cannot delete category with ${productsCount} products. Move products first.`);
  }
  
  await category.deleteOne();
  res.json({ message: 'Category removed' });
}));

// @desc    Get category by slug
// @route   GET /api/categories/slug/:slug
// @access  Public
router.get('/slug/:slug', asyncHandler(async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug, isActive: true });
  
  if (category) {
    res.json(category);
  } else {
    res.status(404);
    throw new Error('Category not found');
  }
}));

// @desc    Get category tree
// @route   GET /api/categories/tree
// @access  Public
router.get('/tree', asyncHandler(async (req, res) => {
  const categories = await Category.find({ isActive: true }).sort('order');
  
  // Build category tree
  const categoryMap = {};
  const tree = [];
  
  categories.forEach(category => {
    categoryMap[category._id] = { ...category.toObject(), children: [] };
  });
  
  categories.forEach(category => {
    if (category.parentCategory && categoryMap[category.parentCategory]) {
      categoryMap[category.parentCategory].children.push(categoryMap[category._id]);
    } else {
      tree.push(categoryMap[category._id]);
    }
  });
  
  res.json(tree);
}));

export default router;
import asyncHandler from 'express-async-handler';
import Category from '../models/Category.js';

// @desc    Get all categories
// @route   GET /api/admin/categories/all
// @access  Private/Admin
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({})
    .sort({ name: 1 })
    .populate('user', 'name email');
  
  res.json(categories);
});

// @desc    Create category
// @route   POST /api/admin/categories
// @access  Private/Admin
const createCategory = asyncHandler(async (req, res) => {
  const { name, description, image, isActive } = req.body;

  const categoryExists = await Category.findOne({ name });
  if (categoryExists) {
    res.status(400);
    throw new Error('Category already exists');
  }

  const category = await Category.create({
    name,
    description,
    image,
    isActive,
    user: req.user._id,
  });

  res.status(201).json(category);
});

// @desc    Update category
// @route   PUT /api/admin/categories/:id
// @access  Private/Admin
const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  const { name, description, image, isActive } = req.body;

  // Check if name already exists (excluding current category)
  if (name && name !== category.name) {
    const categoryExists = await Category.findOne({ name });
    if (categoryExists) {
      res.status(400);
      throw new Error('Category name already exists');
    }
  }

  category.name = name || category.name;
  category.description = description || category.description;
  category.image = image || category.image;
  category.isActive = isActive !== undefined ? isActive : category.isActive;

  const updatedCategory = await category.save();
  res.json(updatedCategory);
});

// @desc    Delete category
// @route   DELETE /api/admin/categories/:id
// @access  Private/Admin
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  // Check if category has products
  const Product = mongoose.model('Product');
  const productsCount = await Product.countDocuments({ category: category._id });
  
  if (productsCount > 0) {
    res.status(400);
    throw new Error(`Cannot delete category with ${productsCount} product(s). Delete products first or reassign them.`);
  }

  await category.deleteOne();
  res.json({ message: 'Category removed' });
});

export {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
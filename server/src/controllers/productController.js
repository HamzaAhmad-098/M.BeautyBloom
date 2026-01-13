import asyncHandler from 'express-async-handler';
import Product from '../models/Product.js';

// @desc    Fetch all products with filtering
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 12;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};

  const categoryFilter = req.query.category
    ? { category: req.query.category }
    : {};

  const brandFilter = req.query.brand
    ? { brand: { $in: req.query.brand.split(',') } }
    : {};

  const skinTypeFilter = req.query.skinType
    ? { skinType: { $in: req.query.skinType.split(',') } }
    : {};

  const priceFilter = {};
  if (req.query.minPrice || req.query.maxPrice) {
    priceFilter.actualPrice = {};
    if (req.query.minPrice) {
      priceFilter.actualPrice.$gte = Number(req.query.minPrice);
    }
    if (req.query.maxPrice) {
      priceFilter.actualPrice.$lte = Number(req.query.maxPrice);
    }
  }

  const ratingFilter = req.query.rating
    ? { rating: { $gte: Number(req.query.rating) } }
    : {};

  const isFeaturedFilter = req.query.featured
    ? { isFeatured: true }
    : {};

  const isNewFilter = req.query.new
    ? { isNew: true }
    : {};

  const sort = {};
  if (req.query.sort) {
    switch (req.query.sort) {
      case 'price-low':
        sort.actualPrice = 1;
        break;
      case 'price-high':
        sort.actualPrice = -1;
        break;
      case 'rating':
        sort.rating = -1;
        break;
      case 'newest':
        sort.createdAt = -1;
        break;
      case 'popular':
        sort.sold = -1;
        break;
      default:
        sort.createdAt = -1;
    }
  }

  const count = await Product.countDocuments({
    ...keyword,
    ...categoryFilter,
    ...brandFilter,
    ...skinTypeFilter,
    ...priceFilter,
    ...ratingFilter,
    ...isFeaturedFilter,
    ...isNewFilter,
  });

  const products = await Product.find({
    ...keyword,
    ...categoryFilter,
    ...brandFilter,
    ...skinTypeFilter,
    ...priceFilter,
    ...ratingFilter,
    ...isFeaturedFilter,
    ...isNewFilter,
  })
    .sort(sort)
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({
    products,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  });
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: 'Sample name',
    price: 0,
    user: req.user._id,
    image: '/images/sample.jpg',
    brand: 'Sample brand',
    category: 'Sample category',
    countInStock: 0,
    numReviews: 0,
    description: 'Sample description',
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    description,
    images,
    brand,
    category,
    stock,
    discountPrice,
    isFeatured,
    isNew,
    variants,
    skinType,
    ingredients,
    howToUse,
    benefits,
    weight,
    expiryDate,
  } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.images = images;
    product.brand = brand;
    product.category = category;
    product.stock = stock;
    product.discountPrice = discountPrice;
    product.actualPrice = discountPrice > 0 ? discountPrice : price;
    product.isFeatured = isFeatured;
    product.isNew = isNew;
    product.variants = variants;
    product.skinType = skinType;
    product.ingredients = ingredients;
    product.howToUse = howToUse;
    product.benefits = benefits;
    product.weight = weight;
    product.expiryDate = expiryDate;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.deleteOne();
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Product already reviewed');
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(5);

  res.json(products);
});

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isFeatured: true }).limit(8);

  res.json(products);
});

// @desc    Get new arrivals
// @route   GET /api/products/new
// @access  Public
const getNewProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isNew: true })
    .sort({ createdAt: -1 })
    .limit(8);

  res.json(products);
});

// @desc    Get products by category
// @route   GET /api/products/category/:category
// @access  Public
const getProductsByCategory = asyncHandler(async (req, res) => {
  const products = await Product.find({ category: req.params.category });
  res.json(products);
});

// @desc    Get unique brands
// @route   GET /api/products/brands
// @access  Public
const getBrands = asyncHandler(async (req, res) => {
  const brands = await Product.distinct('brand');
  res.json(brands);
});

// @desc    Get categories with counts
// @route   GET /api/products/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Product.aggregate([
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
      },
    },
    {
      $sort: { count: -1 },
    },
  ]);

  res.json(categories);
});

export {
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
};
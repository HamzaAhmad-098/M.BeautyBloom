import asyncHandler from 'express-async-handler';
import Product from '../models/Product.js';
import cloudinary from '../config/cloudinary.js';

// @desc    Get products (paginated & filterable)
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 12;
  const page = Number(req.query.pageNumber) || 1;
  const keyword = req.query.keyword
    ? {
        name: { $regex: req.query.keyword, $options: 'i' },
      }
    : {};

  const count = await Product.countDocuments({ ...keyword });
  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort({ createdAt: -1 });

  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Get product by ID
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
// Replace the existing createProduct handler with the following:

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  if (!req.user || !req.user._id) {
    res.status(401);
    throw new Error('Not authorized');
  }

  // Accept product data from client if provided
  const {
    name,
    price,
    description,
    images,
    brand,
    category,
    countInStock,
    discountPrice,
    isFeatured,
    isNew,
    variants,
    subCategory,
    tags,
    weight,
    expiryDate,
  } = req.body || {};

  // Helper to normalize images field (client may send JSON string or array)
  const parseImages = (imagesInput) => {
    if (!imagesInput) return [];
    if (typeof imagesInput === 'string') {
      try {
        return JSON.parse(imagesInput);
      } catch (err) {
        // maybe comma separated string of urls
        return imagesInput.split(',').map((u) => ({ url: u.trim(), public_id: '' })).filter(Boolean);
      }
    }
    if (Array.isArray(imagesInput)) {
      return imagesInput.map((i) => {
        if (typeof i === 'string') return { url: i, public_id: '' };
        return { url: i.url || i.secure_url || '', public_id: i.public_id || i.publicId || '' };
      });
    }
    return [];
  };

  // If the admin provided meaningful data, create product from that payload
  const hasClientData = name || price || brand || category || (images && images.length);

  if (hasClientData) {
    // validate minimal required fields
    if (!name || !price || !brand || !category) {
      res.status(400);
      throw new Error('name, price, brand and category are required to create a product');
    }

    const product = new Product({
      name,
      price: Number(price),
      user: req.user._id,
      images: parseImages(images),
      brand,
      category,
      subCategory,
      countInStock: countInStock !== undefined ? Number(countInStock) : 0,
      discountPrice: discountPrice !== undefined ? Number(discountPrice) : undefined,
      isFeatured: !!isFeatured,
      isNew: isNew !== undefined ? !!isNew : true,
      variants: variants || [],
      tags: tags || [],
      description: description || '',
      weight,
      expiryDate,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
    return;
  }

  // Fallback: keep the old admin quick-create behavior for UI flows that expect it
  const sampleProduct = new Product({
    name: 'Sample name',
    price: 0,
    user: req.user._id,
    images: [], // empty array to avoid validation problems
    brand: 'Sample brand',
    category: 'Skincare',
    countInStock: 0,
    numReviews: 0,
    description: 'Sample description',
  });

  const createdProduct = await sampleProduct.save();
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
    countInStock,
    discountPrice,
    isFeatured,
    isNew,
    variants,
    subCategory,
    tags,
    weight,
    expiryDate,
  } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name || product.name;
    product.price = price !== undefined ? price : product.price;
    product.description = description || product.description;
    product.brand = brand || product.brand;
    product.category = category || product.category;
    product.subCategory = subCategory || product.subCategory;
    product.countInStock = countInStock !== undefined ? countInStock : product.countInStock;
    product.discountPrice = discountPrice !== undefined ? discountPrice : product.discountPrice;
    product.isFeatured = isFeatured !== undefined ? !!isFeatured : product.isFeatured;
    product.isNew = isNew !== undefined ? !!isNew : product.isNew;
    product.variants = variants || product.variants;
    product.tags = tags || product.tags;
    product.weight = weight || product.weight;
    product.expiryDate = expiryDate || product.expiryDate;

    // If images present in request, replace them. Expect format: [{ url, public_id, alt }]
    if (images && Array.isArray(images)) {
      const currentPublicIds = (product.images || []).map((i) => i.public_id).filter(Boolean);
      const newPublicIds = images.map((i) => i.public_id).filter(Boolean);

      // delete images that are not present in newPublicIds
      const toDelete = currentPublicIds.filter((id) => id && !newPublicIds.includes(id));
      for (const pid of toDelete) {
        try {
          await cloudinary.uploader.destroy(pid, { resource_type: 'image' });
        } catch (err) {
          // log and continue
          console.error('Cloudinary delete error', pid, err.message || err);
        }
      }

      product.images = images.map((i) => ({ url: i.url, public_id: i.public_id || '', alt: i.alt || '' }));
    }

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
    // delete images from Cloudinary (if public_id present)
    if (product.images && product.images.length) {
      for (const img of product.images) {
        if (img.public_id) {
          try {
            await cloudinary.uploader.destroy(img.public_id, { resource_type: 'image' });
          } catch (err) {
            console.error('Cloudinary delete error', img.public_id, err.message || err);
          }
        }
      }
    }

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
    const alreadyReviewed = product.reviews.find((r) => r.user.toString() === req.user._id.toString());

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Product already reviewed');
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
      verifiedPurchase: false,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Delete a review (Admin)
// @route   DELETE /api/products/:id/reviews/:reviewId
// @access  Private/Admin
const deleteProductReview = asyncHandler(async (req, res) => {
  const { id, reviewId } = req.params;
  const product = await Product.findById(id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const initialLen = product.reviews.length;
  product.reviews = product.reviews.filter((r) => r._id.toString() !== reviewId.toString());

  if (product.reviews.length === initialLen) {
    res.status(404);
    throw new Error('Review not found');
  }

  product.numReviews = product.reviews.length;
  product.rating = product.reviews.length
    ? product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length
    : 0;

  await product.save();
  res.json({ message: 'Review removed' });
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
  const products = await Product.find({ isNew: true }).sort({ createdAt: -1 }).limit(8);
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
  deleteProductReview,
  getTopProducts,
  getFeaturedProducts,
  getNewProducts,
  getProductsByCategory,
  getBrands,
  getCategories,
};
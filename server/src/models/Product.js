import mongoose from 'mongoose';

const reviewSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
    verifiedPurchase: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['Skincare', 'Makeup', 'Haircare', 'Fragrance', 'Bath & Body', 'Tools & Brushes'],
    },
    subCategory: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    discountPrice: {
      type: Number,
      default: 0,
    },
    actualPrice: {
      type: Number,
      default: function() {
        return this.discountPrice > 0 ? this.discountPrice : this.price;
      },
    },
    images: [{
      type: String,
      required: true,
    }],
    description: {
      type: String,
      required: true,
    },
    ingredients: {
      type: String,
    },
    howToUse: {
      type: String,
    },
    benefits: [{
      type: String,
    }],
    skinType: {
      type: [String],
      enum: ['Oily', 'Dry', 'Combination', 'Sensitive', 'Normal', 'All'],
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
    },
    sold: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    reviews: [reviewSchema],
    tags: [{
      type: String,
    }],
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isNew: {
      type: Boolean,
      default: true,
    },
    variants: [{
      name: String,
      price: Number,
      stock: Number,
      sku: String,
    }],
    weight: {
      type: String,
    },
    expiryDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Calculate rating before saving reviews
productSchema.pre('save', function(next) {
  if (this.reviews.length > 0) {
    this.rating = this.reviews.reduce((acc, item) => item.rating + acc, 0) / this.reviews.length;
    this.numReviews = this.reviews.length;
  }
  next();
});

const Product = mongoose.model('Product', productSchema);
export default Product;
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
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: false, // Make optional for now
      ref: 'User',
    },
    name: { 
      type: String, 
      required: [true, 'Product name is required']
    },
    brand: { 
      type: String, 
      required: [true, 'Brand is required']
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Skincare', 'Makeup', 'Haircare', 'Fragrance', 'Bath & Body', 'Tools & Brushes'],
    },
    subCategory: { type: String },
    price: { 
      type: Number, 
      required: [true, 'Price is required'],
      default: 0,
      min: [0, 'Price cannot be negative']
    },
    discountPrice: { type: Number },
    countInStock: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
    sold: { type: Number, default: 0 },
    description: { type: String, default: '' },

    // Images array - make it completely optional
    images: {
      type: [
        {
          url: { type: String, required: false },
          public_id: { type: String, required: false },
          file_id: { type: String, required: false },
          alt: { type: String, required: false },
        },
      ],
      default: [],
      required: false,
    },

    numReviews: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    reviews: [reviewSchema],
    tags: [{ type: String }],
    isFeatured: { type: Boolean, default: false },
    isNew: { type: Boolean, default: true },
    variants: [{ 
      name: String, 
      price: Number, 
      stock: Number, 
      sku: String 
    }],
    weight: { type: String },
    expiryDate: { type: Date },
  },
  {
    timestamps: true,
  }
);

// Recalculate rating and numReviews on save
productSchema.pre('save', function (next) {
  if (this.reviews && this.reviews.length > 0) {
    this.numReviews = this.reviews.length;
    this.rating =
      this.reviews.reduce((acc, item) => item.rating + acc, 0) /
      this.reviews.length;
  } else {
    this.numReviews = 0;
    this.rating = 0;
  }
  next();
});

const Product = mongoose.model('Product', productSchema);
export default Product;
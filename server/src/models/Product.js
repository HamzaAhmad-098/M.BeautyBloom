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
    name: { type: String, required: true },
    brand: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ['Skincare', 'Makeup', 'Haircare', 'Fragrance', 'Bath & Body', 'Tools & Brushes'],
    },
    subCategory: { type: String },
    price: { type: Number, required: true, default: 0 },
    discountPrice: { type: Number },
    countInStock: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
    sold: { type: Number, default: 0 },
    description: { type: String },

    // images array to support multiple images stored on Cloudinary
    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
        alt: { type: String },
      },
    ],

    numReviews: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    reviews: [reviewSchema],
    tags: [{ type: String }],
    isFeatured: { type: Boolean, default: false },
    isNew: { type: Boolean, default: true },
    variants: [{ name: String, price: Number, stock: Number, sku: String }],
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
    this.rating = this.reviews.reduce((acc, item) => item.rating + acc, 0) / this.reviews.length;
  } else {
    this.numReviews = 0;
    this.rating = 0;
  }
  next();
});

const Product = mongoose.model('Product', productSchema);
export default Product;
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Product from './models/Product.js';
import Category from './models/Category.js';
import connectDB from './config/db.js';

dotenv.config();

// Sample products data
const products = [
  {
    name: 'Moisturizing Cream',
    brand: 'Neutrogena',
    category: 'Skincare',
    price: 2999,
    discountPrice: 2499,
    description: 'Deeply hydrating moisturizer for all skin types',
    ingredients: 'Hyaluronic Acid, Vitamin E, Glycerin',
    howToUse: 'Apply to clean face and neck twice daily',
    benefits: ['Hydration', 'Anti-aging', 'Skin repair'],
    skinType: ['Dry', 'Normal', 'Sensitive'],
    images: [
      'https://images.unsplash.com/photo-1556228578-9c360e1d8d34?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=400&fit=crop'
    ],
    stock: 100,
    isFeatured: true,
    isNew: true,
    weight: '50ml',
    rating: 4.5,
    numReviews: 45,
  },
  {
    name: 'Matte Lipstick',
    brand: 'Maybelline',
    category: 'Makeup',
    price: 1599,
    discountPrice: 1299,
    description: 'Long-lasting matte finish lipstick',
    images: [
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1587051869605-d08c084a2996?w=400&h=400&fit=crop'
    ],
    stock: 150,
    isFeatured: true,
    isNew: false,
    variants: [
      { name: 'Red', price: 1599, stock: 50, sku: 'LIP001-RED' },
      { name: 'Pink', price: 1599, stock: 50, sku: 'LIP001-PINK' },
      { name: 'Nude', price: 1599, stock: 50, sku: 'LIP001-NUDE' }
    ],
    weight: '3.5g',
    rating: 4.7,
    numReviews: 89,
  },
  {
    name: 'Shampoo for Damaged Hair',
    brand: 'Pantene',
    category: 'Haircare',
    price: 1299,
    description: 'Repair and restore damaged hair',
    images: [
      'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&h=400&fit=crop'
    ],
    stock: 75,
    isFeatured: false,
    isNew: true,
    weight: '400ml',
    rating: 4.3,
    numReviews: 34,
  },
  {
    name: 'Perfume Eau de Parfum',
    brand: 'Chanel',
    category: 'Fragrance',
    price: 8999,
    discountPrice: 7999,
    description: 'Luxury fragrance with floral notes',
    images: [
      'https://images.unsplash.com/photo-1541643600914-78b084683601?w-400&h=400&fit=crop'
    ],
    stock: 25,
    isFeatured: true,
    isNew: false,
    weight: '100ml',
    rating: 4.8,
    numReviews: 120,
  },
  {
    name: 'Body Lotion',
    brand: 'Nivea',
    category: 'Bath & Body',
    price: 999,
    description: '24h moisture for soft skin',
    images: [
      'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&h=400&fit=crop'
    ],
    stock: 200,
    isFeatured: false,
    isNew: false,
    weight: '400ml',
    rating: 4.4,
    numReviews: 67,
  },
];

// Sample categories
const categories = [
  { name: 'Skincare', slug: 'skincare', description: 'Face and body skincare products' },
  { name: 'Makeup', slug: 'makeup', description: 'Cosmetics and makeup products' },
  { name: 'Haircare', slug: 'haircare', description: 'Hair care and styling products' },
  { name: 'Fragrance', slug: 'fragrance', description: 'Perfumes and scents' },
  { name: 'Bath & Body', slug: 'bath-body', description: 'Bath and body care products' },
  { name: 'Tools & Brushes', slug: 'tools-brushes', description: 'Beauty tools and brushes' },
];

const importData = async () => {
  try {
    await connectDB();
    
    // Clear existing data
    await User.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    
    console.log('🗑️  Existing data cleared');
    
    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@cosmetics.com',
      password: await bcrypt.hash('Admin123', 12),
      isAdmin: true,
      phone: '+923001234567',
      addresses: [{
        name: 'Admin Office',
        address: 'DHA Phase 5',
        city: 'Karachi',
        state: 'Sindh',
        postalCode: '75500',
        country: 'Pakistan',
        phone: '+923001234567',
        isDefault: true,
      }]
    });
    
    // Create regular user
    const regularUser = await User.create({
      name: 'Test Customer',
      email: 'customer@example.com',
      password: await bcrypt.hash('Password123', 12),
      phone: '+923001234568',
      addresses: [{
        name: 'Home Address',
        address: 'Gulshan-e-Iqbal',
        city: 'Karachi',
        state: 'Sindh',
        postalCode: '75300',
        country: 'Pakistan',
        phone: '+923001234568',
        isDefault: true,
      }]
    });
    
    console.log('👥 Users created:', {
      admin: adminUser.email,
      customer: regularUser.email
    });
    
    // Create categories
    const createdCategories = await Category.insertMany(categories);
    console.log('📂 Categories created:', createdCategories.length);
    
    // Create products
    const createdProducts = await Product.insertMany(products);
    console.log('📦 Products created:', createdProducts.length);
    
    // Add some reviews
    const reviewProduct = await Product.findById(createdProducts[0]._id);
    reviewProduct.reviews.push({
      user: regularUser._id,
      name: regularUser.name,
      rating: 5,
      comment: 'Excellent product! My skin feels amazing.',
      verifiedPurchase: true,
    });
    reviewProduct.rating = 5;
    reviewProduct.numReviews = 1;
    await reviewProduct.save();
    
    console.log('✅ Data import completed successfully');
    process.exit();
  } catch (error) {
    console.error('❌ Error importing data:', error);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();
    
    await User.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    
    console.log('🗑️  All data destroyed');
    process.exit();
  } catch (error) {
    console.error('❌ Error destroying data:', error);
    process.exit(1);
  }
};

// Run seeder based on command line argument
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
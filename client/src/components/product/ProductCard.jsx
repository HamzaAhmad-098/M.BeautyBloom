import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../store/slices/cartSlice';
import { FaStar, FaShoppingCart, FaHeart } from 'react-icons/fa';
import { useState } from 'react';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleAddToCart = () => {
    // Check if product object exists
    if (!product || !product._id) {
      console.error('Product data is missing');
      return;
    }
    
    // Make sure we're passing the full product object
    const productData = {
      product: {
        _id: product._id,
        name: product.name || 'Product',
        price: product.price || 0,
        discountPrice: product.discountPrice || 0,
        images: product.images || ['https://via.placeholder.com/300'],
        brand: product.brand || 'Brand',
        stock: product.stock || 0,
      },
      quantity: 1
    };
    
    dispatch(addToCart(productData));
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    // TODO: Add to wishlist API call
  };

  // Handle missing product data
  if (!product) {
    return (
      <div className="bg-gray-100 rounded-lg h-80 animate-pulse"></div>
    );
  }

  const price = product.discountPrice > 0 ? product.discountPrice : product.price;
  const originalPrice = product.discountPrice > 0 ? product.price : null;
  const discountPercentage = product.discountPrice > 0 
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <div className="group relative bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {discountPercentage > 0 && (
          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            -{discountPercentage}%
          </span>
        )}
        {product.isNew && (
          <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">
            NEW
          </span>
        )}
        {product.stock === 0 && (
          <span className="bg-gray-500 text-white text-xs font-bold px-2 py-1 rounded">
            OUT OF STOCK
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={toggleWishlist}
        className="absolute top-3 right-3 z-10 p-2 bg-white rounded-full shadow hover:shadow-md transition"
      >
        <FaHeart
          className={isWishlisted ? 'text-red-500' : 'text-gray-400'}
        />
      </button>

      {/* Product Image */}
      <Link to={`/product/${product._id}`} className="block overflow-hidden">
        <div className="relative h-64">
          <img
            src={product.images?.[0] || 'https://via.placeholder.com/300'}
            alt={product.name || 'Product'}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300';
            }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4">
        <Link to={`/product/${product._id}`}>
          <div className="mb-2">
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              {product.brand || 'Brand'}
            </p>
            <h3 className="font-semibold text-gray-800 hover:text-primary-600 line-clamp-2 h-12">
              {product.name || 'Product Name'}
            </h3>
          </div>
        </Link>

        {/* Rating */}
        <div className="flex items-center mb-3">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className={`text-sm ${
                  i < Math.floor(product.rating || 0)
                    ? 'text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500 ml-2">
            ({product.numReviews || 0})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xl font-bold text-gray-900">
              Rs. {(price || 0).toLocaleString()}
            </span>
            {originalPrice && originalPrice > 0 && (
              <span className="text-sm text-gray-500 line-through ml-2">
                Rs. {(originalPrice || 0).toLocaleString()}
              </span>
            )}
          </div>
          {product.stock > 0 && (
            <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
              In Stock
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`flex-1 py-2 px-4 rounded-md flex items-center justify-center gap-2 ${
              product.stock === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-primary-500 hover:bg-primary-600 text-white'
            }`}
          >
            <FaShoppingCart />
            <span>{product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
          </button>
          <Link
            to={`/product/${product._id}`}
            className="py-2 px-4 border border-primary-500 text-primary-500 hover:bg-primary-50 rounded-md transition-colors"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
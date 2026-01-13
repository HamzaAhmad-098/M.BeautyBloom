import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { fetchProductById } from '../store/slices/productSlice';
import { FaStar, FaShippingFast, FaShieldAlt, FaUndo, FaHeart, FaShareAlt, FaMinus, FaPlus, FaCheck } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState('');
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState('description');
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/products/${id}`);
        setProduct(response.data);
        setReviews(response.data.reviews || []);
        if (response.data.variants && response.data.variants.length > 0) {
          setSelectedVariant(response.data.variants[0].name);
        }
      } catch (error) {
        toast.error('Product not found');
        navigate('/shop');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const handleAddToCart = () => {
    if (product.stock < quantity) {
      toast.error('Not enough stock available');
      return;
    }
    
    dispatch(addToCart({ 
      productId: product._id, 
      quantity,
      variant: selectedVariant 
    }));
    toast.success('Added to cart!');
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  const handleQuantityChange = (type) => {
    if (type === 'increase') {
      if (quantity < product.stock) {
        setQuantity(quantity + 1);
      }
    } else {
      if (quantity > 1) {
        setQuantity(quantity - 1);
      }
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} on Cosmetics Store`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const features = [
    { icon: <FaShippingFast />, text: 'Free Shipping', subtext: 'On orders above Rs. 2000' },
    { icon: <FaShieldAlt />, text: '100% Authentic', subtext: 'Guaranteed genuine' },
    { icon: <FaUndo />, text: 'Easy Returns', subtext: '14-day return policy' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gray-200 h-[500px] rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
                <div className="h-12 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700">Product not found</h2>
          <button
            onClick={() => navigate('/shop')}
            className="mt-4 text-primary-600 hover:text-primary-700"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  const price = product.discountPrice > 0 ? product.discountPrice : product.price;
  const originalPrice = product.discountPrice > 0 ? product.price : null;
  const discountPercentage = product.discountPrice > 0 
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="flex text-sm">
            <a href="/" className="text-gray-500 hover:text-gray-700">Home</a>
            <span className="mx-2">/</span>
            <a href="/shop" className="text-gray-500 hover:text-gray-700">Shop</a>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">{product.category}</span>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-semibold truncate">{product.name}</span>
          </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div>
            <div className="sticky top-24">
              {/* Main Image */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-4">
                <img
                  src={product.images?.[selectedImage] || 'https://via.placeholder.com/600'}
                  alt={product.name}
                  className="w-full h-[500px] object-contain p-8"
                />
              </div>

              {/* Thumbnails */}
              {product.images && product.images.length > 1 && (
                <div className="flex space-x-3 overflow-x-auto pb-2">
                  {product.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                        selectedImage === index
                          ? 'border-primary-500'
                          : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              {/* Brand & Name */}
              <div className="mb-4">
                <span className="text-sm text-gray-500 uppercase tracking-wider">
                  {product.brand}
                </span>
                <h1 className="text-3xl font-bold text-gray-900 mt-1">
                  {product.name}
                </h1>
              </div>

              {/* Rating */}
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`text-lg ${
                        i < Math.floor(product.rating || 0)
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-gray-600">
                  {product.rating?.toFixed(1) || '0.0'} ({product.numReviews || 0} reviews)
                </span>
                <span className="mx-3 text-gray-300">•</span>
                <span className={`text-sm font-medium ${
                  product.stock > 10 ? 'text-green-600' : 
                  product.stock > 0 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {product.stock > 10 ? 'In Stock' : 
                   product.stock > 0 ? `Only ${product.stock} left` : 'Out of Stock'}
                </span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-center space-x-4">
                  <span className="text-4xl font-bold text-gray-900">
                    Rs. {price.toLocaleString()}
                  </span>
                  {originalPrice && (
                    <>
                      <span className="text-2xl text-gray-500 line-through">
                        Rs. {originalPrice.toLocaleString()}
                      </span>
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        Save {discountPercentage}%
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Variants */}
              {product.variants && product.variants.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-700 mb-3">Select Variant:</h3>
                  <div className="flex flex-wrap gap-3">
                    {product.variants.map((variant, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedVariant(variant.name)}
                        className={`px-4 py-2 rounded-lg border-2 ${
                          selectedVariant === variant.name
                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {variant.name}
                        {variant.price !== price && (
                          <span className="ml-2 text-sm">(+Rs. {variant.price - price})</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-700 mb-3">Quantity:</h3>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => handleQuantityChange('decrease')}
                      className="p-3 hover:bg-gray-100"
                      disabled={quantity <= 1}
                    >
                      <FaMinus className="text-gray-600" />
                    </button>
                    <span className="w-16 text-center text-lg font-medium">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange('increase')}
                      className="p-3 hover:bg-gray-100"
                      disabled={quantity >= product.stock}
                    >
                      <FaPlus className="text-gray-600" />
                    </button>
                  </div>
                  <span className="text-gray-600">
                    {product.stock} available
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className={`py-3 px-6 rounded-lg font-semibold flex items-center justify-center space-x-2 ${
                    product.stock === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-primary-500 hover:bg-primary-600 text-white'
                  }`}
                >
                  <span>Add to Cart</span>
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                  className={`py-3 px-6 rounded-lg font-semibold ${
                    product.stock === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-900 hover:bg-black text-white'
                  }`}
                >
                  Buy Now
                </button>
              </div>

              {/* Secondary Actions */}
              <div className="flex space-x-4">
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                    isWishlisted
                      ? 'text-red-600 bg-red-50'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <FaHeart />
                  <span>{isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}</span>
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:text-gray-900"
                >
                  <FaShareAlt />
                  <span>Share</span>
                </button>
              </div>

              {/* Features */}
              <div className="mt-8 pt-6 border-t">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {features.map((feature, index) => (
                    <div key={index} className="text-center">
                      <div className="text-primary-500 text-2xl mb-2 flex justify-center">
                        {feature.icon}
                      </div>
                      <h4 className="font-semibold text-gray-900">{feature.text}</h4>
                      <p className="text-sm text-gray-600">{feature.subtext}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-12">
          {/* Tab Headers */}
          <div className="border-b">
            <div className="flex overflow-x-auto">
              {['description', 'ingredients', 'how-to-use', 'reviews', 'shipping'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-4 font-medium capitalize whitespace-nowrap ${
                    activeTab === tab
                      ? 'border-b-2 border-primary-500 text-primary-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'description' && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Description</h3>
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
                  
                  {product.benefits && product.benefits.length > 0 && (
                    <div className="mt-6">
                      <h4 className="font-semibold mb-3">Key Benefits:</h4>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {product.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-center">
                            <FaCheck className="text-green-500 mr-2" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'ingredients' && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Ingredients</h3>
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-line">
                    {product.ingredients || 'Ingredient information not available.'}
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'how-to-use' && (
              <div>
                <h3 className="text-xl font-semibold mb-4">How to Use</h3>
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-line">
                    {product.howToUse || 'Usage instructions not available.'}
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-xl font-semibold">Customer Reviews</h3>
                    <div className="flex items-center mt-2">
                      <div className="flex items-center mr-4">
                        <span className="text-3xl font-bold mr-2">{product.rating?.toFixed(1)}</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <FaStar
                              key={i}
                              className={`text-lg ${
                                i < Math.floor(product.rating || 0)
                                  ? 'text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-gray-600">
                        {product.numReviews || 0} {product.numReviews === 1 ? 'review' : 'reviews'}
                      </span>
                    </div>
                  </div>
                  <button className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg">
                    Write a Review
                  </button>
                </div>

                {reviews.length > 0 ? (
                  <div className="space-y-6">
                    {reviews.slice(0, 5).map((review, index) => (
                      <div key={index} className="border-b pb-6 last:border-b-0">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold">{review.name}</h4>
                            <div className="flex items-center mt-1">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <FaStar
                                    key={i}
                                    className={`text-sm ${
                                      i < review.rating
                                        ? 'text-yellow-400'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              {review.verifiedPurchase && (
                                <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                  Verified Purchase
                                </span>
                              )}
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-600">No reviews yet. Be the first to review!</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'shipping' && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Shipping & Returns</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="font-semibold mb-3">Shipping Information</h4>
                    <ul className="space-y-2 text-gray-600">
                      <li>• Free shipping on orders above Rs. 2000</li>
                      <li>• Standard shipping: Rs. 200</li>
                      <li>• Delivery within 3-7 business days</li>
                      <li>• Cash on Delivery available</li>
                      <li>• Same day delivery in major cities</li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="font-semibold mb-3">Return Policy</h4>
                    <ul className="space-y-2 text-gray-600">
                      <li>• 14-day return policy</li>
                      <li>• Products must be unopened and unused</li>
                      <li>• Original packaging required</li>
                      <li>• Free returns for damaged items</li>
                      <li>• Refund processed within 7 days</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow p-4">
                <div className="h-48 bg-gray-100 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
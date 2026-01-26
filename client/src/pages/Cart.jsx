import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { removeItem, updateQuantity, clearCart } from '../store/slices/cartSlice.js';
import { FaTrash, FaPlus, FaMinus, FaShoppingBag, FaArrowLeft } from 'react-icons/fa';
import { useState } from 'react';

const Cart = () => {
  const { cartItems, cartTotal, itemsCount } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [updatingId, setUpdatingId] = useState(null);

  const shippingPrice = cartTotal > 2000 ? 0 : 200;
  const taxPrice = cartTotal * 0.05;
  const totalPrice = cartTotal + shippingPrice + taxPrice;

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setUpdatingId(itemId);
    dispatch(updateQuantity({ itemId, quantity: newQuantity }));
    
    // Simulate loading state
    setTimeout(() => setUpdatingId(null), 300);
  };

  const handleRemoveItem = (itemId) => {
    if (window.confirm('Remove this item from cart?')) {
      dispatch(removeItem(itemId));
    }
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      dispatch(clearCart());
    }
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center animate-fade-in">
          <div className="text-gray-300 mb-6 animate-float">
            <FaShoppingBag className="w-24 h-24 mx-auto" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Looks like you haven't added any products to your cart yet.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/shop"
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 mobile-tap-target"
            >
              Continue Shopping
            </Link>
            <Link
              to="/"
              className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-lg font-semibold transition-colors mobile-tap-target"
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4">
      <div className="max-w-7xl mx-auto animate-fade-in">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 flex items-center">
          <FaShoppingBag className="mr-3 text-primary-500" />
          Shopping Cart ({itemsCount} {itemsCount === 1 ? 'item' : 'items'})
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item._id || `${item.productId}-${Date.now()}`}
                className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-all duration-300 animate-slide-in"
              >
                <div className="flex items-start space-x-4">
                  {/* Product Image */}
                  <Link 
                    to={`/product/${item.productId || item.product?._id}`} 
                    className="flex-shrink-0"
                  >
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={item.image || item.product?.images?.[0] || 'https://via.placeholder.com/150'}
                        alt={item.name || item.product?.name}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  </Link>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${item.productId || item.product?._id}`}>
                      <h3 className="font-semibold text-gray-800 hover:text-primary-600 text-sm sm:text-base line-clamp-2">
                        {item.name || item.product?.name || 'Product'}
                      </h3>
                    </Link>
                    <p className="text-xs text-gray-500 mt-1">
                      {item.brand || item.product?.brand || 'Brand'}
                    </p>
                    <div className="mt-2">
                      <span className="font-bold text-gray-900">
                        Rs. {(
                          (item.price || 
                           (item.product?.discountPrice > 0 
                            ? item.product?.discountPrice 
                            : item.product?.price) || 0) * (item.quantity || 1)
                        ).toLocaleString()}
                      </span>
                      {item.product?.discountPrice > 0 && item.product?.price && (
                        <span className="text-xs text-gray-500 line-through ml-2">
                          Rs. {(item.product?.price * (item.quantity || 1)).toLocaleString()}
                        </span>
                      )}
                    </div>

                    {/* Quantity Controls */}
                    <div className="mt-3 flex items-center space-x-3">
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() => handleQuantityChange(item._id, (item.quantity || 1) - 1)}
                          disabled={item.quantity <= 1 || updatingId === item._id}
                          className="p-2 hover:bg-gray-100 disabled:opacity-50 mobile-tap-target"
                        >
                          <FaMinus className="text-gray-600 text-xs" />
                        </button>
                        <span className="w-12 text-center font-medium">
                          {updatingId === item._id ? '...' : item.quantity || 1}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item._id, (item.quantity || 1) + 1)}
                          disabled={updatingId === item._id}
                          className="p-2 hover:bg-gray-100 disabled:opacity-50 mobile-tap-target"
                        >
                          <FaPlus className="text-gray-600 text-xs" />
                        </button>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item._id)}
                        className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center mobile-tap-target"
                      >
                        <FaTrash className="mr-1 text-xs" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Cart Actions */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <Link
                  to="/shop"
                  className="text-primary-600 hover:text-primary-700 font-medium flex items-center mobile-tap-target"
                >
                  <FaArrowLeft className="mr-2" />
                  Continue Shopping
                </Link>
                <button
                  onClick={handleClearCart}
                  className="text-red-500 hover:text-red-700 font-medium px-4 py-2 rounded-lg hover:bg-red-50 transition-colors mobile-tap-target"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24 animate-scale-in">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({itemsCount} items)</span>
                  <span className="font-medium">Rs. {cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {shippingPrice === 0 ? 'FREE' : `Rs. ${shippingPrice}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (5%)</span>
                  <span className="font-medium">Rs. {taxPrice.toLocaleString()}</span>
                </div>
                
                {shippingPrice > 0 && cartTotal < 2000 && (
                  <div className="p-3 bg-green-50 rounded-lg mt-3 animate-pulse">
                    <p className="text-sm text-green-700">
                      Add Rs. {(2000 - cartTotal).toLocaleString()} more for free shipping!
                    </p>
                  </div>
                )}
              </div>

              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between text-lg font-bold mb-2">
                  <span>Total</span>
                  <span className="text-primary-600">Rs. {totalPrice.toLocaleString()}</span>
                </div>
                <p className="text-sm text-gray-500">
                  Including all taxes and shipping
                </p>
              </div>

              <div className="mt-6 space-y-3">
                <Link
                  to={userInfo ? '/checkout' : '/login?redirect=/checkout'}
                  className="block w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:opacity-90 text-white text-center py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 mobile-tap-target"
                >
                  {userInfo ? 'Proceed to Checkout' : 'Login to Checkout'}
                </Link>
                
                <div className="flex items-center justify-center space-x-4 text-sm text-gray-600 mt-4">
                  <span className="px-2 py-1 bg-gray-100 rounded">COD</span>
                  <span className="px-2 py-1 bg-gray-100 rounded">JazzCash</span>
                  <span className="px-2 py-1 bg-gray-100 rounded">Easypaisa</span>
                  <span className="px-2 py-1 bg-gray-100 rounded">Card</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
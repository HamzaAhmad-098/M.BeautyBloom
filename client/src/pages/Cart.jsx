import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { removeItem, updateQuantity, clearCart } from '../store/slices/cartSlice';
import { FaTrash, FaPlus, FaMinus, FaShoppingBag } from 'react-icons/fa';

const Cart = () => {
  const { cartItems, cartTotal, itemsCount } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const shippingPrice = cartTotal > 2000 ? 0 : 200;
  const taxPrice = cartTotal * 0.05;
  const totalPrice = cartTotal + shippingPrice + taxPrice;

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    dispatch(updateQuantity({ itemId, quantity: newQuantity }));
  };

  const handleRemoveItem = (itemId) => {
    dispatch(removeItem(itemId));
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      dispatch(clearCart());
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="text-gray-400 mb-6">
            <FaShoppingBag className="w-24 h-24 mx-auto" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added any products to your cart yet.
          </p>
          <Link
            to="/shop"
            className="inline-block bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center p-4 border-b last:border-b-0"
                >
                  {/* Product Image */}
                  <Link to={`/product/${item.product._id}`} className="flex-shrink-0">
                    <img
                      src={item.product.images?.[0] || 'https://via.placeholder.com/150'}
                      alt={item.product.name}
                      className="w-24 h-24 object-cover rounded"
                    />
                  </Link>

                  {/* Product Info */}
                  <div className="ml-4 flex-1">
                    <Link to={`/product/${item.product._id}`}>
                      <h3 className="font-semibold text-gray-800 hover:text-primary-600">
                        {item.product.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-500">{item.product.brand}</p>
                    <div className="mt-2">
                      <span className="font-bold text-gray-900">
                        Rs. {(
                          (item.product.discountPrice > 0 
                            ? item.product.discountPrice 
                            : item.product.price) * item.quantity
                        ).toLocaleString()}
                      </span>
                      {item.product.discountPrice > 0 && (
                        <span className="text-sm text-gray-500 line-through ml-2">
                          Rs. {(item.product.price * item.quantity).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                      className="p-1 rounded-full hover:bg-gray-100"
                    >
                      <FaMinus className="text-gray-500" />
                    </button>
                    <span className="w-12 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                      className="p-1 rounded-full hover:bg-gray-100"
                    >
                      <FaPlus className="text-gray-500" />
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveItem(item._id)}
                    className="ml-4 p-2 text-red-500 hover:bg-red-50 rounded-full"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}

              {/* Cart Actions */}
              <div className="p-4 flex justify-between items-center">
                <Link
                  to="/shop"
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  ← Continue Shopping
                </Link>
                <button
                  onClick={handleClearCart}
                  className="text-red-500 hover:text-red-700 font-medium"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

              <div className="space-y-3">
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
                  <div className="p-3 bg-green-50 rounded-md">
                    <p className="text-sm text-green-700">
                      Add Rs. {(2000 - cartTotal).toLocaleString()} more for free shipping!
                    </p>
                  </div>
                )}
              </div>

              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>Rs. {totalPrice.toLocaleString()}</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Including all taxes and shipping
                </p>
              </div>

              <div className="mt-6 space-y-3">
                <Link
                  to={userInfo ? '/checkout' : '/login?redirect=/checkout'}
                  className="block w-full bg-primary-500 hover:bg-primary-600 text-white text-center py-3 rounded-lg font-semibold"
                >
                  {userInfo ? 'Proceed to Checkout' : 'Login to Checkout'}
                </Link>
                <Link
                  to="/shop"
                  className="block w-full border border-primary-500 text-primary-500 text-center py-3 rounded-lg font-semibold hover:bg-primary-50"
                >
                  Continue Shopping
                </Link>
              </div>

              {/* Payment Methods */}
              <div className="mt-6 pt-6 border-t">
                <p className="text-sm text-gray-600 mb-2">We accept:</p>
                <div className="flex items-center space-x-3">
                  <div className="text-xs bg-gray-100 px-2 py-1 rounded">COD</div>
                  <div className="text-xs bg-gray-100 px-2 py-1 rounded">JazzCash</div>
                  <div className="text-xs bg-gray-100 px-2 py-1 rounded">Easypaisa</div>
                  <div className="text-xs bg-gray-100 px-2 py-1 rounded">Card</div>
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
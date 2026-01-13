import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FaSearch, FaTruck, FaBox, FaCheckCircle, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const TrackOrder = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId') || '';
  
  const [trackingId, setTrackingId] = useState(orderId);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [trackingHistory, setTrackingHistory] = useState([]);

  useEffect(() => {
    if (orderId) {
      handleTrackOrder();
    }
  }, [orderId]);

  const handleTrackOrder = async () => {
    if (!trackingId.trim()) {
      toast.error('Please enter an order ID');
      return;
    }

    setLoading(true);
    try {
      // In a real app, this would be a dedicated tracking endpoint
      const response = await axios.get(`/api/orders/${trackingId}`);
      setOrder(response.data);
      
      // Generate mock tracking history based on order status
      generateTrackingHistory(response.data);
    } catch (error) {
      toast.error('Order not found. Please check your order ID.');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const generateTrackingHistory = (orderData) => {
    const history = [
      {
        status: 'Order Placed',
        description: 'Your order has been received',
        date: new Date(orderData.createdAt),
        completed: true,
        icon: '📝',
      },
      {
        status: 'Payment Confirmed',
        description: orderData.isPaid ? 'Payment successful' : 'Waiting for payment',
        date: orderData.paidAt ? new Date(orderData.paidAt) : null,
        completed: orderData.isPaid,
        icon: '💰',
      },
      {
        status: 'Processing',
        description: 'Preparing your order for shipment',
        date: orderData.status !== 'Pending' ? 
          new Date(new Date(orderData.createdAt).getTime() + 2 * 60 * 60 * 1000) : null,
        completed: orderData.status !== 'Pending',
        icon: '⚙️',
      },
      {
        status: 'Shipped',
        description: 'Your order has been dispatched',
        date: ['Shipped', 'Delivered'].includes(orderData.status) ? 
          new Date(new Date(orderData.createdAt).getTime() + 24 * 60 * 60 * 1000) : null,
        completed: ['Shipped', 'Delivered'].includes(orderData.status),
        icon: '🚚',
      },
      {
        status: 'Out for Delivery',
        description: 'Your order is on its way',
        date: orderData.status === 'Delivered' ? 
          new Date(new Date(orderData.createdAt).getTime() + 48 * 60 * 60 * 1000) : null,
        completed: orderData.status === 'Delivered',
        icon: '📦',
      },
      {
        status: 'Delivered',
        description: 'Your order has been delivered',
        date: orderData.deliveredAt ? new Date(orderData.deliveredAt) : null,
        completed: orderData.status === 'Delivered',
        icon: '🏠',
      },
    ];
    setTrackingHistory(history);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'text-green-600 bg-green-50';
      case 'Shipped': return 'text-blue-600 bg-blue-50';
      case 'Processing': return 'text-yellow-600 bg-yellow-50';
      case 'Pending': return 'text-gray-600 bg-gray-50';
      case 'Cancelled': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getEstimatedDelivery = () => {
    if (!order) return null;
    
    const orderDate = new Date(order.createdAt);
    const estimatedDate = new Date(orderDate);
    estimatedDate.setDate(estimatedDate.getDate() + 3);
    
    return estimatedDate.toLocaleDateString('en-PK', {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Track Your Order
          </h1>
          <p className="text-lg text-gray-600">
            Enter your order ID to track your package in real-time
          </p>
        </div>

        {/* Search Box */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="max-w-2xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                    placeholder="Enter your Order ID (e.g., ORD123456)"
                    className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none text-lg"
                    onKeyPress={(e) => e.key === 'Enter' && handleTrackOrder()}
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <FaTruck className="text-2xl" />
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-2 ml-2">
                  You can find your Order ID in your confirmation email
                </p>
              </div>
              <button
                onClick={handleTrackOrder}
                disabled={loading}
                className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 rounded-xl font-semibold text-lg whitespace-nowrap disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                    Tracking...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <FaSearch className="mr-2" />
                    Track Order
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Order Tracking Result */}
        {order && (
          <div className="space-y-8">
            {/* Order Summary Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 border-r">
                  <div className="text-2xl font-bold text-primary-600 mb-2">
                    #{order._id.slice(-8).toUpperCase()}
                  </div>
                  <div className="text-sm text-gray-600">Order ID</div>
                </div>
                <div className="text-center p-4 border-r">
                  <div className={`inline-block px-4 py-2 rounded-full font-semibold mb-2 ${getStatusColor(order.status)}`}>
                    {order.status}
                  </div>
                  <div className="text-sm text-gray-600">Current Status</div>
                </div>
                <div className="text-center p-4">
                  <div className="text-xl font-bold text-gray-900 mb-2">
                    Rs. {order.totalPrice.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Total Amount</div>
                </div>
              </div>
            </div>

            {/* Tracking Timeline */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold mb-8 flex items-center">
                <FaBox className="mr-3 text-primary-500" />
                Tracking History
              </h2>

              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-8 top-0 bottom-0 w-1 bg-gray-200"></div>

                {/* Timeline Items */}
                <div className="space-y-8">
                  {trackingHistory.map((item, index) => (
                    <div key={index} className="relative flex">
                      {/* Timeline Dot */}
                      <div className={`absolute left-6 w-4 h-4 rounded-full z-10 ${
                        item.completed ? 'bg-green-500' : 'bg-gray-300'
                      }`}></div>
                      
                      {/* Content */}
                      <div className="ml-16 flex-1">
                        <div className={`p-6 rounded-xl ${
                          item.completed ? 'bg-green-50' : 'bg-gray-50'
                        }`}>
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center">
                              <span className="text-2xl mr-3">{item.icon}</span>
                              <div>
                                <h3 className="text-lg font-semibold">{item.status}</h3>
                                <p className="text-gray-600">{item.description}</p>
                              </div>
                            </div>
                            {item.date && (
                              <div className="text-right">
                                <div className="text-sm font-medium">
                                  {item.date.toLocaleDateString('en-PK', {
                                    month: 'short',
                                    day: 'numeric'
                                  })}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {item.date.toLocaleTimeString('en-PK', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                          {item.completed && (
                            <div className="flex items-center text-green-600 mt-2">
                              <FaCheckCircle className="mr-2" />
                              <span className="text-sm">Completed</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Estimated Delivery */}
              <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Estimated Delivery</h3>
                    <p className="text-gray-600">
                      Your order is expected to arrive by{' '}
                      <span className="font-bold text-primary-600">{getEstimatedDelivery()}</span>
                    </p>
                  </div>
                  <div className="text-4xl">📦</div>
                </div>
              </div>
            </div>

            {/* Order Details & Support */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Order Details */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-xl font-semibold mb-6 flex items-center">
                  <FaMapMarkerAlt className="mr-3 text-primary-500" />
                  Delivery Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Delivery Address</p>
                    <p className="font-medium">{order.shippingAddress.name}</p>
                    <p className="text-gray-600">{order.shippingAddress.address}</p>
                    <p className="text-gray-600">{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Contact Information</p>
                    <p className="font-medium">{order.shippingAddress.phone}</p>
                    {order.guestUser?.email && (
                      <p className="font-medium">{order.guestUser.email}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Delivery Instructions</p>
                    <p className="text-gray-600">
                      {order.notes || 'No special instructions provided'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Support Card */}
              <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl shadow-xl p-6 text-white">
                <h3 className="text-xl font-semibold mb-6">Need Help?</h3>
                <div className="space-y-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-white bg-opacity-20 rounded-xl mr-4">
                      <FaPhone className="text-xl" />
                    </div>
                    <div>
                      <p className="font-medium">Call Us</p>
                      <a 
                        href="tel:+923001234567" 
                        className="text-white hover:text-white opacity-90"
                      >
                        +92 300 1234567
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="p-3 bg-white bg-opacity-20 rounded-xl mr-4">
                      <FaEnvelope className="text-xl" />
                    </div>
                    <div>
                      <p className="font-medium">Email Us</p>
                      <a 
                        href="mailto:support@cosmeticsstore.com" 
                        className="text-white hover:text-white opacity-90"
                      >
                        support@cosmeticsstore.com
                      </a>
                    </div>
                  </div>
                </div>
                <div className="mt-8 pt-6 border-t border-white border-opacity-20">
                  <p className="text-sm opacity-90">
                    Our customer support team is available 24/7 to assist you with any questions about your order.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/shop"
                className="flex-1 text-center bg-primary-500 hover:bg-primary-600 text-white py-4 px-6 rounded-xl font-semibold text-lg"
              >
                Continue Shopping
              </Link>
              <button
                onClick={() => window.print()}
                className="flex-1 text-center border-2 border-primary-500 text-primary-500 hover:bg-primary-50 py-4 px-6 rounded-xl font-semibold text-lg"
              >
                Print Details
              </button>
              <Link
                to="/contact"
                className="flex-1 text-center bg-gray-100 hover:bg-gray-200 text-gray-800 py-4 px-6 rounded-xl font-semibold text-lg"
              >
                Contact Support
              </Link>
            </div>
          </div>
        )}

        {/* No Order State */}
        {!order && !loading && orderId && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="text-6xl mb-6">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Order Not Found
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              We couldn't find an order with the provided ID. Please check your order confirmation email for the correct Order ID.
            </p>
            <div className="space-y-4 max-w-sm mx-auto">
              <button
                onClick={() => setTrackingId('')}
                className="w-full bg-primary-500 hover:bg-primary-600 text-white py-3 px-6 rounded-lg font-semibold"
              >
                Try Another Order ID
              </button>
              <Link
                to="/contact"
                className="block w-full border-2 border-primary-500 text-primary-500 hover:bg-primary-50 py-3 px-6 rounded-lg font-semibold"
              >
                Contact Support
              </Link>
            </div>
          </div>
        )}

        {/* Help Information */}
        <div className="mt-12 bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-2xl font-bold text-center mb-8">
            Common Tracking Questions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <div className="text-4xl mb-4">📧</div>
              <h4 className="font-semibold mb-2">Where is my Order ID?</h4>
              <p className="text-gray-600 text-sm">
                Your Order ID was sent to your email when you placed the order. Check your inbox or spam folder.
              </p>
            </div>
            <div className="text-center p-4">
              <div className="text-4xl mb-4">⏰</div>
              <h4 className="font-semibold mb-2">Why is my order delayed?</h4>
              <p className="text-gray-600 text-sm">
                Delays can occur due to weather, holidays, or high order volumes. We'll update tracking as soon as possible.
              </p>
            </div>
            <div className="text-center p-4">
              <div className="text-4xl mb-4">📞</div>
              <h4 className="font-semibold mb-2">Need Immediate Help?</h4>
              <p className="text-gray-600 text-sm">
                Call our support team 24/7 at <strong>+92 300 1234567</strong> for instant assistance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;
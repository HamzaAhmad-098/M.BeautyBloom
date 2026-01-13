import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaTruck, FaHome, FaPrint, FaDownload, FaWhatsapp, FaEnvelope } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const OrderConfirmation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`/api/orders/${id}`);
        setOrder(response.data);
      } catch (error) {
        toast.error('Order not found');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, navigate]);

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    const text = `My order #${order?._id} has been confirmed! Total: Rs. ${order?.totalPrice}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleEmailReceipt = () => {
    toast.success('Receipt will be emailed to you shortly!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700">Order not found</h2>
          <Link to="/" className="mt-4 inline-block text-primary-600 hover:text-primary-700">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const steps = [
    { status: 'Order Placed', active: true, icon: '✓' },
    { status: 'Processing', active: order.status !== 'Pending', icon: '⏳' },
    { status: 'Shipped', active: ['Shipped', 'Delivered'].includes(order.status), icon: '🚚' },
    { status: 'Delivered', active: order.status === 'Delivered', icon: '🎉' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-gray-50 py-12 print:bg-white">
      <div className="max-w-4xl mx-auto px-4">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6">
            <FaCheckCircle className="text-5xl text-green-500" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Order Confirmed!
          </h1>
          <p className="text-xl text-gray-600">
            Thank you for your order. We've received it and will process it shortly.
          </p>
          <div className="mt-4 bg-white inline-block px-6 py-3 rounded-full shadow">
            <span className="text-gray-600">Order ID:</span>
            <span className="font-mono font-bold ml-2 text-primary-600">
              #{order._id.slice(-8).toUpperCase()}
            </span>
          </div>
        </div>

        {/* Order Timeline */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6">Order Status</h2>
          <div className="relative">
            <div className="flex justify-between mb-4">
              {steps.map((step, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                    step.active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                  }`}>
                    <span className="text-xl">{step.icon}</span>
                  </div>
                  <span className={`text-sm font-medium ${
                    step.active ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {step.status}
                  </span>
                </div>
              ))}
            </div>
            <div className="absolute top-6 left-12 right-12 h-1 bg-gray-200 -z-10">
              <div 
                className="h-1 bg-green-500 transition-all duration-500"
                style={{ width: 
                  order.status === 'Pending' ? '25%' :
                  order.status === 'Processing' ? '50%' :
                  order.status === 'Shipped' ? '75%' : '100%'
                }}
              ></div>
            </div>
          </div>
          <div className="text-center mt-4">
            <p className="text-gray-600">
              Current status: <span className="font-semibold text-primary-600">{order.status}</span>
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Order placed on {new Date(order.createdAt).toLocaleDateString('en-PK', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
              
              {/* Items */}
              <div className="space-y-4 mb-6">
                {order.orderItems.map((item, index) => (
                  <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="ml-4 flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">Rs. {item.price.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">
                        Total: Rs. {(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="border-t pt-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">Rs. {order.itemsPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      {order.shippingPrice === 0 ? 'FREE' : `Rs. ${order.shippingPrice}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">Rs. {order.taxPrice.toLocaleString()}</span>
                  </div>
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between text-xl font-bold">
                      <span>Total Amount</span>
                      <span className="text-primary-600">
                        Rs. {order.totalPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-semibold mb-6">Shipping Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center mb-4">
                    <FaHome className="text-primary-500 mr-3" />
                    <h3 className="font-semibold">Delivery Address</h3>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-medium">{order.shippingAddress.name}</p>
                    <p className="text-gray-600">{order.shippingAddress.address}</p>
                    <p className="text-gray-600">
                      {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                    </p>
                    <p className="text-gray-600">{order.shippingAddress.country}</p>
                    <p className="text-gray-600 mt-2">Phone: {order.shippingAddress.phone}</p>
                  </div>
                </div>
                <div>
                  <div className="flex items-center mb-4">
                    <FaTruck className="text-primary-500 mr-3" />
                    <h3 className="font-semibold">Delivery Details</h3>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600">Payment Method</p>
                        <p className="font-medium">{order.paymentMethod}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Payment Status</p>
                        <p className={`font-medium ${
                          order.isPaid ? 'text-green-600' : 'text-yellow-600'
                        }`}>
                          {order.isPaid ? 'Paid' : 'Pending'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Estimated Delivery</p>
                        <p className="font-medium">
                          {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-PK', {
                            weekday: 'long',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-6">What's Next?</h2>
              
              <div className="space-y-4 mb-8">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Order Confirmation</h4>
                  <p className="text-sm text-blue-800">
                    We've sent an order confirmation email to your email address.
                  </p>
                </div>
                
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h4 className="font-semibold text-yellow-900 mb-2">Processing Time</h4>
                  <p className="text-sm text-yellow-800">
                    Your order will be processed within 24 hours. You'll receive tracking information once shipped.
                  </p>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">Need Help?</h4>
                  <p className="text-sm text-green-800">
                    Contact our support team for any questions about your order.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handlePrint}
                  className="w-full flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-medium"
                >
                  <FaPrint />
                  <span>Print Receipt</span>
                </button>
                
                <button
                  onClick={handleEmailReceipt}
                  className="w-full flex items-center justify-center space-x-2 bg-blue-100 hover:bg-blue-200 text-blue-800 py-3 px-4 rounded-lg font-medium"
                >
                  <FaDownload />
                  <span>Download PDF</span>
                </button>
                
                <button
                  onClick={handleShareWhatsApp}
                  className="w-full flex items-center justify-center space-x-2 bg-green-100 hover:bg-green-200 text-green-800 py-3 px-4 rounded-lg font-medium"
                >
                  <FaWhatsapp />
                  <span>Share on WhatsApp</span>
                </button>
                
                <button
                  onClick={handleEmailReceipt}
                  className="w-full flex items-center justify-center space-x-2 bg-purple-100 hover:bg-purple-200 text-purple-800 py-3 px-4 rounded-lg font-medium"
                >
                  <FaEnvelope />
                  <span>Email Receipt</span>
                </button>
              </div>

              {/* Track Order */}
              <div className="mt-8 pt-8 border-t">
                <h3 className="font-semibold mb-4">Track Your Order</h3>
                <Link
                  to={`/track-order?orderId=${order._id}`}
                  className="block w-full bg-primary-500 hover:bg-primary-600 text-white text-center py-3 px-4 rounded-lg font-semibold mb-3"
                >
                  Track Order Status
                </Link>
                <Link
                  to="/shop"
                  className="block w-full border-2 border-primary-500 text-primary-500 hover:bg-primary-50 text-center py-3 px-4 rounded-lg font-semibold"
                >
                  Continue Shopping
                </Link>
              </div>

              {/* Contact Support */}
              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Need Help?</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Our customer support team is here to help!
                </p>
                <a
                  href="tel:+923001234567"
                  className="block text-primary-600 hover:text-primary-700 font-medium"
                >
                  📞 +92 300 1234567
                </a>
                <a
                  href="mailto:support@cosmeticsstore.com"
                  className="block text-primary-600 hover:text-primary-700 font-medium"
                >
                  ✉️ support@cosmeticsstore.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
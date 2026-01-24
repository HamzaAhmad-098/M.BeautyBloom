import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { saveShippingAddress, savePaymentMethod, clearCart as clearCartAction } from '../store/slices/cartSlice';
import { createOrder } from '../store/slices/orderSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cartItems, cartTotal, shippingAddress: storedAddress, paymentMethod: storedPayment } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  const orderState = useSelector((state) => state.orders);

  // Prefill shipping from store (if any)
  const [shippingAddress, setShippingAddress] = useState({
    name: storedAddress?.name || (userInfo?.name || ''),
    email: userInfo?.email || '',
    address: storedAddress?.address || '',
    city: storedAddress?.city || '',
    state: storedAddress?.state || '',
    postalCode: storedAddress?.postalCode || '',
    country: storedAddress?.country || 'Pakistan',
    phone: storedAddress?.phone || '',
  });

  const [paymentMethod, setPaymentMethod] = useState(storedPayment || 'COD');
  const [placing, setPlacing] = useState(false);

  // derived prices
  const itemsPrice = Number(cartTotal || 0);
  const taxPrice = Number((itemsPrice * 0.05).toFixed(2)); // 5%
  const shippingPrice = itemsPrice > 2000 ? 0 : 200;
  const totalPrice = Number((itemsPrice + taxPrice + shippingPrice).toFixed(2));

  useEffect(() => {
    // save any preexisting values into localStorage via cartSlice
    dispatch(saveShippingAddress(shippingAddress));
    dispatch(savePaymentMethod(paymentMethod));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once

  const onChangeAddress = (key, value) => {
    setShippingAddress(prev => ({ ...prev, [key]: value }));
  };

  const validateShipping = () => {
    const required = ['name', 'address', 'city', 'postalCode', 'country', 'phone'];
    for (const field of required) {
      if (!shippingAddress[field] || shippingAddress[field].toString().trim() === '') {
        return `Please provide ${field}`;
      }
    }
    return null;
  };

  const buildOrderItems = () => {
    return cartItems.map((item) => {
      // item may have shape: { product: {...}, quantity, _id }
      // or may be server-shaped: { product: productId, quantity }
      const productObj = item.product && typeof item.product === 'object' ? item.product : null;
      const productId = productObj ? (productObj._id || productObj.id) : item.product;
      const name = productObj ? (productObj.name || '') : (item.name || '');
      const image = productObj ? (productObj.images && productObj.images.length ? productObj.images[0].url || productObj.images[0] : '') : (item.image || '');
      const price = productObj ? (productObj.discountPrice > 0 ? productObj.discountPrice : productObj.price) : (item.price || 0);
      return {
        name,
        quantity: item.quantity || 1,
        image,
        price,
        product: productId,
        variant: item.variant || '',
      };
    });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    const validationError = validateShipping();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    // persist shipping & payment in cart state/localStorage
    dispatch(saveShippingAddress(shippingAddress));
    dispatch(savePaymentMethod(paymentMethod));

    // Build payload expected by server
    const orderData = {
      orderItems: buildOrderItems(),
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    };

    // If guest (not logged in), include guestUser info expected by server
    if (!userInfo) {
      orderData.guestUser = {
        name: shippingAddress.name,
        email: shippingAddress.email,
        phone: shippingAddress.phone,
      };
    }

    try {
      setPlacing(true);
      const action = await dispatch(createOrder(orderData));
      // createOrder returns created order on success
      if (createOrder.fulfilled.match(action)) {
        const createdOrder = action.payload;
        // Clear cart in client
        dispatch(clearCartAction());
        toast.success('Order placed successfully');
        // redirect to order confirmation page (we add route for this)
        navigate(`/order-confirmation/${createdOrder._id}`);
      } else {
        const err = action.payload || 'Failed to create order';
        toast.error(err);
      }
    } catch (err) {
      console.error('Place order error', err);
      toast.error(err.message || 'Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-6">
          <h2 className="text-xl font-semibold">Your cart is empty</h2>
          <p className="mt-2 text-gray-600">Add items to your cart before checking out.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Shipping & Payment */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>

              <form onSubmit={handlePlaceOrder} className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={shippingAddress.name}
                    onChange={(e) => onChangeAddress('name', e.target.value)}
                    className="border p-3 rounded w-full"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email (optional)"
                    value={shippingAddress.email}
                    onChange={(e) => onChangeAddress('email', e.target.value)}
                    className="border p-3 rounded w-full"
                  />
                </div>

                <input
                  type="text"
                  placeholder="Address"
                  value={shippingAddress.address}
                  onChange={(e) => onChangeAddress('address', e.target.value)}
                  className="border p-3 rounded w-full"
                  required
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="City"
                    value={shippingAddress.city}
                    onChange={(e) => onChangeAddress('city', e.target.value)}
                    className="border p-3 rounded w-full"
                    required
                  />
                  <input
                    type="text"
                    placeholder="State"
                    value={shippingAddress.state}
                    onChange={(e) => onChangeAddress('state', e.target.value)}
                    className="border p-3 rounded w-full"
                  />
                  <input
                    type="text"
                    placeholder="Postal Code"
                    value={shippingAddress.postalCode}
                    onChange={(e) => onChangeAddress('postalCode', e.target.value)}
                    className="border p-3 rounded w-full"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Country"
                    value={shippingAddress.country}
                    onChange={(e) => onChangeAddress('country', e.target.value)}
                    className="border p-3 rounded w-full"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Phone"
                    value={shippingAddress.phone}
                    onChange={(e) => onChangeAddress('phone', e.target.value)}
                    className="border p-3 rounded w-full"
                    required
                  />
                </div>
              </form>
            </div>

            <div className="bg-white p-6 rounded shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
              <div className="space-y-2">
                <label className="flex items-center space-x-3">
                  <input type="radio" name="payment" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} />
                  <span>Cash on Delivery (COD)</span>
                </label>

                <label className="flex items-center space-x-3">
                  <input type="radio" name="payment" checked={paymentMethod === 'JazzCash'} onChange={() => setPaymentMethod('JazzCash')} />
                  <span>JazzCash</span>
                </label>

                <label className="flex items-center space-x-3">
                  <input type="radio" name="payment" checked={paymentMethod === 'Easypaisa'} onChange={() => setPaymentMethod('Easypaisa')} />
                  <span>Easypaisa</span>
                </label>

                <label className="flex items-center space-x-3">
                  <input type="radio" name="payment" checked={paymentMethod === 'Card'} onChange={() => setPaymentMethod('Card')} />
                  <span>Card (online)</span>
                </label>

                <p className="text-sm text-gray-500 mt-2">
                  Note: Card payments require a Stripe integration on the frontend which is not enabled in this build. Selecting Card will still create the order in the system; you can integrate Stripe Elements next to capture card payments.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="bg-white p-6 rounded shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Items</span>
                <span>Rs. {itemsPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (5%)</span>
                <span>Rs. {taxPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shippingPrice === 0 ? 'Free' : `Rs. ${shippingPrice.toLocaleString()}`}</span>
              </div>

              <div className="border-t pt-3 mt-3 flex justify-between font-bold">
                <span>Total</span>
                <span>Rs. {totalPrice.toLocaleString()}</span>
              </div>

              <div className="mt-4">
                <button
                  onClick={handlePlaceOrder}
                  disabled={placing}
                  className="w-full bg-primary-500 hover:bg-primary-600 text-white py-3 rounded font-semibold disabled:opacity-60"
                >
                  {placing ? 'Placing Order...' : 'Place Order'}
                </button>
              </div>

              <div className="mt-3 text-sm text-gray-500">
                <p>By placing the order you agree to our <a className="underline" href="/terms">Terms & Conditions</a>.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Items list for review */}
        <div className="mt-8 bg-white p-6 rounded shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Items</h3>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item._id || `${item.product}-${item.variant}`} className="flex items-center gap-4 border-b pb-3 last:border-b-0">
                <img src={(item.product && item.product.images && item.product.images[0] && (item.product.images[0].url || item.product.images[0])) || item.image || 'https://via.placeholder.com/80'} alt={item.product && item.product.name} className="w-20 h-20 object-cover rounded" />
                <div className="flex-1">
                  <div className="font-semibold">{(item.product && item.product.name) || item.name}</div>
                  <div className="text-sm text-gray-500">Qty: {item.quantity}</div>
                </div>
                <div className="font-semibold">Rs. {(((item.product && (item.product.discountPrice > 0 ? item.product.discountPrice : item.product.price)) || item.price) * item.quantity).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
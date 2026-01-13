import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-hot-toast';

// Get cart from localStorage
const getGuestCart = () => {
  const guestCart = localStorage.getItem('guestCart');
  return guestCart ? JSON.parse(guestCart) : [];
};

const initialState = {
  cartItems: getGuestCart(),
  cartTotal: 0,
  itemsCount: 0,
  shippingAddress: localStorage.getItem('shippingAddress')
    ? JSON.parse(localStorage.getItem('shippingAddress'))
    : {},
  paymentMethod: localStorage.getItem('paymentMethod') || 'COD',
  loading: false,
  error: null,
};

// Helper functions
const calculateTotal = (items) => {
  return items.reduce((acc, item) => {
    const price = item.product.discountPrice > 0 
      ? item.product.discountPrice 
      : item.product.price;
    return acc + (price * item.quantity);
  }, 0);
};

const calculateCount = (items) => {
  return items.reduce((acc, item) => acc + item.quantity, 0);
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action) => {
      const { product, quantity = 1 } = action.payload;
      const existingItem = state.cartItems.find(
        item => item.product._id === product._id
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.cartItems.push({ product, quantity, _id: Date.now().toString() });
      }

      state.cartTotal = calculateTotal(state.cartItems);
      state.itemsCount = calculateCount(state.cartItems);
      
      // Save to localStorage for guest users
      if (!localStorage.getItem('userInfo')) {
        localStorage.setItem('guestCart', JSON.stringify(state.cartItems));
      }
      
      toast.success('Added to cart!');
    },
    
    removeItem: (state, action) => {
      const itemId = action.payload;
      state.cartItems = state.cartItems.filter(item => item._id !== itemId);
      state.cartTotal = calculateTotal(state.cartItems);
      state.itemsCount = calculateCount(state.cartItems);
      
      if (!localStorage.getItem('userInfo')) {
        localStorage.setItem('guestCart', JSON.stringify(state.cartItems));
      }
      
      toast.success('Item removed from cart');
    },
    
    updateQuantity: (state, action) => {
      const { itemId, quantity } = action.payload;
      const item = state.cartItems.find(item => item._id === itemId);
      
      if (item) {
        item.quantity = quantity;
        state.cartTotal = calculateTotal(state.cartItems);
        state.itemsCount = calculateCount(state.cartItems);
        
        if (!localStorage.getItem('userInfo')) {
          localStorage.setItem('guestCart', JSON.stringify(state.cartItems));
        }
      }
    },
    
    clearCart: (state) => {
      state.cartItems = [];
      state.cartTotal = 0;
      state.itemsCount = 0;
      localStorage.removeItem('guestCart');
    },
    
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      localStorage.setItem('shippingAddress', JSON.stringify(action.payload));
    },
    
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      localStorage.setItem('paymentMethod', action.payload);
    },
    
    syncCartWithUser: (state, action) => {
      state.cartItems = action.payload;
      state.cartTotal = calculateTotal(action.payload);
      state.itemsCount = calculateCount(action.payload);
    },
  },
});

export const {
  addItem,
  removeItem,
  updateQuantity,
  clearCart,
  saveShippingAddress,
  savePaymentMethod,
  syncCartWithUser,
} = cartSlice.actions;

export const addToCart = (productData) => (dispatch, getState) => {
  const { product, quantity } = productData;
  dispatch(addItem({ product, quantity }));
};

export default cartSlice.reducer;
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const initialState = {
  orders: [],
  order: null,
  loading: false,
  error: null,
  success: false,
  totalPages: 1,
  currentPage: 1,
};

export const createOrder = createAsyncThunk(
  'orders/create',
  async (orderData, { rejectWithValue, getState }) => {
    try {
      const { auth: { userInfo } } = getState();
      const config = userInfo?.token ? {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      } : {};

      const { data } = await axios.post('/api/orders', orderData, config);
      return data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create order';
      return rejectWithValue(message);
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  'orders/fetchById',
  async (id, { rejectWithValue, getState }) => {
    try {
      const { auth: { userInfo } } = getState();
      const config = userInfo?.token ? {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      } : {};

      const { data } = await axios.get(`/api/orders/${id}`, config);
      return data;
    } catch (error) {
      const message = error.response?.data?.message || 'Order not found';
      return rejectWithValue(message);
    }
  }
);

export const fetchMyOrders = createAsyncThunk(
  'orders/fetchMyOrders',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth: { userInfo } } = getState();
      if (!userInfo) {
        return rejectWithValue('Please login to view orders');
      }

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.get('/api/orders/myorders', config);
      return data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch orders';
      return rejectWithValue(message);
    }
  }
);

export const fetchGuestOrders = createAsyncThunk(
  'orders/fetchGuestOrders',
  async (email, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/orders/guest/${email}`);
      return data;
    } catch (error) {
      const message = error.response?.data?.message || 'No orders found';
      return rejectWithValue(message);
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.order = null;
      state.success = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
        state.success = true;
        toast.success('Order placed successfully!');
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload || 'Failed to place order');
      })
      // Fetch Order by ID
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch My Orders
      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Guest Orders
      .addCase(fetchGuestOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
      });
  },
});

export const { clearOrder, clearError } = orderSlice.actions;
export default orderSlice.reducer;
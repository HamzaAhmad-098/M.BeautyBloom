import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-hot-toast';

// API URLs
const API_URL = '/api/auth';

// Get user from localStorage
const getUserFromStorage = () => {
  try {
    const userInfo = localStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
  } catch (error) {
    console.error('Error parsing user info:', error);
    return null;
  }
};

const initialState = {
  userInfo: getUserFromStorage(),
  loading: false,
  error: null,
  success: false,
  isAuthenticated: false,
  token: localStorage.getItem('token') || null,
};

// Set auth headers
const setAuthHeaders = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('token', token);
  } else {
    delete axios.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
  }
};

// Initialize auth headers
const token = localStorage.getItem('token');
if (token) {
  setAuthHeaders(token);
}

// Async Thunks
export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${API_URL}/register`, userData);
      
      // Save token and user info
      localStorage.setItem('userInfo', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);
      setAuthHeaders(data.token);
      
      return data;
    } catch (error) {
      const message = error.response?.data?.message || 
                     error.response?.data?.error || 
                     'Registration failed';
      return rejectWithValue(message);
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password, rememberMe = false }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${API_URL}/login`, {
        email,
        password,
        rememberMe,
      });
      
      // Save token and user info
      localStorage.setItem('userInfo', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);
      setAuthHeaders(data.token);
      
      // Set remember me cookie if needed
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }
      
      return data;
    } catch (error) {
      const message = error.response?.data?.message || 
                     error.response?.data?.error || 
                     'Login failed';
      return rejectWithValue(message);
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await axios.post(`${API_URL}/logout`);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear all auth data
      localStorage.removeItem('userInfo');
      localStorage.removeItem('token');
      localStorage.removeItem('guestCart');
      localStorage.removeItem('rememberMe');
      delete axios.defaults.headers.common['Authorization'];
      
      return null;
    }
  }
);

export const getMe = createAsyncThunk(
  'auth/getMe',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}/me`);
      return data.user;
    } catch (error) {
      // If token is invalid, logout
      if (error.response?.status === 401) {
        localStorage.removeItem('userInfo');
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
      }
      return rejectWithValue(error.response?.data?.message || 'Failed to get user');
    }
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (userData, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(`${API_URL}/updatedetails`, userData);
      
      // Update localStorage
      const currentUser = JSON.parse(localStorage.getItem('userInfo'));
      const updatedUser = { ...currentUser, ...data.user };
      localStorage.setItem('userInfo', JSON.stringify(updatedUser));
      
      return data;
    } catch (error) {
      const message = error.response?.data?.message || 'Profile update failed';
      return rejectWithValue(message);
    }
  }
);

export const updatePassword = createAsyncThunk(
  'auth/updatePassword',
  async ({ currentPassword, newPassword }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(`${API_URL}/updatepassword`, {
        currentPassword,
        newPassword,
      });
      
      // Update token if returned
      if (data.token) {
        localStorage.setItem('token', data.token);
        setAuthHeaders(data.token);
      }
      
      return data;
    } catch (error) {
      const message = error.response?.data?.message || 'Password update failed';
      return rejectWithValue(message);
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${API_URL}/forgotpassword`, { email });
      return data;
    } catch (error) {
      const message = error.response?.data?.message || 'Password reset failed';
      return rejectWithValue(message);
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ token, password }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(`${API_URL}/resetpassword/${token}`, {
        password,
      });
      
      // Auto login after password reset
      if (data.token) {
        localStorage.setItem('token', data.token);
        setAuthHeaders(data.token);
        
        // Get user info
        const userResponse = await axios.get(`${API_URL}/me`);
        localStorage.setItem('userInfo', JSON.stringify(userResponse.data.user));
      }
      
      return data;
    } catch (error) {
      const message = error.response?.data?.message || 'Password reset failed';
      return rejectWithValue(message);
    }
  }
);

export const verifyEmail = createAsyncThunk(
  'auth/verifyEmail',
  async (token, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}/verify-email/${token}`);
      return data;
    } catch (error) {
      const message = error.response?.data?.message || 'Email verification failed';
      return rejectWithValue(message);
    }
  }
);

export const resendVerification = createAsyncThunk(
  'auth/resendVerification',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${API_URL}/resend-verification`);
      return data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to resend verification';
      return rejectWithValue(message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.success = false;
    },
    clearAuth: (state) => {
      state.userInfo = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.success = false;
    },
    setUser: (state, action) => {
      state.userInfo = action.payload;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.success = true;
        toast.success(action.payload.message || 'Registration successful!');
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload || 'Registration failed');
      })
      
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.success = true;
        toast.success(action.payload.message || 'Login successful!');
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload || 'Login failed');
      })
      
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.userInfo = null;
        state.token = null;
        state.isAuthenticated = false;
        state.success = false;
        toast.success('Logged out successfully');
      })
      
      // Get Me
      .addCase(getMe.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getMe.rejected, (state) => {
        state.loading = false;
        state.userInfo = null;
        state.isAuthenticated = false;
      })
      
      // Update Profile
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.userInfo = { ...state.userInfo, ...action.payload.user };
        toast.success(action.payload.message || 'Profile updated');
      })
      
      // Update Password
      .addCase(updatePassword.fulfilled, (state) => {
        toast.success('Password updated successfully');
      })
      
      // Forgot Password
      .addCase(forgotPassword.fulfilled, (state, action) => {
        toast.success(action.payload.message || 'Password reset email sent');
      })
      
      // Reset Password
      .addCase(resetPassword.fulfilled, (state, action) => {
        if (action.payload.token) {
          state.token = action.payload.token;
          state.isAuthenticated = true;
        }
        toast.success(action.payload.message || 'Password reset successful');
      })
      
      // Verify Email
      .addCase(verifyEmail.fulfilled, (state, action) => {
        if (state.userInfo) {
          state.userInfo.isVerified = true;
        }
        toast.success(action.payload.message || 'Email verified successfully');
      })
      
      // Resend Verification
      .addCase(resendVerification.fulfilled, (state, action) => {
        toast.success(action.payload.message || 'Verification email sent');
      });
  },
});

export const { clearError, clearAuth, setUser } = authSlice.actions;

// Selectors
export const selectCurrentUser = (state) => state.auth.userInfo;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsAdmin = (state) => state.auth.userInfo?.isAdmin || false;
export const selectIsVerified = (state) => state.auth.userInfo?.isVerified || false;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer;
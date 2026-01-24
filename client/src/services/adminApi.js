import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ============ PRODUCT MANAGEMENT ============
export const adminProductApi = {
  // Get all products with filters
  getAllProducts: async (params = {}) => {
    const response = await api.get('/products', { params });
    return response.data;
  },

  // Get product by ID
  getProductById: async (productId) => {
    const response = await api.get(`/products/${productId}`);
    return response.data;
  },

  // Create product
  createProduct: async (productData) => {
    const response = await api.post('/products', productData);
    return response.data;
  },

  // Update product
  updateProduct: async (productId, productData) => {
    const response = await api.put(`/products/${productId}`, productData);
    return response.data;
  },

  // Delete product
  deleteProduct: async (productId) => {
    const response = await api.delete(`/products/${productId}`);
    return response.data;
  },

  // Upload product images to Cloudinary
  uploadImages: async (formData) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/admin/upload/images`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get brands
  getBrands: async () => {
    const response = await api.get('/admin/brands');
    return response.data;
  },

  // Get categories
  getCategories: async () => {
    const response = await api.get('/products/categories');
    return response.data;
  },
};

// ============ CATEGORY MANAGEMENT ============
export const adminCategoryApi = {
  // Get all categories
  getAllCategories: async () => {
    const response = await api.get('/products/categories');
    return response.data;
  },

  // Get category by ID
  getCategoryById: async (categoryId) => {
    const response = await api.get(`/categories/${categoryId}`);
    return response.data;
  },

  // Create category
  createCategory: async (categoryData) => {
    const response = await api.post('/categories', categoryData);
    return response.data;
  },

  // Update category
  updateCategory: async (categoryId, categoryData) => {
    const response = await api.put(`/categories/${categoryId}`, categoryData);
    return response.data;
  },

  // Delete category
  deleteCategory: async (categoryId) => {
    const response = await api.delete(`/categories/${categoryId}`);
    return response.data;
  },

  // Get category tree
  getCategoryTree: async () => {
    const response = await api.get('/categories/tree');
    return response.data;
  },
};
// ============ USER MANAGEMENT ============
export const adminUserApi = {
  // Get all users with pagination
  getAllUsers: async (page = 1, limit = 10) => {
    const response = await api.get(`/auth/admin/users?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Get user by ID
  getUserById: async (userId) => {
    const response = await api.get(`/auth/admin/users/${userId}`);
    return response.data;
  },

  // Create user
  createUser: async (userData) => {
    const response = await api.post('/auth/admin/users', userData);
    return response.data;
  },

  // Update user
  updateUser: async (userId, userData) => {
    const response = await api.put(`/auth/admin/users/${userId}`, userData);
    return response.data;
  },

  // Delete user
  deleteUser: async (userId) => {
    const response = await api.delete(`/auth/admin/users/${userId}`);
    return response.data;
  },

  // Get admin stats
  getAdminStats: async () => {
    const response = await api.get('/auth/admin/stats');
    return response.data;
  },
};



// ============ ORDER MANAGEMENT ============
export const adminOrderApi = {
  // Get all orders with filters
  getAllOrders: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await api.get(`/orders?${queryString}`);
    return response.data;
  },

  // Get order by ID
  getOrderById: async (orderId) => {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  },

  // Update order status
  updateOrderStatus: async (orderId, statusData) => {
    const response = await api.put(`/orders/${orderId}/status`, statusData);
    return response.data;
  },

  // Mark order as delivered
  markAsDelivered: async (orderId) => {
    const response = await api.put(`/orders/${orderId}/deliver`);
    return response.data;
  },

  // Get order stats
  getOrderStats: async () => {
    const response = await api.get('/orders/stats');
    return response.data;
  },
};


// ============ DASHBOARD STATS ============
export const adminDashboardApi = {
  // Get dashboard stats
  getDashboardStats: async () => {
    const [userStats, orderStats] = await Promise.all([
      api.get('/auth/admin/stats'),
      api.get('/orders/stats'),
    ]);
    
    return {
      users: userStats.data.data,
      orders: orderStats.data,
    };
  },
};

export default api;
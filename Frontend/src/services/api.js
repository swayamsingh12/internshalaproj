import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login/user';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  updatePassword: (data) => api.put('/auth/update', { newPassword: data.newPassword }),
};

// Store API
export const storeAPI = {
  getAllStores: (params) => api.get('/stores', { params }),
  searchStores: (params) => api.get('/stores/search', { params }),
  getStoreById: (id) => api.get(`/stores/${id}`),
};

// Rating API
export const ratingAPI = {
  submitRating: (storeId, rating) => api.post(`/ratings/${storeId}`, { rating }),
  updateRating: (ratingId, rating) => api.put(`/ratings/${ratingId}`, { rating }).catch(() => {
    throw new Error('Update rating endpoint not available');
  }),
};

// Owner API
export const ownerAPI = {
  getMyStores: () => api.get('/owner/stores'),
  getStoreRaters: (storeId) => api.get(`/owner/stores/${storeId}/raters`),
  getStoreAverage: (storeId) => api.get(`/owner/stores/${storeId}/avg`),
};

// Admin API
export const adminAPI = {
  getAllStores: () => api.get('/admin/stores'),
  createStore: (data) => api.post('/admin/stores', data),
  updateStore: (id, data) => api.put(`/admin/stores/${id}`, data),
  deleteStore: (id) => api.delete(`/admin/stores/${id}`),
  searchUsers: (email) => api.get('/admin/users', { params: { q: email } }),
  createUser: (data) => api.post('/admin/users', data),
  assignOwner: (storeId, ownerId) => api.put(`/admin/stores/${storeId}`, { ownerId }),
};

export default api;


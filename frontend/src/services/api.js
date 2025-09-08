import axios from 'axios';

// API Configuration
const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
};

// Create axios instance
const api = axios.create(API_CONFIG);

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if exists
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const { response } = error;

    // Handle specific error cases
    if (response?.status === 401) {
      // Clear auth data and redirect to login
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      window.location.href = '/';
    }

    // Handle network errors
    if (!response) {
      console.error('Network Error:', error.message);
      return Promise.reject(new Error('Network error occurred. Please check your connection.'));
    }

    // Handle other error cases
    const errorMessage = response.data?.message || 'An unexpected error occurred';
    console.error(`API Error (${response.status}):`, errorMessage);
    
    return Promise.reject(error);
  }
);

// API Methods
const apiService = {
  // GET request
  get: (url, config) => api.get(url, config),

  // POST request
  post: (url, data, config) => api.post(url, data, config),

  // POST request para envio de arquivos (multipart/form-data)
  postForm: (url, formData, config = {}) => {
    return api.post(url, formData, {
      ...config,
      headers: {
        ...(config && config.headers),
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // PUT request
  put: (url, data, config) => api.put(url, data, config),

  // DELETE request
  delete: (url, config) => api.delete(url, config),

  // PATCH request
  patch: (url, data, config) => api.patch(url, data, config),

  // Cancel token source
  createCancelToken: () => axios.CancelToken.source(),

  // Set auth token
  setAuthToken: (token) => {
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  },

  // Clear auth data
  clearAuth: () => {
    localStorage.clear();
  },

  // Base URL
  baseURL: API_CONFIG.baseURL
};

export default apiService; 
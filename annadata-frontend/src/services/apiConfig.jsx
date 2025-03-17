import axios from 'axios';

// Determine API base URL from environment or use a fallback
const API_URL = process.env.REACT_APP_API_URL || '/api';

// Create an axios instance with defaults
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  // Add timeout to prevent long-hanging requests
  timeout: 10000
});

// Add token to requests if it exists
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
api.interceptors.response.use(
  response => response,
  error => {
    // Handle network errors specifically
    if (!error.response) {
      console.error('Network or server error:', error.message);
      return Promise.reject({
        message: 'Network error - please check your connection or the server may be down',
        original: error
      });
    }

    // Handle specific status codes
    switch (error.response.status) {
      case 401:
        // Unauthorized - clear token and redirect to login
        localStorage.removeItem('token');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        break;
      case 403:
        // Forbidden - user doesn't have permissions
        console.error('Permission denied:', error.response.data);
        break;
      case 404:
        // Not found
        console.error('Resource not found:', error.response.data);
        break;
      case 500:
      default:
        // Server error or other
        console.error('API error:', error.response?.data || error.message);
        break;
    }

    return Promise.reject(error.response?.data || { message: error.message });
  }
);

// Error handling function
const handleApiError = (error) => {
  const message = 
    error.message || 
    'An unexpected error occurred';
    
  return { message };
};

// Export both the configured axios instance and the error handler
export { api, handleApiError };

export default api;

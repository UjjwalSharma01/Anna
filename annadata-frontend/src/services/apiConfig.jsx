import axios from 'axios';

// Detect GitHub Codespaces environment
const isGitHubEnvironment = !!process.env.CODESPACE_NAME || 
  window.location.hostname.includes('github.dev') || 
  window.location.hostname.includes('app.github.dev');

// Determine API base URL for different environments
const getApiBaseUrl = () => {
  if (isGitHubEnvironment) {
    // In GitHub environment, prepend port to the base URL
    const port = '5050'; // The port your backend runs on
    const baseUrl = window.location.origin;
    // Replace the port in the URL
    const urlParts = baseUrl.split(':');
    if (urlParts.length > 2) {
      return `${urlParts[0]}:${urlParts[1]}:${port}/api`;
    }
    return `/api`; // Fallback to relative path
  }
  return process.env.REACT_APP_API_URL || '/api';
};

const API_URL = getApiBaseUrl();
console.log('API URL configured as:', API_URL);

// Create an axios instance with defaults
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  // Add timeout to prevent long-hanging requests
  timeout: 7000
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
        original: error,
        isNetworkError: true
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
    
  return { message, isNetworkError: error.isNetworkError };
};

// Export both the configured axios instance and the error handler
export { api, handleApiError, isGitHubEnvironment };

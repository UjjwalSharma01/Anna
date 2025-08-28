import axios from 'axios';
import { API_BASE_URL, TOKEN_KEY } from '../utils/constants';

// Debug logging
console.log('🚀 API.js loaded - API_BASE_URL:', API_BASE_URL);
console.log('🚀 API.js loaded - process.env.REACT_APP_API_URL:', process.env.REACT_APP_API_URL);

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for auth token (will implement later)
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling (will expand later)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      // Will redirect to login later
    }
    return Promise.reject(error);
  }
);

export default apiClient;

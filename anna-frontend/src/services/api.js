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
  console.log('🌐 API Request:', config.method?.toUpperCase(), config.url);
  console.log('🌐 Full URL:', config.baseURL + config.url);
  console.log('📦 Request data:', config.data);
  
  // Try to get token using the same method as the helpers
  let token = null;
  try {
    const item = localStorage.getItem(TOKEN_KEY);
    token = item ? JSON.parse(item) : null;
  } catch (error) {
    // If JSON.parse fails, try getting it as plain string
    token = localStorage.getItem(TOKEN_KEY);
  }
  
  console.log('🔑 Token from localStorage:', token ? token.substring(0, 20) + '...' : 'NO TOKEN FOUND');
  console.log('🔑 Full token:', token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('✅ Authorization header set:', config.headers.Authorization.substring(0, 30) + '...');
  } else {
    console.log('❌ No token found in localStorage');
  }
  return config;
});

// Add response interceptor for error handling (will expand later)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      // Will redirect to login later
    }
    return Promise.reject(error);
  }
);

export default apiClient;

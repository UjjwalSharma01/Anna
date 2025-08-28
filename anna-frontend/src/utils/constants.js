// Application constants
export const APP_NAME = process.env.REACT_APP_APP_NAME || 'Anna';
export const APP_VERSION = process.env.REACT_APP_VERSION || '1.0.0';

// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5050';

// Authentication
export const TOKEN_KEY = 'authToken';
export const USER_DATA_KEY = 'userData';

// Navigation routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORUM: '/forum',
  ANNADATA: '/annadata',
  SCHEMES: '/schemes',
  PROFILE: '/profile',
};

// API endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    LOGOUT: '/auth/logout',
    VERIFY: '/auth/verify',
  },
  // User endpoints
  USER: {
    PROFILE: '/user/profile',
  },
  // Forum endpoints
  FORUM: {
    BASE: '/forum',
    SEARCH: '/forum/search',
    REPLIES: (postId) => `/forum/${postId}/replies`,
  },
  // AnnaData endpoints
  ANNADATA: {
    BASE: '/annadata',
    USER: '/annadata/user',
    SEARCH: '/annadata/search',
    STATISTICS: '/annadata/statistics',
  },
};

// Form validation patterns
export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  PHONE: /^[+]?[\d\s\-()]{10,}$/,
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
};

// Success messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful!',
  SIGNUP_SUCCESS: 'Account created successfully!',
  LOGOUT_SUCCESS: 'Logged out successfully!',
  UPDATE_SUCCESS: 'Updated successfully!',
  DELETE_SUCCESS: 'Deleted successfully!',
};

// Loading states
export const LOADING_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
};

// Theme colors (for future use with Tailwind)
export const THEME_COLORS = {
  PRIMARY: 'green',
  SECONDARY: 'blue',
  ACCENT: 'yellow',
  ERROR: 'red',
  SUCCESS: 'green',
  WARNING: 'yellow',
  INFO: 'blue',
};

const constants = {
  APP_NAME,
  APP_VERSION,
  API_BASE_URL,
  TOKEN_KEY,
  USER_DATA_KEY,
  ROUTES,
  API_ENDPOINTS,
  VALIDATION_PATTERNS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  LOADING_STATES,
  THEME_COLORS,
};

export default constants;

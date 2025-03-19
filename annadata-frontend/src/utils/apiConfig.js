import axios from 'axios';

// Detect if we're in GitHub Codespaces environment
export const isGitHubEnvironment = !!process.env.CODESPACE_NAME || 
  window.location.hostname.includes('github.dev') || 
  window.location.hostname.includes('app.github.dev');

// Set the base API URL
let baseURL = '/api'; // Default to relative path

// If environment variable is set, use that instead
if (process.env.REACT_APP_API_URL) {
  baseURL = process.env.REACT_APP_API_URL;
}

// Create axios instance with base URL
export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add interceptor to include auth token in requests
api.interceptors.request.use(
  config => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    // If token exists, add it to request headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  error => {
    // Handle request error
    return Promise.reject(error);
  }
);

// Standardize error handling
export const handleApiError = (error) => {
  let message = 'An unexpected error occurred';
  let statusCode = 500;
  
  if (error.response) {
    // The server responded with a status code outside of 2xx range
    statusCode = error.response.status;
    message = error.response.data?.message || `Error ${statusCode}: ${error.response.statusText}`;
  } else if (error.request) {
    // The request was made but no response was received
    message = 'Server did not respond. Please check your network connection.';
    error.isNetworkError = true;
  }
  
  // Add additional info to the error
  error.statusCode = statusCode;
  error.message = message;
  
  return error;
};

export default api;

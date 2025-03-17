import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

// Create an axios instance with defaults
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
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

// Error handling function - moved before it's used
const handleApiError = (error) => {
  const message = 
    error.response?.data?.message || 
    error.message || 
    'An unexpected error occurred';
    
  return { message };
};

export const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const signup = async (userData) => {
  try {
    const response = await api.post('/users/register', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Server error during registration' };
  }
};

export const getUserProfile = async () => {
  try {
    const response = await api.get('/users/profile');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error fetching user profile' };
  }
};

export const updateProfile = async (userData) => {
  try {
    const response = await api.put('/users/profile', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error updating profile' };
  }
};

// Add alias for updateProfile to fix import error in Profile.jsx
export const updateUserProfile = updateProfile;

const authService = {
  login,
  signup,
  getUserProfile,
  updateProfile,
  updateUserProfile
};

export default authService;

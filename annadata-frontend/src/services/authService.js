import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5050/api';

// Helper function to set auth token in headers
const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Get current user's profile
export const getUserProfile = async () => {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
      const response = await axios.get(`${API_URL}/users/profile`);
      return response.data;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

// Login user
export const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    const { token, user } = response.data;
    
    if (token) {
      localStorage.setItem('token', token);
      setAuthToken(token);
    }
    
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Sign up new user
export const signup = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    const { token, user } = response.data;
    
    if (token) {
      localStorage.setItem('token', token);
      setAuthToken(token);
    }
    
    return response.data;
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
};

// Update user profile
export const updateProfile = async (userData) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Authentication required');
    
    setAuthToken(token);
    const response = await axios.put(`${API_URL}/users/profile`, userData);
    return response.data;
  } catch (error) {
    console.error('Update profile error:', error);
    throw error;
  }
};

// For backward compatibility
export const updateUserProfile = updateProfile;

// Default export
const authService = {
  login,
  signup,
  getUserProfile,
  updateProfile
};

export default authService;

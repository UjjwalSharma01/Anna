import apiClient from './api';

// Authentication service functions
const authService = {
  // Login user
  login: async (credentials) => {
    try {
      console.log('🔐 AuthService: Attempting login with:', { email: credentials.email, password: '***' });
      console.log('🌐 Making request to: /api/auth/login');
      
      const response = await apiClient.post('/api/auth/login', credentials);
      
      console.log('✅ AuthService: Login API response:', response);
      console.log('📦 AuthService: Response data:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('❌ AuthService: Login error:', error);
      console.error('❌ AuthService: Error response:', error.response);
      throw error.response?.data || { message: 'Login failed' };
    }
  },

  // Register user
  signup: async (userData) => {
    try {
      const response = await apiClient.post('/api/auth/signup', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Signup failed' };
    }
  },

  // Logout user
  logout: async () => {
    try {
      const response = await apiClient.post('/api/auth/logout');
      return response.data;
    } catch (error) {
      // Even if logout fails on server, we clear local storage
      throw error.response?.data || { message: 'Logout failed' };
    }
  },

  // Get current user profile
  getProfile: async () => {
    try {
      const response = await apiClient.get('/api/auth/profile');
      console.log('🔍 AuthService: Profile API raw response:', response);
      console.log('📋 AuthService: Profile data received:', response.data);
      console.log('👤 AuthService: User object:', response.data.user);
      console.log('🏠 AuthService: Location field:', response.data.user?.location);
      console.log('🌾 AuthService: Land area field:', response.data.user?.land_area);
      console.log('💰 AuthService: Income field:', response.data.user?.income);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch profile' };
    }
  },

  // Update user profile
  updateProfile: async (userData) => {
    try {
      const response = await apiClient.put('/api/auth/profile', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update profile' };
    }
  },

  // Verify token (check if token is still valid)
  verifyToken: async () => {
    try {
      const response = await apiClient.get('/api/auth/verify');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Token verification failed' };
    }
  },
};

export default authService;

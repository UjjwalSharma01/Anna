import { api, handleApiError, isGitHubEnvironment } from './apiConfig';

// Flag for enabling mock data in development
const useMockData = process.env.REACT_APP_USE_MOCK_DATA === 'true' || isGitHubEnvironment;

// Generate a special mock token with __MOCK__ prefix to easily identify it
const generateMockToken = (userData) => {
  // Create a JSON object with all necessary user data
  const mockUserData = {
    id: 'mock-user-id',
    _id: 'mock-user-id',
    username: userData?.username || 'mockuser',
    email: userData?.email || 'mock@example.com',
    name: userData?.name || 'Mock User',
    createdAt: new Date().toISOString(),
    exp: Math.floor(Date.now() / 1000) + (60 * 60), // 1 hour from now
    isMockToken: true // Special flag to identify mock tokens
  };
  
  // Return a special format that won't be processed by jwt_decode
  return `__MOCK__${JSON.stringify(mockUserData)}`;
};

export const login = async (credentials) => {
  try {
    // Use mock data in development or GitHub environment
    if (useMockData) {
      console.log('Using mock login data');
      // Simulate successful login with our special mock token
      return {
        _id: 'mock-user-id',
        username: credentials.username || 'mockuser',
        email: credentials.email || 'mock@example.com',
        token: generateMockToken(credentials)
      };
    }

    const response = await api.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    // If it's a network error and we're in mock mode, return mock data
    if ((error.isNetworkError || !error.response) && useMockData) {
      console.log('Network error, falling back to mock login data');
      return {
        _id: 'mock-user-id',
        username: credentials.username || 'mockuser',
        email: credentials.email || 'mock@example.com',
        token: generateMockToken(credentials)
      };
    }
    throw handleApiError(error);
  }
};

export const signup = async (userData) => {
  try {
    // Use mock data in development or GitHub environment
    if (useMockData) {
      console.log('Using mock signup data');
      // Simulate successful registration with our special mock token
      return {
        _id: 'mock-user-id',
        username: userData.username,
        email: userData.email,
        token: generateMockToken(userData)
      };
    }

    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    // If it's a network error and we're in mock mode, return mock data
    if ((error.isNetworkError || !error.response) && useMockData) {
      console.log('Network error, falling back to mock signup data');
      return {
        _id: 'mock-user-id',
        username: userData.username,
        email: userData.email,
        token: generateMockToken(userData)
      };
    }
    throw handleApiError(error);
  }
};

export const getUserProfile = async () => {
  try {
    if (useMockData) {
      console.log('Using mock user profile data');
      return {
        _id: 'mock-user-id',
        name: 'Mock User',
        username: 'mockuser',
        email: 'mock@example.com',
        location: 'Mock Location',
        bio: 'This is a mock user profile for development',
        createdAt: new Date(Date.now() - 90*24*60*60*1000).toISOString() // 90 days ago
      };
    }
    
    const response = await api.get('/users/profile');
    return response.data;
  } catch (error) {
    if ((error.isNetworkError || !error.response) && useMockData) {
      console.log('Network error, falling back to mock profile data');
      return {
        _id: 'mock-user-id',
        name: 'Mock User',
        username: 'mockuser',
        email: 'mock@example.com',
        location: 'Mock Location',
        bio: 'This is a mock user profile for development',
        createdAt: new Date(Date.now() - 90*24*60*60*1000).toISOString() // 90 days ago
      };
    }
    throw handleApiError(error);
  }
};

export const updateProfile = async (userData) => {
  try {
    if (useMockData) {
      console.log('Using mock update profile');
      return {
        ...userData,
        _id: 'mock-user-id',
        updatedAt: new Date().toISOString()
      };
    }
    
    const response = await api.put('/users/profile', userData);
    return response.data;
  } catch (error) {
    if ((error.isNetworkError || !error.response) && useMockData) {
      console.log('Network error, falling back to mock update response');
      return {
        ...userData,
        _id: 'mock-user-id',
        updatedAt: new Date().toISOString()
      };
    }
    throw handleApiError(error);
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

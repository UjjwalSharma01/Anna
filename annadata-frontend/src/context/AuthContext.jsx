import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import jwt_decode from 'jwt-decode';

// Detect if we're using mock data
const isGitHubEnvironment = !!process.env.CODESPACE_NAME || 
  window.location.hostname.includes('github.dev') || 
  window.location.hostname.includes('app.github.dev');
const useMockData = process.env.REACT_APP_USE_MOCK_DATA === 'true' || isGitHubEnvironment;

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Define the logout function first
  const logout = useCallback(() => {
    try {
      localStorage.removeItem('token');
    } catch (error) {
      console.error('Error removing token from localStorage:', error);
    }
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  // Safe token storage helper
  const safeStoreToken = useCallback((token) => {
    try {
      localStorage.setItem('token', token);
      return true;
    } catch (error) {
      console.error('Failed to store token in localStorage:', error);
      return false;
    }
  }, []);

  // Safe token retrieval helper
  const safeGetToken = useCallback(() => {
    try {
      return localStorage.getItem('token');
    } catch (error) {
      console.error('Failed to get token from localStorage:', error);
      return null;
    }
  }, []);

  // Check if a token is a mock token
  const isMockToken = useCallback((token) => {
    return token && token.startsWith('__MOCK__');
  }, []);
  
  // Extract user data from mock token
  const extractMockUserData = useCallback((token) => {
    if (!token || !token.startsWith('__MOCK__')) {
      return null;
    }
    
    try {
      // Remove the __MOCK__ prefix and parse the JSON
      const jsonStr = token.substring(8); // Skip '__MOCK__'
      return JSON.parse(jsonStr);
    } catch (error) {
      console.error('Error parsing mock token:', error);
      return null;
    }
  }, []);

  // Safely decode JWT token with special handling for mock tokens
  const safeDecodeToken = useCallback((token) => {
    if (!token) return null;
    
    // First check if it's our special mock token format
    if (token.startsWith('__MOCK__')) {
      console.log('Detected mock token, extracting data directly');
      return extractMockUserData(token);
    }
    
    try {
      // It's a regular JWT token, decode it normally
      return jwt_decode(token);
    } catch (error) {
      console.error('Error decoding token:', error);
      // If in mock mode, fall back to mock user data
      if (useMockData) {
        console.log('Token decode failed but in mock mode, using mock user');
        return {
          id: 'mock-user-id',
          _id: 'mock-user-id',
          username: 'mockuser',
          email: 'mock@example.com',
          name: 'Mock User',
          createdAt: new Date().toISOString(),
          exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hour from now
        };
      }
      return null;
    }
  }, [extractMockUserData]);

  const login = useCallback((token) => {
    if (!token) {
      console.error('No token provided to login function');
      return null;
    }
    
    try {
      // Store token in localStorage
      safeStoreToken(token);
      
      // Check for mock token first, then decode
      let userData;
      if (isMockToken(token)) {
        userData = extractMockUserData(token);
        console.log('Using extracted mock user data:', userData);
      } else {
        userData = safeDecodeToken(token);
      }
      
      if (userData) {
        // Ensure the user object has all required fields
        const normalizedUser = {
          ...userData,
          id: userData.id || userData._id || 'unknown',
          _id: userData._id || userData.id || 'unknown',
          username: userData.username || userData.name || 'user',
          createdAt: userData.createdAt || new Date().toISOString()
        };
        
        setUser(normalizedUser);
        setIsAuthenticated(true);
        return normalizedUser;
      }
      
      // Fallback for mock environment if decoding failed
      if (useMockData) {
        const mockUser = {
          id: 'mock-user-id',
          _id: 'mock-user-id',
          username: 'mockuser',
          email: 'mock@example.com',
          name: 'Mock User',
          createdAt: new Date().toISOString(),
          exp: Math.floor(Date.now() / 1000) + (60 * 60)
        };
        setUser(mockUser);
        setIsAuthenticated(true);
        return mockUser;
      }
      
      throw new Error('Could not decode user data from token');
    } catch (error) {
      console.error('Login error:', error);
      logout();
      return null;
    }
  }, [logout, safeStoreToken, safeDecodeToken, isMockToken, extractMockUserData]);

  const signup = useCallback((token) => {
    return login(token);
  }, [login]);

  const refreshUserData = useCallback(async () => {
    try {
      console.log('Refreshing user data');
      return true;
    } catch (error) {
      console.error('Error refreshing user data:', error);
      return false;
    }
  }, []);

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = safeGetToken();
        
        if (!token) {
          console.log('No authentication token found');
          setLoading(false);
          return;
        }
        
        // Special handling for mock tokens
        if (isMockToken(token)) {
          console.log('Found saved mock token');
          const mockData = extractMockUserData(token);
          if (mockData) {
            setUser(mockData);
            setIsAuthenticated(true);
            setLoading(false);
            return;
          }
        }
        
        // Handle regular tokens
        const decoded = safeDecodeToken(token);
        if (decoded) {
          const currentTime = Date.now() / 1000;
          
          if (decoded.exp && decoded.exp < currentTime) {
            console.log('Token expired, logging out');
            logout();
          } else {
            console.log('Valid token found, setting authenticated state');
            setUser(decoded);
            setIsAuthenticated(true);
          }
        } else if (useMockData) {
          console.log('Using mock authentication as fallback');
          setUser({
            id: 'mock-user-id',
            _id: 'mock-user-id', 
            username: 'mockuser',
            email: 'mock@example.com',
            name: 'Mock User',
            createdAt: new Date().toISOString(),
            exp: Math.floor(Date.now() / 1000) + (60 * 60)
          });
          setIsAuthenticated(true);
        } else {
          console.warn('Invalid token found, logging out');
          logout();
        }
      } catch (error) {
        console.error('Unexpected error during auth check:', error);
        if (useMockData) {
          // Even on unexpected errors, use mock auth in mock mode
          console.log('Using mock authentication due to error');
          setUser({
            id: 'mock-user-id',
            _id: 'mock-user-id',
            username: 'mockuser',
            email: 'mock@example.com',
            name: 'Mock User'
          });
          setIsAuthenticated(true);
        } else {
          logout();
        }
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [logout, safeGetToken, safeDecodeToken, isMockToken, extractMockUserData]);

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    signup,
    logout,
    refreshUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
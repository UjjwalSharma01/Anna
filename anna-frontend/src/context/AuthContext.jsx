import React, { createContext, useContext, useState, useEffect } from 'react';
import { TOKEN_KEY, USER_DATA_KEY } from '../utils/constants';
import { getFromStorage, setToStorage, removeFromStorage } from '../utils/helpers';

// Create the context
const AuthContext = createContext();

// Export the context
export { AuthContext };

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is logged in on app start
  useEffect(() => {
    const token = getFromStorage(TOKEN_KEY);
    const userData = getFromStorage(USER_DATA_KEY);
    
    if (token && userData) {
      setUser(userData);
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  // Login function
  const login = (userData, token) => {
    console.log('🔐 AuthContext: Login function called');
    console.log('👤 User data to store:', userData);
    console.log('🎫 Token to store:', token ? token.substring(0, 20) + '...' : 'NO TOKEN');
    console.log('🎫 Token type:', typeof token);
    console.log('🎫 Token full value:', token);
    
    setToStorage(TOKEN_KEY, token);
    setToStorage(USER_DATA_KEY, userData);
    
    // Verify storage
    const storedToken = getFromStorage(TOKEN_KEY);
    const storedUser = getFromStorage(USER_DATA_KEY);
    console.log('✅ Token stored verification:', storedToken ? storedToken.substring(0, 20) + '...' : 'FAILED TO STORE');
    console.log('✅ User data stored verification:', storedUser);
    
    setUser(userData);
    setIsAuthenticated(true);
    
    console.log('🎯 Auth state updated: authenticated =', true);
  };

  // Logout function
  const logout = () => {
    removeFromStorage(TOKEN_KEY);
    removeFromStorage(USER_DATA_KEY);
    setUser(null);
    setIsAuthenticated(false);
  };

  // Update user data
  const updateUser = (updatedUserData) => {
    setToStorage(USER_DATA_KEY, updatedUserData);
    setUser(updatedUserData);
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import jwt_decode from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Define the logout function first
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const login = useCallback((token) => {
    try {
      localStorage.setItem('token', token);
      const decoded = jwt_decode(token);
      setUser(decoded);
      setIsAuthenticated(true);
      return decoded;
    } catch (error) {
      console.error('Login error:', error);
      logout(); // Now logout is defined before it's used
      return null;
    }
  }, [logout]); // Include logout in dependencies

  const signup = useCallback((token) => {
    return login(token); // Just use login
  }, [login]);

  const refreshUserData = useCallback(async () => {
    try {
      // Implementation depends on your API
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
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decoded = jwt_decode(token);
          const currentTime = Date.now() / 1000;
          
          if (decoded.exp && decoded.exp < currentTime) {
            // Token expired
            logout();
          } else {
            // Valid token
            setUser(decoded);
            setIsAuthenticated(true);
          }
        } catch (error) {
          // Invalid token
          logout();
        }
      }
      setLoading(false);
    };
    
    checkAuth();
  }, [logout]);

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
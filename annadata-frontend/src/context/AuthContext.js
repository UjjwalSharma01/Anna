import React, { createContext, useContext, useState, useEffect } from 'react';
import authService, { getUserProfile, login, signup, updateProfile } from '../services/authService';
import jwt_decode from 'jwt-decode';

// Create the AuthContext
const AuthContext = createContext({
  isAuthenticated: false,
  user: null,
  token: null,
  loading: true,
  login: () => {},
  logout: () => {},
  register: () => {}
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const storedToken = localStorage.getItem('token');
        
        if (storedToken) {
          // Verify token is valid (not expired)
          try {
            const decoded = jwt_decode(storedToken);
            const currentTime = Date.now() / 1000;
            
            if (decoded.exp < currentTime) {
              // Token expired
              localStorage.removeItem('token');
              setIsAuthenticated(false);
              setUser(null);
              setToken(null);
            } else {
              // Token valid
              const userData = await getUserProfile(); // Using the correct function
              setIsAuthenticated(true);
              setUser(userData);
              setToken(storedToken);
            }
          } catch (error) {
            // Invalid token
            localStorage.removeItem('token');
            setIsAuthenticated(false);
            setUser(null);
            setToken(null);
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const loginUser = async (credentials) => {
    const { token, user } = await login(credentials); // Using the correct function
    localStorage.setItem('token', token);
    setToken(token);
    setUser(user);
    setIsAuthenticated(true);
    return user;
  };

  const logoutUser = async () => {
    // Since there's no explicit logout function, we just handle it locally
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const registerUser = async (userData) => {
    const { token, user } = await signup(userData); // Using the correct function
    localStorage.setItem('token', token);
    setToken(token);
    setUser(user);
    setIsAuthenticated(true);
    return user;
  };

  const value = {
    isAuthenticated,
    user,
    token,
    loading,
    login: loginUser,
    logout: logoutUser,
    register: registerUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/authService';
import { validateEmail, validatePassword, validateRequired } from '../../utils/helpers';

const CombinedAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login: contextLogin } = useAuth();
  
  // Determine initial state based on route
  const [isLogin, setIsLogin] = useState(location.pathname === '/login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    location: '',
    land_area: '',
    income: ''
  });

  // Update form state when route changes
  useEffect(() => {
    setIsLogin(location.pathname === '/login');
    setError('');
    setFieldErrors({});
  }, [location.pathname]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors({
        ...fieldErrors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    // Common validations
    if (!validateRequired(formData.email)) {
      errors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email';
    }
    
    if (!validateRequired(formData.password)) {
      errors.password = 'Password is required';
    } else if (!validatePassword(formData.password)) {
      errors.password = 'Password must be at least 8 characters with uppercase, lowercase, and number';
    }
    
    // Signup-specific validations
    if (!isLogin) {
      if (!validateRequired(formData.username)) {
        errors.username = 'Username is required';
      }
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    
    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    
    setIsLoading(true);

    try {
      if (isLogin) {
        // Login
        const response = await authService.login({
          email: formData.email,
          password: formData.password
        });
        
        // Update auth context
        contextLogin(response.user, response.token);
        
        // Navigate to home
        navigate('/');
      } else {
        // Signup - transform username to name for API
        const signupData = {
          ...formData,
          name: formData.username
        };
        delete signupData.username;
        
        const response = await authService.signup(signupData);
        
        // Auto-login after successful signup
        contextLogin(response.user, response.token);
        
        // Navigate to home
        navigate('/');
      }
    } catch (error) {
      setError(error.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-400 to-blue-600">
      <div className="relative w-96">
        {/* Error Message */}
        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        
        {/* Signup Form */}
        <div className={`bg-white p-8 rounded-lg shadow-lg transition-all duration-300 ${isLogin ? 'hidden' : ''}`}>
          {!isLogin && (
            <form onSubmit={handleSubmit}>
              <label className="block text-2xl font-bold text-center mb-6 text-green-600">Sign up</label>
              
              <input 
                className={`w-full h-10 px-3 mb-2 border rounded focus:outline-none ${
                  fieldErrors.username ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-green-500'
                }`}
                type="text" 
                name="username" 
                placeholder="User name" 
                value={formData.username}
                onChange={handleInputChange}
                required 
              />
              {fieldErrors.username && <p className="text-red-500 text-sm mb-4">{fieldErrors.username}</p>}
              
              <input 
                className={`w-full h-10 px-3 mb-2 border rounded focus:outline-none ${
                  fieldErrors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-green-500'
                }`}
                type="email" 
                name="email" 
                placeholder="Email" 
                value={formData.email}
                onChange={handleInputChange}
                required 
              />
              {fieldErrors.email && <p className="text-red-500 text-sm mb-4">{fieldErrors.email}</p>}
              
              <input 
                className={`w-full h-10 px-3 mb-2 border rounded focus:outline-none ${
                  fieldErrors.password ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-green-500'
                }`}
                type="password" 
                name="password" 
                placeholder="Password" 
                value={formData.password}
                onChange={handleInputChange}
                required 
              />
              {fieldErrors.password && <p className="text-red-500 text-sm mb-4">{fieldErrors.password}</p>}
              
              <input 
                className="w-full h-10 px-3 mb-4 border border-gray-300 rounded focus:outline-none focus:border-green-500" 
                type="text" 
                name="location" 
                placeholder="Location" 
                value={formData.location}
                onChange={handleInputChange}
              />
              
              <input 
                className="w-full h-10 px-3 mb-4 border border-gray-300 rounded focus:outline-none focus:border-green-500" 
                type="number" 
                name="land_area" 
                placeholder="Land Area" 
                value={formData.land_area}
                onChange={handleInputChange}
              />
              
              <input 
                className="w-full h-10 px-3 mb-6 border border-gray-300 rounded focus:outline-none focus:border-green-500" 
                type="number" 
                name="income" 
                placeholder="Income" 
                value={formData.income}
                onChange={handleInputChange}
              />
              
              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing up...' : 'Sign up'}
              </button>
              
              <p className="text-center mt-4">
                Already have an account? 
                <button 
                  type="button"
                  onClick={() => navigate('/login')}
                  className="text-blue-600 cursor-pointer ml-1 hover:underline"
                >
                  Login
                </button>
              </p>
            </form>
          )}
        </div>

        {/* Login Form */}
        <div className={`bg-white p-8 rounded-lg shadow-lg transition-all duration-300 ${!isLogin ? 'hidden' : ''}`}>
          {isLogin && (
            <form onSubmit={handleSubmit}>
              <label className="block text-2xl font-bold text-center mb-6 text-blue-600">Login</label>
              
              <input 
                className="w-full h-10 px-3 mb-4 border border-gray-300 rounded focus:outline-none focus:border-blue-500" 
                type="text" 
                name="username" 
                placeholder="Username" 
                value={formData.username}
                onChange={handleInputChange}
                required 
              />
              
              <input 
                className={`w-full h-10 px-3 mb-2 border rounded focus:outline-none ${
                  fieldErrors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                }`}
                type="email" 
                name="email" 
                placeholder="Email" 
                value={formData.email}
                onChange={handleInputChange}
                required 
              />
              {fieldErrors.email && <p className="text-red-500 text-sm mb-4">{fieldErrors.email}</p>}
              
              <input 
                className={`w-full h-10 px-3 mb-2 border rounded focus:outline-none ${
                  fieldErrors.password ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                }`}
                type="password" 
                name="password" 
                placeholder="Password" 
                value={formData.password}
                onChange={handleInputChange}
                required 
              />
              {fieldErrors.password && <p className="text-red-500 text-sm mb-6">{fieldErrors.password}</p>}
              
              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
              
              <p className="text-center mt-4">
                Don't have an account? 
                <button 
                  type="button"
                  onClick={() => navigate('/signup')}
                  className="text-green-600 cursor-pointer ml-1 hover:underline"
                >
                  Sign up
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default CombinedAuth;
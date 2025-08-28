import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';
import { validateEmail, validatePassword, validateRequired, getErrorMessage } from '../utils/helpers';
import { ROUTES } from '../utils/constants';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import AuthRedirect from '../components/Common/AuthRedirect';

const Signup = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear submit error
    if (submitError) {
      setSubmitError('');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!validateRequired(formData.name)) {
      newErrors.name = 'Name is required';
    }
    
    if (!validateRequired(formData.email)) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!validateRequired(formData.password)) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters with uppercase, lowercase, and number';
    }
    
    if (!validateRequired(formData.confirmPassword)) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setSubmitError('');
    
    try {
      const { confirmPassword, ...signupData } = formData;
      const response = await authService.signup(signupData);
      login(response.user, response.token);
      navigate(ROUTES.HOME);
    } catch (error) {
      setSubmitError(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthRedirect>
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-teal-300 to-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse-slow"></div>
        </div>

        <div className="relative z-10 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full">
            {/* Header Section */}
            <div className="text-center mb-8">
              <div className="mx-auto w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl animate-bounce-slow">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-4xl font-bold mb-3">
                <span className="gradient-text">Join the Revolution!</span>
              </h2>
              <p className="text-gray-600 text-lg">
                Create your account and start smart farming
              </p>
            </div>

            {/* Signup Card */}
            <div className="glass-effect rounded-3xl p-8 shadow-2xl backdrop-blur-lg border border-white/20 card-hover">
              <form className="space-y-6" onSubmit={handleSubmit}>
                {submitError && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 animate-pulse">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-red-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <span className="text-red-700 font-medium">{submitError}</span>
                    </div>
                  </div>
                )}
                
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl bg-white/50 backdrop-blur-sm transition-all duration-300 focus:bg-white focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 ${
                        errors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-100' : 'border-gray-200 hover:border-emerald-300'
                      }`}
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-2 text-sm text-red-600 font-medium flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl bg-white/50 backdrop-blur-sm transition-all duration-300 focus:bg-white focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 ${
                        errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-100' : 'border-gray-200 hover:border-emerald-300'
                      }`}
                      placeholder="Enter your email address"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600 font-medium flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      className={`w-full pl-10 pr-12 py-3 border-2 rounded-xl bg-white/50 backdrop-blur-sm transition-all duration-300 focus:bg-white focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 ${
                        errors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-100' : 'border-gray-200 hover:border-emerald-300'
                      }`}
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-2 text-sm text-red-600 font-medium flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      className={`w-full pl-10 pr-12 py-3 border-2 rounded-xl bg-white/50 backdrop-blur-sm transition-all duration-300 focus:bg-white focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 ${
                        errors.confirmPassword ? 'border-red-300 focus:border-red-500 focus:ring-red-100' : 'border-gray-200 hover:border-emerald-300'
                      }`}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-2 text-sm text-red-600 font-medium flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="space-y-2">
                    <div className="text-xs text-gray-600">Password strength:</div>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4].map((level) => {
                        const strength = formData.password.length >= 8 && 
                                       /[A-Z]/.test(formData.password) && 
                                       /[a-z]/.test(formData.password) && 
                                       /[0-9]/.test(formData.password) ? 4 :
                                       formData.password.length >= 6 ? 3 :
                                       formData.password.length >= 4 ? 2 : 1;
                        return (
                          <div
                            key={level}
                            className={`h-2 w-full rounded-full ${
                              level <= strength 
                                ? level === 1 ? 'bg-red-400' 
                                  : level === 2 ? 'bg-yellow-400'
                                  : level === 3 ? 'bg-blue-400'
                                  : 'bg-green-400'
                                : 'bg-gray-200'
                            }`}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none btn-hover-effect"
                >
                  <div className="flex items-center justify-center">
                    {isLoading && <LoadingSpinner size="sm" className="mr-3" />}
                    <span>{isLoading ? 'Creating Account...' : 'Create Account'}</span>
                  </div>
                </button>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white/70 text-gray-500 font-medium">Already have an account?</span>
                  </div>
                </div>

                {/* Sign In Link */}
                <div className="text-center">
                  <Link
                    to={ROUTES.LOGIN}
                    className="group inline-flex items-center font-semibold text-emerald-600 hover:text-emerald-700 transition-colors duration-200"
                  >
                    <svg className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                    </svg>
                    <span>Sign in to existing account</span>
                  </Link>
                </div>
              </form>
            </div>

            {/* Benefits Preview */}
            <div className="mt-8 text-center">
              <p className="text-gray-600 text-sm mb-4">Join the smart farming revolution today!</p>
              <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span>Free Analytics</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                  <span>Expert Support</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Smart Recommendations</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Community Access</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthRedirect>
  );
};

export default Signup;

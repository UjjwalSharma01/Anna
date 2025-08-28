import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * AuthRedirect component - Redirects authenticated users away from auth pages
 * Shows a message and redirects after a delay
 */
const AuthRedirect = ({ children, redirectTo = '/', message = 'You are already logged in. Redirecting...' }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      setShowMessage(true);
      
      // Get the previous route from location state, or use redirectTo as fallback
      const from = location.state?.from || redirectTo;
      
      // Redirect after 2 seconds
      const timer = setTimeout(() => {
        navigate(from, { replace: true });
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, isLoading, navigate, redirectTo, location.state]);

  // If still loading, don't render anything yet
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  // If authenticated, show redirect message
  if (isAuthenticated && showMessage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md mx-4">
          <div className="mb-4">
            <svg 
              className="mx-auto h-12 w-12 text-green-500" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Already Logged In
          </h2>
          <p className="text-gray-600 mb-4">{message}</p>
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
            <span className="ml-2 text-sm text-gray-500">Redirecting...</span>
          </div>
        </div>
      </div>
    );
  }

  // If not authenticated, render the children (login/signup form)
  return children;
};

export default AuthRedirect;
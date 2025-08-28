import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import GoogleTranslate from '../Common/GoogleTranslate';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="bg-green-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold">
            Anna
          </Link>
          
          {/* Navigation Links */}
          <div className="hidden md:flex space-x-6">
            <Link 
              to="/" 
              className="hover:text-green-200 transition-colors"
            >
              Home
            </Link>
            <Link 
              to="/forum" 
              className="hover:text-green-200 transition-colors"
            >
              Forum
            </Link>
            <Link 
              to="/ask" 
              className="hover:text-green-200 transition-colors"
            >
              Ask Question
            </Link>
            <Link 
              to="/annadata" 
              className="hover:text-green-200 transition-colors"
            >
              Anna Data
            </Link>
            <Link 
              to="/schemes" 
              className="hover:text-green-200 transition-colors"
            >
              Schemes
            </Link>
          </div>
          
          {/* Auth Links */}
          <div className="flex items-center space-x-4">
            {/* Google Translate */}
            <GoogleTranslate />
            
            {isAuthenticated ? (
              <>
                {/* User Profile Link */}
                <Link 
                  to="/profile" 
                  className="hover:text-green-200 transition-colors"
                >
                  Welcome, {user?.name || user?.username || 'User'}
                </Link>
                
                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="bg-green-700 hover:bg-green-800 px-4 py-2 rounded transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className="bg-white text-green-600 hover:bg-gray-100 px-4 py-2 rounded transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

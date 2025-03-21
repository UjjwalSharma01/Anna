import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';

/**
 * Simplified RouterWrapper component - we'll only use BrowserRouter
 * and handle the /auth route separately
 */
const RouterWrapper = ({ children }) => {
  useEffect(() => {
    console.log('[RouterWrapper] Using simplified routing strategy');
  }, []);
  
  return <BrowserRouter>{children}</BrowserRouter>;
};

export default RouterWrapper;

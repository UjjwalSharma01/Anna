import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext.jsx';
import Navbar from '../Navbar.jsx';

// Mock AuthContext for testing different auth states
jest.mock('../../context/AuthContext.jsx', () => ({
  useAuth: jest.fn(),
  AuthProvider: ({ children }) => <div>{children}</div>
}));

describe('Navbar Component', () => {
  test('renders navbar with logo', () => {
    const { useAuth } = require('../../context/AuthContext.jsx');
    useAuth.mockReturnValue({ isAuthenticated: false });
    
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    
    expect(screen.getByAltText(/annadata/i) || screen.getByText(/annadata/i)).toBeInTheDocument();
  });

  test('shows login link when not authenticated', () => {
    const { useAuth } = require('../../context/AuthContext.jsx');
    useAuth.mockReturnValue({ isAuthenticated: false });
    
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    
    expect(screen.getByText(/login/i)).toBeInTheDocument();
  });

  test('shows profile link when authenticated', () => {
    const { useAuth } = require('../../context/AuthContext.jsx');
    useAuth.mockReturnValue({ 
      isAuthenticated: true,
      user: { name: 'Test User' }
    });
    
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    
    expect(screen.getByText(/profile/i)).toBeInTheDocument();
  });
});

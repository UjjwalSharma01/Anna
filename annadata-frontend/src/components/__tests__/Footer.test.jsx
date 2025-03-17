import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '../Footer.jsx';

describe('Footer Component', () => {
  test('renders footer with copyright information', () => {
    render(<Footer />);
    
    // Check for copyright text
    expect(screen.getByText(/copyright/i)).toBeInTheDocument();
  });

  test('renders footer with links', () => {
    render(<Footer />);
    
    // Check for common footer links
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
  });

  test('renders current year in copyright notice', () => {
    render(<Footer />);
    
    const currentYear = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(currentYear))).toBeInTheDocument();
  });
});

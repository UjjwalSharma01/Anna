import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import { useFlash } from '../context/FlashContext.jsx';
import { FlashMessages } from '../components/FlashMessage.jsx';
import FlashContainer from '../components/FlashContainer';

const MainLayout = () => {
  // Use optional chaining to prevent the error when useFlash returns undefined
  const flash = useFlash();
  
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      
      <div className="container py-4 flex-grow-1">
        <FlashContainer />
        <Outlet />
      </div>
      
      <Footer />
    </div>
  );
};

export default MainLayout;
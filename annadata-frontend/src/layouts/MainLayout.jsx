import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import { FlashMessages } from '../components/FlashMessage.jsx';
import { useFlash } from '../context/FlashContext.jsx';

const MainLayout = ({ children }) => {
  const { flashMessages, removeFlash } = useFlash();
  
  // Use either children passed as prop or Outlet from React Router
  const content = children || <Outlet />;

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      
      <div className="container mt-4 mb-4">
        <FlashMessages 
          messages={flashMessages} 
          onCloseMessage={removeFlash}
        />
        
        <main className="py-4 flex-grow-1 fade-in">
          {content}
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default MainLayout;
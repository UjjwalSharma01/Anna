import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import { useFlash } from '../context/FlashContext.jsx';
import { FlashMessages } from '../components/FlashMessage.jsx';

const MainLayout = () => {
  // Use optional chaining to prevent the error when useFlash returns undefined
  const flash = useFlash();
  
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      
      {/* Safe access to flashMessages using optional chaining */}
      <div className="flash-container container mt-3">
        {flash?.flashMessages && flash.flashMessages.length > 0 && (
          <FlashMessages 
            messages={flash.flashMessages} 
            onCloseMessage={(index) => {
              if (flash.removeFlash && flash.flashMessages[index]) {
                flash.removeFlash(flash.flashMessages[index].id);
              }
            }} 
          />
        )}
      </div>
      
      <main className="container py-4 flex-grow-1">
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
};

export default MainLayout;
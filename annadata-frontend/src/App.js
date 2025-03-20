import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { FlashProvider } from './context/FlashContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { FlashMessages } from './components/FlashMessage';
import Home from './pages/Home';
// ...other imports...

function App() {
  return (
    <Router>
      <FlashProvider>
        <AuthProvider>
          <div className="app-container d-flex flex-column min-vh-100">
            <Navbar />
            <FlashMessages />
            <main className="flex-grow-1">
              <Routes>
                <Route path="/" element={<Home />} />
                {/* Add your other routes here */}
              </Routes>
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </FlashProvider>
    </Router>
  );
}

export default App;

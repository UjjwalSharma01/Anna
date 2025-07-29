import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ErrorBoundary from './components/Common/ErrorBoundary';
import Navbar from './components/Layout/Navbar';
import Home from './pages/Home';
import Forum from './pages/Forum';
import AnnaData from './pages/AnnaData';
import Schemes from './pages/Schemes';
import Ask from './pages/Ask';
import NotFound from './pages/NotFound';
import CombinedAuth from './components/Auth/CombinedAuth';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <div className="App">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<CombinedAuth />} />
              <Route path="/signup" element={<CombinedAuth />} />
              <Route path="/forum" element={<Forum />} />
              <Route path="/annadata" element={<AnnaData />} />
              <Route path="/schemes" element={<Schemes />} />
              <Route path="/ask" element={<Ask />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;

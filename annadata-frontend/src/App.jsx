import React, { Suspense, lazy, useEffect, useState } from 'react';
import { 
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route
} from 'react-router-dom';
import MainLayout from './layouts/MainLayout.jsx';
import { FlashProvider } from './context/FlashContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { ImageProvider } from './context/ImageContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import LoadingSpinner from './components/LoadingSpinner.jsx';
import { checkBackendHealth } from './utils/backendChecker.js';
import { fixTranslateIssues, ensureTranslateDropdownWorks } from './utils/translationHelper';

// Import the CSS file
import './App.css';

// Lazily load page components
const Home = lazy(() => import('./pages/Home.jsx'));
const Schemes = lazy(() => import('./pages/Schemes.jsx'));
const Forum = lazy(() => import('./pages/Forum.jsx'));
const AskQuestion = lazy(() => import('./pages/AskQuestion.jsx'));
const QuestionDetail = lazy(() => import('./pages/QuestionDetail.jsx'));
const Profile = lazy(() => import('./pages/Profile.jsx'));
const Auth = lazy(() => import('./pages/Auth.jsx'));
const ErrorPage = lazy(() => import('./pages/ErrorPage.jsx'));

// Create a BackendStatus component to show backend connectivity status
const BackendStatus = ({ isHealthy, error }) => {
  if (isHealthy) return null;
  
  return (
    <div className="backend-status-alert">
      <div className="alert alert-warning" role="alert">
        <strong>Backend Connection Issue:</strong> Some features may not work correctly.
        {error && <div className="mt-1 small">{error}</div>}
      </div>
    </div>
  );
};

// Create the MainApp component that wraps the layout with context providers
const MainApp = () => (
  <FlashProvider>
    <AuthProvider>
      <ImageProvider>
        <Suspense fallback={<div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>}>
          <MainLayout />
        </Suspense>
      </ImageProvider>
    </AuthProvider>
  </FlashProvider>
);

// Create router with future flags enabled
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path="/"
      element={<MainApp />}
      errorElement={<MainLayout><ErrorPage /></MainLayout>}
    >
      <Route index element={<Home />} />
      <Route path="schemes" element={<Schemes />} />
      <Route path="forum" element={<Forum />} />
      <Route path="forum/:id" element={<QuestionDetail />} />
      <Route 
        path="forum/ask" 
        element={
          <ProtectedRoute>
            <AskQuestion />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="profile" 
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } 
      />
      <Route path="login" element={<Auth />} />
    </Route>
  ),
  {
    // Enable future flags to avoid deprecation warnings
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true
    }
  }
);

function App() {
  const [backendStatus, setBackendStatus] = useState({
    isHealthy: true,
    error: null,
    checked: false
  });

  useEffect(() => {
    // Check backend health when component mounts
    const checkBackendStatus = async () => {
      try {
        const result = await checkBackendHealth();
        setBackendStatus({
          isHealthy: result.isHealthy,
          error: result.error || null,
          checked: true
        });
      } catch (error) {
        setBackendStatus({
          isHealthy: false,
          error: "Could not connect to backend server",
          checked: true
        });
      }
    };

    checkBackendStatus();

    // Set up periodic checks (every 30 seconds)
    const intervalId = setInterval(checkBackendStatus, 30000);

    // Initialize translation observer to fix Google Translate issues
    fixTranslateIssues();

    // Fix Google Translate body shifting issue and ensure dropdown works
    const fixGoogleTranslate = () => {
      document.body.style.top = '0px';
      document.body.style.position = 'static';
      
      // Remove Google Translate iframe banners
      const elements = document.querySelectorAll('.skiptranslate, .goog-te-banner-frame');
      elements.forEach(el => {
        if (el) {
          el.style.display = 'none';
        }
      });
      
      // Make sure dropdown works
      ensureTranslateDropdownWorks();
    };

    // Apply fix initially and set interval to reapply
    fixGoogleTranslate();
    const translateFixInterval = setInterval(fixGoogleTranslate, 1000);
    
    // Listen for changes from Google Translate
    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' || 
            (mutation.type === 'attributes' && 
            (mutation.target.classList.contains('translated-ltr') || 
             mutation.target.classList.contains('translated-rtl')))) {
          fixTranslateIssues();
          ensureTranslateDropdownWorks();
        }
      });
    });
    
    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style']
    });
    
    return () => {
      // Clean up interval on unmount
      clearInterval(intervalId);
      
      clearInterval(translateFixInterval);
      mutationObserver.disconnect();
    };
  }, []);

  return (
    <>
      {backendStatus.checked && !backendStatus.isHealthy && 
        <BackendStatus 
          isHealthy={backendStatus.isHealthy} 
          error={backendStatus.error} 
        />
      }
      <RouterProvider router={router} />
    </>
  );
}

export default App;

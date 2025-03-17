import React, { useState, useEffect } from 'react';

const ConnectionStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Handle online/offline status changes
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    // Listen for global errors that might be caused by WebSocket connections
    const handleError = (error) => {
      // Only handle WebSocket errors
      if (error.message && error.message.includes('WebSocket')) {
        setHasError(true);
        console.log('WebSocket connection issue detected');
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('error', handleError);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('error', handleError);
    };
  }, []);

  // If everything is good, don't show anything
  if (isOnline && !hasError) return null;

  return (
    <div className="alert alert-warning">
      {!isOnline ? (
        <span>You are currently offline. Some features may be limited.</span>
      ) : hasError ? (
        <span>Connection issues detected. The application will continue to work normally.</span>
      ) : null}
    </div>
  );
};

export default ConnectionStatus;

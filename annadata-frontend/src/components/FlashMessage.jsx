import React, { useEffect } from 'react';
import { useFlash } from '../context/FlashContext';

export const FlashMessage = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const alertClass = `alert alert-${type || 'info'} alert-dismissible fade show`;

  return (
    <div className={alertClass} role="alert">
      {message}
      <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
    </div>
  );
};

export const FlashMessages = () => {
  const { messages = [], removeFlash } = useFlash() || {};
  
  // If flash context is not available or messages is undefined, render nothing
  if (!Array.isArray(messages)) {
    return null;
  }
  
  return (
    <div className="flash-container position-fixed top-0 start-50 translate-middle-x mt-3" style={{ zIndex: 1050, width: '90%', maxWidth: '500px' }}>
      {messages.map((msg) => (
        <FlashMessage 
          key={msg?.id || Math.random()}
          message={msg?.message || 'Unknown message'}
          type={msg?.type || 'info'}
          onClose={() => removeFlash && removeFlash(msg?.id)}
        />
      ))}
    </div>
  );
};

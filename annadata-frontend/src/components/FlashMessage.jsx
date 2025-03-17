import React, { useState, useEffect } from 'react';

// This component will display success, error, or info messages
const FlashMessage = ({ message, type, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  // Auto-dismiss flash messages after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) onClose();
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message || !isVisible) return null;

  const alertClass = `alert alert-${type || 'info'} alert-dismissible fade show`;
  
  return (
    <div className={alertClass} role="alert">
      {message}
      <button 
        type="button" 
        className="btn-close" 
        aria-label="Close"
        onClick={() => {
          setIsVisible(false);
          if (onClose) onClose();
        }}
      ></button>
    </div>
  );
};

// This is a wrapper to handle multiple flash messages
const FlashMessages = ({ messages = [], onCloseMessage }) => {
  if (!messages || messages.length === 0) return null;
  
  return (
    <div className="flash-messages container mt-3">
      {messages.map((msg, index) => (
        <FlashMessage 
          key={index}
          message={msg.message}
          type={msg.type}
          onClose={() => onCloseMessage && onCloseMessage(index)}
        />
      ))}
    </div>
  );
};

export { FlashMessage, FlashMessages };

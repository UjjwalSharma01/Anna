import React, { createContext, useState, useContext, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Create context
const FlashContext = createContext();

// Custom hook to use flash context
export const useFlash = () => useContext(FlashContext);

export const FlashProvider = ({ children }) => {
  const [flashMessages, setFlashMessages] = useState([]);

  // Add a new flash message
  const addFlash = useCallback((message, type = 'info', timeout = 5000) => {
    const id = uuidv4();
    const newFlash = { id, message, type };
    
    setFlashMessages(prevMessages => [...prevMessages, newFlash]);
    
    // Auto remove after timeout
    if (timeout > 0) {
      setTimeout(() => {
        removeFlash(id);
      }, timeout);
    }
    
    return id;
  }, []);

  // Remove a flash message by ID
  const removeFlash = useCallback((id) => {
    setFlashMessages(prevMessages => 
      prevMessages.filter(message => message.id !== id)
    );
  }, []);

  // Clear all flash messages
  const clearFlashes = useCallback(() => {
    setFlashMessages([]);
  }, []);

  const value = {
    flashMessages,
    addFlash,
    removeFlash,
    clearFlashes
  };

  return (
    <FlashContext.Provider value={value}>
      {children}
    </FlashContext.Provider>
  );
};
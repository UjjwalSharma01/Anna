import React, { createContext, useContext, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

const FlashContext = createContext({
  messages: [],
  addFlash: () => {},
  removeFlash: () => {},
});

export const useFlash = () => {
  return useContext(FlashContext);
};

export const FlashProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);

  const addFlash = useCallback((message, type = 'info', timeout = 5000) => {
    const id = uuidv4();
    setMessages(prevMessages => [...prevMessages, { id, message, type }]);

    if (timeout) {
      setTimeout(() => {
        removeFlash(id);
      }, timeout);
    }

    return id;
  }, []);

  const removeFlash = useCallback((id) => {
    setMessages(prevMessages => prevMessages.filter(msg => msg.id !== id));
  }, []);

  // Ensure we always return valid values in the context
  const contextValue = {
    messages,
    addFlash,
    removeFlash,
  };

  return (
    <FlashContext.Provider value={contextValue}>
      {children}
    </FlashContext.Provider>
  );
};

export default FlashContext;
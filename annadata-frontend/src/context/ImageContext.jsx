import React, { createContext, useContext, useState } from 'react';
import { fallbackImages } from '../utils/defaultImages';

const ImageContext = createContext();

export const useImage = () => useContext(ImageContext);

export const ImageProvider = ({ children }) => {
  const [imageErrors, setImageErrors] = useState({});

  const handleImageError = (imageId, fallbackType = 'default') => {
    setImageErrors(prev => ({
      ...prev,
      [imageId]: fallbackImages[fallbackType] || fallbackImages.default
    }));
  };

  const getImageSrc = (originalSrc, imageId, fallbackType = 'default') => {
    return imageErrors[imageId] || originalSrc;
  };

  return (
    <ImageContext.Provider value={{ handleImageError, getImageSrc }}>
      {children}
    </ImageContext.Provider>
  );
};

export default ImageContext;

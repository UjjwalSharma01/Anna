import React, { useState } from 'react';

const ImageWithFallback = ({ 
  src, 
  fallbackSrc, 
  alt, 
  className,
  ...props 
}) => {
  const [error, setError] = useState(false);

  return (
    <img
      src={error ? fallbackSrc : src}
      alt={alt}
      className={className}
      onError={(e) => {
        setError(true);
        // Clear onError after first failure to prevent infinite loop
        e.target.onError = null;
      }}
      {...props}
    />
  );
};

export default ImageWithFallback;

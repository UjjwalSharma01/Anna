/**
 * Standard API response formatter
 */
export const formatApiResponse = (data = null, message = '', success = true) => {
  return {
    success,
    message,
    data
  };
};

/**
 * Error handler for API requests
 */
export const handleApiError = (error, defaultMessage = 'Something went wrong') => {
  console.error('API Error:', error);
  
  if (error.response?.data?.message) {
    return error.response.data;
  }
  
  return {
    success: false,
    message: error.message || defaultMessage,
    data: null
  };
};

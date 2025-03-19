/**
 * Format date to a readable string
 * @param {string|Date} dateString - Date to format
 * @param {object} options - Formatting options
 * @returns {string} - Formatted date string
 */
export const formatDate = (dateString, options = {}) => {
  const date = new Date(dateString);
  
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options
  };
  
  return date.toLocaleDateString(undefined, defaultOptions);
};

/**
 * Format time elapsed since date
 * @param {string|Date} dateString - Date to calculate elapsed time from
 * @returns {string} - Human readable elapsed time
 */
export const timeAgo = (dateString) => {
  const date = new Date(dateString);
  const seconds = Math.floor((new Date() - date) / 1000);
  let interval = Math.floor(seconds / 31536000);
  
  if (interval > 1) {
    return `${interval} years ago`;
  } else if (interval === 1) {
    return 'a year ago';
  }
  
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) {
    return `${interval} months ago`;
  } else if (interval === 1) {
    return 'a month ago';
  }
  
  interval = Math.floor(seconds / 86400);
  if (interval > 1) {
    return `${interval} days ago`;
  } else if (interval === 1) {
    return 'a day ago';
  }
  
  interval = Math.floor(seconds / 3600);
  if (interval > 1) {
    return `${interval} hours ago`;
  } else if (interval === 1) {
    return 'an hour ago';
  }
  
  interval = Math.floor(seconds / 60);
  if (interval > 1) {
    return `${interval} minutes ago`;
  } else if (interval === 1) {
    return 'a minute ago';
  }
  
  if (seconds < 10) {
    return 'just now';
  }
  
  return `${Math.floor(seconds)} seconds ago`;
};

/**
 * Format currency amount
 * @param {number} amount - Currency amount
 * @param {string} currency - Currency code (default: INR)
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (amount, currency = 'INR') => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Truncate text to specific length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} - Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) {
    return text;
  }
  
  return text.substring(0, maxLength) + '...';
};

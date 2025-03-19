/**
 * Utility to check backend health status
 */
import axios from 'axios';
import { isGitHubEnvironment } from '../services/apiConfig';

// In GitHub environment, we'll consider the backend as "healthy" even if it's not
// This prevents showing error messages in the environment where we expect the backend to be offline
const isGitHubDev = isGitHubEnvironment;

/**
 * Check if the backend API is healthy
 * @returns {Promise<Object>} - Status object with isHealthy boolean and error message if any
 */
export const checkBackendHealth = async () => {
  // In GitHub environment, return as healthy to avoid showing error messages
  if (isGitHubDev) {
    console.log('Running in GitHub environment, skipping backend health check');
    return { 
      isHealthy: true,
      data: { status: 'mock', environment: 'github' },
      error: null
    };
  }

  try {
    const response = await axios.get('/api/health', {
      timeout: 5000, // 5 second timeout
      headers: {
        'Cache-Control': 'no-cache'
      }
    });
    
    if (response.status === 200 && response.data.status === 'ok') {
      return { 
        isHealthy: true, 
        data: response.data,
        error: null
      };
    } else {
      return { 
        isHealthy: false, 
        error: 'Backend returned unexpected response',
        data: response.data
      };
    }
  } catch (error) {
    console.warn('Backend health check failed:', error.message);
    return {
      isHealthy: false,
      error: error.message,
      data: null
    };
  }
};

export default { checkBackendHealth };

/**
 * Backend connectivity checker
 * This utility helps verify backend connectivity at runtime
 */

const checkBackendHealth = async () => {
  try {
    const response = await fetch('/api/health');
    const data = await response.json();
    
    console.log('✅ Backend health check successful:', data);
    return {
      isHealthy: true,
      data
    };
  } catch (error) {
    console.error('❌ Backend health check failed:', error);
    return {
      isHealthy: false,
      error: error.message
    };
  }
};

export { checkBackendHealth };

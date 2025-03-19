import { api, handleApiError, isGitHubEnvironment } from './apiConfig';
import mockData from '../utils/mockData';

// Flag for enabling mock data in development
const useMockData = process.env.REACT_APP_USE_MOCK_DATA === 'true' || isGitHubEnvironment;

// General app functions
export const getHomePageData = async () => {
  try {
    if (useMockData) {
      console.log('Using mock home data');
      return mockData.homeData;
    }

    const response = await api.get('/home');
    return response.data;
  } catch (error) {
    console.error('Home page data error:', error);
    
    // Use mock data as fallback if it's a network error
    if (error.isNetworkError && useMockData) {
      console.log('Network error, falling back to mock data');
      return mockData.homeData;
    }
    
    throw handleApiError(error);
  }
};

// Export the function with both names for backward compatibility
export const getAllSchemes = async (filters = {}) => {
  try {
    if (useMockData) {
      console.log('Using mock schemes data');
      return mockData.schemes;
    }

    const response = await api.get('/schemes', { params: filters });
    return response.data;
  } catch (error) {
    console.error('Get all schemes error:', error);
    
    // Use mock data as fallback if it's a network error
    if (error.isNetworkError && useMockData) {
      console.log('Network error, falling back to mock schemes data');
      return mockData.schemes;
    }
    
    throw handleApiError(error);
  }
};

// Add alias for getAllSchemes to fix the import error
export const getSchemes = getAllSchemes;

export const getSchemeById = async (id) => {
  try {
    const response = await api.get(`/schemes/${id}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const applyForScheme = async (schemeId, applicationData) => {
  try {
    const response = await api.post(`/schemes/${schemeId}/apply`, applicationData);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getWeatherData = async (location) => {
  try {
    const response = await api.get('/weather', { params: { location } });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getMarketPrices = async (cropType) => {
  try {
    const response = await api.get('/market-prices', { params: { crop: cropType } });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

const annadataService = {
  getHomePageData,
  getAllSchemes,
  getSchemes,
  getSchemeById,
  applyForScheme,
  getWeatherData,
  getMarketPrices
};

export default annadataService;

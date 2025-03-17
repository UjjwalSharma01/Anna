import { api, handleApiError } from './apiConfig';

// General app functions
export const getHomePageData = async () => {
  try {
    const response = await api.get('/home');
    return response.data;
  } catch (error) {
    console.error('Home page data error:', error);
    throw handleApiError(error);
  }
};

// Export the function with both names for backward compatibility
export const getAllSchemes = async (filters = {}) => {
  try {
    const response = await api.get('/schemes', { params: filters });
    return response.data;
  } catch (error) {
    console.error('Get all schemes error:', error);
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

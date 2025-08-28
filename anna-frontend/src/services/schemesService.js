import api from './api';

class SchemesService {
  /**
   * Get all schemes and NGOs data
   */
  async getSchemes() {
    try {
      const response = await api.get('/api/schemes');
      return response.data;
    } catch (error) {
      console.error('Error fetching schemes:', error);
      throw error;
    }
  }

  /**
   * Refresh schemes data from external sources
   */
  async refreshSchemes() {
    try {
      console.log('🔍 Debug - API_BASE_URL:', process.env.REACT_APP_API_URL);
      console.log('🔍 Debug - Full URL will be:', `${process.env.REACT_APP_API_URL}/api/schemes/refresh`);
      const response = await api.post('/api/schemes/refresh');
      return response.data;
    } catch (error) {
      console.error('Error refreshing schemes:', error);
      throw error;
    }
  }

  /**
   * Get schemes by category
   */
  async getSchemesByCategory(category) {
    try {
      const response = await api.get(`/api/schemes/category/${category}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching schemes by category:', error);
      throw error;
    }
  }
}

const schemesService = new SchemesService();
export default schemesService;

import apiClient from './api';

// AnnaData service functions
const annadataService = {
  // Get all annadata records
  getAllRecords: async () => {
    try {
      const response = await apiClient.get('/annadata');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch annadata records' };
    }
  },

  // Get a single annadata record by ID
  getRecordById: async (recordId) => {
    try {
      const response = await apiClient.get(`/annadata/${recordId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch annadata record' };
    }
  },

  // Create a new annadata record
  createRecord: async (recordData) => {
    try {
      const response = await apiClient.post('/annadata', recordData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create annadata record' };
    }
  },

  // Update an annadata record
  updateRecord: async (recordId, recordData) => {
    try {
      const response = await apiClient.put(`/annadata/${recordId}`, recordData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update annadata record' };
    }
  },

  // Delete an annadata record
  deleteRecord: async (recordId) => {
    try {
      const response = await apiClient.delete(`/annadata/${recordId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete annadata record' };
    }
  },

  // Get user's annadata records
  getUserRecords: async () => {
    try {
      const response = await apiClient.get('/annadata/user');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch user records' };
    }
  },

  // Search annadata records
  searchRecords: async (query) => {
    try {
      const response = await apiClient.get(`/annadata/search?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to search annadata records' };
    }
  },

  // Get annadata statistics
  getStatistics: async () => {
    try {
      const response = await apiClient.get('/annadata/statistics');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch statistics' };
    }
  },
};

export default annadataService;

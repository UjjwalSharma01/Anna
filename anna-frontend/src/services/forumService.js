import apiClient from './api';

// Forum service functions
const forumService = {
  // Get all forum posts
  getAllPosts: async () => {
    try {
      const response = await apiClient.get('/forum');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch forum posts' };
    }
  },

  // Get a single forum post by ID
  getPostById: async (postId) => {
    try {
      const response = await apiClient.get(`/forum/${postId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch forum post' };
    }
  },

  // Create a new forum post
  createPost: async (postData) => {
    try {
      const response = await apiClient.post('/forum', postData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create forum post' };
    }
  },

  // Update a forum post
  updatePost: async (postId, postData) => {
    try {
      const response = await apiClient.put(`/forum/${postId}`, postData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update forum post' };
    }
  },

  // Delete a forum post
  deletePost: async (postId) => {
    try {
      const response = await apiClient.delete(`/forum/${postId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete forum post' };
    }
  },

  // Add a reply to a forum post
  addReply: async (postId, replyData) => {
    try {
      const response = await apiClient.post(`/forum/${postId}/replies`, replyData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to add reply' };
    }
  },

  // Search forum posts
  searchPosts: async (query) => {
    try {
      const response = await apiClient.get(`/forum/search?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to search forum posts' };
    }
  },
};

export default forumService;

import apiClient from './api';

// Forum service functions
const forumService = {
  // Get all forum posts
  getAllPosts: async () => {
    try {
      console.log('🌐 Making API call to get all posts...');
      const response = await apiClient.get('/api/forum');
      console.log('✅ API Response received:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Forum service error:', error);
      console.error('❌ Error response:', error.response?.data);
      throw error.response?.data || { message: 'Failed to fetch forum posts' };
    }
  },

  // Get a single forum post by ID
  getPostById: async (postId) => {
    try {
      const response = await apiClient.get(`/api/forum/${postId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch forum post' };
    }
  },

    // Create a new forum post
  createPost: async (postData) => {
    try {
      console.log('📝 Creating new post with data:', postData);
      const response = await apiClient.post('/api/forum', postData);
      console.log('✅ Post created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.log('❌ Error creating post:', error);
      console.log('❌ Error response:', error.response?.data);
      throw error.response?.data || { message: 'Failed to create forum post' };
    }
  },

  // Update a forum post
  updatePost: async (postId, postData) => {
    try {
      const response = await apiClient.put(`/api/forum/${postId}`, postData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update forum post' };
    }
  },

  // Delete a forum post
  deletePost: async (postId) => {
    try {
      const response = await apiClient.delete(`/api/forum/${postId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete forum post' };
    }
  },

  // Add a reply to a forum post
  addReply: async (postId, replyData) => {
    try {
      const response = await apiClient.post(`/api/forum/${postId}/replies`, replyData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to add reply' };
    }
  },

  // Search forum posts
  searchPosts: async (query) => {
    try {
      const response = await apiClient.get(`/api/forum/search?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to search forum posts' };
    }
  },
};

export default forumService;

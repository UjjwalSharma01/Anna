import { api, handleApiError } from './apiConfig';

// Forum API functions
export const getAllQuestions = async (filters = {}) => {
  try {
    const response = await api.get('/forum/questions', { params: filters });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Add alias for getAllQuestions to fix import error in Forum.jsx
export const getQuestions = getAllQuestions;

export const getQuestionById = async (id) => {
  try {
    const response = await api.get(`/forum/questions/${id}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const createQuestion = async (questionData) => {
  try {
    const response = await api.post('/forum/questions', questionData);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Add alias for createQuestion to fix import error in AskQuestion.jsx
export const askQuestion = createQuestion;

export const answerQuestion = async (questionId, answerData) => {
  try {
    const response = await api.post(`/forum/questions/${questionId}/answers`, answerData);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const upvoteQuestion = async (questionId) => {
  try {
    const response = await api.post(`/forum/questions/${questionId}/upvote`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const upvoteAnswer = async (questionId, answerId) => {
  try {
    const response = await api.post(`/forum/questions/${questionId}/answers/${answerId}/upvote`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const searchQuestions = async (searchTerm) => {
  try {
    const response = await api.get('/forum/search', { params: { q: searchTerm } });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Add getUserQuestions function to fix import error in Profile.jsx
export const getUserQuestions = async () => {
  try {
    const response = await api.get('/forum/user/questions');
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Export all functions as default object
const forumService = {
  getQuestions: getAllQuestions,
  getAllQuestions,
  getQuestionById,
  createQuestion,
  askQuestion,
  answerQuestion,
  upvoteQuestion,
  upvoteAnswer,
  searchQuestions,
  getUserQuestions
};

export default forumService;

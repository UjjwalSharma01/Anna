/**
 * Forum Bridge - Ensures forum functions are always available
 * This file resolves circular dependency issues and provides guaranteed access to forum functions
 */

import { getForumService, askQuestion as reliableAskQuestion } from './serviceHelper';

// Get the service once
const forumService = getForumService();

// Export guaranteed working functions that connect to MongoDB when possible
export const askQuestion = async (data) => {
  console.log('[FORUM BRIDGE] Using bridge askQuestion function to save to MongoDB');
  
  // Get response from service which will send to MongoDB if available
  const response = await forumService.askQuestion(data);
  console.log('[FORUM BRIDGE] askQuestion response:', response);
  return response;
};

export const getQuestions = async (...args) => {
  console.log('[FORUM BRIDGE] Getting questions from MongoDB if available, args:', args);
  const response = await forumService.getQuestions(...args);
  console.log('[FORUM BRIDGE] getQuestions response structure:', 
    response ? 
    `Has questions array: ${!!(response.questions && Array.isArray(response.questions))}, 
     Is array: ${Array.isArray(response)}, 
     Object keys: ${Object.keys(response || {})}` : 'null');
  return response;
};

// Enhanced getQuestionById to get from MongoDB
export const getQuestionById = async (id) => {
  console.log('[FORUM BRIDGE] Getting question by ID from MongoDB if available:', id);
  const question = await forumService.getQuestionById(id);
  console.log('[FORUM BRIDGE] Question detail retrieved:', question?._id, question?.title);
  return question;
};

// Add missing answerQuestion export
export const answerQuestion = async (questionId, answerData) => {
  console.log('[FORUM BRIDGE] Answering question with ID:', questionId, 'and data:', answerData);
  const response = await forumService.answerQuestion(questionId, answerData);
  console.log('[FORUM BRIDGE] Answer submitted, response:', response);
  return response;
};

// Export the remaining functions
export const getUserQuestions = async (...args) => {
  console.log('[FORUM BRIDGE] Getting user questions, args:', args);
  const questions = await forumService.getUserQuestions(...args);
  console.log('[FORUM BRIDGE] Retrieved user questions count:', questions?.length || 0);
  return questions;
};

export const upvoteQuestion = async (questionId) => {
  console.log('[FORUM BRIDGE] Upvoting question:', questionId);
  const response = await forumService.upvoteQuestion(questionId);
  console.log('[FORUM BRIDGE] Question upvoted, new count:', response?.upvotes);
  return response;
};

export const upvoteAnswer = async (questionId, answerId) => {
  console.log('[FORUM BRIDGE] Upvoting answer:', answerId, 'in question:', questionId);
  const response = await forumService.upvoteAnswer(questionId, answerId);
  console.log('[FORUM BRIDGE] Answer upvoted, new count:', response?.upvotes);
  return response;
};

export const searchQuestions = async (searchTerm) => {
  console.log('[FORUM BRIDGE] Searching questions with term:', searchTerm);
  const results = await forumService.searchQuestions(searchTerm);
  console.log('[FORUM BRIDGE] Search results count:', results?.length || 0);
  return results;
};

// Export the enhanced service
const enhancedService = {
  ...forumService,
  askQuestion,
  getQuestions,
  getUserQuestions,
  upvoteQuestion,
  upvoteAnswer,
  getQuestionById,
  answerQuestion, // Added the missing function to the enhanced service
  searchQuestions
};

export default enhancedService;

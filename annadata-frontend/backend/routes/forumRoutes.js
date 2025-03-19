const express = require('express');
const router = express.Router();
const { 
  getQuestions, 
  getQuestionById, 
  createQuestion,
  answerQuestion,
  upvoteQuestion,
  upvoteAnswer,
  getUserQuestions,
  searchQuestions
} = require('../controllers/forumController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
// @route   GET /api/forum/questions
router.get('/questions', getQuestions);

// @route   GET /api/forum/questions/:id
router.get('/questions/:id', getQuestionById);

// @route   GET /api/forum/search
router.get('/search', searchQuestions);

// Protected routes
// @route   POST /api/forum/questions
router.post('/questions', protect, createQuestion);

// @route   POST /api/forum/questions/:id/answers
router.post('/questions/:id/answers', protect, answerQuestion);

// @route   POST /api/forum/questions/:id/upvote
router.post('/questions/:id/upvote', protect, upvoteQuestion);

// @route   POST /api/forum/questions/:id/answers/:answerId/upvote
router.post('/questions/:id/answers/:answerId/upvote', protect, upvoteAnswer);

// @route   GET /api/forum/user/questions
router.get('/user/questions', protect, getUserQuestions);

module.exports = router;

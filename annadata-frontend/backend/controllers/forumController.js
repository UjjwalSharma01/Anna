const Forum = require('../models/Forum');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all questions (with pagination)
// @route   GET /api/forum/questions
// @access  Public
const getQuestions = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  
  const count = await Forum.countDocuments();
  
  const questions = await Forum.find({})
    .populate('author', 'username avatar')
    .sort({ createdAt: -1 })
    .skip((page - 1) * pageSize)
    .limit(pageSize);
  
  res.json({
    questions,
    page,
    totalPages: Math.ceil(count / pageSize)
  });
});

// @desc    Get a single question by ID
// @route   GET /api/forum/questions/:id
// @access  Public
const getQuestionById = asyncHandler(async (req, res) => {
  const question = await Forum.findById(req.params.id)
    .populate('author', 'username avatar')
    .populate('answers.author', 'username avatar');
  
  if (question) {
    res.json(question);
  } else {
    res.status(404);
    throw new Error('Question not found');
  }
});

// @desc    Create a new question
// @route   POST /api/forum/questions
// @access  Private
const createQuestion = asyncHandler(async (req, res) => {
  const { title, content, tags } = req.body;
  
  if (!title || !content) {
    res.status(400);
    throw new Error('Title and content are required');
  }
  
  const question = await Forum.create({
    title,
    content,
    tags: tags || [],
    author: req.user._id
  });
  
  const populatedQuestion = await Forum.findById(question._id)
    .populate('author', 'username avatar');
  
  res.status(201).json(populatedQuestion);
});

// @desc    Create an answer for a question
// @route   POST /api/forum/questions/:id/answers
// @access  Private
const answerQuestion = asyncHandler(async (req, res) => {
  const { content } = req.body;
  
  if (!content) {
    res.status(400);
    throw new Error('Answer content is required');
  }
  
  const question = await Forum.findById(req.params.id);
  
  if (!question) {
    res.status(404);
    throw new Error('Question not found');
  }
  
  const answer = {
    content,
    author: req.user._id
  };
  
  question.answers.push(answer);
  await question.save();
  
  // Get the newly created answer
  const newAnswer = question.answers[question.answers.length - 1];
  
  // Populate the author field
  const populatedQuestion = await Forum.findById(question._id);
  const populatedAnswer = populatedQuestion.answers.id(newAnswer._id);
  
  // Manually populate the author (since we need only one answer)
  const author = await User.findById(req.user._id).select('username avatar');
  
  res.status(201).json({
    ...populatedAnswer.toObject(),
    author
  });
});

// @desc    Upvote a question
// @route   POST /api/forum/questions/:id/upvote
// @access  Private
const upvoteQuestion = asyncHandler(async (req, res) => {
  const question = await Forum.findById(req.params.id);
  
  if (!question) {
    res.status(404);
    throw new Error('Question not found');
  }
  
  // Check if user already upvoted
  if (question.upvotedBy.includes(req.user._id)) {
    res.status(400);
    throw new Error('You already upvoted this question');
  }
  
  question.upvotes += 1;
  question.upvotedBy.push(req.user._id);
  
  await question.save();
  
  res.json({ upvotes: question.upvotes });
});

// @desc    Upvote an answer
// @route   POST /api/forum/questions/:id/answers/:answerId/upvote
// @access  Private
const upvoteAnswer = asyncHandler(async (req, res) => {
  const question = await Forum.findById(req.params.id);
  
  if (!question) {
    res.status(404);
    throw new Error('Question not found');
  }
  
  const answer = question.answers.id(req.params.answerId);
  
  if (!answer) {
    res.status(404);
    throw new Error('Answer not found');
  }
  
  // Check if user already upvoted
  if (answer.upvotedBy.includes(req.user._id)) {
    res.status(400);
    throw new Error('You already upvoted this answer');
  }
  
  answer.upvotes += 1;
  answer.upvotedBy.push(req.user._id);
  
  await question.save();
  
  res.json({ upvotes: answer.upvotes });
});

// @desc    Get questions by user
// @route   GET /api/forum/user/questions
// @access  Private
const getUserQuestions = asyncHandler(async (req, res) => {
  const questions = await Forum.find({ author: req.user._id })
    .sort({ createdAt: -1 });
  
  res.json(questions);
});

// @desc    Search questions
// @route   GET /api/forum/search
// @access  Public
const searchQuestions = asyncHandler(async (req, res) => {
  const query = req.query.q;
  
  if (!query) {
    res.status(400);
    throw new Error('Search query is required');
  }
  
  const questions = await Forum.find({
    $or: [
      { title: { $regex: query, $options: 'i' } },
      { content: { $regex: query, $options: 'i' } },
      { tags: { $in: [new RegExp(query, 'i')] } }
    ]
  })
    .populate('author', 'username avatar')
    .sort({ createdAt: -1 });
  
  res.json(questions);
});

module.exports = {
  getQuestions,
  getQuestionById,
  createQuestion,
  answerQuestion,
  upvoteQuestion,
  upvoteAnswer,
  getUserQuestions,
  searchQuestions
};

const Scheme = require('../models/Scheme');
const Forum = require('../models/Forum');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get home page data
// @route   GET /api/home
// @access  Public
const getHomeData = asyncHandler(async (req, res) => {
  // Get featured schemes
  const featuredSchemes = await Scheme.find({ featured: true })
    .limit(3)
    .sort({ createdAt: -1 });
  
  // Get latest forum questions
  const latestQuestions = await Forum.find({})
    .populate('author', 'username avatar')
    .limit(5)
    .sort({ createdAt: -1 });
  
  // Prepare hero section data
  const hero = {
    title: 'Welcome to Annadata',
    subtitle: 'Your one-stop platform for agricultural resources and community',
    description: 'Access agricultural schemes, connect with farmers, and get the resources you need'
  };
  
  res.json({
    hero,
    featuredSchemes,
    latestQuestions
  });
});

module.exports = {
  getHomeData
};

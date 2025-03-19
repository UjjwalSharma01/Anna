const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  
  if (user) {
    user.name = req.body.name || user.name;
    user.location = req.body.location || user.location;
    user.bio = req.body.bio || user.bio;
    
    // Only update email if it's provided
    if (req.body.email && req.body.email !== user.email) {
      // Check if email already exists
      const emailExists = await User.findOne({ email: req.body.email });
      if (emailExists) {
        res.status(400);
        throw new Error('Email already in use');
      }
      user.email = req.body.email;
    }
    
    // Only update password if it's provided
    if (req.body.password) {
      user.password = req.body.password;
    }
    
    const updatedUser = await user.save();
    
    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      name: updatedUser.name,
      location: updatedUser.location,
      bio: updatedUser.bio,
      avatar: updatedUser.avatar,
      token: updatedUser.generateToken()
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

module.exports = {
  getUserProfile,
  updateUserProfile
};

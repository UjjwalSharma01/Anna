const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, location, land_area, income } = req.body;
  
  // Check if user already exists
  const userExists = await User.findOne({ $or: [{ email }, { username }] });
  
  if (userExists) {
    res.status(400);
    throw new Error('User already exists with that email or username');
  }
  
  // Create new user
  const user = await User.create({
    username,
    email,
    password, // Will be hashed by pre-save hook in model
    location: location || '',
    land_area: land_area || 0,
    income: income || 0,
  });
  
  if (user) {
    // Generate JWT token
    const token = user.generateToken();
    
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      location: user.location,
      token
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Login user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  
  // Allow login with either username or email
  const user = await User.findOne({
    $or: [
      { email: email },
      { username: username }
    ]
  });
  
  // Check if user exists and password is correct
  if (user && await user.comparePassword(password)) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      location: user.location,
      avatar: user.avatar,
      token: user.generateToken()
    });
  } else {
    res.status(401);
    throw new Error('Invalid username/email or password');
  }
});

module.exports = {
  registerUser,
  loginUser
};

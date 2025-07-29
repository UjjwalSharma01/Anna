const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwtUtils');

// API: User Registration
const apiSignup = async (req, res) => {
  try {
    console.log('Signup request body:', req.body);
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      console.log('Validation failed:', { name: !!name, email: !!email, password: !!password });
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log('Password hashed successfully');

    // Create new user - using username instead of name
    const newUser = new User({
      username: name, // Map name to username for User model
      email,
      password: hashedPassword
    });

    await newUser.save();
    console.log('New user saved:', newUser._id);

    // Generate JWT token
    const token = generateToken(newUser._id);

    // Return success response
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: newUser._id,
        name: newUser.username, // Map username back to name for frontend
        email: newUser.email
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
};

// API: User Login
const apiLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Debug: Log user fields to understand the structure
    console.log('User fields:', Object.keys(user.toObject()));
    console.log('Has password:', !!user.password);
    console.log('Has hash:', !!user.hash);

    // Check password - handle both our API users and passport-local-mongoose users
    let isPasswordValid = false;
    
    if (user.password) {
      // User has a direct password field (created via our API)
      console.log('Using password field');
      isPasswordValid = await bcrypt.compare(password, user.password);
    } else if (user.hash) {
      // User created with passport-local-mongoose
      console.log('Using hash field');
      isPasswordValid = await bcrypt.compare(password, user.hash);
    } else {
      // No password method available
      console.log('No password field found');
      return res.status(401).json({
        success: false,
        message: 'Account needs password reset. Please contact support.'
      });
    }
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    // Return success response
    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.username, // Map username to name for frontend
        email: user.email
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

// API: User Logout
const apiLogout = async (req, res) => {
  try {
    // With JWT, logout is mainly handled on client side
    // But we can add token blacklisting here if needed
    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during logout'
    });
  }
};

// API: Get User Profile
const apiGetProfile = async (req, res) => {
  try {
    // User is already available from authenticateToken middleware
    res.status(200).json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.username, // Map username to name for frontend
        email: req.user.email
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting profile'
    });
  }
};

// API: Update User Profile
const apiUpdateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const userId = req.user._id;

    // Validation
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name and email are required'
      });
    }

    // Check if email is already taken by another user
    const existingUser = await User.findOne({ 
      email, 
      _id: { $ne: userId } 
    });
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email is already taken'
      });
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email },
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating profile'
    });
  }
};

module.exports = {
  apiSignup,
  apiLogin,
  apiLogout,
  apiGetProfile,
  apiUpdateProfile
};

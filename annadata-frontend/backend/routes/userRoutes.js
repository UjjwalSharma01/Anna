const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// All routes in this file require authentication
router.use(protect);

// @route   GET /api/users/profile
router.get('/profile', getUserProfile);

// @route   PUT /api/users/profile
router.put('/profile', updateUserProfile);

module.exports = router;

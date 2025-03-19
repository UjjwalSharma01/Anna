const express = require('express');
const router = express.Router();
const { 
  getSchemes, 
  getSchemeById,
  createScheme,
  updateScheme,
  deleteScheme,
  applyForScheme
} = require('../controllers/schemeController');
const { protect } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/adminMiddleware');

// Public routes
// @route   GET /api/schemes
router.get('/', getSchemes);

// @route   GET /api/schemes/:id
router.get('/:id', getSchemeById);

// Protected routes
// @route   POST /api/schemes/:id/apply
router.post('/:id/apply', protect, applyForScheme);

// Admin routes
// @route   POST /api/schemes
router.post('/', protect, isAdmin, createScheme);

// @route   PUT /api/schemes/:id
router.put('/:id', protect, isAdmin, updateScheme);

// @route   DELETE /api/schemes/:id
router.delete('/:id', protect, isAdmin, deleteScheme);

module.exports = router;

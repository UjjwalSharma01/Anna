const express = require('express');
const router = express.Router();
const { 
  getUserCrops, 
  getCropById, 
  createCrop, 
  updateCrop,
  addExpense, 
  deleteCrop 
} = require('../controllers/cropController');
const { protect } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(protect);

// @route   GET /api/crops
router.get('/', getUserCrops);

// @route   GET /api/crops/:id
router.get('/:id', getCropById);

// @route   POST /api/crops
router.post('/', createCrop);

// @route   PUT /api/crops/:id
router.put('/:id', updateCrop);

// @route   POST /api/crops/:id/expenses
router.post('/:id/expenses', addExpense);

// @route   DELETE /api/crops/:id
router.delete('/:id', deleteCrop);

module.exports = router;

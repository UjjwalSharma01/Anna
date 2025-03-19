const express = require('express');
const router = express.Router();
const { getWeatherForecast, getWeatherAdvice } = require('../controllers/weatherController');
const { protect } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(protect);

// @route   GET /api/weather
router.get('/', getWeatherForecast);

// @route   GET /api/weather/advice
router.get('/advice', getWeatherAdvice);

module.exports = router;

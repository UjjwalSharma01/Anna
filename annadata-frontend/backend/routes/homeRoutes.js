const express = require('express');
const router = express.Router();
const { getHomeData } = require('../controllers/homeController');

// @route   GET /api/home
router.get('/', getHomeData);

module.exports = router;

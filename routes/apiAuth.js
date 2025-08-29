const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
  apiSignup,
  apiLogin,
  apiLogout,
  apiGetProfile,
  apiUpdateProfile,
  apiDeleteProfile
} = require('../controllers/apiUser');

// Public routes (no authentication required)
router.post('/signup', apiSignup);
router.post('/login', apiLogin);

// Protected routes (authentication required)
router.post('/logout', authenticateToken, apiLogout);
router.get('/profile', authenticateToken, apiGetProfile);
router.put('/profile', authenticateToken, apiUpdateProfile);
router.delete('/profile', authenticateToken, apiDeleteProfile);

module.exports = router;

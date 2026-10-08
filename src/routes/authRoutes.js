const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const { validateAuth } = require('../middleware/validator');
const { authenticate } = require('../middleware/auth');

// POST /api/auth/register
router.post('/register', validateAuth, AuthController.register);

// POST /api/auth/login
router.post('/login', validateAuth, AuthController.login);

// GET /api/auth/me (Protected)
router.get('/me', authenticate, AuthController.getProfile);

module.exports = router;

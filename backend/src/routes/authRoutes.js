const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Clean endpoints for the login handshake
router.get('/verify-username/:username', authController.verifyUsername);
router.get('/verify-password', authController.verifyPassword);
router.post('/login', authController.login);

module.exports = router;
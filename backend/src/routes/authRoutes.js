const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Clean endpoints for the login handshake
router.get('/verify-username/:username', authController.verifyUsername);
router.get('/verify-password', authController.verifyPassword);
router.post('/login', authController.login);

// Management and Logs endpoints
router.get('/user-accounts', authController.getAllUserAccounts);
router.post('/user-accounts', authController.createUserAccount);
router.put('/user-accounts/:UserID', authController.updateUserAccount);
router.get('/activity-logs', authController.getAllActivityLogs);
router.get('/system-logs', authController.getAllSystemLogs);

module.exports = router;
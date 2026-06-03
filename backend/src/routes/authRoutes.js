const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken, checkRole } = require('../middleware/authMiddleware');

console.log("Checking Auth Controller Import:", authController);

router.post('/register', authController.register);

// New endpoints for frontend verification steps
router.get('/verify-username/:username', authController.verifyUsername);
router.get('/verify-password', authController.verifyPassword);

router.get('/user/:Username', verifyToken, authController.getUserDetails);
router.put('/user/:UserID', verifyToken, authController.updateUser);

router.get('/user-accounts', verifyToken, checkRole(['admin']), authController.getUserAccounts);
router.put('/user-accounts/:UserID', verifyToken, checkRole(['admin']), authController.updateUserAccount);

router.post('/activity-logs', verifyToken, authController.logActivity);
router.get('/activity-logs', verifyToken, authController.getActivityLogs);

router.post('/system-logs', verifyToken, checkRole(['admin']), authController.createSystemLog);
router.get('/system-logs', verifyToken, checkRole(['admin']), authController.getSystemLogs);

module.exports = router;

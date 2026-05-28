const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken, checkRole } = require('../middleware/authMiddleware');

console.log("Checking Auth Controller Import:", authController);

router.post('/register', authController.register);
router.post('/login', authController.login);

router.post('/user-accounts', verifyToken, checkRole(['admin']), authController.getUserAccounts);
router.get('/user-accounts', verifyToken, checkRole(['admin']), authController.getUserAccounts);

router.post('/activity-logs', verifyToken, authController.logActivity);
router.get('/activity-logs', verifyToken, authController.getActivityLogs);

router.post('/system-logs', verifyToken, checkRole(['admin']), authController.createSystemLog);
router.get('/system-logs', verifyToken, checkRole(['admin']), authController.getSystemLogs);

module.exports = router;

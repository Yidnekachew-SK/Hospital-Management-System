const express = require('express');
const router = express.Router();
const supportController = require('../controllers/supportController');

console.log("Checking Support Controller Import:", supportController);

router.post('/emergencies', supportController.recordEmergency);
router.get('/emergencies', supportController.getEmergencies);

router.post('/visitors', supportController.logVisitor);
router.get('/visitors', supportController.getVisitors);

module.exports = router;

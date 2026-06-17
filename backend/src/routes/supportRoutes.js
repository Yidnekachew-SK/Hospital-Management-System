const express = require('express');
const router = express.Router();
const supportController = require('../controllers/supportController');

// Emergencies
router.post('/emergencies', supportController.recordEmergency);
router.get('/emergencies', supportController.getEmergencies);

// Visitors
router.post('/visitors', supportController.logVisitor);
router.get('/visitors', supportController.getVisitors);
router.get('/visitors/patient/:PatientID', supportController.getVisitorsByPatient);
router.get('/visitors/patient/:PatientID/count', supportController.countVisitorsByPatient);

// Update routes
router.put('/emergencies/:CaseID', supportController.updateEmergency);
router.put('/visitors/:VisitorID', supportController.updateVisitor);

module.exports = router;


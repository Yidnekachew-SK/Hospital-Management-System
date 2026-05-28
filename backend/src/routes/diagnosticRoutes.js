const express = require('express');
const router = express.Router();
const diagnosticController = require('../controllers/diagnosticController');

console.log("Checking Diagnostic Controller Import:", diagnosticController);

router.post('/lab-tests', diagnosticController.createLabTest);
router.get('/lab-tests', diagnosticController.getLabTests);

router.post('/lab-reports', diagnosticController.createLabReport);
router.get('/lab-reports', diagnosticController.getLabReports);

router.post('/surgeries', diagnosticController.createSurgery);
router.get('/surgeries', diagnosticController.getSurgeries);

module.exports = router;

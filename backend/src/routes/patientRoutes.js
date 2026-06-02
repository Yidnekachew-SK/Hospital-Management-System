const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');

// Diagnostic check: This will print to your terminal when the server starts
console.log("Checking Controller Import:", patientController);

router.post('/insurance', patientController.createInsurance);
router.get('/insurance', patientController.getInsurance);

router.post('/', patientController.createPatient);
router.get('/patient', patientController.getPatients);
router.put('/:id', patientController.updatePatient);
router.get('/count', patientController.getPatientCount); 

module.exports = router;

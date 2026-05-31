const express = require('express');
const router = express.Router();
const diagnosticController = require('../controllers/diagnosticController');

console.log("Checking Diagnostic Controller Import:", diagnosticController);

router.post('/lab-tests', diagnosticController.createLabTest);
router.get('/lab-tests', diagnosticController.getLabTests);
router.get('/lab-tests/doctor/:DoctorID', diagnosticController.getLabTestsByDoctor);
router.get('/lab-tests/patient/:PatientID', diagnosticController.getLabTestsByPatient);
router.put('/lab-tests/:TestID', diagnosticController.updateLabTest);
router.delete('/lab-tests/:TestID', diagnosticController.deleteLabTest);

router.post('/lab-reports', diagnosticController.createLabReport);
router.get('/lab-reports', diagnosticController.getLabReports);

router.post('/surgeries', diagnosticController.createSurgery);
router.get('/surgeries', diagnosticController.getSurgeries);
router.put('/surgeries/:SurgeryID', diagnosticController.updateSurgery);

module.exports = router;

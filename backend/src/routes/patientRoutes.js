const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');

router.post('/insurance', patientController.createInsurance);
router.get('/insurance', patientController.getInsurance);
router.put('/insurance/:InsuranceID', patientController.updateInsurance);

router.post('/', patientController.createPatient);
router.get('/', patientController.getPatients);
router.get('/patient', patientController.getPatients);
router.put('/:id', patientController.updatePatient);
router.get('/count', patientController.getPatientCount); 

module.exports = router;

const express = require('express');
const router = express.Router();
const medicalRecordController = require('../controllers/recordController');

// Create new record
router.post('/', medicalRecordController.createRecord);

// Get records by patient ID
router.get('/patient/:patientId', medicalRecordController.getByPatientId);

// Get records by employee ID
router.get('/employee/:employeeId', medicalRecordController.getByEmployeeId);

// Update record
router.put('/:recordId', medicalRecordController.updateRecord);

router.get('/', medicalRecordController.getAllMedicalRecords)

module.exports = router;


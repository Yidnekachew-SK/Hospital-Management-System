const express = require('express');
const router = express.Router();
const pharmacyController = require('../controllers/pharmacyController');

console.log("Checking Pharmacy Controller Import:", pharmacyController);

router.post('/medications', pharmacyController.createMedication);
router.get('/medications', pharmacyController.getMedications);

router.post('/prescriptions', pharmacyController.createPrescription);
router.get('/prescriptions', pharmacyController.getPrescriptions);

router.post('/prescription-items', pharmacyController.createPrescriptionItem);
router.get('/prescription-items', pharmacyController.getPrescriptionItems);

module.exports = router;

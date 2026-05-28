const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

console.log("Checking Appointment Controller Import:", appointmentController);

router.post('/', appointmentController.createAppointment);
router.get('/', appointmentController.getAppointments);

router.post('/admissions', appointmentController.createAdmission);
router.get('/admissions', appointmentController.getAdmissions);

module.exports = router;

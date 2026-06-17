const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

console.log("Checking Appointment Controller Import:", appointmentController);

router.post('/', appointmentController.createAppointment);
router.get('/', appointmentController.getAppointments);

router.post('/admissions', appointmentController.createAdmission);
router.get('/admissions', appointmentController.getAdmissions);
router.put('/admissions/:AdmissionID', appointmentController.updateAdmission);
router.delete('/admissions/:AdmissionID', appointmentController.deleteAdmission);

router.get('/:PatientID', appointmentController.getAppointmentsByPatientID);
router.get('/doctor/:DoctorID', appointmentController.getAppointmentsByDoctorID);
router.put('/:AppointmentID', appointmentController.updateAppointment);
router.delete('/:AppointmentID', appointmentController.deleteAppointment);

module.exports = router;

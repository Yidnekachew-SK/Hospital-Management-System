const appointmentService = require('../services/appointmentService');
const { sendSuccess, sendError } = require('../utils/responseHandler');

exports.createAppointment = async (req, res, next) => {
    try {
        const { PatientID, EmployeeID, AppointmentDate, AppointmentTime, AppointmentStatus } = req.body;

        if (!PatientID || !EmployeeID || !AppointmentDate || !AppointmentTime) {
            return sendError(res, 'PatientID, EmployeeID, AppointmentDate, and AppointmentTime are required', 400);
        }

        const appointmentId = await appointmentService.addAppointment(PatientID, EmployeeID, AppointmentDate, AppointmentTime, AppointmentStatus);
        sendSuccess(res, 'Appointment created successfully', { AppointmentID: appointmentId, PatientID, EmployeeID, AppointmentDate, AppointmentTime, AppointmentStatus }, 201);
    } catch (error) {
        next(error);
    }
};

exports.getAppointments = async (req, res, next) => {
    try {
        const appointments = await appointmentService.getAllAppointments();
        sendSuccess(res, 'Appointments retrieved successfully', { count: appointments.length, appointments }, 200);
    } catch (error) {
        next(error);
    }
};

exports.createAdmission = async (req, res, next) => {
    try {
        const { PatientID, RoomID, AdmissionDate, DischargeDate, PrimaryDiagnosis } = req.body;

        if (!PatientID || !RoomID || !AdmissionDate) {
            return sendError(res, 'PatientID, RoomID, and AdmissionDate are required', 400);
        }

        const admissionId = await appointmentService.addAdmission(PatientID, RoomID, AdmissionDate, DischargeDate, PrimaryDiagnosis);
        sendSuccess(res, 'Admission created successfully', { AdmissionID: admissionId, PatientID, RoomID, AdmissionDate, DischargeDate, PrimaryDiagnosis }, 201);
    } catch (error) {
        next(error);
    }
};

exports.getAdmissions = async (req, res, next) => {
    try {
        const admissions = await appointmentService.getAllAdmissions();
        sendSuccess(res, 'Admissions retrieved successfully', { count: admissions.length, admissions }, 200);
    } catch (error) {
        next(error);
    }
};

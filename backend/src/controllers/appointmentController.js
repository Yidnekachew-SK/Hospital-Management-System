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

exports.getAppointmentsByPatientID = async (req, res, next) => {
    try {
        const { PatientID } = req.params;

        if (!PatientID) {
            return sendError(res, 'PatientID is required', 400);
        }

        const appointments = await appointmentService.getAppointmentsByPatientID(PatientID);
        sendSuccess(res, 'Appointments retrieved successfully', { count: appointments.length, appointments }, 200);
    } catch (error) {
        next(error);
    }
};

exports.getAppointmentsByDoctorID = async (req, res, next) => {
    try {
        const { DoctorID } = req.params;

        if (!DoctorID) {
            return sendError(res, 'DoctorID is required', 400);
        }

        const appointments = await appointmentService.getAppointmentsByDoctorID(DoctorID);
        sendSuccess(res, 'Appointments retrieved successfully', { count: appointments.length, appointments }, 200);
    } catch (error) {
        next(error);
    }
};

exports.updateAppointment = async (req, res, next) => {
    try {
        const { AppointmentID } = req.params;
        const { AppointmentDate, AppointmentTime, AppointmentStatus } = req.body;

        if (!AppointmentID || !AppointmentDate || !AppointmentTime) {
            return sendError(res, 'AppointmentID, AppointmentDate, and AppointmentTime are required', 400);
        }

        const updated = await appointmentService.updateAppointment(AppointmentID, AppointmentDate, AppointmentTime, AppointmentStatus);
        if (!updated) {
            return sendError(res, 'Appointment not found or update failed', 404);
        }

        sendSuccess(res, 'Appointment updated successfully', { AppointmentID, AppointmentDate, AppointmentTime, AppointmentStatus }, 200);
    } catch (error) {
        next(error);
    }
};

exports.deleteAppointment = async (req, res, next) => {
    try {
        const { AppointmentID } = req.params;

        if (!AppointmentID) {
            return sendError(res, 'AppointmentID is required', 400);
        }

        const deleted = await appointmentService.deleteAppointment(AppointmentID);
        if (!deleted) {
            return sendError(res, 'Appointment not found or deletion failed', 404);
        }

        sendSuccess(res, 'Appointment deleted successfully', { AppointmentID }, 200);
    } catch (error) {
        next(error);
    }
};

exports.updateAdmission = async (req, res, next) => {
    try {
        const { AdmissionID } = req.params;
        const {  RoomID, AdmissionDate, DischargeDate, PrimaryDiagnosis } = req.body;

        if (!AdmissionID) {
            return sendError(res, 'AdmissionID is required', 400);
        }

        const updated = await appointmentService.updateAdmission(AdmissionID, RoomID, AdmissionDate, DischargeDate, PrimaryDiagnosis);
        if (!updated) {
            return sendError(res, 'Admission not found or update failed', 404);
        }

        sendSuccess(res, 'Admission updated successfully', { AdmissionID, RoomID, AdmissionDate, DischargeDate, PrimaryDiagnosis }, 200);
    } catch (error) {
        next(error);
    }
};

exports.deleteAdmission = async (req, res, next) => {
    try {
        const { AdmissionID } = req.params;

        if (!AdmissionID) {
            return sendError(res, 'AdmissionID is required', 400);
        }

        const deleted = await appointmentService.deleteAdmission(AdmissionID);
        if (!deleted) {
            return sendError(res, 'Admission not found or deletion failed', 404);
        }

        sendSuccess(res, 'Admission deleted successfully', { AdmissionID }, 200);
    } catch (error) {
        next(error);
    }
};

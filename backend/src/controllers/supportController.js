const supportService = require('../services/supportService');
const { sendSuccess, sendError } = require('../utils/responseHandler');

exports.recordEmergency = async (req, res, next) => {
    try {
        const { PatientID, EmployeeID, AdmissionID, AdmissionTime, SeverityLevel, Outcome } = req.body;

        if (!PatientID || !EmployeeID || !AdmissionTime || !SeverityLevel) {
            return sendError(res, 'PatientID, EmployeeID, AdmissionTime, and SeverityLevel are required', 400);
        }

        const caseId = await supportService.addEmergencyCase(PatientID, EmployeeID, AdmissionID, AdmissionTime, SeverityLevel, Outcome);
        sendSuccess(res, 'Emergency case recorded successfully', { CaseID: caseId, PatientID, EmployeeID, AdmissionID, AdmissionTime, SeverityLevel, Outcome }, 201);
    } catch (error) {
        next(error);
    }
};

exports.getEmergencies = async (req, res, next) => {
    try {
        const emergencies = await supportService.getAllEmergencyCases();
        sendSuccess(res, 'Emergency cases retrieved successfully', { count: emergencies.length, emergencies }, 200);
    } catch (error) {
        next(error);
    }
};

exports.logVisitor = async (req, res, next) => {
    try {
        const { PatientID, VisitorName, RelationToPatient, VisitDate } = req.body;

        if (!PatientID || !VisitorName || !VisitDate) {
            return sendError(res, 'PatientID, VisitorName, and VisitDate are required', 400);
        }

        const visitorId = await supportService.addVisitor(PatientID, VisitorName, RelationToPatient, VisitDate);
        sendSuccess(res, 'Visitor logged successfully', { VisitorID: visitorId, PatientID, VisitorName, RelationToPatient, VisitDate }, 201);
    } catch (error) {
        next(error);
    }
};

exports.getVisitors = async (req, res, next) => {
    try {
        const visitors = await supportService.getAllVisitors();
        sendSuccess(res, 'Visitors retrieved successfully', { count: visitors.length, visitors }, 200);
    } catch (error) {
        next(error);
    }
};

// GET /visitors/patient/:PatientID
exports.getVisitorsByPatient = async (req, res, next) => {
    try {
        const { PatientID } = req.params;

        if (!PatientID) {
            return sendError(res, 'PatientID is required', 400);
        }

        const visitors = await supportService.getVisitorsByPatient(PatientID);
        sendSuccess(res, 'Visitors retrieved successfully', { count: visitors.length, visitors }, 200);
    } catch (error) {
        next(error);
    }
};

// GET /visitors/patient/:PatientID/count
exports.countVisitorsByPatient = async (req, res, next) => {
    try {
        const { PatientID } = req.params;

        if (!PatientID) {
            return sendError(res, 'PatientID is required', 400);
        }

        const visitorCount = await supportService.countVisitorsByPatient(PatientID);
        sendSuccess(res, 'Visitor count retrieved successfully', { PatientID, VisitorCount: visitorCount }, 200);
    } catch (error) {
        next(error);
    }
};

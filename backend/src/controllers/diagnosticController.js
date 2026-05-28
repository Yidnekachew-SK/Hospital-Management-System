const diagnosticService = require('../services/diagnosticService');
const { sendSuccess, sendError } = require('../utils/responseHandler');

exports.createLabTest = async (req, res, next) => {
    try {
        const { PatientID, EmployeeID, TestType, RequestDate } = req.body;

        if (!PatientID || !EmployeeID || !TestType || !RequestDate) {
            return sendError(res, 'PatientID, EmployeeID, TestType, and RequestDate are required', 400);
        }

        const testId = await diagnosticService.addLabTest(PatientID, EmployeeID, TestType, RequestDate);
        sendSuccess(res, 'Lab test created successfully', { TestID: testId, PatientID, EmployeeID, TestType, RequestDate }, 201);
    } catch (error) {
        next(error);
    }
};

exports.getLabTests = async (req, res, next) => {
    try {
        const labTests = await diagnosticService.getAllLabTests();
        sendSuccess(res, 'Lab tests retrieved successfully', { count: labTests.length, labTests }, 200);
    } catch (error) {
        next(error);
    }
};

exports.createLabReport = async (req, res, next) => {
    try {
        const { TestID, ResultSummary, ReportDate, PathologistComments } = req.body;

        if (!TestID || !ResultSummary || !ReportDate) {
            return sendError(res, 'TestID, ResultSummary, and ReportDate are required', 400);
        }

        const reportId = await diagnosticService.addLabReport(TestID, ResultSummary, ReportDate, PathologistComments);
        sendSuccess(res, 'Lab report created successfully', { ReportID: reportId, TestID, ResultSummary, ReportDate, PathologistComments }, 201);
    } catch (error) {
        next(error);
    }
};

exports.getLabReports = async (req, res, next) => {
    try {
        const labReports = await diagnosticService.getAllLabReports();
        sendSuccess(res, 'Lab reports retrieved successfully', { count: labReports.length, labReports }, 200);
    } catch (error) {
        next(error);
    }
};

exports.createSurgery = async (req, res, next) => {
    try {
        const { PatientID, EmployeeID, RoomID, SurgeryDate, SurgeryType, Outcome } = req.body;

        if (!PatientID || !EmployeeID || !RoomID || !SurgeryDate || !SurgeryType) {
            return sendError(res, 'PatientID, EmployeeID, RoomID, SurgeryDate, and SurgeryType are required', 400);
        }

        const surgeryId = await diagnosticService.addSurgery(PatientID, EmployeeID, RoomID, SurgeryDate, SurgeryType, Outcome);
        sendSuccess(res, 'Surgery scheduled successfully', { SurgeryID: surgeryId, PatientID, EmployeeID, RoomID, SurgeryDate, SurgeryType, Outcome }, 201);
    } catch (error) {
        next(error);
    }
};

exports.getSurgeries = async (req, res, next) => {
    try {
        const surgeries = await diagnosticService.getAllSurgeries();
        sendSuccess(res, 'Surgeries retrieved successfully', { count: surgeries.length, surgeries }, 200);
    } catch (error) {
        next(error);
    }
};

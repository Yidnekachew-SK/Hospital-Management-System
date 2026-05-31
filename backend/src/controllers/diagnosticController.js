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

exports.getLabTestsByDoctor = async (req, res, next) => {
    try {
        const { DoctorID } = req.params;

        if (!DoctorID) {
            return sendError(res, 'DoctorID is required', 400);
        }

        const labTests = await diagnosticService.getLabTestsByDoctor(DoctorID);
        sendSuccess(res, 'Lab tests retrieved successfully', { count: labTests.length, labTests }, 200);
    } catch (error) {
        next(error);
    }
};

exports.getLabTestsByPatient = async (req, res, next) => {
    try {
        const { PatientID } = req.params;

        if (!PatientID) {
            return sendError(res, 'PatientID is required', 400);
        }

        const labTests = await diagnosticService.getLabTestsByPatient(PatientID);
        sendSuccess(res, 'Lab tests retrieved successfully', { count: labTests.length, labTests }, 200);
    } catch (error) {
        next(error);
    }
};

exports.updateLabTest = async (req, res, next) => {
    try {
        const { TestID } = req.params;
        const { PatientID, EmployeeID, TestType, RequestDate } = req.body;

        if (!TestID || !PatientID || !EmployeeID || !TestType || !RequestDate) {
            return sendError(res, 'All fields are required', 400);
        }

        const updated = await diagnosticService.updateLabTest(TestID, PatientID, EmployeeID, TestType, RequestDate);
        if (!updated) {
            return sendError(res, 'Lab test not found or update failed', 404);
        }

        sendSuccess(res, 'Lab test updated successfully', { TestID, PatientID, EmployeeID, TestType, RequestDate }, 200);
    } catch (error) {
        next(error);
    }
};

exports.deleteLabTest = async (req, res, next) => {
    try {
        const { TestID } = req.params;

        if (!TestID) {
            return sendError(res, 'TestID is required', 400);
        }

        const deleted = await diagnosticService.deleteLabTest(TestID);
        if (!deleted) {
            return sendError(res, 'Lab test not found or deletion failed', 404);
        }

        sendSuccess(res, 'Lab test deleted successfully', { TestID }, 200);
    } catch (error) {
        next(error);
    }
};

exports.updateSurgery = async (req, res, next) => {
    try {
        const { SurgeryID } = req.params;
        const { PatientID, EmployeeID, RoomID, SurgeryDate, SurgeryType, Outcome } = req.body;

        if (!SurgeryID || !PatientID || !EmployeeID || !RoomID || !SurgeryDate || !SurgeryType) {
            return sendError(res, 'All required fields must be provided', 400);
        }

        const updated = await diagnosticService.updateSurgery(SurgeryID, PatientID, EmployeeID, RoomID, SurgeryDate, SurgeryType, Outcome);
        if (!updated) {
            return sendError(res, 'Surgery not found or update failed', 404);
        }

        sendSuccess(res, 'Surgery updated successfully', { SurgeryID, PatientID, EmployeeID, RoomID, SurgeryDate, SurgeryType, Outcome }, 200);
    } catch (error) {
        next(error);
    }
};

exports.getLabReportByTestID = async (req, res, next) => {
    try {
        const { TestID } = req.params;

        if (!TestID) {
            return sendError(res, 'TestID is required', 400);
        }

        const labReport = await diagnosticService.getLabReportByTestID(TestID);
        if (!labReport) {
            return sendError(res, 'Lab report not found', 404);
        }

        sendSuccess(res, 'Lab report retrieved successfully', labReport, 200);
    } catch (error) {
        next(error);
    }
};

exports.getSurgeriesByPatient = async (req, res, next) => {
    try {
        const { PatientID } = req.params;

        if (!PatientID) {
            return sendError(res, 'PatientID is required', 400);
        }

        const surgeries = await diagnosticService.getSurgeriesByPatient(PatientID);
        sendSuccess(res, 'Surgeries retrieved successfully', { count: surgeries.length, surgeries }, 200);
    } catch (error) {
        next(error);
    }
};

exports.getSurgeriesByDoctor = async (req, res, next) => {
    try {
        const { EmployeeID } = req.params;

        if (!EmployeeID) {
            return sendError(res, 'EmployeeID is required', 400);
        }

        const surgeries = await diagnosticService.getSurgeriesByDoctor(EmployeeID);
        sendSuccess(res, 'Surgeries retrieved successfully', { count: surgeries.length, surgeries }, 200);
    } catch (error) {
        next(error);
    }
};

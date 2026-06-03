const recordService = require('../services/recordService');
const { sendSuccess, sendError } = require('../utils/responseHandler');

// Create new record
exports.createRecord = async (req, res, next) => {
  try {
    const { PatientID, EmployeeID, RecordDate, ClinicalNotes, FinalDiagnosis } = req.body;

    if (!PatientID || !EmployeeID || !RecordDate) {
      return sendError(res, 'PatientID, EmployeeID, and RecordDate are required', 400);
    }

    const recordId = await medicalRecordService.addMedicalRecord(PatientID, EmployeeID, RecordDate, ClinicalNotes, FinalDiagnosis);
    sendSuccess(res, 'Medical record created successfully', { RecordID: recordId }, 201);
  } catch (error) {
    next(error);
  }
};

// Get records by patient ID
exports.getByPatientId = async (req, res, next) => {
  try {
    const { patientId } = req.params;
    const records = await medicalRecordService.getRecordsByPatientId(patientId);
    sendSuccess(res, 'Records retrieved successfully', { count: records.length, records }, 200);
  } catch (error) {
    next(error);
  }
};

// Get records by employee ID
exports.getByEmployeeId = async (req, res, next) => {
  try {
    const { employeeId } = req.params;
    const records = await medicalRecordService.getRecordsByEmployeeId(employeeId);
    sendSuccess(res, 'Records retrieved successfully', { count: records.length, records }, 200);
  } catch (error) {
    next(error);
  }
};

// Update record
exports.updateRecord = async (req, res, next) => {
  try {
    const { recordId } = req.params;
    const { ClinicalNotes, FinalDiagnosis } = req.body;

    const updated = await medicalRecordService.updateMedicalRecord(recordId, ClinicalNotes, FinalDiagnosis);
    if (!updated) return sendError(res, 'Record not found or not updated', 404);

    sendSuccess(res, 'Medical record updated successfully', { RecordID: recordId }, 200);
  } catch (error) {
    next(error);
  }
};

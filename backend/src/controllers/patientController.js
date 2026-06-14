const patientService = require('../services/patientService');
const { sendSuccess, sendError } = require('../utils/responseHandler');

exports.createInsurance = async (req, res, next) => {
    try {
        const { ProviderName, PolicyNumber, CoverageDetails } = req.body;

        if (!ProviderName || !PolicyNumber) {
            return sendError(res, 'ProviderName and PolicyNumber are required', 400);
        }

        const insuranceId = await patientService.addInsurance(ProviderName, PolicyNumber, CoverageDetails);
        sendSuccess(res, 'Insurance created successfully', { InsuranceID: insuranceId, ProviderName, PolicyNumber, CoverageDetails }, 201);
    } catch (error) {
        next(error);
    }
};

exports.getInsurance = async (req, res, next) => {
    try {
        const insuranceRecords = await patientService.getAllInsurance();
        sendSuccess(res, 'Insurance records retrieved successfully', { count: insuranceRecords.length, insuranceRecords }, 200);
    } catch (error) {
        next(error);
    }
};

exports.createPatient = async (req, res, next) => {
    try {
        const { PatientID, NationalID, PatientName, DOB_DATE, Gender, Region, City, HouseNumber, Phone, InsuranceID } = req.body;

        if (!PatientID || !PatientName || !DOB_DATE || !Gender || !Phone) {
            return sendError(res, 'PatientID, PatientName, DOB_DATE, Gender, and Phone are required', 400);
        }

        const result = await patientService.addPatient(PatientID, NationalID, PatientName, DOB_DATE, Gender, Region, City, HouseNumber, Phone, InsuranceID);
        sendSuccess(res, 'Patient created successfully', { PatientID, NationalID, PatientName, DOB_DATE, Gender, Region, City, HouseNumber, Phone, InsuranceID }, 201);
    } catch (error) {
        next(error);
    }
};

exports.getPatients = async (req, res, next) => {
    try {
        const patients = await patientService.getAllPatients();
        sendSuccess(res, 'Patients retrieved successfully', { count: patients.length, patients }, 200);
    } catch (error) {
        next(error);
    }
};

exports.updatePatient = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { PatientName, DOB_DATE, Gender, Region, City, HouseNumber, Phone, InsuranceID } = req.body;

    const updated = await patientService.updatePatient(id, PatientName, DOB_DATE, Gender, Region, City, HouseNumber, Phone, InsuranceID);
    if (!updated) return sendError(res, 'Patient not found or not updated', 404);

    sendSuccess(res, 'Patient updated successfully', { PatientID: id }, 200);
  } catch (error) {
    next(error);
  }
};

exports.getPatientCount = async (req, res, next) => {
  try {
    const count = await patientService.getPatientCount();
    sendSuccess(res, 'Patient count retrieved successfully', { total: count }, 200);
  } catch (error) {
    next(error);
  }
};

exports.updateInsurance = async (req, res, next) => {
    try {
        const { InsuranceID } = req.params;
        const { ProviderName, PolicyNumber, CoverageDetails } = req.body;

        if (!InsuranceID || !ProviderName || !PolicyNumber) {
            return sendError(res, 'InsuranceID, ProviderName, and PolicyNumber are required', 400);
        }

        const updated = await patientService.updateInsurance(InsuranceID, ProviderName, PolicyNumber, CoverageDetails);
        if (!updated) {
            return sendError(res, 'Insurance record not found or update failed', 404);
        }

        sendSuccess(res, 'Insurance record updated successfully', { InsuranceID, ProviderName, PolicyNumber, CoverageDetails }, 200);
    } catch (error) {
        next(error);
    }
};

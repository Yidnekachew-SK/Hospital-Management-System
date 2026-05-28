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

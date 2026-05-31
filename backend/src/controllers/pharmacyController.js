const pharmacyService = require('../services/pharmacyService');
const { sendSuccess, sendError } = require('../utils/responseHandler');

exports.createMedication = async (req, res, next) => {
    try {
        const { MedicationName, MedicationType, StockQuantity, UnitPrice } = req.body;

        if (!MedicationName || !MedicationType || StockQuantity === undefined || !UnitPrice) {
            return sendError(res, 'MedicationName, MedicationType, StockQuantity, and UnitPrice are required', 400);
        }

        const medicationId = await pharmacyService.addMedication(MedicationName, MedicationType, StockQuantity, UnitPrice);
        sendSuccess(res, 'Medication created successfully', { MedicationID: medicationId, MedicationName, MedicationType, StockQuantity, UnitPrice }, 201);
    } catch (error) {
        next(error);
    }
};

exports.getMedications = async (req, res, next) => {
    try {
        const medications = await pharmacyService.getAllMedications();
        sendSuccess(res, 'Medications retrieved successfully', { count: medications.length, medications }, 200);
    } catch (error) {
        next(error);
    }
};

exports.createPrescription = async (req, res, next) => {
    try {
        const { PatientID, EmployeeID, DateIssued } = req.body;

        if (!PatientID || !EmployeeID || !DateIssued) {
            return sendError(res, 'PatientID, EmployeeID, and DateIssued are required', 400);
        }

        const prescriptionId = await pharmacyService.addPrescription(PatientID, EmployeeID, DateIssued);
        sendSuccess(res, 'Prescription created successfully', { PrescriptionID: prescriptionId, PatientID, EmployeeID, DateIssued }, 201);
    } catch (error) {
        next(error);
    }
};

exports.getPrescriptions = async (req, res, next) => {
    try {
        const prescriptions = await pharmacyService.getAllPrescriptions();
        sendSuccess(res, 'Prescriptions retrieved successfully', { count: prescriptions.length, prescriptions }, 200);
    } catch (error) {
        next(error);
    }
};

// GET /prescriptions/patient/:PatientID
exports.getPrescriptionsByPatient = async (req, res, next) => {
    try {
        const { PatientID } = req.params;

        if (!PatientID) {
            return sendError(res, 'PatientID is required', 400);
        }

        const prescriptions = await pharmacyService.getPrescriptionsByPatient(PatientID);
        sendSuccess(res, 'Prescriptions retrieved successfully', { count: prescriptions.length, prescriptions }, 200);
    } catch (error) {
        next(error);
    }
};

exports.createPrescriptionItem = async (req, res, next) => {
    try {
        const { PrescriptionID, MedicationID, Dosage, Duration, Frequency } = req.body;

        if (!PrescriptionID || !MedicationID || !Dosage || !Duration || !Frequency) {
            return sendError(res, 'PrescriptionID, MedicationID, Dosage, Duration, and Frequency are required', 400);
        }

        const itemId = await pharmacyService.addPrescriptionItem(PrescriptionID, MedicationID, Dosage, Duration, Frequency);
        sendSuccess(res, 'Prescription item added successfully', { ItemID: itemId, PrescriptionID, MedicationID, Dosage, Duration, Frequency }, 201);
    } catch (error) {
        if (error.message === 'Medication not found') {
            return sendError(res, 'MedicationID does not exist', 400);
        }
        if (error.message === 'Insufficient stock for medication') {
            return sendError(res, 'Insufficient stock for this medication', 400);
        }
        next(error);
    }
};

exports.getPrescriptionItems = async (req, res, next) => {
    try {
        const prescriptionItems = await pharmacyService.getAllPrescriptionItems();
        sendSuccess(res, 'Prescription items retrieved successfully', { count: prescriptionItems.length, prescriptionItems }, 200);
    } catch (error) {
        next(error);
    }
};

// PUT /prescription-items/:ItemID
exports.updatePrescriptionItem = async (req, res, next) => {
    try {
        const { ItemID } = req.params;
        const { Dosage, Duration, Frequency } = req.body;

        if (!ItemID || !Dosage || !Duration || !Frequency) {
            return sendError(res, 'ItemID, Dosage, Duration, and Frequency are required', 400);
        }

        const updated = await pharmacyService.updatePrescriptionItem(ItemID, Dosage, Duration, Frequency);
        if (!updated) {
            return sendError(res, 'Prescription item not found or update failed', 404);
        }

        sendSuccess(res, 'Prescription item updated successfully', { ItemID, Dosage, Duration, Frequency }, 200);
    } catch (error) {
        next(error);
    }
};

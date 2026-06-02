const db = require('../config/db');

// 1. Logic to save a new medication to the DB
exports.addMedication = async (medicationName, medicationType, stockQuantity, unitPrice) => {
    const sql = "INSERT INTO Medications (MedicationName, MedicationType, StockQuantity, UnitPrice) VALUES (?, ?, ?, ?)";
    const [result] = await db.execute(sql, [medicationName, medicationType, stockQuantity, unitPrice]);
    return result.insertId;
};

// 2. Logic to get all medications
exports.getAllMedications = async () => {
    const [rows] = await db.execute("SELECT * FROM Medications");
    return rows;
};

// 3. Logic to save a new prescription to the DB
exports.addPrescription = async (patientID, employeeID, dateIssued) => {
    const sql = "INSERT INTO Prescriptions (PatientID, EmployeeID, DateIssued) VALUES (?, ?, ?)";
    const [result] = await db.execute(sql, [patientID, employeeID, dateIssued]);
    return result.insertId;
};

// 4. Logic to get all prescriptions
exports.getAllPrescriptions = async () => {
    const [rows] = await db.execute("SELECT * FROM Prescriptions");
    return rows;
};

// 5. Logic to save a new prescription item with stock check
exports.addPrescriptionItem = async (prescriptionID, medicationID, dosage, duration, frequency) => {
    // Check if medication exists and has enough stock
    const [medication] = await db.execute("SELECT StockQuantity FROM Medications WHERE MedicationID = ?", [medicationID]);
    
    if (medication.length === 0) {
        throw new Error('Medication not found');
    }

    if (medication[0].StockQuantity <= 0) {
        throw new Error('Insufficient stock for medication');
    }

    const sql = "INSERT INTO PrescriptionItems (PrescriptionID, MedicationID, Dosage, Duration, Frequency) VALUES (?, ?, ?, ?, ?)";
    const [result] = await db.execute(sql, [prescriptionID, medicationID, dosage, duration, frequency]);
    return result.insertId;
};

// 6. Logic to get all prescription items
exports.getAllPrescriptionItems = async () => {
    const [rows] = await db.execute("SELECT * FROM PrescriptionItems");
    return rows;
};

const db = require('../config/db');

// 1. Logic to save a new insurance to the DB
exports.addInsurance = async (providerName, policyNumber, coverageDetails) => {
    const sql = "INSERT INTO Insurance (ProviderName, PolicyNumber, CoverageDetails) VALUES (?, ?, ?)";
    const [result] = await db.execute(sql, [providerName, policyNumber, coverageDetails]);
    return result.insertId;
};

// 2. Logic to get all insurance records
exports.getAllInsurance = async () => {
    const [rows] = await db.execute("SELECT * FROM Insurance");
    return rows;
};

// 3. Logic to save a new patient to the DB
exports.addPatient = async (patientID, nationalID, patientName, dobDate, gender, region, city, houseNumber, phone, insuranceID) => {
    const sql = "INSERT INTO Patients (PatientID, NationalID, PatientName, DOB_DATE, Gender, Region, City, HouseNumber, Phone, InsuranceID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const [result] = await db.execute(sql, [patientID, nationalID, patientName, dobDate, gender, region, city, houseNumber, phone, insuranceID]);
    return result.insertId;
};

// 4. Logic to get all patients
exports.getAllPatients = async () => {
    const [rows] = await db.execute("SELECT * FROM Patients");
    return rows;
};

// 5. Logic to update patient details
exports.updatePatient = async (patientID, patientName, dobDate, gender, region, city, houseNumber, phone, insuranceID) => {
    const sql = "UPDATE Patients SET PatientName = ?, DOB_DATE = ?, Gender = ?, Region = ?, City = ?, HouseNumber = ?, Phone = ?, InsuranceID = ? WHERE PatientID = ?";
    const [result] = await db.execute(sql, [patientName, dobDate, gender, region, city, houseNumber, phone, insuranceID, patientID]);
    return result.affectedRows > 0;
};

// 6. Logic to get global patient count
exports.getPatientCount = async () => {
    const [rows] = await db.execute("SELECT COUNT(*) AS TotalPatients FROM Patients");
    return rows[0].TotalPatients;
};

// 7. Logic to update insurance details
exports.updateInsurance = async (insuranceID, providerName, policyNumber, coverageDetails) => {
    const sql = "UPDATE Insurance SET ProviderName = ?, PolicyNumber = ?, CoverageDetails = ? WHERE InsuranceID = ?";
    const [result] = await db.execute(sql, [providerName, policyNumber, coverageDetails, insuranceID]);
    return result.affectedRows > 0;
};

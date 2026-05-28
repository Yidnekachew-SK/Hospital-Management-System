const db = require('../config/db');

// 1. Logic to save a new lab test to the DB
exports.addLabTest = async (patientID, employeeID, testType, requestDate) => {
    const sql = "INSERT INTO LabTests (PatientID, EmployeeID, TestType, RequestDate) VALUES (?, ?, ?, ?)";
    const [result] = await db.execute(sql, [patientID, employeeID, testType, requestDate]);
    return result.insertId;
};

// 2. Logic to get all lab tests
exports.getAllLabTests = async () => {
    const [rows] = await db.execute("SELECT * FROM LabTests");
    return rows;
};

// 3. Logic to save a new lab report to the DB
exports.addLabReport = async (testID, resultSummary, reportDate, pathologistComments) => {
    const sql = "INSERT INTO LabReports (TestID, ResultSummary, ReportDate, PathologistComments) VALUES (?, ?, ?, ?)";
    const [result] = await db.execute(sql, [testID, resultSummary, reportDate, pathologistComments]);
    return result.insertId;
};

// 4. Logic to get all lab reports
exports.getAllLabReports = async () => {
    const [rows] = await db.execute("SELECT * FROM LabReports");
    return rows;
};

// 5. Logic to save a new surgery to the DB
exports.addSurgery = async (patientID, employeeID, roomID, surgeryDate, surgeryType, outcome) => {
    const sql = "INSERT INTO Surgeries (PatientID, EmployeeID, RoomID, SurgeryDate, SurgeryType, Outcome) VALUES (?, ?, ?, ?, ?, ?)";
    const [result] = await db.execute(sql, [patientID, employeeID, roomID, surgeryDate, surgeryType, outcome]);
    return result.insertId;
};

// 6. Logic to get all surgeries
exports.getAllSurgeries = async () => {
    const [rows] = await db.execute("SELECT * FROM Surgeries");
    return rows;
};

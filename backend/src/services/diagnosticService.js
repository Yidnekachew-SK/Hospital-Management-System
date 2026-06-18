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
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        const sql = "INSERT INTO LabReports (TestID, ResultSummary, ReportDate, PathologistComments) VALUES (?, ?, ?, ?)";
        const [result] = await connection.execute(sql, [testID, resultSummary, reportDate, pathologistComments]);
        
        // NEW CODE ADDED: Update the associated LabTest's Status to 'Done'
        const updateSql = "UPDATE LabTests SET Status = 'Done' WHERE TestID = ?";
        await connection.execute(updateSql, [testID]);
        
        await connection.commit();
        return result.insertId;
    } catch (err) {
        await connection.rollback();
        throw err;
    } finally {
        connection.release();
    }
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

// 7. Logic to get lab tests by doctor ID
exports.getLabTestsByDoctor = async (doctorID) => {
    const sql = "SELECT * FROM LabTests WHERE EmployeeID = ?";
    const [rows] = await db.execute(sql, [doctorID]);
    return rows;
};

// 8. Logic to get lab tests by patient ID
exports.getLabTestsByPatient = async (patientID) => {
    const sql = "SELECT * FROM LabTests WHERE PatientID = ?";
    const [rows] = await db.execute(sql, [patientID]);
    return rows;
};

// 9. Logic to update a lab test
exports.updateLabTest = async (testID, patientID, employeeID, testType, requestDate) => {
    const sql = "UPDATE LabTests SET PatientID = ?, EmployeeID = ?, TestType = ?, RequestDate = ? WHERE TestID = ?";
    const [result] = await db.execute(sql, [patientID, employeeID, testType, requestDate, testID]);
    return result.affectedRows > 0;
};

// 10. Logic to delete a lab test
exports.deleteLabTest = async (testID) => {
    const sql = "DELETE FROM LabTests WHERE TestID = ?";
    const [result] = await db.execute(sql, [testID]);
    return result.affectedRows > 0;
};

// 11. Logic to update a surgery
exports.updateSurgery = async (surgeryID, patientID, employeeID, roomID, surgeryDate, surgeryType, outcome) => {
    const sql = "UPDATE Surgeries SET PatientID = ?, EmployeeID = ?, RoomID = ?, SurgeryDate = ?, SurgeryType = ?, Outcome = ? WHERE SurgeryID = ?";
    const [result] = await db.execute(sql, [patientID, employeeID, roomID, surgeryDate, surgeryType, outcome, surgeryID]);
    return result.affectedRows > 0;
};

// 12. Logic to get lab report by TestID
exports.getLabReportByTestID = async (testID) => {
    const sql = "SELECT * FROM LabReports WHERE TestID = ?";
    const [rows] = await db.execute(sql, [testID]);
    return rows.length > 0 ? rows[0] : null;
};

// 13. Logic to get surgeries by PatientID
exports.getSurgeriesByPatient = async (patientID) => {
    const sql = "SELECT * FROM Surgeries WHERE PatientID = ?";
    const [rows] = await db.execute(sql, [patientID]);
    return rows;
};

// 14. Logic to get surgeries by DoctorID (EmployeeID)
exports.getSurgeriesByDoctor = async (doctorID) => {
    const sql = "SELECT * FROM Surgeries WHERE EmployeeID = ?";
    const [rows] = await db.execute(sql, [doctorID]);
    return rows;
};

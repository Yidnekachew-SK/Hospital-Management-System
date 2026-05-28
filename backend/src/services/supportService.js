const db = require('../config/db');

// 1. Logic to save an emergency case
exports.addEmergencyCase = async (patientID, employeeID, admissionID, admissionTime, severityLevel, outcome) => {
    const sql = "INSERT INTO EmergencyCases (PatientID, EmployeeID, AdmissionID, AdmissionTime, SeverityLevel, Outcome) VALUES (?, ?, ?, ?, ?, ?)";
    const [result] = await db.execute(sql, [patientID, employeeID, admissionID, admissionTime, severityLevel, outcome]);
    return result.insertId;
};

// 2. Logic to get all emergency cases
exports.getAllEmergencyCases = async () => {
    const [rows] = await db.execute("SELECT * FROM EmergencyCases");
    return rows;
};

// 3. Logic to log a visitor
exports.addVisitor = async (patientID, visitorName, relationToPatient, visitDate) => {
    const sql = "INSERT INTO Visitors (PatientID, VisitorName, RelationToPatient, VisitDate) VALUES (?, ?, ?, ?)";
    const [result] = await db.execute(sql, [patientID, visitorName, relationToPatient, visitDate]);
    return result.insertId;
};

// 4. Logic to get all visitors
exports.getAllVisitors = async () => {
    const [rows] = await db.execute("SELECT * FROM Visitors");
    return rows;
};

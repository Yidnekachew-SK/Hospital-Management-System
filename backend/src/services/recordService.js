const db = require('../config/db');

// 1. Add new medical record
exports.addMedicalRecord = async (patientID, employeeID, recordDate, clinicalNotes, finalDiagnosis) => {
  const sql = `
    INSERT INTO MedicalRecords (PatientID, EmployeeID, RecordDate, ClinicalNotes, FinalDiagnosis)
    VALUES (?, ?, ?, ?, ?)
  `;
  const [result] = await db.execute(sql, [patientID, employeeID, recordDate, clinicalNotes, finalDiagnosis]);
  return result.insertId;
};

// 2. Get records by patient ID
exports.getRecordsByPatientId = async (patientID) => {
  const sql = "SELECT * FROM MedicalRecords WHERE PatientID = ?";
  const [rows] = await db.execute(sql, [patientID]);
  return rows;
};

// 3. Get records by employee ID
exports.getRecordsByEmployeeId = async (employeeID) => {
  const sql = "SELECT * FROM MedicalRecords WHERE EmployeeID = ?";
  const [rows] = await db.execute(sql, [employeeID]);
  return rows;
};

// 4. Update medical record
exports.updateMedicalRecord = async (recordID, clinicalNotes, finalDiagnosis) => {
  const sql = `
    UPDATE MedicalRecords
    SET ClinicalNotes = ?, FinalDiagnosis = ?
    WHERE RecordID = ?
  `;
  const [result] = await db.execute(sql, [clinicalNotes, finalDiagnosis, recordID]);
  return result.affectedRows > 0;
};

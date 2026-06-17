const db = require('../config/db');

// 1. Logic to save a new appointment to the DB
exports.addAppointment = async (patientID, employeeID, appointmentDate, appointmentTime, appointmentStatus) => {
    const sql = "INSERT INTO Appointments (PatientID, EmployeeID, AppointmentDate, AppointmentTime, AppointmentStatus) VALUES (?, ?, ?, ?, ?)";
    const [result] = await db.execute(sql, [patientID, employeeID, appointmentDate, appointmentTime, appointmentStatus]);
    return result.insertId;
};

// 2. Logic to get all appointments
exports.getAllAppointments = async () => {
    const [rows] = await db.execute("SELECT * FROM Appointments");
    return rows;
};

// 3. Logic to save a new admission to the DB
exports.addAdmission = async (patientID, roomID, admissionDate, dischargeDate, primaryDiagnosis) => {
    const sql = "INSERT INTO Admissions (PatientID, RoomID, AdmissionDate, DischargeDate, PrimaryDiagnosis) VALUES (?, ?, ?, ?, ?)";
    const [result] = await db.execute(sql, [patientID, roomID, admissionDate, dischargeDate, primaryDiagnosis]);
    return result.insertId;
};

// 4. Logic to get all admissions
exports.getAllAdmissions = async () => {
    const [rows] = await db.execute("SELECT * FROM Admissions");
    return rows;
};

// 5. Logic to get appointments by PatientID
exports.getAppointmentsByPatientID = async (patientID) => {
    const sql = "SELECT * FROM Appointments WHERE PatientID = ?";
    const [rows] = await db.execute(sql, [patientID]);
    return rows;
};

// 6. Logic to get appointments by DoctorID (EmployeeID)
exports.getAppointmentsByDoctorID = async (doctorID) => {
    const sql = "SELECT * FROM Appointments WHERE EmployeeID = ?";
    const [rows] = await db.execute(sql, [doctorID]);
    return rows;
};

// 7. Logic to update an appointment
exports.updateAppointment = async (appointmentID, appointmentDate, appointmentTime, appointmentStatus) => {
    const sql = "UPDATE Appointments SET AppointmentDate = ?, AppointmentTime = ?, AppointmentStatus = ? WHERE AppointmentID = ?";
    const [result] = await db.execute(sql, [appointmentDate, appointmentTime, appointmentStatus, appointmentID]);
    return result.affectedRows > 0;
};

// 8. Logic to delete an appointment
exports.deleteAppointment = async (appointmentID) => {
    const sql = "DELETE FROM Appointments WHERE AppointmentID = ?";
    const [result] = await db.execute(sql, [appointmentID]);
    return result.affectedRows > 0;
};

// 9. Logic to update an admission
exports.updateAdmission = async (admissionID, roomID, admissionDate, dischargeDate, primaryDiagnosis) => {
    const sql = "UPDATE Admissions SET RoomID = ?, AdmissionDate = ?, DischargeDate = ?, PrimaryDiagnosis = ? WHERE AdmissionID = ?";
    const [result] = await db.execute(sql, [roomID, admissionDate, dischargeDate, primaryDiagnosis, admissionID]);
    return result.affectedRows > 0;
};

// 10. Logic to delete an admission
exports.deleteAdmission = async (admissionID) => {
    const sql = "DELETE FROM Admissions WHERE AdmissionID = ?";
    const [result] = await db.execute(sql, [admissionID]);
    return result.affectedRows > 0;
};

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

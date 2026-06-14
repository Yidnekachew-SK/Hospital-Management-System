const db = require('../config/db');

// 1. Logic to save a new department to the DB
exports.addDepartment = async (deptName, building) => {
    const sql = "INSERT INTO Departments (DeptName, Building) VALUES (?, ?)";
    const [result] = await db.execute(sql, [deptName, building]);
    return result.insertId; // Returns the ID of the new department
};

// 2. Logic to get all departments
exports.getAllDepartments = async () => {
    const [rows] = await db.execute("SELECT * FROM Departments");
    return rows;
};

// 3. Logic to save a new employee to the DB
exports.addEmployee = async (employeeID, nationalID, employeeName, gender, phone, email, address, deptID, salary) => {
    const sql = "INSERT INTO Employees (EmployeeID, NationalID, EmployeeName, Gender, Phone, Email, Address, DeptID, Salary) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const [result] = await db.execute(sql, [employeeID, nationalID, employeeName, gender, phone, email, address, deptID, salary]);
    return result.insertId;
};

// 4. Logic to get all employees
exports.getAllEmployees = async () => {
    const [rows] = await db.execute("SELECT * FROM Employees");
    return rows;
};

// 5. Logic to save a new doctor to the DB
exports.addDoctor = async (employeeID, specialty, licenseNumber) => {
    const sql = "INSERT INTO Doctors (EmployeeID, Specialty, LicenseNumber) VALUES (?, ?, ?)";
    const [result] = await db.execute(sql, [employeeID, specialty, licenseNumber]);
    return result.insertId;
};

// 6. Logic to get all doctors
exports.getAllDoctors = async () => {
    const [rows] = await db.execute("SELECT * FROM Doctors");
    return rows;
};

// 7. Logic to save a new nurse to the DB
exports.addNurse = async (employeeID, certification, assignedWard) => {
    const sql = "INSERT INTO Nurses (EmployeeID, Certification, AssignedWard) VALUES (?, ?, ?)";
    const [result] = await db.execute(sql, [employeeID, certification, assignedWard]);
    return result.insertId;
};

// 8. Logic to get all nurses
exports.getAllNurses = async () => {
    const [rows] = await db.execute("SELECT * FROM Nurses");
    return rows;
};

// 9. Logic to save a new staff to the DB
exports.addStaff = async (employeeID, staffRole) => {
    const sql = "INSERT INTO Staff (EmployeeID, StaffRole) VALUES (?, ?)";
    const [result] = await db.execute(sql, [employeeID, staffRole]);
    return result.insertId;
};

// 10. Logic to get all staff
exports.getAllStaff = async () => {
    const [rows] = await db.execute("SELECT * FROM Staff");
    return rows;
};

// 11. Logic to get detailed doctor info with employee details (JOIN)
exports.getDetailedDoctorInfo = async (doctorEmployeeID) => {
    const sql = `
        SELECT 
            e.EmployeeID, 
            e.EmployeeName, 
            e.NationalID, 
            e.Gender, 
            e.Phone, 
            e.Email, 
            e.Address, 
            e.Salary,
            d.Specialty, 
            d.LicenseNumber
        FROM Doctors d
        JOIN Employees e ON d.EmployeeID = e.EmployeeID
        WHERE d.EmployeeID = ?
    `;
    const [rows] = await db.execute(sql, [doctorEmployeeID]);
    return rows.length > 0 ? rows[0] : null;
};

// 12. Logic to get all detailed doctor info (JOIN)
exports.getAllDetailedDoctorInfo = async () => {
    const sql = `
        SELECT 
            e.EmployeeID, 
            e.EmployeeName, 
            e.NationalID, 
            e.Gender, 
            e.Phone, 
            e.Email, 
            e.Address, 
            e.Salary,
            d.Specialty, 
            d.LicenseNumber
        FROM Doctors d
        JOIN Employees e ON d.EmployeeID = e.EmployeeID
    `;
    const [rows] = await db.execute(sql);
    return rows;
};

// 13. Logic to get detailed nurse info with employee details (JOIN)
exports.getDetailedNurseInfo = async (nurseEmployeeID) => {
    const sql = `
        SELECT 
            e.EmployeeID, 
            e.EmployeeName, 
            e.NationalID, 
            e.Gender, 
            e.Phone, 
            e.Email, 
            e.Address, 
            e.Salary,
            n.Certification, 
            n.AssignedWard
        FROM Nurses n
        JOIN Employees e ON n.EmployeeID = e.EmployeeID
        WHERE n.EmployeeID = ?
    `;
    const [rows] = await db.execute(sql, [nurseEmployeeID]);
    return rows.length > 0 ? rows[0] : null;
};

// 14. Logic to get all detailed nurse info (JOIN)
exports.getAllDetailedNurseInfo = async () => {
    const sql = `
        SELECT 
            e.EmployeeID, 
            e.EmployeeName, 
            e.NationalID, 
            e.Gender, 
            e.Phone, 
            e.Email, 
            e.Address, 
            e.Salary,
            n.Certification, 
            n.AssignedWard
        FROM Nurses n
        JOIN Employees e ON n.EmployeeID = e.EmployeeID
    `;
    const [rows] = await db.execute(sql);
    return rows;
};

// 15. Logic to get detailed staff info with employee details (JOIN)
exports.getDetailedStaffInfo = async (staffEmployeeID) => {
    const sql = `
        SELECT 
            e.EmployeeID, 
            e.EmployeeName, 
            e.NationalID, 
            e.Gender, 
            e.Phone, 
            e.Email, 
            e.Address, 
            e.Salary,
            s.StaffRole
        FROM Staff s
        JOIN Employees e ON s.EmployeeID = e.EmployeeID
        WHERE s.EmployeeID = ?
    `;
    const [rows] = await db.execute(sql, [staffEmployeeID]);
    return rows.length > 0 ? rows[0] : null;
};

// 16. Logic to get all detailed staff info (JOIN)
exports.getAllDetailedStaffInfo = async () => {
    const sql = `
        SELECT 
            e.EmployeeID, 
            e.EmployeeName, 
            e.NationalID, 
            e.Gender, 
            e.Phone, 
            e.Email, 
            e.Address, 
            e.Salary,
            s.StaffRole
        FROM Staff s
        JOIN Employees e ON s.EmployeeID = e.EmployeeID
    `;
    const [rows] = await db.execute(sql);
    return rows;
};

// 17. Logic to get system counts (Employees, Doctors, Nurses, Staff)
exports.getSystemCounts = async () => {
    const sql = `
        SELECT 
            (SELECT COUNT(*) FROM Employees) as TotalEmployees,
            (SELECT COUNT(*) FROM Doctors) as TotalDoctors,
            (SELECT COUNT(*) FROM Nurses) as TotalNurses,
            (SELECT COUNT(*) FROM Staff) as TotalStaff
    `;
    const [rows] = await db.execute(sql);
    return rows[0];
};

// 18. Logic to update an employee
exports.updateEmployee = async (employeeID, employeeName, phone, email, address, salary) => {
    const sql = "UPDATE Employees SET EmployeeName = ?, Phone = ?, Email = ?, Address = ?, Salary = ? WHERE EmployeeID = ?";
    const [result] = await db.execute(sql, [employeeName, phone, email, address, salary, employeeID]);
    return result.affectedRows > 0;
};

// 19. Logic to update a department
exports.updateDepartment = async (deptID, deptName, building) => {
    const sql = "UPDATE Departments SET DeptName = ?, Building = ? WHERE DeptID = ?";
    const [result] = await db.execute(sql, [deptName, building, deptID]);
    return result.affectedRows > 0;
};

// 20. Logic to update a doctor
exports.updateDoctor = async (employeeID, specialty, licenseNumber) => {
    const sql = "UPDATE Doctors SET Specialty = ?, LicenseNumber = ? WHERE EmployeeID = ?";
    const [result] = await db.execute(sql, [specialty, licenseNumber, employeeID]);
    return result.affectedRows > 0;
};

// 21. Logic to update a nurse
exports.updateNurse = async (employeeID, certification, assignedWard) => {
    const sql = "UPDATE Nurses SET Certification = ?, AssignedWard = ? WHERE EmployeeID = ?";
    const [result] = await db.execute(sql, [certification, assignedWard, employeeID]);
    return result.affectedRows > 0;
};

// 22. Logic to update a staff
exports.updateStaff = async (employeeID, staffRole) => {
    const sql = "UPDATE Staff SET StaffRole = ? WHERE EmployeeID = ?";
    const [result] = await db.execute(sql, [staffRole, employeeID]);
    return result.affectedRows > 0;
};
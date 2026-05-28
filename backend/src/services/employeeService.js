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
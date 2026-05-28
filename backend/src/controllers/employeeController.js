const employeeService = require('../services/employeeService');
const { sendSuccess, sendError } = require('../utils/responseHandler');

exports.createDepartment = async (req, res, next) => {
    try {
        const { DeptName, Building } = req.body;

        if (!DeptName || !Building) {
            return sendError(res, 'DeptName and Building are required', 400);
        }

        const departmentId = await employeeService.addDepartment(DeptName, Building);
        sendSuccess(res, 'Department created successfully', { DeptID: departmentId, DeptName, Building }, 201);
    } catch (error) {
        next(error);
    }
};

exports.getDepartments = async (req, res, next) => {
    try {
        const departments = await employeeService.getAllDepartments();
        sendSuccess(res, 'Departments retrieved successfully', { count: departments.length, departments }, 200);
    } catch (error) {
        next(error);
    }
};

exports.createEmployee = async (req, res, next) => {
    try {
        const { EmployeeID, NationalID, EmployeeName, Gender, Phone, Email, Address, DeptID, Salary } = req.body;

        if (!EmployeeID || !NationalID || !EmployeeName || !Gender || !Phone || !Address || !Salary) {
            return sendError(res, 'Required fields are missing', 400);
        }

        const result = await employeeService.addEmployee(EmployeeID, NationalID, EmployeeName, Gender, Phone, Email, Address, DeptID, Salary);
        sendSuccess(res, 'Employee created successfully', { EmployeeID, NationalID, EmployeeName, Gender, Phone, Email, Address, DeptID, Salary }, 201);
    } catch (error) {
        next(error);
    }
};

exports.getEmployees = async (req, res, next) => {
    try {
        const employees = await employeeService.getAllEmployees();
        sendSuccess(res, 'Employees retrieved successfully', { count: employees.length, employees }, 200);
    } catch (error) {
        next(error);
    }
};

exports.createDoctor = async (req, res, next) => {
    try {
        const { EmployeeID, Specialty, LicenseNumber } = req.body;

        if (!EmployeeID || !Specialty || !LicenseNumber) {
            return sendError(res, 'EmployeeID, Specialty, and LicenseNumber are required', 400);
        }

        const result = await employeeService.addDoctor(EmployeeID, Specialty, LicenseNumber);
        sendSuccess(res, 'Doctor registered successfully', { EmployeeID, Specialty, LicenseNumber }, 201);
    } catch (error) {
        next(error);
    }
};
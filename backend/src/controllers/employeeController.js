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

exports.getDoctors = async (req, res, next) => {
    try {
        const doctors = await employeeService.getAllDoctors();
        sendSuccess(res, 'Doctors retrieved successfully', { count: doctors.length, doctors }, 200);
    } catch (error) {
        next(error);
    }
};

exports.createNurse = async (req, res, next) => {
    try {
        const { EmployeeID, Certification, AssignedWard } = req.body;

        if (!EmployeeID || !Certification || !AssignedWard) {
            return sendError(res, 'EmployeeID, Certification, and AssignedWard are required', 400);
        }

        const result = await employeeService.addNurse(EmployeeID, Certification, AssignedWard);
        sendSuccess(res, 'Nurse registered successfully', { EmployeeID, Certification, AssignedWard }, 201);
    } catch (error) {
        next(error);
    }
};

exports.getNurses = async (req, res, next) => {
    try {
        const nurses = await employeeService.getAllNurses();
        sendSuccess(res, 'Nurses retrieved successfully', { count: nurses.length, nurses }, 200);
    } catch (error) {
        next(error);
    }
};

exports.createStaff = async (req, res, next) => {
    try {
        const { EmployeeID, StaffRole } = req.body;

        if (!EmployeeID || !StaffRole) {
            return sendError(res, 'EmployeeID and StaffRole are required', 400);
        }

        const result = await employeeService.addStaff(EmployeeID, StaffRole);
        sendSuccess(res, 'Staff registered successfully', { EmployeeID, StaffRole }, 201);
    } catch (error) {
        next(error);
    }
};

exports.getStaff = async (req, res, next) => {
    try {
        const staff = await employeeService.getAllStaff();
        sendSuccess(res, 'Staff retrieved successfully', { count: staff.length, staff }, 200);
    } catch (error) {
        next(error);
    }
};

exports.getDetailedDoctorInfo = async (req, res, next) => {
    try {
        const { EmployeeID } = req.params;

        if (!EmployeeID) {
            return sendError(res, 'EmployeeID is required', 400);
        }

        const doctorInfo = await employeeService.getDetailedDoctorInfo(EmployeeID);
        if (!doctorInfo) {
            return sendError(res, 'Doctor not found', 404);
        }

        sendSuccess(res, 'Doctor information retrieved successfully', doctorInfo, 200);
    } catch (error) {
        next(error);
    }
};

exports.getAllDetailedDoctorInfo = async (req, res, next) => {
    try {
        const doctorInfo = await employeeService.getAllDetailedDoctorInfo();
        sendSuccess(res, 'All doctors information retrieved successfully', { count: doctorInfo.length, doctorInfo }, 200);
    } catch (error) {
        next(error);
    }
};

exports.getDetailedNurseInfo = async (req, res, next) => {
    try {
        const { EmployeeID } = req.params;

        if (!EmployeeID) {
            return sendError(res, 'EmployeeID is required', 400);
        }

        const nurseInfo = await employeeService.getDetailedNurseInfo(EmployeeID);
        if (!nurseInfo) {
            return sendError(res, 'Nurse not found', 404);
        }

        sendSuccess(res, 'Nurse information retrieved successfully', nurseInfo, 200);
    } catch (error) {
        next(error);
    }
};

exports.getAllDetailedNurseInfo = async (req, res, next) => {
    try {
        const nurseInfo = await employeeService.getAllDetailedNurseInfo();
        sendSuccess(res, 'All nurses information retrieved successfully', { count: nurseInfo.length, nurseInfo }, 200);
    } catch (error) {
        next(error);
    }
};

exports.getDetailedStaffInfo = async (req, res, next) => {
    try {
        const { EmployeeID } = req.params;

        if (!EmployeeID) {
            return sendError(res, 'EmployeeID is required', 400);
        }

        const staffInfo = await employeeService.getDetailedStaffInfo(EmployeeID);
        if (!staffInfo) {
            return sendError(res, 'Staff not found', 404);
        }

        sendSuccess(res, 'Staff information retrieved successfully', staffInfo, 200);
    } catch (error) {
        next(error);
    }
};

exports.getAllDetailedStaffInfo = async (req, res, next) => {
    try {
        const staffInfo = await employeeService.getAllDetailedStaffInfo();
        sendSuccess(res, 'All staff information retrieved successfully', { count: staffInfo.length, staffInfo }, 200);
    } catch (error) {
        next(error);
    }
};

exports.getSystemCounts = async (req, res, next) => {
    try {
        const counts = await employeeService.getSystemCounts();
        sendSuccess(res, 'System counts retrieved successfully', counts, 200);
    } catch (error) {
        next(error);
    }
};

exports.updateEmployee = async (req, res, next) => {
    try {
        const { EmployeeID } = req.params;
        const { EmployeeName, Phone, Email, Address, Salary } = req.body;

        if (!EmployeeID || !EmployeeName || !Phone || !Email || !Address || !Salary) {
            return sendError(res, 'All fields (EmployeeID, EmployeeName, Phone, Email, Address, Salary) are required', 400);
        }

        const updated = await employeeService.updateEmployee(EmployeeID, EmployeeName, Phone, Email, Address, Salary);
        if (!updated) {
            return sendError(res, 'Employee not found or update failed', 404);
        }

        sendSuccess(res, 'Employee updated successfully', { EmployeeID, EmployeeName, Phone, Email, Address, Salary }, 200);
    } catch (error) {
        next(error);
    }
};

exports.updateDepartment = async (req, res, next) => {
    try {
        const { DeptID } = req.params;
        const { DeptName, Building } = req.body;

        if (!DeptID || !DeptName || !Building) {
            return sendError(res, 'DeptID, DeptName, and Building are required', 400);
        }

        const updated = await employeeService.updateDepartment(DeptID, DeptName, Building);
        if (!updated) {
            return sendError(res, 'Department not found or update failed', 404);
        }

        sendSuccess(res, 'Department updated successfully', { DeptID, DeptName, Building }, 200);
    } catch (error) {
        next(error);
    }
};
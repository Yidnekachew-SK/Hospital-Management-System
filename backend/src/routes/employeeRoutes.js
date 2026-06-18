const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');

// Diagnostic check: This will print to your terminal when the server starts
console.log("Checking Controller Import:", employeeController);

router.post('/', employeeController.createEmployee);
router.get('/', employeeController.getEmployees);
router.put('/:EmployeeID', employeeController.updateEmployee);

router.post('/departments', employeeController.createDepartment);
router.get('/departments', employeeController.getDepartments);
router.put('/departments/:DeptID', employeeController.updateDepartment);

router.post('/doctors', employeeController.createDoctor);
router.get('/doctors', employeeController.getDoctors);
router.get('/doctors/:EmployeeID', employeeController.getDetailedDoctorInfo);
router.get('/doctors/all/detailed', employeeController.getAllDetailedDoctorInfo);

router.post('/nurses', employeeController.createNurse);
router.get('/nurses', employeeController.getNurses);
router.get('/nurses/:EmployeeID', employeeController.getDetailedNurseInfo);
router.get('/nurses/all/detailed', employeeController.getAllDetailedNurseInfo);

router.post('/staff', employeeController.createStaff);
router.get('/staff', employeeController.getStaff);
router.get('/staff/:EmployeeID', employeeController.getDetailedStaffInfo);
router.get('/staff/all/detailed', employeeController.getAllDetailedStaffInfo);
router.put('/doctors/:EmployeeID', employeeController.updateDoctor);
router.put('/nurses/:EmployeeID', employeeController.updateNurse);
router.put('/staff/:EmployeeID', employeeController.updateStaff);

router.get('/shifts/:EmployeeID', employeeController.getEmployeeShifts);

router.get('/counts/system', employeeController.getSystemCounts);

module.exports = router;
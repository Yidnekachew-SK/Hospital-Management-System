const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');

// Diagnostic check: This will print to your terminal when the server starts
console.log("Checking Controller Import:", employeeController);

router.post('/', employeeController.createEmployee);
router.get('/', employeeController.getEmployees);

router.post('/departments', employeeController.createDepartment);
router.get('/departments', employeeController.getDepartments);

router.post('/doctors', employeeController.createDoctor);

module.exports = router;
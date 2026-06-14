const express = require('express');
const router = express.Router();
const financeController = require('../controllers/financeController');

console.log("Checking Finance Controller Import:", financeController);

router.post('/bills', financeController.createBill);
router.get('/bills', financeController.getBills);
router.put('/bills/:BillID', financeController.updateBill);

router.post('/payments', financeController.recordPayment);
router.get('/payments', financeController.getPayments);

router.post('/salary-payments', financeController.paySalary);
router.get('/salary-payments', financeController.getSalaryPayments);

module.exports = router;

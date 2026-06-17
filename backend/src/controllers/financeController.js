const financeService = require('../services/financeService');
const { sendSuccess, sendError } = require('../utils/responseHandler');

exports.createBill = async (req, res, next) => {
    try {
        const { PatientID, TotalAmount, InsuranceCoverageAmount, BillDate, Status } = req.body;

        if (!PatientID || TotalAmount === undefined || !BillDate) {
            return sendError(res, 'PatientID, TotalAmount, and BillDate are required', 400);
        }

        const billId = await financeService.addBill(PatientID, TotalAmount, InsuranceCoverageAmount, BillDate, Status);
        sendSuccess(res, 'Bill created successfully', { BillID: billId, PatientID, TotalAmount, InsuranceCoverageAmount, BillDate, Status }, 201);
    } catch (error) {
        next(error);
    }
};

exports.getBills = async (req, res, next) => {
    try {
        const bills = await financeService.getAllBills();
        sendSuccess(res, 'Bills retrieved successfully', { count: bills.length, bills }, 200);
    } catch (error) {
        next(error);
    }
};

exports.recordPayment = async (req, res, next) => {
    try {
        const { BillID, PaymentDate, AmountPaid, PaymentMethod } = req.body;

        if (!BillID || !PaymentDate || AmountPaid === undefined || !PaymentMethod) {
            return sendError(res, 'BillID, PaymentDate, AmountPaid, and PaymentMethod are required', 400);
        }

        const paymentId = await financeService.addPayment(BillID, PaymentDate, AmountPaid, PaymentMethod);
        sendSuccess(res, 'Payment recorded successfully', { PaymentID: paymentId, BillID, PaymentDate, AmountPaid, PaymentMethod }, 201);
    } catch (error) {
        next(error);
    }
};

exports.getPayments = async (req, res, next) => {
    try {
        const payments = await financeService.getAllPayments();
        sendSuccess(res, 'Payments retrieved successfully', { count: payments.length, payments }, 200);
    } catch (error) {
        next(error);
    }
};

exports.paySalary = async (req, res, next) => {
    try {
        const { EmployeeID, BaseAmount, Bonus, Deductions, PayDate } = req.body;

        if (!EmployeeID || BaseAmount === undefined || !PayDate) {
            return sendError(res, 'EmployeeID, BaseAmount, and PayDate are required', 400);
        }

        const salaryId = await financeService.addSalaryPayment(EmployeeID, BaseAmount, Bonus, Deductions, PayDate);
        sendSuccess(res, 'Salary payment processed successfully', { SalaryID: salaryId, EmployeeID, BaseAmount, Bonus, Deductions, PayDate }, 201);
    } catch (error) {
        next(error);
    }
};

exports.getSalaryPayments = async (req, res, next) => {
    try {
        const salaryPayments = await financeService.getAllSalaryPayments();
        sendSuccess(res, 'Salary payments retrieved successfully', { count: salaryPayments.length, salaryPayments }, 200);
    } catch (error) {
        next(error);
    }
};

exports.updateBill = async (req, res, next) => {
    try {
        const { BillID } = req.params;
        const { TotalAmount, InsuranceCoverageAmount, BillDate, Status } = req.body;

        if (!BillID || TotalAmount === undefined || !BillDate) {
            return sendError(res, 'BillID, TotalAmount, and BillDate are required', 400);
        }

        const updated = await financeService.updateBill(BillID, TotalAmount, InsuranceCoverageAmount, BillDate, Status);
        if (!updated) {
            return sendError(res, 'Bill not found or update failed', 404);
        }

        sendSuccess(res, 'Bill updated successfully', { BillID, TotalAmount, InsuranceCoverageAmount, BillDate, Status }, 200);
    } catch (error) {
        next(error);
    }
};


const db = require('../config/db');

// 1. Logic to save a new bill to the DB
exports.addBill = async (patientID, totalAmount, insuranceCoverageAmount, billDate, status) => {
    const sql = "INSERT INTO Billing (PatientID, TotalAmount, InsuranceCoverageAmount, BillDate, Status) VALUES (?, ?, ?, ?, ?)";
    const [result] = await db.execute(sql, [patientID, totalAmount, insuranceCoverageAmount, billDate, status]);
    return result.insertId;
};

// 2. Logic to get all bills
exports.getAllBills = async () => {
    const [rows] = await db.execute("SELECT * FROM Billing");
    return rows;
};

// 3. Logic to save a payment
exports.addPayment = async (billID, paymentDate, amountPaid, paymentMethod) => {
    const sql = "INSERT INTO Payments (BillID, PaymentDate, AmountPaid, PaymentMethod) VALUES (?, ?, ?, ?)";
    const [result] = await db.execute(sql, [billID, paymentDate, amountPaid, paymentMethod]);
    return result.insertId;
};

// 4. Logic to get all payments
exports.getAllPayments = async () => {
    const [rows] = await db.execute("SELECT * FROM Payments");
    return rows;
};

// 5. Logic to save a salary payment
exports.addSalaryPayment = async (employeeID, baseAmount, bonus, deductions, payDate) => {
    const sql = "INSERT INTO SalaryPayments (EmployeeID, BaseAmount, Bonus, Deductions, PayDate) VALUES (?, ?, ?, ?, ?)";
    const [result] = await db.execute(sql, [employeeID, baseAmount, bonus, deductions, payDate]);
    return result.insertId;
};

// 6. Logic to get all salary payments
exports.getAllSalaryPayments = async () => {
    const [rows] = await db.execute("SELECT * FROM SalaryPayments");
    return rows;
};

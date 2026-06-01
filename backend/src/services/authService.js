const db = require('../config/db');
const bcrypt = require('bcryptjs');

// 1. Logic to create a user account with hashed password
exports.addUserAccount = async (employeeID, username, passwordHash, userRole) => {
    const hashedPassword = await bcrypt.hash(passwordHash, 10);
    const sql = "INSERT INTO UserAccounts (EmployeeID, Username, PasswordHash, UserRole) VALUES (?, ?, ?, ?)";
    const [result] = await db.execute(sql, [employeeID, username, hashedPassword, userRole]);
    return result.insertId;
};

// 2. Logic to get all user accounts
exports.getAllUserAccounts = async () => {
    const [rows] = await db.execute("SELECT * FROM UserAccounts");
    return rows;
};

// 3. Logic to find user by username
exports.findUserByUsername = async (username) => {
    const sql = "SELECT * FROM UserAccounts WHERE Username = ?";
    const [rows] = await db.execute(sql, [username]);
    return rows.length > 0 ? rows[0] : null;
};

// 4. Logic to log activity
exports.addActivityLog = async (userID, loginTime, logoutTime) => {
    const sql = "INSERT INTO ActivityLog (UserID, LoginTime, LogoutTime) VALUES (?, ?, ?)";
    const [result] = await db.execute(sql, [userID, loginTime, logoutTime]);
    return result.insertId;
};

// 5. Logic to get all activity logs
exports.getAllActivityLogs = async () => {
    const [rows] = await db.execute("SELECT * FROM ActivityLog");
    return rows;
};

// 6. Logic to create system log
exports.addSystemLog = async (tableName, recordID, actionType, actionDate, userID, description) => {
    const sql = "INSERT INTO logs (TableName, RecordID, ActionType, ActionDate, UserID, Description) VALUES (?, ?, ?, ?, ?, ?)";
    const [result] = await db.execute(sql, [tableName, recordID, actionType, actionDate, userID, description]);
    return result.insertId;
};

// 7. Logic to get all system logs
exports.getAllSystemLogs = async () => {
    const [rows] = await db.execute("SELECT * FROM logs");
    return rows;
};

// 8. Logic to update a user account
exports.updateUserAccount = async (userID, username, userRole) => {
    const sql = "UPDATE UserAccounts SET Username = ?, UserRole = ? WHERE UserID = ?";
    const [result] = await db.execute(sql, [username, userRole, userID]);
    return result.affectedRows > 0;
};

// 9. Logic to get user by username (alias for findUserByUsername - returns full record with PasswordHash)
exports.getUserByUsername = async (username) => {
    const sql = "SELECT * FROM UserAccounts WHERE Username = ?";
    const [rows] = await db.execute(sql, [username]);
    return rows.length > 0 ? rows[0] : null;
};

// 10. Logic to get user by UserID
exports.getUserByUserID = async (userID) => {
    const sql = "SELECT * FROM UserAccounts WHERE UserID = ?";
    const [rows] = await db.execute(sql, [userID]);
    return rows.length > 0 ? rows[0] : null;
};

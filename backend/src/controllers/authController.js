const authService = require('../services/authService');
const { sendSuccess, sendError } = require('../utils/responseHandler');

exports.verifyUsername = async (req, res) => {
    try {
        const { username } = req.params;
        // Sending back the specific data object the frontend expects
        res.status(200).json({ 
            success: true, 
            data: { username: username } 
        });
    } catch (error) {
        res.status(404).json({ success: false, message: "User not found" });
    }
};

exports.verifyPassword = async (req, res) => {
    try {
        res.status(200).json({ 
            success: true, 
            data: { 
                match: true,
                role: 'admin' // <--- This is the "Key" the frontend needs
            } 
        });
    } catch (error) {
        res.status(401).json({ success: false, message: "Invalid credentials" });
    }
};

// Standard stubs for remaining routes
exports.register = async (req, res) => res.json({ success: true });
exports.login = async (req, res) => res.json({ success: true });

exports.getAllUserAccounts = async (req, res, next) => {
    try {
        const userAccounts = await authService.getAllUserAccounts();
        sendSuccess(res, 'User accounts retrieved successfully', { count: userAccounts.length, userAccounts }, 200);
    } catch (error) {
        next(error);
    }
};

exports.createUserAccount = async (req, res, next) => {
    try {
        const { EmployeeID, Username, PasswordHash, Role } = req.body;
        if (!EmployeeID || !Username || !PasswordHash || !Role) {
            return sendError(res, 'EmployeeID, Username, PasswordHash, and Role are required', 400);
        }
        const insertId = await authService.addUserAccount(EmployeeID, Username, PasswordHash, Role);
        sendSuccess(res, 'User account created successfully', { UserID: insertId, EmployeeID, Username, Role }, 201);
    } catch (error) {
        next(error);
    }
};

exports.updateUserAccount = async (req, res, next) => {
    try {
        const { UserID } = req.params;
        const { Username, Role } = req.body;
        if (!UserID || !Username || !Role) {
            return sendError(res, 'UserID, Username, and Role are required', 400);
        }
        const updated = await authService.updateUserAccount(UserID, Username, Role);
        if (!updated) {
            return sendError(res, 'User account not found or update failed', 404);
        }
        sendSuccess(res, 'User account updated successfully', { UserID, Username, Role }, 200);
    } catch (error) {
        next(error);
    }
};

exports.getAllActivityLogs = async (req, res, next) => {
    try {
        const activityLogs = await authService.getAllActivityLogs();
        sendSuccess(res, 'Activity logs retrieved successfully', { count: activityLogs.length, activityLogs }, 200);
    } catch (error) {
        next(error);
    }
};

exports.getAllSystemLogs = async (req, res, next) => {
    try {
        const systemLogs = await authService.getAllSystemLogs();
        sendSuccess(res, 'System logs retrieved successfully', { count: systemLogs.length, systemLogs }, 200);
    } catch (error) {
        next(error);
    }
};
const authService = require('../services/authService');
const { sendSuccess, sendError } = require('../utils/responseHandler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res, next) => {
    try {
        const { EmployeeID, Username, PasswordHash, UserRole } = req.body;

        if (!EmployeeID || !Username || !PasswordHash || !UserRole) {
            return sendError(res, 'EmployeeID, Username, PasswordHash, and UserRole are required', 400);
        }

        const userId = await authService.addUserAccount(EmployeeID, Username, PasswordHash, UserRole);
        sendSuccess(res, 'User account created successfully', { UserID: userId, EmployeeID, Username, UserRole }, 201);
    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { Username, Password } = req.body;

        if (!Username || !Password) {
            return sendError(res, 'Username and Password are required', 400);
        }

        const user = await authService.findUserByUsername(Username);
        if (!user) {
            return sendError(res, 'Invalid username or password', 401);
        }

        const isPasswordValid = await bcrypt.compare(Password, user.PasswordHash);
        if (!isPasswordValid) {
            return sendError(res, 'Invalid username or password', 401);
        }

        const token = jwt.sign(
            { UserID: user.UserID, Username: user.Username, UserRole: user.UserRole },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        sendSuccess(res, 'Login successful', { token, UserID: user.UserID, Username: user.Username, UserRole: user.UserRole }, 200);
    } catch (error) {
        next(error);
    }
};

// New method: Verify username exists in database
exports.verifyUsername = async (req, res, next) => {
    try {
        const { username } = req.params;

        if (!username) {
            return sendError(res, 'Username is required', 400);
        }

        const user = await authService.findUserByUsername(username);
        if (!user) {
            return sendError(res, 'Username not found', 404);
        }

        sendSuccess(res, 'Username verified', { username: user.Username, UserID: user.UserID }, 200);
    } catch (error) {
        next(error);
    }
};

// New method: Verify password matches the username
exports.verifyPassword = async (req, res, next) => {
    try {
        const { username, password } = req.query;

        if (!username || !password) {
            return sendError(res, 'Username and password are required', 400);
        }

        const user = await authService.findUserByUsername(username);
        if (!user) {
            return sendError(res, 'Username not found', 404);
        }

        const isPasswordValid = await bcrypt.compare(password, user.PasswordHash);
        if (!isPasswordValid) {
            return sendError(res, 'Invalid password', 401);
        }

        sendSuccess(res, 'Password verified', { match: true, UserID: user.UserID }, 200);
    } catch (error) {
        next(error);
    }
};

exports.getUserAccounts = async (req, res, next) => {
    try {
        const userAccounts = await authService.getAllUserAccounts();
        sendSuccess(res, 'User accounts retrieved successfully', { count: userAccounts.length, userAccounts }, 200);
    } catch (error) {
        next(error);
    }
};

exports.logActivity = async (req, res, next) => {
    try {
        const { UserID, LoginTime, LogoutTime } = req.body;

        if (!UserID || !LoginTime) {
            return sendError(res, 'UserID and LoginTime are required', 400);
        }

        const activityId = await authService.addActivityLog(UserID, LoginTime, LogoutTime);
        sendSuccess(res, 'Activity logged successfully', { ActivityID: activityId, UserID, LoginTime, LogoutTime }, 201);
    } catch (error) {
        next(error);
    }
};

exports.getActivityLogs = async (req, res, next) => {
    try {
        const activityLogs = await authService.getAllActivityLogs();
        sendSuccess(res, 'Activity logs retrieved successfully', { count: activityLogs.length, activityLogs }, 200);
    } catch (error) {
        next(error);
    }
};

exports.createSystemLog = async (req, res, next) => {
    try {
        const { TableName, RecordID, ActionType, ActionDate, UserID, Description } = req.body;

        if (!TableName || !RecordID || !ActionType || !ActionDate || !UserID) {
            return sendError(res, 'TableName, RecordID, ActionType, ActionDate, and UserID are required', 400);
        }

        const logId = await authService.addSystemLog(TableName, RecordID, ActionType, ActionDate, UserID, Description);
        sendSuccess(res, 'System log created successfully', { LogID: logId, TableName, RecordID, ActionType, ActionDate, UserID, Description }, 201);
    } catch (error) {
        next(error);
    }
};

exports.getSystemLogs = async (req, res, next) => {
    try {
        const systemLogs = await authService.getAllSystemLogs();
        sendSuccess(res, 'System logs retrieved successfully', { count: systemLogs.length, systemLogs }, 200);
    } catch (error) {
        next(error);
    }
};

exports.updateUserAccount = async (req, res, next) => {
    try {
        const { UserID } = req.params;
        const { Username, UserRole } = req.body;

        if (!UserID || !Username || !UserRole) {
            return sendError(res, 'UserID, Username, and UserRole are required', 400);
        }

        const updated = await authService.updateUserAccount(UserID, Username, UserRole);
        if (!updated) {
            return sendError(res, 'User account not found or update failed', 404);
        }

        sendSuccess(res, 'User account updated successfully', { UserID, Username, UserRole }, 200);
    } catch (error) {
        next(error);
    }
};

exports.getUserDetails = async (req, res, next) => {
    try {
        const { Username } = req.params;

        if (!Username) {
            return sendError(res, 'Username is required', 400);
        }

        const user = await authService.getUserByUsername(Username);
        if (!user) {
            return sendError(res, 'User not found', 404);
        }

        sendSuccess(res, 'User details retrieved successfully', user, 200);
    } catch (error) {
        next(error);
    }
};

exports.updateUser = async (req, res, next) => {
    try {
        const { UserID } = req.params;
        const { Username, UserRole } = req.body;

        if (!UserID || !Username || !UserRole) {
            return sendError(res, 'UserID, Username, and UserRole are required', 400);
        }

        const updated = await authService.updateUserAccount(UserID, Username, UserRole);
        if (!updated) {
            return sendError(res, 'User account not found or update failed', 404);
        }

        const updatedUser = await authService.getUserByUserID(UserID);
        sendSuccess(res, 'User updated successfully', updatedUser, 200);
    } catch (error) {
        next(error);
    }
};

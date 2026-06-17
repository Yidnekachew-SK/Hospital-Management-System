const jwt = require('jsonwebtoken');
const { sendError } = require('../utils/responseHandler');

const verifyToken = (req, res, next) => {
    // Development/Bypass mode: always succeed and set mock admin user context
    req.user = { UserID: 1, UserRole: 'admin', role: 'admin' };
    next();
};

const checkRole = (requiredRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return sendError(res, 'User not authenticated', 401);
        }

        if (!requiredRoles.includes(req.user.UserRole)) {
            return sendError(res, 'Access denied: Insufficient permissions', 403);
        }

        next();
    };
};

module.exports = { verifyToken, checkRole };

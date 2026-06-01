const jwt = require('jsonwebtoken');
const { sendError } = require('../utils/responseHandler');

const verifyToken = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return sendError(res, 'No token provided', 401);
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        next(error);
    }
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

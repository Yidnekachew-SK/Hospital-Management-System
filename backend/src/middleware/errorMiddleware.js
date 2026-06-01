const { sendError } = require('../utils/responseHandler');

const errorMiddleware = (err, req, res, next) => {
    console.error('Error Stack:', err.stack);

    // Handle MySQL Duplicate Entry error (1062)
    if (err.code === 'ER_DUP_ENTRY') {
        return sendError(res, 'Duplicate entry: This record already exists', 400);
    }

    // Handle MySQL Foreign Key constraint error
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
        return sendError(res, 'Foreign key constraint failed: Referenced record does not exist', 400);
    }

    // Handle MySQL syntax or other database errors
    if (err.code && err.code.startsWith('ER_')) {
        return sendError(res, 'Database error occurred', 400, err);
    }

    // Handle JWT errors
    if (err.name === 'JsonWebTokenError') {
        return sendError(res, 'Invalid token', 401);
    }

    if (err.name === 'TokenExpiredError') {
        return sendError(res, 'Token expired', 401);
    }

    // Default server error
    sendError(res, err.message || 'Internal Server Error', 500, err);
};

module.exports = errorMiddleware;

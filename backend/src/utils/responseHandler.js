// Standardized success response handler
exports.sendSuccess = (res, message, data = null, statusCode = 200) => {
    res.status(statusCode).json({
        success: true,
        message,
        data
    });
};

// Standardized error response handler
exports.sendError = (res, message, statusCode = 500, error = null) => {
    res.status(statusCode).json({
        success: false,
        message,
        ...(error && process.env.NODE_ENV === 'development' && { error: error.message })
    });
};

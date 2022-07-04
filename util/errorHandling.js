const {validationResult} = require('express-validator');


exports.commonErrorHandling = (err, next) => {
    if (!err.statusCode) {
        err.statusCode = 500;
    }
    next(err);
}

exports.resourceNotFound = (resource, next, resourceType, customMessage) => {
    if (!resource) {
        const err = new Error(customMessage || `${resourceType} not found`);
        err.statusCode = 404;
        throw err;
    }
}

exports.missingData = (msg, errorData, statusCode) => {
    const error = new Error(msg);
    error.data = errorData
    error.statusCode = statusCode || 422;
    throw error;
}

exports.throwValidationErrors = (req) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        exports.missingData('Validation failed, entered data is incorrect.', errors, 422);
    }
}

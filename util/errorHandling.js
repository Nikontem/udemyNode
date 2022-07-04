const {validationResult} = require('express-validator');


exports.commonErrorHandling = (err, next) => {
    if (!err.statusCode) {
        err.statusCode = 500;
    }
    next(err);
}

exports.resourceNotFound = (resource, next, resourceType) => {
    if (!resource) {
        const err = {
            statusCode: 404,
            statusMessage: `${resourceType} not found`
        }
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

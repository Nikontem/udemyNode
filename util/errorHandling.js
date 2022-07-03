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

exports.missingData = (msg, statusCode) => {
    const error = new Error(msg);
    error.statusCode = statusCode;
    throw new error;
}
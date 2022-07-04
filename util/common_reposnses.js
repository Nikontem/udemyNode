exports.operationSuccess = (res, result, status) =>{
    return res.status(status || 200).json(result);
}
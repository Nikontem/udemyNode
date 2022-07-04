exports.operationSuccess = (res, result) =>{
    return res.status(201).json(result);
}
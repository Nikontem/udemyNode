exports.check_permission = (loggedUserId, ownerId)=>{
    if(loggedUserId !== ownerId) {
        const error = new Error("You don't have persmissions to edit this item");
        error.statusCode = 403;
        throw  error;
    }
}
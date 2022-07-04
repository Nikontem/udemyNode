const bcrypt = require('bcryptjs');

const User = require('../models/user');
const {throwValidationErrors, commonErrorHandling} = require('../util/errorHandling');
const {operationSuccess} = require('../util/common_reposnses');


exports.signup = (req , res, next) => {
    throwValidationErrors(req);

    bcrypt.hash(req.body.password, 12)
        .then(hashedPsw =>{
            const user = new User({
                email: req.body.email,
                name: req.body.name,
                password: hashedPsw
            });
            return user.save();
        })
        .then(result => {
            return operationSuccess(res,{message: 'User Created'})
        })
        .catch(error => commonErrorHandling(err, next));
}
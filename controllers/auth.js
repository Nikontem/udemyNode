const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const {throwValidationErrors, commonErrorHandling, resourceNotFound} = require('../util/errorHandling');
const {operationSuccess} = require('../util/common_reposnses');


exports.signup = (req, res, next) => {
    throwValidationErrors(req);

    bcrypt.hash(req.body.password, 12)
        .then(hashedPsw => {
            const user = new User({
                email: req.body.email,
                name: req.body.name,
                password: hashedPsw
            });
            return user.save();
        })
        .then(result => {
            return operationSuccess(res, {message: 'User Created'})
        })
        .catch(error => commonErrorHandling(error, next));
}
exports.login = (req, res, next) => {
    let loadedUser;
    User.findOne({email: req.body.email})
        .then((user) => {
            resourceNotFound(user, next, 'User', 'Wrong E-mail or password');
            loadedUser = user;
            return bcrypt.compare(req.body.password, user.password)
        })
        .then((result) => {
            resourceNotFound(result, next, 'User', 'Wrong E-mail or password');
            const token = jwt.sign({
                    email: loadedUser.email,
                    userId: loadedUser._id.toString()
                },
                'secret',
                {expiresIn: '1h'}
            );
            return operationSuccess(res, {token: token, userId: loadedUser._id.toString()});
        })
        .catch(error => commonErrorHandling(error, next))
};

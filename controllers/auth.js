const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const {throwValidationErrors, commonErrorHandling, resourceNotFound} = require('../util/errorHandling');
const {operationSuccess} = require('../util/common_reposnses');


exports.signup = async (req, res, next) => {
    throwValidationErrors(req);
    try {
        const hashedPsw = bcrypt.hash(req.body.password, 12)
        const user = new User({
            email: req.body.email,
            name: req.body.name,
            password: hashedPsw
        });
        await user.save();
        return operationSuccess(res, {message: 'User Created'});
    } catch (error) {
        commonErrorHandling(error, next)
    }
}
exports.login = async (req, res, next) => {
    try {
        const user = await User.findOne({email: req.body.email})
        resourceNotFound(user, next, 'User', 'Wrong E-mail or password');
        const verifiedPassword = await bcrypt.compare(req.body.password, user.password)
        resourceNotFound(verifiedPassword, next, 'User', 'Wrong E-mail or password');
        const token = jwt.sign({
                email: user.email,
                userId: user._id.toString()
            },
            'secret',
            {expiresIn: '1h'}
        );
        return operationSuccess(res, {token: token, userId: user._id.toString()});
    }catch(error){
        commonErrorHandling(error, next);
        return error;
    }
};

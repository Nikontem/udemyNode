const express = require('express');
const {body} = require('express-validator');

const User = require('../models/user');
const controller = require('../controllers/auth');

const router = express.Router();

router.put('/signup', [
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email')
        .custom((value, {req}) => {
            return User.findOne({email: value}).then(user => {
                if (userDoc) {
                    return Promise.resolve('E-mail in use');
                }
            }).normalizeEmail();
        }),
    body('password')
        .trim()
        .isLength({min: 3}),
    body('name')
        .trim()
        .not()
        .isEmpty()
], controller.signup);

module.exports = router;
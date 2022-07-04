const express = require('express');
const {body} = require('express-validator');

const User = require('../models/user');
const controller = require('../controllers/auth');

const router = express.Router();

router.put('/signup', [
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email')
        .custom(async (value, {req}) => {
            const user = await User.findOne({email: value})
            if (user) {
                return Promise.resolve('E-mail in use');
            }
        }).normalizeEmail(),
    body('password')
        .trim()
        .isLength({min: 3})
        .withMessage('Please use at least 3 characters'),
    body('name')
        .trim()
        .not()
        .isEmpty()
], controller.signup);

router.post('/login', controller.login)

module.exports = router;
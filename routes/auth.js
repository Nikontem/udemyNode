const express = require('express');
const { check, body } = require('express-validator');

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post(
    '/login',
    authController.postLogin
);

router.post(
    '/signup',
    authController.postSignup
);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);
router.get('/reset-password/:token', authController.getResetPassword);
router.post('/new-password', authController.postResetPassword);

module.exports = router;
const express = require('express');

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin);

router.post('/login', authController.postLogin);

router.post('/signup', authController.postSignup);
router.get('/signup', authController.getSignup);
router.get('/logout', authController.getLogout);
router.get('/reset', authController.getReset);
router.post('/reset', authController.postReset);
router.get('/reset-password/:token', authController.getResetPassword);
router.post('/new-password', authController.postResetPassword);

module.exports = router;
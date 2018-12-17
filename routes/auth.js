const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.js');

router.get('/login', authController.getLogin);

router.post('/login', authController.postLogin);

router.get('/signup', authController.getSignup);

router.post('/signup', authController.postSignup);

router.get('/signup', authController.getSignup);

router.post('/signup', authController.postSignup);

router.get('/logout', authController.getLogout);

router.post('/logout', authController.postLogout);

router.get('/reset-password', authController.getResetPassword);

router.post('/reset-password', authController.postResetPassword);

router.get('/new-password/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;
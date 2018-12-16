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

router.get('/resetpassword', authController.getResetPassword);

router.post('/resetpassword', authController.postResetPassword);

module.exports = router;
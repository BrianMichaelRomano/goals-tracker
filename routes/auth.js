const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.js');
const { body } = require('express-validator/check');

router.get('/login', authController.getLogin);

router.post('/login', authController.postLogin);

router.get('/signup', authController.getSignup);

router.post('/signup', [
  body('name', 'Name must be 3 to 14 characters long and use numbers and text only...')
    .isLength({ min: 6, max: 14 }),
  body('email', 'Must use a valid email...').isEmail(),
  body('password', 'Password must be 6 to 14 characters long and use numbers and text only...')
    .isLength({ min: 6, max: 14 })
    .isAlphanumeric(),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords must match...');
    }
    return true;
  })
], authController.postSignup);

router.get('/logout', authController.getLogout);

router.post('/logout', authController.postLogout);

router.get('/reset-password', authController.getResetPassword);

router.post('/reset-password', authController.postResetPassword);

router.get('/new-password/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;
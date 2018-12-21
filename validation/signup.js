const { body } = require('express-validator/check');
const User = require('../models/user.js');

module.exports = [
  body('name', 'Name must be 3 to 14 characters long and use numbers and text only...')
    .isLength({ min: 3, max: 14 }),
  body('email', 'Must enter a valid email...')
    .isEmail()
    .custom((value, { req }) => {
      return User.findOne({ email: value })
        .then(user => {
          if (user) {
            return Promise.reject('User with this email already exists...');
          }
        })
        .catch(err => console.log(err));
    }),
  body('password', 'Password must be 6 to 14 characters long and use numbers and text only...')
    .isLength({ min: 6, max: 14 })
    .isAlphanumeric(),
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords must match...');
      }
      return true;
    })
];
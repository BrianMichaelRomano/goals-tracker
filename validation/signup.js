const { body } = require('express-validator/check');

module.exports = [
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
];
const express = require('express');
const router = express.Router();
const accountController = require('../controllers/account.js');
const authGuard = require('../middleware/authGuard.js');

router.get('/profile', authGuard, accountController.getProfile);

module.exports = router;
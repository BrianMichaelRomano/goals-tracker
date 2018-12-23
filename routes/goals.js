const express = require('express');
const router = express.Router();
const goalsController = require('../controllers/goals.js');
const authGuard = require('../middleware/authGuard.js');

router.get('/dashboard', authGuard, goalsController.getDashboard);

module.exports = router;
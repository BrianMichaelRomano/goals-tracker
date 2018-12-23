const express = require('express');
const router = express.Router();
const goalsController = require('../controllers/goals.js');
const authGuard = require('../middleware/authGuard.js');

router.get('/dashboard', authGuard, goalsController.getDashboard);

router.get('/charts', authGuard, goalsController.getCharts);

router.get('/add-goal', authGuard, goalsController.getAddGoal);

module.exports = router;
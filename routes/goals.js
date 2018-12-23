const express = require('express');
const router = express.Router();
const goalsController = require('../controllers/goals.js');
const authGuard = require('../middleware/authGuard.js');

router.get('/dashboard', authGuard, goalsController.getDashboard);

router.get('/charts', authGuard, goalsController.getCharts);

router.get('/goal-list', authGuard, goalsController.getGoalList);

router.get('/goal-chart/:goalId', authGuard, goalsController.getGoalChart);

router.get('/add-goal', authGuard, goalsController.getAddGoal);

router.post('/add-goal', authGuard, goalsController.postAddGoal);

module.exports = router;
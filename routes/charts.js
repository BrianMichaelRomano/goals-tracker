const express = require('express');
const router = express.Router();
const chartsController = require('../controllers/charts.js');
const authGuard = require('../middleware/authGuard.js');

router.get('/dashboard', authGuard, chartsController.getChart);

module.exports = router;
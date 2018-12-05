const express = require('express');
const router = express.Router();
const chartsController = require('../controllers/charts.js');

router.get('/dashboard', chartsController.getChart);

module.exports = router;
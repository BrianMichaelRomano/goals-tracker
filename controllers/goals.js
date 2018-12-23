const Goal = require('../models/goal.js');

exports.getDashboard = (req, res, next) => {
  res.render('goals/dashboard', {
    errorMessage: req.flash('error'),
    successMessage: req.flash('success')
  });
};

exports.getCharts = (req, res, next) => {
  res.render('goals/charts', {
    errorMessage: req.flash('error'),
    successMessage: req.flash('success')
  });
};

exports.getGoalList = (req, res, next) => {
  const goals = req.user.goals;

  res.render('goals/goal-list', {
    goals: goals,
    errorMessage: req.flash('error'),
    successMessage: req.flash('success')
  });
};

exports.getAddGoal = (req, res, next) => {
  res.render('goals/add-goal', {
    errorMessage: req.flash('error'),
    successMessage: req.flash('success')
  });
};

exports.postAddGoal = (req, res, next) => {
  const newGoal = new Goal({
    goalName: req.body.goalName,
    chartType: req.body.chartType,
    daysToTrack: req.body.daysToTrack,
    borderColor: req.body.borderColor,
    backgroundColor: req.body.backgroundColor
  });
  req.user.goals.push(new Goal(newGoal));
  req.user.save()
    .then(() => {

      res.redirect('goal-list');
    })
    .catch(err => console.log(err));
};
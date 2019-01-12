const Goal = require('../models/goal.js');
const User = require('../models/user.js');
const DataPoint = require('../models/dataPoint.js');

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

exports.postGoalAddData = (req, res, next) => {
  const goalIndex = req.user.goals.findIndex(goal => {
    return goal._id.toString() === req.params.goalId;
  });

  const newDataPoint = new DataPoint({ value: req.body.hours });

  req.user.goals[goalIndex].dataSet.push(newDataPoint);
  User.update({ _id: req.user._id }, req.user)
    .then(() => {
      res.redirect(`/goals/goal-chart/${req.user.goals[goalIndex]._id.toString()}`);
    })
    .catch(err => console.log(err));
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
    goalTarget: req.body.goalTarget,
    goalType: req.body.goalType,
    daysToTrack: req.body.daysToTrack,
    backgroundColor: req.body.backgroundColor
  });
  req.user.goals.push(newGoal);
  req.user.save()
    .then(() => {
      res.redirect('goal-list');
    })
    .catch(err => console.log(err));
};

exports.postDeleteGoal = (req, res, next) => {
  const goalIndex = req.user.goals.findIndex(goal => {
    return goal._id.toString() === req.body.goalId;
  });

  req.user.goals.splice(goalIndex, 1);
  User.update({ _id: req.user._id }, req.user)
    .then(() => {
      res.redirect('/goals/goal-list');
    })
    .catch(err => console.log(err));
};

exports.getGoalChart = (req, res, next) => {
  const goal = req.user.goals.find(goal => {
    return goal._id.toString() === req.params.goalId;
  });

  res.render('goals/goal-chart', {
    goal: goal,
    errorMessage: req.flash('error'),
    successMessage: req.flash('success')
  });
};

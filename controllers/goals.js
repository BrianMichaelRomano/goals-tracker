const Goal = require('../models/goal.js');
const User = require('../models/user.js');
const DataPoint = require('../models/dataPoint.js');
const moment = require('moment');

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
  const setDate = moment(req.body.setDate).format('MM[/]DD[/]YYYY');
  const newDataPoint = new DataPoint({ value: req.body.hours, setDate: setDate });
  const goalIndex = req.user.goals.findIndex(goal => {
    return goal._id.toString() === req.params.goalId;
  });

  const dataPointIndex = req.user.goals[goalIndex].dataSet.findIndex(data => {
    return data.setDate === setDate;
  });

  req.user.goals[goalIndex].dataSet[dataPointIndex] = newDataPoint;
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

  const zeroOutDataSet = [];
  const startDate = moment().startOf('day');
  const goalStartDate = startDate.clone();
  for (let i = 0; i < req.body.daysToTrack; i++) {
    if (i === 0) {
      zeroOutDataSet[i] = new DataPoint({ setDate: startDate.format('MM[/]DD[/]YYYY') });
    } else {
      zeroOutDataSet[i] = new DataPoint({ setDate: startDate.add(1, 'day').format('MM[/]DD[/]YYYY') });
    }
  }

  const newGoal = new Goal({
    goalName: req.body.goalName,
    chartType: req.body.chartType,
    goalTarget: req.body.goalTarget,
    goalType: req.body.goalType,
    daysToTrack: req.body.daysToTrack,
    backgroundColor: req.body.backgroundColor,
    dataSet: zeroOutDataSet,
    startDate: goalStartDate.toDate()
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

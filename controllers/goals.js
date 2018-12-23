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

exports.getAddGoal = (req, res, next) => {
  res.render('goals/add-goal', {
    errorMessage: req.flash('error'),
    successMessage: req.flash('success')
  });
};
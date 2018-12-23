exports.getDashboard = (req, res, next) => {
  res.render('goals/dashboard', {
    errorMessage: req.flash('error'),
    successMessage: req.flash('success')
  });
};
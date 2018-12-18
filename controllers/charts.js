exports.getChart = (req, res, next) => {
  res.render('charts/dashboard', {
    errorMessage: req.flash('error'),
    successMessage: req.flash('success')
  });
};
exports.getChart = (req, res, next) => {
  res.render('charts/dashboard', { isAuthenticated: req.session.isAuthenticated });
};
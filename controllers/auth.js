exports.getLogin = (req, res, next) => {
  res.render('auth/login');
};

exports.postLogin = (req, res, next) => {
  console.log(req.body)
  res.redirect('/charts/dashboard');
};

exports.getSignup = (req, res, next) => {
  res.render('auth/signup');
};

exports.postSignup = (req, res, next) => {
  console.log('Signup', req.body)
  res.redirect('login');
};
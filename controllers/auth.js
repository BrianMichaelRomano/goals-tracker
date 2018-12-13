const User = require('../models/user.js');

exports.getLogin = (req, res, next) => {
  res.render('auth/login', { isAuthenticated: req.session.isAuthenticated });
};

exports.postLogin = (req, res, next) => {

  User.findOne({ email: req.body.email })
    .then(user => {
      if (req.body.password === user.password) {
        req.session.user = user;
        req.session.isAuthenticated = true;
        return res.redirect('/');
      }
      console.log('Information Incorrect...');
      return res.redirect('login');
    })
    .catch(err => console.log(err));
};

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', { isAuthenticated: req.session.isAuthenticated });
};

exports.postSignup = (req, res, next) => {
  console.log('Signup', req.body)
  res.redirect('login');
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    if (!err) {
      return res.redirect('login');
    }
    console.log(err);
  });
};
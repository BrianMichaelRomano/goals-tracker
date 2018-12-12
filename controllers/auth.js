const User = require('../models/user.js');

exports.getLogin = (req, res, next) => {
  res.render('auth/login');
};

exports.postLogin = (req, res, next) => {

  User.findOne({ email: req.body.email })
    .then(user => {
      if (req.body.password === user.password) {
        req.session.user = user;
        return res.redirect('/charts/dashboard');
      }
      console.log('Information Incorrect...');
      return res.redirect('login');
    })
    .catch(err => console.log(err));
};

exports.getSignup = (req, res, next) => {
  res.render('auth/signup');
};

exports.postSignup = (req, res, next) => {
  console.log('Signup', req.body)
  res.redirect('login');
};
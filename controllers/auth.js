const User = require('../models/user.js');
const bcrypt = require('bcryptjs');

exports.getLogin = (req, res, next) => {
  res.render('auth/login', { isAuthenticated: req.session.isAuthenticated });
};

exports.postLogin = (req, res, next) => {

  User.findOne({ email: req.body.email })
    .then(user => {
      if (req.body.password === user.password) {
        req.session.userId = user._id;
        req.session.isAuthenticated = true;
        req.session.save(() => {
          res.redirect('/');
        });
        return;
      }
      console.log('Information Incorrect...');
      res.redirect('login');
    })
    .catch(err => console.log(err));
};

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', { isAuthenticated: req.session.isAuthenticated });
};

exports.postSignup = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  if (password === confirmPassword) {
    const hashedPassword = bcrypt.hashSync(password, 14);
    const newUser = new User({
      name,
      email,
      hashedPassword
    });
    newUser.save();
  }

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
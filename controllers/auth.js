const User = require('../models/user.js');
const bcrypt = require('bcryptjs');

exports.getLogin = (req, res, next) => {
  res.render('auth/login', { isAuthenticated: req.session.isAuthenticated });
};

exports.postLogin = (req, res, next) => {

  User.findOne({ email: req.body.email })
    .then(user => {
      if (bcrypt.compareSync(req.body.password, user.hashedPassword)) {
        req.session.userId = user._id;
        req.session.isAuthenticated = true;
        req.session.save(err => {
          console.log(err);
          res.redirect('/');
        });
        return;
      }
      console.log('Information Incorrect or User does not exist...');
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

  User.findOne({ email: email })
    .then(user => {
      if (!user && password === confirmPassword) {

        const hashedPassword = bcrypt.hashSync(password, 14);
        const newUser = new User({
          name,
          email,
          hashedPassword
        });
        newUser.save();

        return res.redirect('login');
      }
      console.log('User already exists or incorret information provided...');
      res.redirect('signup');
    })
    .catch(err => console.log(err));

};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    if (!err) {
      return res.redirect('login');
    }
    console.log(err);
  });
};
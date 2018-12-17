const User = require('../models/user.js');
const bcrypt = require('bcryptjs');
const sgMail = require('@sendgrid/mail');
const crypto = require('crypto');

exports.getLogin = (req, res, next) => {
  res.render('auth/login');
};

exports.postLogin = (req, res, next) => {

  User.findOne({ email: req.body.email })
    .then(user => {
      if (user) {
        if (bcrypt.compareSync(req.body.password, user.hashedPassword)) {
          req.session.userId = user._id;
          req.session.isAuthenticated = true;
          req.session.save(err => {
            if (err) {
              console.log(err);
            }
            req.flash('messages', 'Successfully logged in...');
            req.flash('classes', 'success');
            res.redirect('/');
          });
          return;
        }
      }
      req.flash('messages', 'Information Incorrect or User does not exist, please re-enter information or sign up...');
      req.flash('classes', 'warning');
      res.redirect('login');
    })
    .catch(err => console.log(err));
};

exports.getSignup = (req, res, next) => {
  res.render('auth/signup');
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

        sgMail.setApiKey(process.env.SENDGRID_KEY);
        const msg = {
          to: email,
          from: 'support@goalstracker.com',
          subject: 'Your signed up!',
          html: '<h1>Your are now signed up, just log in!</h1>'
        };
        sgMail.send(msg);

        req.flash('messages', 'You have signed up successfully, please check your email for account verification...');
        req.flash('classes', 'success');
        return res.redirect('login');
      }
      req.flash('messages', 'User with that email already exists or passwords fields do not match...');
      req.flash('classes', 'warning');
      res.redirect('signup');
    })
    .catch(err => console.log(err));

};

exports.getLogout = (req, res, next) => {
  res.render('auth/logout');
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    if (!err) {
      return res.redirect('logout');
    }
    console.log(err);
  });
};

exports.getResetPassword = (req, res, next) => {
  res.render('auth/reset-password');
};

exports.postResetPassword = (req, res, next) => {
  let userEmail = req.body.email;

  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect('reset-password');
    }

    const resetToken = buffer.toString('hex');
    User.findOne({ email: userEmail })
      .then(user => {
        if (!user) {
          userEmail = null;
          req.flash('messages', 'User with that password does not exist...');
          req.flash('classes', 'warning');
          return res.redirect('/auth/reset-password');
        }
        console.log('User found, saving....');
        user.resetToken = resetToken;
        user.resetTokenExpiration = Date.now() + 360000;
        return user.save();
      })
      .then(() => {
        if (userEmail) {

          sgMail.setApiKey(process.env.SENDGRID_KEY);
          const msg = {
            to: req.body.email,
            from: 'support@goalstracker.com',
            subject: 'Password Reset',
            html: `
            <h1>Goals Tracker Reset Password!</h1>
            <P>
            If you did not request a password reset, please head to Goals Tracker website and request a password reset and update your password.
            If you did request a password reset please click reset link below.
            </p>
            <a href="http://localhost:5000/auth/new-password/${resetToken}">Password Reset</a>
            `
          };
          sgMail.send(msg);

          req.flash('messages', 'Your password reset email has been sent, please check in your spam box if not shown in your inbox...');
          req.flash('classes', 'inform');
          res.redirect('/auth/login');
        }
      })
      .catch(err => console.log(err));
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then(user => {
      res.render('auth/new-password', { userId: user._id.toString() });
    })
    .catch(err => console.log(err));
};

exports.postNewPassword = (req, res, next) => {
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  if (password === confirmPassword) {
    User.findOne({ _id: req.body.userId, resetTokenExpiration: { $gt: Date.now() } })
      .then(user => {
        const hashedPassword = bcrypt.hashSync(password, 14);
        user.hashedPassword = hashedPassword;
        return user.save();
      })
      .then(() => {
        res.redirect('login');
      })
      .catch(err => console.log(err));
  }
};
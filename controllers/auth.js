const User = require('../models/user.js');
const bcrypt = require('bcryptjs');
const sgMail = require('@sendgrid/mail');
const crypto = require('crypto');
const { validationResult } = require('express-validator/check');
const cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    errorMessage: req.flash('error'),
    successMessage: req.flash('success')
  });
};

exports.postLogin = (req, res, next) => {

  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user || !bcrypt.compareSync(req.body.password, user.hashedPassword)) {
        req.flash('error', 'Information Incorrect or User does not exist, please re-enter information or sign up...');
        req.session.save(() => {
          res.redirect('login');
        });
      } else {
        req.session.userId = user._id;
        req.session.isAuthenticated = true;
        req.session.save(() => {
          req.flash('success', 'Successfully logged in...');
          res.redirect('/');
        });
      }
    })
    .catch(err => console.log(err));
};

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    errorMessage: req.flash('error'),
    successMessage: req.flash('success'),
    password: '',
    confirmPassword: '',
    email: '',
    name: '',
    validationErrors: []
  });
};

exports.postSignup = (req, res, next) => {

  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const avatar = req.file;
  const setAvatar = req.body.setAvatar;
  const errors = validationResult(req);
  let avatarPathSecure;

  if (!avatar && !setAvatar) {
    return res.status(422).render('auth/signup', {
      errorMessage: 'Click checkbox if you do not wish to set you avatar image at this time, image must be .jpg .jpeg or .png...',
      successMessage: req.flash('success'),
      password: password,
      confirmPassword: req.body.confirmPassword,
      email: email,
      name: name,
      validationErrors: errors.array()
    });
  } else if (avatar && !setAvatar) {
    cloudinary.v2.uploader.upload(avatar.path, function (err, result) {
      if (err) {
        return console.log('Error uploading to cloudinary...');
      }
      avatarPathSecure = result.secure_url;

      if (!errors.isEmpty()) {
        return res.status(422).render('auth/signup', {
          errorMessage: errors.array()[0].msg,
          successMessage: req.flash('success'),
          password: password,
          confirmPassword: req.body.confirmPassword,
          email: email,
          name: name,
          validationErrors: errors.array()
        });
      }

      bcrypt.hash(password, 14)
        .then((hashedPassword) => {
          const newUser = new User({
            name,
            email,
            hashedPassword,
            avatar: avatarPathSecure
          });
          return newUser.save();
        })
        .then(() => {
          sgMail.setApiKey(process.env.SENDGRID_KEY);
          const msg = {
            to: req.body.email,
            from: 'support@goalstracker.com',
            subject: 'Your signed up!',
            html: '<h1>Your are now signed up, just log in!</h1>'
          };
          sgMail.send(msg);
          req.flash('success', 'You have signed up successfully...');
          req.session.save(() => {
            res.redirect('login');
          });
        })
        .catch(err => console.log(err));
    });
  }

};

exports.getLogout = (req, res, next) => {
  res.render('auth/logout');
};

exports.postLogout = (req, res, next) => {
  if (req.session) {
    return req.session.destroy((err) => {

      if (err) {
        console.log(err);
        res.redirect('index');
      } else {
        res.redirect('logout');
      }
    });
  } else {
    res.redirect('index');
  }
};

exports.getResetPassword = (req, res, next) => {
  res.render('auth/reset-password', {
    errorMessage: req.flash('error'),
    successMessage: req.flash('success')
  });
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
          req.flash('error', 'User with that password does not exist...');
          req.session.save(() => {
            res.redirect('/auth/reset-password');
          });
          return;
        }
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
            <a href="https://sheltered-thicket-56176.herokuapp.com/auth/new-password/${resetToken}">Password Reset</a>
            `
          };
          sgMail.send(msg);
          req.flash('success', 'Your password reset email has been sent, please check in your spam box if not shown in your inbox...');
          req.session.save(() => {
            res.redirect('/');
          });
        }
      })
      .catch(err => console.log(err));
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then(user => {
      res.render('auth/new-password', {
        token: token,
        userId: user._id.toString(),
        errorMessage: req.flash('error'),
        successMessage: req.flash('success')
      });
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
        user.save((err) => {
          if (!err) {
            req.flash('success', 'Your password has been reset, you may now log in with new password...');
            req.session.save(() => {
              res.redirect('login');
            });
            return;
          }
          req.flash('error', 'Something went wrong updating password, please contact support...');
          req.session.save(() => {
            res.redirect('login');
          });
          return;
        });
      })
      .catch(err => console.log(err));
  } else {
    req.flash('error', 'Passwords do not...');
    req.session.save(() => {
      res.render(`auth/new-password`, {
        token: req.body.token,
        userId: req.body.userId,
        errorMessage: req.flash('error'),
        successMessage: req.flash('success')
      });
    });
  }
};
exports.getProfile = (req, res, next) => {

  res.render('account/profile', {
    avatarPath: req.user.avatar,
    name: req.user.name,
    errorMessage: [],
    successMessage: []
  });
};
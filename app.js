const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const bodyParser = require('body-parser');
const session = require('express-session');
const MongodbStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('express-flash');
const multer = require('multer');

const User = require('./models/user.js');
const rootDir = require('./util/rootDir.js');

const authRoutes = require('./routes/auth.js');
const goalRoutes = require('./routes/goals.js');
const accountRoutes = require('./routes/account.js');

const app = express();

const PORT = process.env.PORT || 5000;
const DB_URI = process.env.DB_URI;
const SESS_SECRET = process.env.SESS_SECRET;

app.set('views', 'views');
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(rootDir, 'public')));
app.use('/images', express.static(path.join(rootDir, 'images')));

const store = new MongodbStore({
  uri: DB_URI,
  collection: 'sessions',
  autoRemove: 'interval',
  autoRemoveInterval: 24 * 60 * 60 * 1000
},
  function (err) {
    if (err) {
      console.log('Error', err);
    }
  }
);

store.on('error', (err) => {
  console.log('Error', err);
});

const csrfProtection = csrf();

app.use(session({
  secret: SESS_SECRET,
  saveUninitialized: false,
  resave: false,
  store: store,
  cookie: {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  },
  resave: false
}));

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('avatar'));

app.use(csrfProtection);

app.use((req, res, next) => {
  if (!req.session.userId) {
    return next();
  }
  User.findById({ _id: req.session.userId })
    .then(user => {
      if (!user) {
        next();
      }
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isAuthenticated;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use(flash());
app.use('/auth', authRoutes);
app.use('/goals', goalRoutes);
app.use('/account', accountRoutes);


app.use('/', (req, res, next) => {
  res.render('index', {
    errorMessage: req.flash('error'),
    successMessage: req.flash('success')
  });
});

mongoose.connect(DB_URI, { useNewUrlParser: true })
  .then(() => {

    console.log('Connected to Database...');
    app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
  })
  .catch((err) => console.log(err));

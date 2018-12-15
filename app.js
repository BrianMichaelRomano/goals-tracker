const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const bodyParser = require('body-parser');
const session = require('express-session');
const MongodbStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');

const User = require('./models/user.js');
const rootDir = require('./util/rootDir.js');

const authRoutes = require('./routes/auth.js');
const chartRoutes = require('./routes/charts.js');

const app = express();

const PORT = process.env.PORT || 3000;
const DB_URI = process.env.DB_URI;
const SESS_SECRET = process.env.SESS_SECRET;

app.set('views', 'views');
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(rootDir, 'public')));

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

app.use(csrfProtection);

app.use((req, res, next) => {
  if (req.session.user) {
    User.findById({ _id: req.session.userId })
      .then(user => {
        req.user = user;
        next();
      })
      .catch(err => console.log(err));
  } else {
    next();
  }
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isAuthenticated;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use('/auth', authRoutes);
app.use('/charts', chartRoutes);


app.use('/', (req, res, next) => {
  res.render('index');
});

mongoose.connect(DB_URI, { useNewUrlParser: true })
  .then(() => {

    console.log('Connected to Database...');
    app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
  })
  .catch((err) => console.log(err));
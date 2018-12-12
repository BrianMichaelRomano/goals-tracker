const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const session = require('express-session');
const MongodbStore = require('connect-mongodb-session')(session);
const bodyParser = require('body-parser');


const User = require('./models/user.js');

const rootDir = require('./util/rootDir.js');

const app = express();

const PORT = process.env.PORT || 3000;
const DB_URI = process.env.DB_URI;
const SESS_SECRET = process.env.SESS_SECRET;

const store = new MongodbStore({
  uri: DB_URI,
  databaseName: 'goalstracker',
  collection: 'sessions'
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

const authRoutes = require('./routes/auth.js');
const chartRoutes = require('./routes/charts.js');

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));

app.use('/auth', authRoutes);
app.use('/charts', chartRoutes);

app.use(express.static(path.join(rootDir, 'public')));

app.use(session({
  secret: SESS_SECRET,
  saveUninitialized: true,
  store: store,
  cookie: {
    httpOnly: true
  },
  resave: false
}));

app.use('/', (req, res, next) => {
  res.render('index');
});

mongoose.connect(DB_URI, { useNewUrlParser: true })
  .then(() => {

    return User.findOne({ email: 'brian@gmail.com' });
  })
  .then((user) => {
    if (!user) {
      const newUser = new User({
        username: 'Brian',
        email: 'brian@gmail.com',
        password: 'secret'
      });

      return newUser.save()
    }
  })
  .then(() => {

    console.log('Connected to Database...');
    app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
  })
  .catch((err) => console.log(err));
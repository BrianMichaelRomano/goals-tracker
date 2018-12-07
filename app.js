const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

const rootDir = require('./util/rootDir.js');

const app = express();

const PORT = process.env.PORT || 3000;
const DB_URI = process.env.DB_URI;

const authRoutes = require('./routes/auth.js');
const chartRoutes = require('./routes/charts.js');

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use('/auth', authRoutes);
app.use('/charts', chartRoutes);

app.use(express.static(path.join(rootDir, 'public')));

app.use((req, res, next) => {
  res.render('index');
});

mongoose.connect(DB_URI, { useNewUrlParser: true })
  .then(() => {
    console.log('Connected to Database...');
    app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
  })
  .catch((err) => console.log(err));
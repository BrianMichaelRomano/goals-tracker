const express = require('express');
const path = require('path');

const rootDir = require('./util/rootDir.js');

const app = express();
const PORT = process.env.PORT || 3000;

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

app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
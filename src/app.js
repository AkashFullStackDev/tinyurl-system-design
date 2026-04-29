const express = require('express');
const urlRoutes = require('./routes/urlRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();

app.set('trust proxy', true);

app.use(express.json());
app.use('/', urlRoutes);
app.use('/analytics', analyticsRoutes);

module.exports = app;
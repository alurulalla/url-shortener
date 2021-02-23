const express = require('express');
const path = require('path');
const morgan = require('morgan');

const urlShortenerRouter = require('./routes/urlShortenerRouters');

const app = express();

// Access public folder
app.use(express.static(path.join(__dirname, 'public')));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parser, parsing req data;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/v1/urls', urlShortenerRouter);

module.exports = app;

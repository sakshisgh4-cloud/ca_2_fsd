const express = require('express');
const mongoose = require('mongoose');
const feedbackRoutes = require('./routes/feedbackroute');

const app = express();

app.use(express.json());
app.use('/api/feedback', feedbackRoutes);

app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  if (error instanceof mongoose.Error.ValidationError || error instanceof mongoose.Error.CastError) {
    return res.status(400).json({ message: error.message });
  }

  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return res.status(400).json({ message: 'Request body contains invalid JSON.' });
  }

  console.error(error);
  return res.status(500).json({ message: 'An unexpected server error occurred.' });
});

module.exports = app;

require('dotenv').config();

const mongoose = require('mongoose');
const app = require('./app');

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/student-feedback';

if (require.main === module) {
  mongoose
    .connect(MONGODB_URI)
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Student Feedback API listening on port ${PORT}`);
      });
    })
    .catch((error) => {
      console.error('Failed to connect to MongoDB:', error);
      process.exitCode = 1;
    });
}

module.exports = app;

/*const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/student-feedback';
const REVIEW_STATUSES = ['Pending', 'Reviewed'];

const feedbackSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: true,
      trim: true,
    },
    courseName: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      validate: {
        validator: Number.isInteger,
        message: 'Rating must be a whole number between 1 and 5.',
      },
    },
    status: {
      type: String,
      enum: REVIEW_STATUSES,
      default: 'Pending',
    },
  },
  { timestamps: true }
);

const Feedback = mongoose.models.Feedback || mongoose.model('Feedback', feedbackSchema);

app.use(express.json());

app.post('/api/feedback', async (req, res) => {
  const { studentName, courseName, message, rating } = req.body || {};

  if (!studentName || !courseName || !message || rating === undefined) {
    return res.status(400).json({
      message: 'studentName, courseName, message, and rating are required.',
    });
  }

  const feedback = await Feedback.create({ studentName, courseName, message, rating });
  return res.status(201).json(feedback);
});

app.get('/api/feedback', async (req, res) => {
  const page = req.query.page === undefined ? 1 : Number(req.query.page);
  const limit = req.query.limit === undefined ? 10 : Number(req.query.limit);

  if (!Number.isSafeInteger(page) || page < 1 || !Number.isSafeInteger(limit) || limit < 1) {
    return res.status(400).json({ message: 'page and limit must be positive integers.' });
  }

  const skip = (page - 1) * limit;
  if (!Number.isSafeInteger(skip)) {
    return res.status(400).json({ message: 'The requested page offset is too large.' });
  }

  const [feedback, totalRecords] = await Promise.all([
    Feedback.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Feedback.countDocuments(),
  ]);

  return res.json({
    feedback,
    currentPage: page,
    totalRecords,
    totalPages: Math.ceil(totalRecords / limit),
  });
});

app.patch('/api/feedback/:id', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: 'Invalid feedback ID.' });
  }

  const { status } = req.body || {};
  if (!REVIEW_STATUSES.includes(status)) {
    return res.status(400).json({
      message: `status must be one of: ${REVIEW_STATUSES.join(', ')}.`,
    });
  }

  const feedback = await Feedback.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  );

  if (!feedback) {
    return res.status(404).json({ message: 'Feedback record not found.' });
  }

  return res.json(feedback);
});

app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  if (error instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({ message: error.message });
  }

  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return res.status(400).json({ message: 'Request body contains invalid JSON.' });
  }

  console.error(error);
  return res.status(500).json({ message: 'An unexpected server error occurred.' });
});

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

module.exports = app;*/
"use strict";
const express = require('express');
const mongoose = require('mongoose');
const Feedback = require('../models/feedback');
const { REVIEW_STATUSES } = require('../models/feedback');

const router = express.Router();

router.post('/', async (req, res) => {
  const { studentName, courseName, message, rating } = req.body || {};

  if (
    typeof studentName !== 'string' ||
    !studentName.trim() ||
    typeof courseName !== 'string' ||
    !courseName.trim() ||
    typeof message !== 'string' ||
    !message.trim() ||
    rating === undefined
  ) {
    return res.status(400).json({
      message: 'studentName, courseName, message, and rating are required.',
    });
  }

  if (typeof rating !== 'number' || !Number.isInteger(rating) || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'rating must be a whole number between 1 and 5.' });
  }

  const feedback = await Feedback.create({ studentName, courseName, message, rating });
  return res.status(201).json(feedback);
});

router.get('/', async (req, res) => {
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
    Feedback.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
    Feedback.countDocuments(),
  ]);

  return res.json({
    feedback,
    currentPage: page,
    totalRecords,
    totalPages: Math.ceil(totalRecords / limit),
  });
});

router.patch('/:id', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: 'Invalid feedback ID.' });
  }

  const { status } = req.body || {};
  if (typeof status !== 'string' || !REVIEW_STATUSES.includes(status)) {
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

module.exports = router;

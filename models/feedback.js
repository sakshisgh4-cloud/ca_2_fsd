const mongoose = require('mongoose');

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

module.exports = Feedback;
module.exports.REVIEW_STATUSES = REVIEW_STATUSES;

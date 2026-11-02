"use strict";

var express = require('express');

var mongoose = require('mongoose');

var app = express();
var PORT = process.env.PORT || 3000;
var MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/student-feedback';
var REVIEW_STATUSES = ['Pending', 'Reviewed'];
var feedbackSchema = new mongoose.Schema({
  studentName: {
    type: String,
    required: true,
    trim: true
  },
  courseName: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
    validate: {
      validator: Number.isInteger,
      message: 'Rating must be a whole number between 1 and 5.'
    }
  },
  status: {
    type: String,
    "enum": REVIEW_STATUSES,
    "default": 'Pending'
  }
}, {
  timestamps: true
});
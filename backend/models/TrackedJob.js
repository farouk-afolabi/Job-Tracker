const mongoose = require('mongoose');

const TrackedJobSchema = new mongoose.Schema({
  adzunaId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  location: String,
  description: String,
  salaryMin: Number,
  salaryMax: Number,
  url: String,
  status: {
    type: String,
    enum: ['interested', 'applied', 'interview', 'offer', 'rejected'],
    default: 'interested'
  },
  notes: String,
  interviewDate: Date,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

// Prevent duplicate tracking
TrackedJobSchema.index({ adzunaId: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('TrackedJob', TrackedJobSchema);
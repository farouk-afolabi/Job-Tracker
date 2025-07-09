const mongoose = require('mongoose');

const StatusEnum = {
  INTERESTED: 'interested',
  APPLIED: 'applied',
  INTERVIEW: 'interview',
  OFFER: 'offer',
  REJECTED: 'rejected'
};

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
    enum: Object.values(StatusEnum),
    default: StatusEnum.INTERESTED
  },
  notes: String,
  appliedDate: Date,
  interviewDate: Date,
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('TrackedJob', TrackedJobSchema);
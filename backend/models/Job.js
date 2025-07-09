const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  // Reference to the user who created the job
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Links to the User model
    required: true
  },
  // Company name
  company: {
    type: String,
    required: [true, 'Please provide company name'],
    maxlength: 50
  },
  // Job position
  position: {
    type: String,
    required: [true, 'Please provide position'],
    maxlength: 100
  },
  // Application status
  status: {
    type: String,
    enum: ['interview', 'declined', 'pending', 'accepted'],
    default: 'pending'
  },
  // Job type
  jobType: {
    type: String,
    enum: ['full-time', 'part-time', 'remote', 'internship', 'contract'],
    default: 'full-time'
  },
  // Job location
  jobLocation: {
    type: String,
    required: [true, 'Please provide job location'],
    default: 'my city'
  },
  // Additional fields you might want:
  applicationDate: {
    type: Date,
    default: Date.now
  },
  salary: {
    type: Number,
    min: 0
  },
  jobLink: {
    type: String,
    match: [/^https?:\/\//, 'Please provide a valid URL']
  },
  notes: {
    type: String,
    maxlength: 500
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

module.exports = mongoose.model('Job', jobSchema);
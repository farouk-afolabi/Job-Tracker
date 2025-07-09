const Job = require('../models/Job');

// @desc    Get all jobs for a user
// @route   GET /api/jobs
const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ user: req.user.id }); // Only fetch user's jobs
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new job
// @route   POST /api/jobs
const createJob = async (req, res) => {
  try {
    const { company, position, status } = req.body;

    const job = await Job.create({
      user: req.user.id, // Attach user ID from JWT
      company,
      position,
      status,
    });

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a job
// @route   PUT /api/jobs/:id
const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    // Check if job exists and belongs to user
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    if (job.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // Return updated job
    );

    res.json(updatedJob);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a job
// @route   DELETE /api/jobs/:id
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    // Validate ownership
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    if (job.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await job.deleteOne();
    res.json({ message: 'Job removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getJobs,
  createJob,
  updateJob,
  deleteJob,
};
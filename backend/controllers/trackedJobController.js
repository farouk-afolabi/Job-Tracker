const TrackedJob = require('../models/TrackedJob');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');

const trackJob = async (req, res) => {
  req.body.user = req.user.userId;
  const job = await TrackedJob.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};

const getTrackedJobs = async (req, res) => {
  const jobs = await TrackedJob.find({ user: req.user.userId }).sort('-createdAt');
  res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};

const updateJobStatus = async (req, res) => {
  const {
    body: { status, notes, interviewDate },
    user: { userId },
    params: { id: jobId },
  } = req;

  if (!status && !notes && !interviewDate) {
    throw new BadRequestError('Please provide at least one field to update');
  }

  const job = await TrackedJob.findOneAndUpdate(
    { _id: jobId, user: userId },
    req.body,
    { new: true, runValidators: true }
  );

  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`);
  }

  res.status(StatusCodes.OK).json({ job });
};

const deleteTrackedJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;

  const job = await TrackedJob.findOneAndRemove({
    _id: jobId,
    user: userId,
  });

  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`);
  }

  res.status(StatusCodes.OK).send();
};

module.exports = {
  trackJob,
  getTrackedJobs,
  updateJobStatus,
  deleteTrackedJob
};
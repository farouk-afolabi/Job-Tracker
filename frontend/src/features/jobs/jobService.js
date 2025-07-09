import axios from 'axios';

const API_URL = '/api/jobs/';

// Create new job
const createJob = async (jobData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(API_URL, jobData, config);
  return response.data;
};

// Get user jobs
const getJobs = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL, config);
  return response.data;
};

// Update job
const updateJob = async (jobId, jobData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(API_URL + jobId, jobData, config);
  return response.data;
};

// Delete job
const deleteJob = async (jobId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.delete(API_URL + jobId, config);
  return response.data;
};

const jobService = {
  createJob,
  getJobs,
  updateJob,
  deleteJob,
};

export default jobService;
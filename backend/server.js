require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

// Adzuna API Configuration
const ADZUNA_BASE_URL = 'https://api.adzuna.com/v1/api/jobs/ca';
const ADZUNA_ID = process.env.ADZUNA_APP_ID;
const ADZUNA_KEY = process.env.ADZUNA_APP_KEY;

// Cache setup
let jobCache = {
  data: null,
  lastUpdated: null,
  ttl: 30 * 60 * 1000 // 30 minutes
};

// Fetch jobs from Adzuna
const fetchAdzunaJobs = async (params = {}) => {
  try {
    const response = await axios.get(`${ADZUNA_BASE_URL}/search/1`, {
      params: {
        app_id: ADZUNA_ID,
        app_key: ADZUNA_KEY,
        results_per_page: 50,
        sort_by: 'date',
        where: 'Canada',
        ...params
      }
    });
    return response.data.results;
  } catch (error) {
    console.error('Adzuna API error:', error.message);
    throw error;
  }
};

// API Endpoint
app.get('/api/jobs', async (req, res) => {
  try {
    // Check cache first
    if (jobCache.data && Date.now() - jobCache.lastUpdated < jobCache.ttl) {
      return res.json(jobCache.data);
    }
    
    // Get query parameters
    const { q: query, location, salary_min } = req.query;
    
    // Fetch fresh data
    const jobs = await fetchAdzunaJobs({
      what: query,
      where: location,
      salary_min: salary_min
    });
    
    // Update cache
    jobCache = {
      data: jobs,
      lastUpdated: Date.now(),
      ttl: 30 * 60 * 1000
    };
    
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

// Province-based filtering
app.get('/api/jobs/province/:province', async (req, res) => {
  try {
    const { province } = req.params;
    const jobs = await fetchAdzunaJobs({
      where: province
    });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
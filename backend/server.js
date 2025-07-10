require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const axios = require('axios');

// Initialize Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

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

// Models
const User = require('./models/User');
const TrackedJob = require('./models/TrackedJob');

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

// ======================
// API Endpoints
// ======================

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});

// Public Job Search
app.get('/api/jobs', async (req, res) => {
  try {
    // Check cache first
    if (jobCache.data && Date.now() - jobCache.lastUpdated < jobCache.ttl) {
      return res.json(jobCache.data);
    }
    
    const { q: query, location, salary_min } = req.query;
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

// ======================
// Authentication Routes
// ======================

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Create user
    const user = await User.create({ name, email, password });
    res.status(201).json({ user: { id: user._id, name: user.name } });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token (simplified)
    const token = user.generateJWT();
    res.json({ token, user: { id: user._id, name: user.name } });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// ======================
// Protected Job Tracking Routes
// ======================

const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    // Verify token (simplified)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId);
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

app.post('/api/jobs/track', authenticate, async (req, res) => {
  try {
    const { adzunaId, title, company, location, description, salaryMin, salaryMax, url } = req.body;
    
    // Check if already tracked
    const existingJob = await TrackedJob.findOne({ 
      adzunaId,
      user: req.user._id 
    });
    
    if (existingJob) {
      return res.status(400).json({ error: 'Job already tracked' });
    }

    const job = await TrackedJob.create({
      adzunaId,
      title,
      company,
      location,
      description,
      salaryMin,
      salaryMax,
      url,
      user: req.user._id,
      status: 'interested'
    });

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ error: 'Failed to track job' });
  }
});

app.get('/api/jobs/tracked', authenticate, async (req, res) => {
  try {
    const jobs = await TrackedJob.find({ user: req.user._id });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tracked jobs' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
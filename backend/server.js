require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const axios = require('axios');
const jwt = require('jsonwebtoken'); // Add this import

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

// Job Search (updated to match frontend expectations)
app.get('/api/jobs/search', async (req, res) => {
  try {
    const { keyword, location, salary_min, salary_max, job_type } = req.query;
    const jobs = await fetchAdzunaJobs({
      what: keyword,
      where: location,
      salary_min: salary_min,
      salary_max: salary_max
    });
    
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

// Keep existing endpoint for backward compatibility
app.get('/api/jobs', async (req, res) => {
  try {
    const { q: query, location, salary_min } = req.query;
    const jobs = await fetchAdzunaJobs({
      what: query,
      where: location,
      salary_min: salary_min
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
    const token = user.generateJWT();
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email } });
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

    const token = user.generateJWT();
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Add missing verify token endpoint
app.post('/api/auth/verify', async (req, res) => {
  try {
    const { token } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// ======================
// Protected Job Tracking Routes
// ======================

const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId);
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

app.post('/api/jobs/track', authenticate, async (req, res) => {
  try {
    const { id, title, company, location, description, salary_min, salary_max, url } = req.body;
    
    // Check if already tracked
    const existingJob = await TrackedJob.findOne({ 
      adzunaId: id,
      user: req.user._id 
    });
    
    if (existingJob) {
      return res.status(400).json({ error: 'Job already tracked' });
    }

    const job = await TrackedJob.create({
      adzunaId: id,
      title,
      company: company?.display_name || company,
      location: location?.display_name || location,
      description,
      salaryMin: salary_min,
      salaryMax: salary_max,
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

// Add missing update endpoint
app.put('/api/jobs/tracked/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const job = await TrackedJob.findOneAndUpdate(
      { _id: id, user: req.user._id },
      updates,
      { new: true }
    );
    
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    res.json(job);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update job' });
  }
});

// Add missing delete endpoint
app.delete('/api/jobs/tracked/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    
    const job = await TrackedJob.findOneAndDelete({ _id: id, user: req.user._id });
    
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    res.json({ message: 'Job removed from tracking' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete job' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
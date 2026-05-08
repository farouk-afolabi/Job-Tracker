require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const axios = require('axios');

const app = express();

// CORS — reads from env so it works locally and in production.
// Set ALLOWED_ORIGINS=https://yourapp.netlify.app in production.
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:3000'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// Rate limiter for auth endpoints — prevents brute-force attacks.
// Allows 20 attempts per 15 minutes per IP.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Too many requests, please try again later' },
});

// Database connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

const User = require('./models/User');
const TrackedJob = require('./models/TrackedJob');

// ======================
// Auth middleware
// Reads the JWT from the Authorization header ("Bearer <token>"),
// verifies it, and attaches the user to req.user for route handlers.
// ======================
const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId).select('-password');
    if (!req.user) return res.status(401).json({ error: 'User not found' });

    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// ======================
// Health check
// ======================
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

// ======================
// Auth routes
// ======================

app.post('/api/auth/register', authLimiter, async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    if (await User.findOne({ email })) {
      return res.status(400).json({ error: 'An account with that email already exists' });
    }

    const user = await User.create({ name, email, password });
    const token = user.generateJWT();

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/auth/login', authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = user.generateJWT();
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Verify route — used on page load to check if a stored token is still valid.
// Uses the authenticate middleware so it reads from the Authorization header.
app.get('/api/auth/verify', authenticate, (req, res) => {
  res.json({ id: req.user._id, name: req.user.name, email: req.user.email });
});

// ======================
// Job tracking routes
// ======================

app.post('/api/jobs/track', authenticate, async (req, res) => {
  try {
    const { id, title, company, location, description, salary_min, salary_max, url } = req.body;

    if (await TrackedJob.findOne({ adzunaId: id, user: req.user._id })) {
      return res.status(400).json({ error: 'You are already tracking this job' });
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
      status: 'interested',
    });

    res.status(201).json(job);
  } catch (err) {
    console.error('Track job error:', err);
    res.status(500).json({ error: 'Failed to track job' });
  }
});

app.get('/api/jobs/tracked', authenticate, async (req, res) => {
  try {
    const jobs = await TrackedJob.find({ user: req.user._id }).sort('-createdAt');
    res.json(jobs);
  } catch (err) {
    console.error('Get tracked jobs error:', err);
    res.status(500).json({ error: 'Failed to fetch tracked jobs' });
  }
});

app.put('/api/jobs/tracked/:id', authenticate, async (req, res) => {
  try {
    const { status, notes, interviewDate } = req.body;
    const job = await TrackedJob.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { status, notes, interviewDate },
      { new: true, runValidators: true }
    );
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json(job);
  } catch (err) {
    console.error('Update job error:', err);
    res.status(500).json({ error: 'Failed to update job' });
  }
});

app.delete('/api/jobs/tracked/:id', authenticate, async (req, res) => {
  try {
    const job = await TrackedJob.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json({ message: 'Job removed from tracking' });
  } catch (err) {
    console.error('Delete job error:', err);
    res.status(500).json({ error: 'Failed to delete job' });
  }
});

// ======================
// Job search — Adzuna US, Adzuna CA, and Jooble in parallel
// ======================
app.get('/api/jobs/search', authenticate, async (req, res) => {
  try {
    const { keywords, location } = req.query;

    if (!keywords) {
      return res.status(400).json({ error: 'Keywords are required to search' });
    }

    const adzunaParams = {
      app_id: process.env.ADZUNA_APP_ID,
      app_key: process.env.ADZUNA_APP_KEY,
      what: keywords,
      where: location || '',
      results_per_page: 20,
    };

    // allSettled means one failing source never blocks the others
    const [usResult, caResult, joobleResult] = await Promise.allSettled([
      axios.get('https://api.adzuna.com/v1/api/jobs/us/search/1', { params: adzunaParams }),
      axios.get('https://api.adzuna.com/v1/api/jobs/ca/search/1', { params: adzunaParams }),
      axios.post(`https://jooble.org/api/${process.env.JOOBLE_API_KEY}`, {
        keywords,
        location: location || '',
        resultsOnPage: 20,
      }),
    ]);

    const usJobs = usResult.status === 'fulfilled'
      ? usResult.value.data.results.map(job => ({ ...job, country: 'US', source: 'Adzuna' }))
      : [];

    const caJobs = caResult.status === 'fulfilled'
      ? caResult.value.data.results.map(job => ({ ...job, country: 'CA', source: 'Adzuna' }))
      : [];

    // Normalize Jooble's different field names to match the Adzuna shape
    const joobleJobs = joobleResult.status === 'fulfilled'
      ? (joobleResult.value.data.jobs || []).map(job => ({
          id: job.link,
          title: job.title,
          company: { display_name: job.company || 'Unknown' },
          location: { display_name: job.location },
          description: job.snippet,
          salary_min: null,
          salary_max: null,
          salary_string: job.salary || null,
          redirect_url: job.link,
          source: 'Jooble',
        }))
      : [];

    const allJobs = [...usJobs, ...caJobs, ...joobleJobs];

    if (allJobs.length === 0) {
      return res.status(500).json({ error: 'All job sources failed to respond' });
    }

    res.json(allJobs);
  } catch (err) {
    console.error('Job search error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const express = require('express');
const router = express.Router();
const axios = require('axios');
const { protect } = require('../middleware/auth');

// Adzuna API config
const ADZUNA_APP_ID = process.env.ADZUNA_APP_ID;
const ADZUNA_APP_KEY = process.env.ADZUNA_APP_KEY;
const ADZUNA_API_URL = 'https://api.adzuna.com/v1/api/jobs/ca/search/1';

// Fetch jobs from Adzuna (protected route)
router.get('/', protect, async (req, res) => {
  try {
    const { keywords, location } = req.query; // e.g., ?keywords=react&location=toronto

    const response = await axios.get(ADZUNA_API_URL, {
      params: {
        app_id: ADZUNA_APP_ID,
        app_key: ADZUNA_APP_KEY,
        what: keywords,
        where: location,
      },
    });

    res.json(response.data.results);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch jobs' });
  }
});

module.exports = router;
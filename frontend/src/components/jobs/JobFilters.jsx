import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Paper,
  Typography
} from '@mui/material';

export default function JobFilters({ onSearch }) {
  const [filters, setFilters] = useState({
    keyword: '',
    location: '',
    salary_min: '',
    salary_max: '',
    job_type: ''
  });

  const handleChange = (field) => (event) => {
    setFilters(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Remove empty filters
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== '')
    );
    onSearch(cleanFilters);
  };

  const handleClear = () => {
    setFilters({
      keyword: '',
      location: '',
      salary_min: '',
      salary_max: '',
      job_type: ''
    });
    onSearch({});
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Search Jobs
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Job Title or Keywords"
              value={filters.keyword}
              onChange={handleChange('keyword')}
              placeholder="e.g., Software Engineer, React Developer"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Location"
              value={filters.location}
              onChange={handleChange('location')}
              placeholder="e.g., New York, NY"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Minimum Salary"
              type="number"
              value={filters.salary_min}
              onChange={handleChange('salary_min')}
              placeholder="50000"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Maximum Salary"
              type="number"
              value={filters.salary_max}
              onChange={handleChange('salary_max')}
              placeholder="100000"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Job Type</InputLabel>
              <Select
                value={filters.job_type}
                onChange={handleChange('job_type')}
                label="Job Type"
              >
                <MenuItem value="">All Types</MenuItem>
                <MenuItem value="full-time">Full Time</MenuItem>
                <MenuItem value="part-time">Part Time</MenuItem>
                <MenuItem value="contract">Contract</MenuItem>
                <MenuItem value="internship">Internship</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button variant="outlined" onClick={handleClear}>
                Clear Filters
              </Button>
              <Button variant="contained" type="submit">
                Search Jobs
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
} 
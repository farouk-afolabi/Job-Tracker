import React, { useState, useEffect } from 'react';
import { 
  Container,
  TextField,
  Select,
  MenuItem,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Chip,
  Box
} from '@mui/material';
import axios from 'axios';

const provinces = [
  { code: 'all', name: 'All Canada' },
  { code: 'ON', name: 'Ontario' },
  { code: 'QC', name: 'Quebec' },
  { code: 'BC', name: 'British Columbia' },
  { code: 'AB', name: 'Alberta' },
  { code: 'MB', name: 'Manitoba' },
  { code: 'SK', name: 'Saskatchewan' },
  { code: 'NS', name: 'Nova Scotia' },
  { code: 'NB', name: 'New Brunswick' },
  { code: 'NL', name: 'Newfoundland' },
  { code: 'PE', name: 'PEI' },
  { code: 'NT', name: 'Northwest Territories' },
  { code: 'YT', name: 'Yukon' },
  { code: 'NU', name: 'Nunavut' }
];

const JobBoard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    query: '',
    province: 'all',
    salary: ''
  });

  const fetchJobs = async () => {
    setLoading(true);
    try {
      let url = '/api/jobs';
      if (filters.province !== 'all') {
        url = `/api/jobs/province/${filters.province}`;
      }
      
      const params = new URLSearchParams();
      if (filters.query) params.append('q', filters.query);
      if (filters.salary) params.append('salary_min', filters.salary);
      
      const response = await axios.get(`${url}?${params.toString()}`);
      setJobs(response.data);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [filters.province]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ 
        display: 'flex', 
        gap: 2, 
        mb: 4,
        flexDirection: { xs: 'column', sm: 'row' }
      }}>
        <TextField
          label="Job Title or Keywords"
          fullWidth
          value={filters.query}
          onChange={(e) => setFilters({...filters, query: e.target.value})}
        />
        
        <Select
          value={filters.province}
          onChange={(e) => setFilters({...filters, province: e.target.value})}
          sx={{ minWidth: 200 }}
        >
          {provinces.map((province) => (
            <MenuItem key={province.code} value={province.code}>
              {province.name}
            </MenuItem>
          ))}
        </Select>
        
        <TextField
          label="Min Salary (CAD)"
          type="number"
          value={filters.salary}
          onChange={(e) => setFilters({...filters, salary: e.target.value})}
          sx={{ minWidth: 150 }}
        />
        
        <Button 
          variant="contained" 
          onClick={fetchJobs}
          disabled={loading}
          sx={{ height: 56 }}
        >
          Search
        </Button>
      </Box>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {jobs.map((job) => (
            <Grid item xs={12} sm={6} md={4} key={job.id}>
              <JobCard job={job} />
            </Grid>
          ))}
        </Grid>
      )}
      
      {!loading && jobs.length === 0 && (
        <Typography variant="h6" textAlign="center" sx={{ py: 4 }}>
          No jobs found. Try different search criteria.
        </Typography>
      )}
    </Container>
  );
};

const JobCard = ({ job }) => {
  const salary = job.salary_min ? 
    `$${job.salary_min.toLocaleString()}${job.salary_max ? ` - $${job.salary_max.toLocaleString()}` : '+'}` : 
    'Not specified';
    
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" gutterBottom>
          {job.title}
        </Typography>
        <Typography color="text.secondary" gutterBottom>
          {job.company.display_name}
        </Typography>
        <Typography variant="body2" gutterBottom>
          {job.location.display_name}
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Chip label={salary} size="small" />
          {job.contract_type && (
            <Chip label={job.contract_type} size="small" variant="outlined" />
          )}
        </Box>
        
        <Typography variant="body2" sx={{ 
          mb: 2,
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {job.description.replace(/<[^>]*>/g, '')}
        </Typography>
      </CardContent>
      
      <Box sx={{ p: 2 }}>
        <Button 
          variant="contained" 
          fullWidth 
          href={job.redirect_url} 
          target="_blank"
        >
          View Job
        </Button>
      </Box>
    </Card>
  );
};

export default JobBoard;
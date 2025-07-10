import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import JobCard from './JobCard';

export default function JobList({ jobs, loading, onTrack, isAuthenticated }) {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!jobs || jobs.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="textSecondary">
          No jobs found. Try adjusting your search criteria.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Found {jobs.length} job{jobs.length !== 1 ? 's' : ''}
      </Typography>
      {jobs.map((job) => (
        <JobCard
          key={job.id}
          job={job}
          onTrack={onTrack}
          isAuthenticated={isAuthenticated}
        />
      ))}
    </Box>
  );
} 
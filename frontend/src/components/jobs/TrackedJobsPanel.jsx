import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Chip
} from '@mui/material';
import { getTrackedJobs, updateTrackedJob, deleteTrackedJob } from '../../services/api';
import TrackedJobCard from './TrackedJobCard';

export default function TrackedJobsPanel() {
  const [trackedJobs, setTrackedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadTrackedJobs();
  }, []);

  const loadTrackedJobs = async () => {
    try {
      setLoading(true);
      const jobs = await getTrackedJobs();
      setTrackedJobs(jobs);
    } catch (err) {
      setError('Failed to load tracked jobs');
      console.error('Error loading tracked jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateJob = async (jobId, updates) => {
    try {
      const updatedJob = await updateTrackedJob(jobId, updates);
      setTrackedJobs(prev => 
        prev.map(job => job.id === jobId ? updatedJob : job)
      );
    } catch (err) {
      setError('Failed to update job');
      console.error('Error updating job:', err);
    }
  };

  const handleDeleteJob = async (jobId) => {
    try {
      await deleteTrackedJob(jobId);
      setTrackedJobs(prev => prev.filter(job => job.id !== jobId));
    } catch (err) {
      setError('Failed to delete job');
      console.error('Error deleting job:', err);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  if (trackedJobs.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="textSecondary" gutterBottom>
          No tracked jobs yet
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Start searching for jobs and track the ones you're interested in!
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">
          My Tracked Jobs ({trackedJobs.length})
        </Typography>
        <Button variant="outlined" onClick={loadTrackedJobs}>
          Refresh
        </Button>
      </Box>
      
      {trackedJobs.map((job) => (
        <TrackedJobCard
          key={job.id}
          job={job}
          onUpdate={(updates) => handleUpdateJob(job.id, updates)}
          onDelete={() => handleDeleteJob(job.id)}
        />
      ))}
    </Box>
  );
} 
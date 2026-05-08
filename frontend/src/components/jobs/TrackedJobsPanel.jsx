import { useState, useEffect } from 'react';
<<<<<<< HEAD
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
=======
import { Box, Typography, CircularProgress, Alert, Button } from '@mui/material';
import { getTrackedJobs, updateTrackedJob, deleteTrackedJob } from '../../services/api';
import TrackedJobCard from './TrackedJobCard';

// refreshKey comes from JobBoard — whenever it increments, we re-fetch.
// This is how tracking a new job from the Search tab instantly shows up here.
export default function TrackedJobsPanel({ refreshKey }) {
>>>>>>> Fix broken features, security hardening, and UI consistency
  const [trackedJobs, setTrackedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadTrackedJobs();
<<<<<<< HEAD
  }, []);
=======
  }, [refreshKey]);
>>>>>>> Fix broken features, security hardening, and UI consistency

  const loadTrackedJobs = async () => {
    try {
      setLoading(true);
<<<<<<< HEAD
      const jobs = await getTrackedJobs();
      setTrackedJobs(jobs);
    } catch (err) {
      setError('Failed to load tracked jobs');
      console.error('Error loading tracked jobs:', err);
=======
      setError('');
      const jobs = await getTrackedJobs();
      setTrackedJobs(jobs);
    } catch (err) {
      setError(err.message || 'Failed to load tracked jobs');
>>>>>>> Fix broken features, security hardening, and UI consistency
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateJob = async (jobId, updates) => {
    try {
      const updatedJob = await updateTrackedJob(jobId, updates);
<<<<<<< HEAD
      setTrackedJobs(prev => 
        prev.map(job => job.id === jobId ? updatedJob : job)
      );
    } catch (err) {
      setError('Failed to update job');
      console.error('Error updating job:', err);
=======
      // MongoDB uses _id; Mongoose also virtualizes it as id — we use _id explicitly.
      setTrackedJobs(prev => prev.map(job => job._id === jobId ? updatedJob : job));
    } catch (err) {
      setError(err.message || 'Failed to update job');
>>>>>>> Fix broken features, security hardening, and UI consistency
    }
  };

  const handleDeleteJob = async (jobId) => {
    try {
      await deleteTrackedJob(jobId);
<<<<<<< HEAD
      setTrackedJobs(prev => prev.filter(job => job.id !== jobId));
    } catch (err) {
      setError('Failed to delete job');
      console.error('Error deleting job:', err);
=======
      setTrackedJobs(prev => prev.filter(job => job._id !== jobId));
    } catch (err) {
      setError(err.message || 'Failed to delete job');
>>>>>>> Fix broken features, security hardening, and UI consistency
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

<<<<<<< HEAD
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

=======
>>>>>>> Fix broken features, security hardening, and UI consistency
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
<<<<<<< HEAD
      
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
=======

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {trackedJobs.length === 0 ? (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            No tracked jobs yet
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Search for jobs and click "Track Job" on any listing.
          </Typography>
        </Box>
      ) : (
        trackedJobs.map(job => (
          <TrackedJobCard
            key={job._id}
            job={job}
            onUpdate={(updates) => handleUpdateJob(job._id, updates)}
            onDelete={() => handleDeleteJob(job._id)}
          />
        ))
      )}
    </Box>
  );
}
>>>>>>> Fix broken features, security hardening, and UI consistency

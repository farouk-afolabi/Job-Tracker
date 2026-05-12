import { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Alert, Button, Paper } from '@mui/material';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { getTrackedJobs, updateTrackedJob, deleteTrackedJob, getReminders } from '../../services/api';
import TrackedJobCard from './TrackedJobCard';

// refreshKey comes from JobBoard — whenever it increments, we re-fetch.
// This is how tracking a new job from the Search tab instantly shows up here.
export default function TrackedJobsPanel({ refreshKey }) {
  const [trackedJobs, setTrackedJobs] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadTrackedJobs();
  }, [refreshKey]);

  const loadTrackedJobs = async () => {
    try {
      setLoading(true);
      setError('');
      const [jobs, remind] = await Promise.all([getTrackedJobs(), getReminders()]);
      setTrackedJobs(jobs);
      setReminders(remind);
    } catch (err) {
      setError(err.message || 'Failed to load tracked jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateJob = async (jobId, updates) => {
    try {
      const updatedJob = await updateTrackedJob(jobId, updates);
      // MongoDB uses _id; Mongoose also virtualizes it as id — we use _id explicitly.
      setTrackedJobs(prev => prev.map(job => job._id === jobId ? updatedJob : job));
    } catch (err) {
      setError(err.message || 'Failed to update job');
    }
  };

  const handleDeleteJob = async (jobId) => {
    try {
      await deleteTrackedJob(jobId);
      setTrackedJobs(prev => prev.filter(job => job._id !== jobId));
    } catch (err) {
      setError(err.message || 'Failed to delete job');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {reminders.length > 0 && (
        <Paper
          elevation={0}
          sx={{ p: 2, mb: 3, bgcolor: 'warning.light', borderRadius: 2 }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <NotificationsActiveIcon color="warning" fontSize="small" />
            <Typography variant="subtitle2" fontWeight="bold">
              {reminders.length} application{reminders.length > 1 ? 's' : ''} may need a follow-up
            </Typography>
          </Box>
          {reminders.map(job => {
            const days = Math.floor((Date.now() - new Date(job.statusChangedAt)) / 86400000);
            return (
              <Typography key={job._id} variant="body2" sx={{ ml: 3.5 }}>
                • {job.title} at {job.company} — {days} days with no update
              </Typography>
            );
          })}
        </Paper>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">
          My Tracked Jobs ({trackedJobs.length})
        </Typography>
        <Button variant="outlined" onClick={loadTrackedJobs}>
          Refresh
        </Button>
      </Box>

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

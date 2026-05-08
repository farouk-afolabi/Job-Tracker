<<<<<<< HEAD
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
=======
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Tabs, Tab, Box, Alert } from '@mui/material';
>>>>>>> Fix broken features, security hardening, and UI consistency
import JobFilters from './JobFilters';
import JobList from './JobList';
import TrackedJobsPanel from './TrackedJobsPanel';
import { fetchJobs, trackJob } from '../../services/api';

export default function JobBoard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
<<<<<<< HEAD
  const [trackedJobs, setTrackedJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('search');

  const handleSearch = async (filters) => {
    setLoading(true);
    try {
      const results = await fetchJobs(filters);
      setJobs(results);
=======
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [trackError, setTrackError] = useState('');
  const [activeTab, setActiveTab] = useState(0);

  // Incrementing this key tells TrackedJobsPanel to re-fetch from the server.
  // This is how we sync the two tabs without complex shared state.
  const [trackedRefreshKey, setTrackedRefreshKey] = useState(0);

  const handleSearch = async (filters) => {
    setLoading(true);
    setSearchError('');
    try {
      const results = await fetchJobs(filters);
      setJobs(results);
    } catch (err) {
      setSearchError(err.message);
>>>>>>> Fix broken features, security hardening, and UI consistency
    } finally {
      setLoading(false);
    }
  };

  const handleTrackJob = async (job) => {
    if (!user) return;
<<<<<<< HEAD
    try {
      const trackedJob = await trackJob(job);
      setTrackedJobs([...trackedJobs, trackedJob]);
    } catch (error) {
      console.error('Tracking failed:', error);
=======
    setTrackError('');
    try {
      await trackJob(job);
      setTrackedRefreshKey(k => k + 1);
    } catch (err) {
      setTrackError(err.message);
>>>>>>> Fix broken features, security hardening, and UI consistency
    }
  };

  return (
<<<<<<< HEAD
    <div className="job-board">
      <div className="tabs">
        <button onClick={() => setActiveTab('search')}>Job Search</button>
        <button onClick={() => setActiveTab('tracked')}>My Tracked Jobs</button>
      </div>

      {activeTab === 'search' ? (
        <>
          <JobFilters onSearch={handleSearch} />
          <JobList 
            jobs={jobs} 
=======
    <Box>
      <Tabs
        value={activeTab}
        onChange={(_, val) => setActiveTab(val)}
        sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab label="Job Search" />
        <Tab label="My Tracked Jobs" />
      </Tabs>

      {trackError && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setTrackError('')}>
          {trackError}
        </Alert>
      )}

      {activeTab === 0 ? (
        <>
          <JobFilters onSearch={handleSearch} />
          {searchError && <Alert severity="error" sx={{ mb: 2 }}>{searchError}</Alert>}
          <JobList
            jobs={jobs}
>>>>>>> Fix broken features, security hardening, and UI consistency
            loading={loading}
            onTrack={handleTrackJob}
            isAuthenticated={!!user}
          />
        </>
      ) : (
<<<<<<< HEAD
        <TrackedJobsPanel jobs={trackedJobs} />
      )}
    </div>
  );
}
=======
        <TrackedJobsPanel refreshKey={trackedRefreshKey} />
      )}
    </Box>
  );
}
>>>>>>> Fix broken features, security hardening, and UI consistency

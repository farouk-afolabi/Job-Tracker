import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import JobFilters from './JobFilters';
import JobList from './JobList';
import TrackedJobsPanel from './TrackedJobsPanel';
import { fetchJobs, trackJob } from '../../services/api';

export default function JobBoard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [trackedJobs, setTrackedJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('search');

  const handleSearch = async (filters) => {
    setLoading(true);
    try {
      const results = await fetchJobs(filters);
      setJobs(results);
    } finally {
      setLoading(false);
    }
  };

  const handleTrackJob = async (job) => {
    if (!user) return;
    try {
      const trackedJob = await trackJob(job);
      setTrackedJobs([...trackedJobs, trackedJob]);
    } catch (error) {
      console.error('Tracking failed:', error);
    }
  };

  return (
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
            loading={loading}
            onTrack={handleTrackJob}
            isAuthenticated={!!user}
          />
        </>
      ) : (
        <TrackedJobsPanel jobs={trackedJobs} />
      )}
    </div>
  );
}
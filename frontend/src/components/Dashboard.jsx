import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getJobs, reset } from '../features/jobs/jobSlice';
import Spinner from './Spinner';
import JobList from './JobList';
import StatsCard from './StatsCard'; // New component for statistics
import AddJobFAB from './AddJobFAB'; // Floating action button

function Dashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { jobs, isLoading, isError, message } = useSelector(
    (state) => state.jobs
  );

  useEffect(() => {
    if (isError) console.error(message);
    if (user?.token) dispatch(getJobs());
    return () => { dispatch(reset()); };
  }, [user, isError, message, dispatch]);

  if (isLoading) return <Spinner />;

  // Calculate stats
  const stats = {
    total: jobs?.length || 0,
    interview: jobs?.filter(job => job.status === 'interview').length || 0,
    pending: jobs?.filter(job => job.status === 'pending').length || 0,
    declined: jobs?.filter(job => job.status === 'declined').length || 0
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="welcome-section">
          <h1>Welcome back, {user?.name || 'User'} 👋</h1>
          <p>Here's your job application overview</p>
        </div>
        <div className="stats-grid">
          <StatsCard title="Total Applications" value={stats.total} trend="up" />
          <StatsCard title="Interviews" value={stats.interview} color="#3498db" />
          <StatsCard title="Pending" value={stats.pending} color="#f39c12" />
          <StatsCard title="Declined" value={stats.declined} color="#e74c3c" />
        </div>
      </header>

      <main className="dashboard-main">
        <div className="jobs-header">
          <h2>Your Applications</h2>
          <div className="view-controls">
            <button className="view-btn active">All</button>
            <button className="view-btn">Pending</button>
            <button className="view-btn">Interview</button>
          </div>
        </div>
        
        {jobs?.length > 0 ? (
          <JobList jobs={jobs} />
        ) : (
          <div className="empty-state">
            <img src="/empty-state.svg" alt="No jobs" />
            <h3>No applications yet</h3>
            <p>Start by adding your first job application</p>
          </div>
        )}
      </main>

      <AddJobFAB />
    </div>
  );
}

export default Dashboard;
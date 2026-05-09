import { useState, useEffect } from 'react';
import {
  Box, Grid, Paper, Typography, CircularProgress, Alert
} from '@mui/material';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { getTrackedJobs } from '../../services/api';

const STATUS_ORDER = ['interested', 'applied', 'interview', 'offer', 'rejected'];
const STATUS_COLORS = {
  interested: '#9e9e9e',
  applied:    '#2196f3',
  interview:  '#9c27b0',
  offer:      '#4caf50',
  rejected:   '#f44336',
};

function StatCard({ label, value, color }) {
  return (
    <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
      <Typography variant="h3" fontWeight="bold" sx={{ color }}>
        {value}
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
        {label}
      </Typography>
    </Paper>
  );
}

function buildWeeklyData(jobs) {
  const now = new Date();
  return Array.from({ length: 8 }, (_, i) => {
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - 7 * (7 - i));
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 7);
    const label = weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return {
      week: label,
      count: jobs.filter(j => {
        const d = new Date(j.createdAt);
        return d >= weekStart && d < weekEnd;
      }).length,
    };
  });
}

export default function Analytics() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getTrackedJobs()
      .then(setJobs)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  // Derived stats
  const total      = jobs.length;
  const applied    = jobs.filter(j => ['applied', 'interview', 'offer', 'rejected'].includes(j.status)).length;
  const interviews = jobs.filter(j => ['interview', 'offer'].includes(j.status)).length;
  const offers     = jobs.filter(j => j.status === 'offer').length;
  const interviewRate = applied > 0 ? Math.round((interviews / applied) * 100) : 0;

  const statusData = STATUS_ORDER.map(s => ({
    status: s.charAt(0).toUpperCase() + s.slice(1),
    count:  jobs.filter(j => j.status === s).length,
    color:  STATUS_COLORS[s],
  }));

  const weeklyData = buildWeeklyData(jobs);

  const rateColor =
    interviewRate >= 20 ? '#4caf50' :
    interviewRate >= 10 ? '#ff9800' : '#f44336';

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Your Job Search Analytics
      </Typography>

      {total === 0 ? (
        <Alert severity="info" sx={{ mt: 2 }}>
          No tracked jobs yet. Start tracking jobs to see your analytics.
        </Alert>
      ) : (
        <>
          {/* Stat cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={6} md={3}>
              <StatCard label="Total Tracked" value={total} color="text.primary" />
            </Grid>
            <Grid item xs={6} md={3}>
              <StatCard label="Applications Sent" value={applied} color="#2196f3" />
            </Grid>
            <Grid item xs={6} md={3}>
              <StatCard label="Interviews" value={interviews} color="#9c27b0" />
            </Grid>
            <Grid item xs={6} md={3}>
              <StatCard label="Offers" value={offers} color="#4caf50" />
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            {/* Status breakdown */}
            <Grid item xs={12} md={7}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Applications by Status
                </Typography>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={statusData} layout="vertical" margin={{ left: 10 }}>
                    <XAxis type="number" allowDecimals={false} />
                    <YAxis type="category" dataKey="status" width={80} />
                    <Tooltip formatter={(v) => [v, 'Jobs']} />
                    <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                      {statusData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            {/* Interview rate */}
            <Grid item xs={12} md={5}>
              <Paper sx={{ p: 3, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Typography variant="h6" gutterBottom>
                  Interview Rate
                </Typography>
                <Typography variant="h2" fontWeight="bold" sx={{ color: rateColor }}>
                  {interviewRate}%
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                  of applications led to an interview
                </Typography>
                <Typography variant="caption" color="textSecondary" sx={{ mt: 2 }}>
                  Industry average is ~10–15%
                </Typography>
              </Paper>
            </Grid>

            {/* Weekly activity */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Jobs Tracked — Last 8 Weeks
                </Typography>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={weeklyData}>
                    <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                    <YAxis allowDecimals={false} />
                    <Tooltip formatter={(v) => [v, 'Jobs tracked']} />
                    <Bar dataKey="count" fill="#2196f3" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
}

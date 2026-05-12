import { useState } from 'react';
import {
  Card, CardContent, Typography, Button, Chip, Box,
  CircularProgress, Collapse, Divider, Alert
} from '@mui/material';
import { matchJob, getProfile } from '../../services/api';

const sourceChip = {
  'Adzuna-US': { label: 'USA',    color: 'primary' },
  'Adzuna-CA': { label: 'Canada', color: 'success' },
  'Jooble':    { label: 'Jooble', color: 'warning' },
};

function getSourceKey(job) {
  if (job.source === 'Jooble') return 'Jooble';
  if (job.source === 'Adzuna' && job.country === 'US') return 'Adzuna-US';
  if (job.source === 'Adzuna' && job.country === 'CA') return 'Adzuna-CA';
  return null;
}

function salaryLabel(job) {
  if (job.salary_string) return job.salary_string;
  if (job.salary_min) return `$${job.salary_min}${job.salary_max ? `-$${job.salary_max}` : '+'}`;
  return null;
}

function scoreColor(score) {
  if (score >= 70) return 'success';
  if (score >= 40) return 'warning';
  return 'error';
}

export default function JobCard({ job, onTrack, isAuthenticated }) {
  const [match, setMatch]       = useState(null);
  const [scoring, setScoring]   = useState(false);
  const [matchError, setMatchError] = useState('');

  const chip   = sourceChip[getSourceKey(job)];
  const salary = salaryLabel(job);

  const handleMatchScore = async () => {
    setScoring(true);
    setMatchError('');
    try {
      // Check profile is set up before calling the AI — gives a clear message instead of a generic error
      const profile = await getProfile();
      if (!profile.skills && !profile.experience) {
        setMatchError('Set up your profile first (Profile page) so we can score this match.');
        return;
      }
      const result = await matchJob(
        job.title,
        job.company?.display_name || job.company,
        job.description
      );
      setMatch(result);
    } catch (err) {
      setMatchError(err.message);
    } finally {
      setScoring(false);
    }
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6">{job.title}</Typography>
            <Typography color="textSecondary">{job.company?.display_name}</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              {job.location?.display_name}
            </Typography>
          </Box>
          {chip && (
            <Chip
              label={chip.label}
              color={chip.color}
              size="small"
              sx={{ ml: 1, flexShrink: 0 }}
            />
          )}
        </Box>

        {salary && (
          <Box sx={{ mt: 1 }}>
            <Chip label={salary} size="small" variant="outlined" />
          </Box>
        )}

        <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
          {isAuthenticated && (
            <Button variant="contained" size="small" onClick={() => onTrack(job)}>
              Track Job
            </Button>
          )}
          {isAuthenticated && (
            <Button
              variant="outlined"
              size="small"
              onClick={handleMatchScore}
              disabled={scoring}
            >
              {scoring
                ? <><CircularProgress size={14} sx={{ mr: 1 }} />Scoring…</>
                : match ? 'Re-score' : 'AI Match Score'
              }
            </Button>
          )}
        </Box>

        {matchError && (
          <Alert severity="error" sx={{ mt: 2 }} onClose={() => setMatchError('')}>
            {matchError}
          </Alert>
        )}

        <Collapse in={!!match}>
          {match && (
            <Box sx={{ mt: 2 }}>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <Chip
                  label={`${match.score}% Match`}
                  color={scoreColor(match.score)}
                  size="medium"
                />
                <Typography variant="body2">{match.summary}</Typography>
              </Box>

              {match.strengths?.length > 0 && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="caption" color="success.main" fontWeight="bold">
                    STRENGTHS
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 0.5 }}>
                    {match.strengths.map((s, i) => (
                      <Chip key={i} label={s} size="small" color="success" variant="outlined" />
                    ))}
                  </Box>
                </Box>
              )}

              {match.gaps?.length > 0 && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="caption" color="error.main" fontWeight="bold">
                    GAPS
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 0.5 }}>
                    {match.gaps.map((g, i) => (
                      <Chip key={i} label={g} size="small" color="error" variant="outlined" />
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </Collapse>
      </CardContent>
    </Card>
  );
}

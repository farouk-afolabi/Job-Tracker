import { Card, CardContent, Typography, Button, Chip, Box } from '@mui/material';

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

export default function JobCard({ job, onTrack, isAuthenticated }) {
  const chip = sourceChip[getSourceKey(job)];
  const salary = salaryLabel(job);

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

        {isAuthenticated && (
          <Button
            variant="contained"
            size="small"
            sx={{ mt: 2 }}
            onClick={() => onTrack(job)}
          >
            Track Job
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

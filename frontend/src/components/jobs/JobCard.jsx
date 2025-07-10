import { Card, CardContent, Typography, Button, Chip } from '@mui/material';

export default function JobCard({ job, onTrack, isAuthenticated }) {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6">{job.title}</Typography>
        <Typography color="textSecondary">{job.company?.display_name}</Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          {job.location?.display_name}
        </Typography>
        
        {job.salary_min && (
          <Chip 
            label={`$${job.salary_min}${job.salary_max ? `-$${job.salary_max}` : '+'}`}
            size="small" 
            sx={{ mt: 1, mr: 1 }}
          />
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
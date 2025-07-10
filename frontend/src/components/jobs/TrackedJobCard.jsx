import { useState } from 'react';
import { Card, CardContent, Typography, Button, Chip, Box } from '@mui/material';
import JobStatusModal from './JobStatusModal';

export default function TrackedJobCard({ job, onUpdate }) {
  const [openModal, setOpenModal] = useState(false);
  const statusColors = {
    interested: 'default',
    applied: 'primary',
    interview: 'secondary',
    offer: 'success',
    rejected: 'error'
  };

  return (
    <>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6">{job.title}</Typography>
          <Typography color="textSecondary">{job.company}</Typography>
          
          <Box sx={{ display: 'flex', gap: 1, my: 1 }}>
            <Chip 
              label={job.status.toUpperCase()} 
              color={statusColors[job.status]} 
              size="small" 
            />
            {job.salaryMin && (
              <Chip 
                label={`$${job.salaryMin}${job.salaryMax ? `-$${job.salaryMax}` : '+'}`}
                size="small"
                variant="outlined"
              />
            )}
          </Box>

          <Button 
            size="small" 
            variant="outlined"
            onClick={() => setOpenModal(true)}
            sx={{ mr: 1 }}
          >
            Update Status
          </Button>
          <Button 
            size="small" 
            variant="contained"
            href={job.url} 
            target="_blank"
          >
            View Job
          </Button>
        </CardContent>
      </Card>

      <JobStatusModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        job={job}
        onSave={onUpdate}
      />
    </>
  );
}
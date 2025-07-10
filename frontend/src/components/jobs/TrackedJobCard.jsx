import { useState } from 'react';
import { Card, CardContent, Typography, Button, Chip, Box, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import JobStatusModal from './JobStatusModal';

export default function TrackedJobCard({ job, onUpdate, onDelete }) {
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
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box sx={{ flex: 1 }}>
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

              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button 
                  size="small" 
                  variant="outlined"
                  onClick={() => setOpenModal(true)}
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
              </Box>
            </Box>
            
            {onDelete && (
              <IconButton 
                color="error" 
                size="small"
                onClick={() => onDelete(job.id)}
                sx={{ ml: 1 }}
              >
                <DeleteIcon />
              </IconButton>
            )}
          </Box>
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
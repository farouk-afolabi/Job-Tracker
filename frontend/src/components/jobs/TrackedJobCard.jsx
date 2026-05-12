import { useState } from 'react';
import {
  Card, CardContent, Typography, Button, Chip, Box,
  IconButton, Collapse, Divider
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import HistoryIcon from '@mui/icons-material/History';
import JobStatusModal from './JobStatusModal';

const STATUS_COLORS = {
  interested: 'default',
  applied:    'primary',
  interview:  'secondary',
  offer:      'success',
  rejected:   'error',
};

const STATUS_DOT = {
  interested: '#9e9e9e',
  applied:    '#2196f3',
  interview:  '#9c27b0',
  offer:      '#4caf50',
  rejected:   '#f44336',
};

export default function TrackedJobCard({ job, onUpdate, onDelete }) {
  const [openModal, setOpenModal]     = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const history = job.statusHistory || [];

  return (
    <>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6">{job.title}</Typography>
              <Typography color="textSecondary">{job.company}</Typography>

              <Box sx={{ display: 'flex', gap: 1, my: 1, flexWrap: 'wrap' }}>
                <Chip
                  label={job.status.toUpperCase()}
                  color={STATUS_COLORS[job.status]}
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

              {job.notes && (
                <Typography variant="body2" color="textSecondary" sx={{ mb: 1, fontStyle: 'italic' }}>
                  {job.notes}
                </Typography>
              )}

              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Button size="small" variant="outlined" onClick={() => setOpenModal(true)}>
                  Update Status
                </Button>
                {job.url && (
                  <Button size="small" variant="contained" href={job.url} target="_blank">
                    View Job
                  </Button>
                )}
                {history.length > 0 && (
                  <Button
                    size="small"
                    variant="text"
                    startIcon={<HistoryIcon fontSize="small" />}
                    onClick={() => setShowHistory(h => !h)}
                  >
                    {showHistory ? 'Hide' : 'History'} ({history.length})
                  </Button>
                )}
              </Box>
            </Box>

            {onDelete && (
              <IconButton
                color="error"
                size="small"
                onClick={() => onDelete(job._id)}
                sx={{ ml: 1 }}
              >
                <DeleteIcon />
              </IconButton>
            )}
          </Box>

          {/* Status history timeline */}
          <Collapse in={showHistory}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="caption" color="textSecondary" fontWeight="bold">
              APPLICATION HISTORY
            </Typography>
            <Box sx={{ mt: 1, pl: 1 }}>
              {[...history].reverse().map((entry, i) => (
                <Box
                  key={i}
                  sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 1.5, position: 'relative' }}
                >
                  {/* Dot */}
                  <Box sx={{
                    width: 10, height: 10, borderRadius: '50%', flexShrink: 0, mt: 0.5,
                    bgcolor: STATUS_DOT[entry.status] || '#9e9e9e',
                  }} />
                  <Box>
                    <Typography variant="body2" fontWeight="medium" sx={{ textTransform: 'capitalize' }}>
                      {entry.status}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {new Date(entry.changedAt).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'short', day: 'numeric',
                      })}
                    </Typography>
                    {entry.notes && (
                      <Typography variant="caption" color="textSecondary" sx={{ display: 'block', fontStyle: 'italic' }}>
                        "{entry.notes}"
                      </Typography>
                    )}
                  </Box>
                </Box>
              ))}
            </Box>
          </Collapse>
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

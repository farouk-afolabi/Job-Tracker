import { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel
} from '@mui/material';

const statusOptions = [
  { value: 'interested', label: 'Interested' },
  { value: 'applied', label: 'Applied' },
  { value: 'interview', label: 'Interview Scheduled' },
  { value: 'offer', label: 'Offer Received' },
  { value: 'rejected', label: 'Rejected' }
];

export default function JobStatusModal({ open, onClose, job, onSave }) {
  const [status, setStatus] = useState(job.status);
  const [notes, setNotes] = useState(job.notes || '');
  const [interviewDate, setInterviewDate] = useState(job.interviewDate || '');

  const handleSubmit = () => {
    onSave({
      status,
      notes,
      interviewDate: interviewDate || undefined
    });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ 
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: 2
      }}>
        <Typography variant="h6" gutterBottom>
          Update Job Status
        </Typography>
        
        <FormControl fullWidth margin="normal">
          <InputLabel>Status</InputLabel>
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            label="Status"
          >
            {statusOptions.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {status === 'interview' && (
          <TextField
            fullWidth
            margin="normal"
            type="datetime-local"
            label="Interview Date & Time"
            InputLabelProps={{ shrink: true }}
            value={interviewDate}
            onChange={(e) => setInterviewDate(e.target.value)}
          />
        )}

        <TextField
          fullWidth
          margin="normal"
          multiline
          rows={4}
          label="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button onClick={onClose} sx={{ mr: 1 }}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
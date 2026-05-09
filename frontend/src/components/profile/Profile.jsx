import { useState, useEffect } from 'react';
import {
  Box, Paper, Typography, TextField, Button,
  Alert, CircularProgress
} from '@mui/material';
import { getProfile, saveProfile } from '../../services/api';

export default function Profile() {
  const [form, setForm]       = useState({ title: '', skills: '', experience: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);
  const [error, setError]     = useState('');

  useEffect(() => {
    getProfile()
      .then(p => setForm({ title: p.title || '', skills: p.skills || '', experience: p.experience || '' }))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (field) => (e) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    setError('');
    try {
      await saveProfile(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box maxWidth={700}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        My Profile
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
        This is used to score how well job listings match your background.
        Be specific — the more detail you add, the more accurate the AI scoring.
      </Typography>

      <Paper sx={{ p: 4 }}>
        {error  && <Alert severity="error"   sx={{ mb: 2 }}>{error}</Alert>}
        {saved  && <Alert severity="success" sx={{ mb: 2 }}>Profile saved!</Alert>}

        <TextField
          fullWidth
          label="Target Role / Current Title"
          placeholder="e.g. Frontend Developer, Full Stack Engineer"
          value={form.title}
          onChange={handleChange('title')}
          sx={{ mb: 3 }}
        />

        <TextField
          fullWidth
          multiline
          rows={4}
          label="Skills"
          placeholder="e.g. React, Node.js, TypeScript, MongoDB, REST APIs, Git"
          value={form.skills}
          onChange={handleChange('skills')}
          sx={{ mb: 3 }}
          helperText="List your skills separated by commas"
        />

        <TextField
          fullWidth
          multiline
          rows={5}
          label="Experience & Background"
          placeholder="e.g. 2 years building full-stack web apps with React and Node.js. Worked on e-commerce platforms, built REST APIs, familiar with agile teams."
          value={form.experience}
          onChange={handleChange('experience')}
          sx={{ mb: 3 }}
          helperText="Write a short summary of your experience — treat it like a brief bio"
        />

        <Button
          variant="contained"
          size="large"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? <CircularProgress size={22} color="inherit" /> : 'Save Profile'}
        </Button>
      </Paper>
    </Box>
  );
}

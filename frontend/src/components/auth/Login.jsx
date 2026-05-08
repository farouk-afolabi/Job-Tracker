import { useState } from 'react';
<<<<<<< HEAD
import { useAuth } from '../../context/AuthContext';
import { TextField, Button, Container, Box, Typography } from '@mui/material';
=======
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { TextField, Button, Container, Box, Typography, CircularProgress } from '@mui/material';
>>>>>>> Fix broken features, security hardening, and UI consistency

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
<<<<<<< HEAD
=======
  const [loading, setLoading] = useState(false);
>>>>>>> Fix broken features, security hardening, and UI consistency
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
<<<<<<< HEAD
    try {
      await login(email, password);
    } catch (err) {
      setError('Invalid email or password');
=======
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
>>>>>>> Fix broken features, security hardening, and UI consistency
    }
  };

  return (
    <Container maxWidth="sm">
<<<<<<< HEAD
      <Box sx={{ mt: 8, p: 4, boxShadow: 3 }}>
        <Typography variant="h4" gutterBottom>Login</Typography>
        {error && <Typography color="error">{error}</Typography>}
=======
      <Box sx={{ mt: 8, p: 4, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom>Login</Typography>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

>>>>>>> Fix broken features, security hardening, and UI consistency
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
<<<<<<< HEAD
          <Button 
            fullWidth 
            variant="contained" 
            type="submit"
            sx={{ mt: 3 }}
          >
            Login
          </Button>
        </form>
      </Box>
    </Container>
  );
}
=======
          <Button
            fullWidth
            variant="contained"
            type="submit"
            disabled={loading}
            sx={{ mt: 3 }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
          </Button>
        </form>

        <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'inherit' }}>Register here</Link>
        </Typography>
      </Box>
    </Container>
  );
}
>>>>>>> Fix broken features, security hardening, and UI consistency

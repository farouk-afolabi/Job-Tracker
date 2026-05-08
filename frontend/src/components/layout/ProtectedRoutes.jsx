import { Navigate } from 'react-router-dom';
<<<<<<< HEAD
=======
import { Box, CircularProgress } from '@mui/material';
>>>>>>> Fix broken features, security hardening, and UI consistency
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

<<<<<<< HEAD
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return children;
}
=======
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  return children;
}
>>>>>>> Fix broken features, security hardening, and UI consistency

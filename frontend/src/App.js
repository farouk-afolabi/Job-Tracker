import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './context/AuthContext';
import NavBar from './components/layout/NavBar';
import ProtectedRoute from './components/layout/ProtectedRoutes';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import JobBoard from './components/jobs/JobBoard';
import { Container, Box } from '@mui/material';
import theme from './theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Box 
            sx={{ 
              minHeight: '100vh',
              display: 'flex',
              flexDirection: 'column',
              bgcolor: 'background.default'
            }}
          >
            <NavBar />
            <Container 
              maxWidth="lg" 
              sx={{ 
                mt: 3, 
                mb: 3, 
                flex: 1,
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <Routes>
                {/* Redirect root to dashboard */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                
                {/* Protected routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <JobBoard />
                  </ProtectedRoute>
                } />
                
                {/* Public routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Catch all route - redirect to dashboard */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </Container>
          </Box>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
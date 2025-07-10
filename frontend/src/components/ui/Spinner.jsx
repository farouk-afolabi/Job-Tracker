import { Box, CircularProgress } from '@mui/material';

const Spinner = () => {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '200px' 
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default Spinner;
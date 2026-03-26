import { Box, CircularProgress, Typography } from '@mui/material';

export default function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 8, gap: 2 }}>
      <CircularProgress size={36} thickness={4} sx={{ color: '#e8673a' }} />
      <Typography variant="body2" sx={{ color: '#6b6b8a', fontFamily: '"DM Mono", monospace', fontSize: '0.75rem' }}>
        {message}
      </Typography>
    </Box>
  );
}

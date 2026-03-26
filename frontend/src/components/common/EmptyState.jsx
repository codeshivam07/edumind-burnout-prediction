import { Box, Typography, Button } from '@mui/material';
import { InboxRounded } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export default function EmptyState({ message = 'No data yet', actionLabel, actionPath }) {
  const navigate = useNavigate();
  return (
    <Box sx={{ textAlign: 'center', py: 8 }}>
      <InboxRounded sx={{ fontSize: 48, color: '#d0d0e0', mb: 2 }} />
      <Typography variant="body1" sx={{ color: '#6b6b8a', mb: 2 }}>{message}</Typography>
      {actionLabel && (
        <Button variant="contained" color="primary" onClick={() => navigate(actionPath)}>
          {actionLabel}
        </Button>
      )}
    </Box>
  );
}

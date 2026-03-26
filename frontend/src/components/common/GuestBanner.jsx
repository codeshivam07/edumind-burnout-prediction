import { Box, Typography, Button, Chip } from '@mui/material';
import { VisibilityRounded, LoginRounded } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export default function GuestBanner() {
  const navigate = useNavigate();

  return (
    <Box sx={{
      mx: { xs: 2, md: 3 }, mt: 2, mb: -1,
      px: 2.5, py: 1.5,
      borderRadius: '12px',
      background: 'linear-gradient(135deg, rgba(232,103,58,0.10), rgba(245,184,51,0.08))',
      border: '1.5px dashed rgba(232,103,58,0.35)',
      display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap',
    }}>
      <VisibilityRounded sx={{ color: '#e8673a', fontSize: 18, flexShrink: 0 }} />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.25 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, color: '#1a1a2e' }}>
            Guest Mode
          </Typography>
          <Chip
            label="Sample data only"
            size="small"
            sx={{ height: 18, fontSize: '0.62rem', bgcolor: 'rgba(232,103,58,0.12)', color: '#e8673a', fontFamily: '"DM Mono", monospace' }}
          />
        </Box>
        <Typography sx={{ fontSize: '0.75rem', color: '#6b6b8a' }}>
          You are browsing with sample data. No predictions are saved. Sign up to track your real wellness.
        </Typography>
      </Box>
      <Button
        size="small"
        variant="contained"
        color="secondary"
        startIcon={<LoginRounded />}
        onClick={() => navigate('/register')}
        sx={{ flexShrink: 0, fontSize: '0.78rem', py: 0.75 }}
      >
        Sign up free
      </Button>
    </Box>
  );
}

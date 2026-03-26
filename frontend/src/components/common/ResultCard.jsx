import { Card, CardContent, Box, Typography, Chip, LinearProgress } from '@mui/material';

export default function ResultCard({ title, value, label, color = 'primary', icon, progress }) {
  const colorMap = {
    success: '#2ecc8f',
    warning: '#f0a500',
    error: '#e84040',
    info: '#3a86e8',
    secondary: '#e8673a',
    primary: '#1a1a2e',
  };
  const accent = colorMap[color] || colorMap.primary;

  return (
    <Card sx={{
      border: `1.5px solid ${accent}33`,
      bgcolor: `${accent}08`,
      height: '100%',
    }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          {icon && <Box sx={{ color: accent, display: 'flex' }}>{icon}</Box>}
          <Typography variant="overline" sx={{ color: '#6b6b8a' }}>{title}</Typography>
        </Box>
        <Typography variant="h3" sx={{ fontWeight: 700, color: accent, mb: 1 }}>
          {value}
        </Typography>
        <Chip label={label} size="small" sx={{
          bgcolor: `${accent}18`, color: accent,
          fontWeight: 600, borderRadius: '8px', fontSize: '0.78rem',
        }} />
        {progress !== undefined && (
          <Box sx={{ mt: 2 }}>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 6, borderRadius: 3,
                bgcolor: `${accent}18`,
                '& .MuiLinearProgress-bar': { bgcolor: accent, borderRadius: 3 },
              }}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

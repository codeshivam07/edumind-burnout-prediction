import { Card, CardContent, Box, Typography, Chip } from '@mui/material';

export default function StatCard({ title, value, label, color = 'primary', icon, subtitle }) {
  const colorMap = {
    success: { bg: 'rgba(46,204,143,0.08)', border: 'rgba(46,204,143,0.25)', accent: '#2ecc8f' },
    warning: { bg: 'rgba(240,165,0,0.08)', border: 'rgba(240,165,0,0.25)', accent: '#f0a500' },
    error: { bg: 'rgba(232,64,64,0.08)', border: 'rgba(232,64,64,0.25)', accent: '#e84040' },
    info: { bg: 'rgba(58,134,232,0.08)', border: 'rgba(58,134,232,0.25)', accent: '#3a86e8' },
    secondary: { bg: 'rgba(232,103,58,0.08)', border: 'rgba(232,103,58,0.25)', accent: '#e8673a' },
    primary: { bg: 'rgba(26,26,46,0.06)', border: 'rgba(26,26,46,0.15)', accent: '#1a1a2e' },
  };

  const c = colorMap[color] || colorMap.primary;

  return (
    <Card sx={{
      borderColor: c.border,
      bgcolor: c.bg,
      height: '100%',
      '&:hover': { transform: 'translateY(-2px)', boxShadow: 4 },
    }}>
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="overline" sx={{ color: '#6b6b8a' }}>
            {title}
          </Typography>
          {icon && (
            <Box sx={{
              width: 36, height: 36, borderRadius: '10px',
              bgcolor: c.accent + '22',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: c.accent,
            }}>
              {icon}
            </Box>
          )}
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a1a2e', mb: 0.5 }}>
          {value}
        </Typography>
        {label && (
          <Chip
            label={label}
            size="small"
            color={color}
            variant="outlined"
            sx={{ borderRadius: '6px', height: 22, fontSize: '0.7rem', mt: 0.5 }}
          />
        )}
        {subtitle && (
          <Typography variant="body2" sx={{ color: '#6b6b8a', mt: 1, fontSize: '0.78rem' }}>
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

import {
  AppBar, Toolbar, Typography, IconButton, Box,
  useMediaQuery, useTheme,
} from '@mui/material';
import { MenuRounded } from '@mui/icons-material';
import { useLocation } from 'react-router-dom';
import { DRAWER_WIDTH } from './Sidebar';

const pageTitles = {
  '/dashboard': { title: 'Dashboard',  sub: 'Your mental wellness overview' },
  '/predict':   { title: 'Prediction', sub: 'Run a new burnout assessment' },
  '/history':   { title: 'History',    sub: 'Your past predictions' },
  '/analytics': { title: 'Analytics',  sub: 'Trends and insights' },
};

export default function Navbar({ onMenuClick }) {
  const location = useLocation();
  const theme    = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const page     = pageTitles[location.pathname] || { title: 'EduMind', sub: '' };

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        bgcolor: '#f5f4f0',
        borderBottom: '1px solid #e8e8f0',
        color: '#1a1a2e',
      }}
    >
      <Toolbar sx={{ gap: 2, minHeight: '64px !important' }}>
        {isMobile && (
          <IconButton onClick={onMenuClick} edge="start" sx={{ color: '#1a1a2e' }}>
            <MenuRounded />
          </IconButton>
        )}
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ lineHeight: 1.2, fontSize: '1.05rem' }}>
            {page.title}
          </Typography>
          <Typography variant="caption" sx={{ color: '#6b6b8a', fontFamily: '"DM Sans", sans-serif', fontSize: '0.75rem' }}>
            {page.sub}
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

import { useState } from 'react';
import {
  Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText,
  Typography, Divider, Avatar, IconButton, Tooltip, useMediaQuery, useTheme,
} from '@mui/material';
import {
  DashboardRounded, PsychologyRounded, HistoryRounded,
  BarChartRounded, LogoutRounded, MenuRounded, AutoGraphRounded,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const DRAWER_WIDTH = 248;

const navItems = [
  { label: 'Dashboard', icon: <DashboardRounded />, path: '/dashboard' },
  { label: 'Prediction', icon: <PsychologyRounded />, path: '/predict' },
  { label: 'History', icon: <HistoryRounded />, path: '/history' },
  { label: 'Analytics', icon: <BarChartRounded />, path: '/analytics' },
];

export default function Sidebar({ mobileOpen, onMobileClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleNav = (path) => {
    navigate(path);
    if (isMobile) onMobileClose();
  };

  const drawerContent = (
    <Box sx={{
      display: 'flex', flexDirection: 'column', height: '100%',
      bgcolor: '#1a1a2e', color: '#fff',
    }}>
      {/* Logo */}
      <Box sx={{ px: 3, py: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box sx={{
          width: 36, height: 36, borderRadius: '10px',
          background: 'linear-gradient(135deg, #e8673a, #f5b833)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <AutoGraphRounded sx={{ fontSize: 20, color: '#fff' }} />
        </Box>
        <Box>
          <Typography variant="h6" sx={{ fontSize: '1rem', color: '#fff', lineHeight: 1.2 }}>
            EduMind
          </Typography>
          <Typography sx={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.45)', fontFamily: '"DM Mono", monospace', letterSpacing: '0.08em' }}>
            BURNOUT SYSTEM
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', mx: 2 }} />

      {/* Nav */}
      <List sx={{ px: 1.5, pt: 2, flex: 1 }}>
        {navItems.map(({ label, icon, path }) => {
          const active = location.pathname === path;
          return (
            <ListItemButton
              key={path}
              onClick={() => handleNav(path)}
              sx={{
                borderRadius: '10px', mb: 0.5, px: 2, py: 1.2,
                color: active ? '#fff' : 'rgba(255,255,255,0.5)',
                bgcolor: active ? 'rgba(232,103,58,0.18)' : 'transparent',
                '&:hover': {
                  bgcolor: active ? 'rgba(232,103,58,0.22)' : 'rgba(255,255,255,0.06)',
                  color: '#fff',
                },
                transition: 'all 0.15s ease',
              }}
            >
              <ListItemIcon sx={{
                minWidth: 36, color: active ? '#e8673a' : 'inherit',
                '& .MuiSvgIcon-root': { fontSize: 20 },
              }}>
                {icon}
              </ListItemIcon>
              <ListItemText
                primary={label}
                primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: active ? 600 : 400 }}
              />
              {active && (
                <Box sx={{
                  width: 3, height: 20, borderRadius: 2,
                  bgcolor: '#e8673a', ml: 1,
                }} />
              )}
            </ListItemButton>
          );
        })}
      </List>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', mx: 2 }} />

      {/* User */}
      <Box sx={{ px: 2, py: 2.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Avatar sx={{ width: 36, height: 36, bgcolor: '#e8673a', fontSize: '0.85rem', fontWeight: 700 }}>
          {user?.name?.[0]?.toUpperCase() || 'U'}
        </Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontSize: '0.85rem', color: '#fff', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user?.name || 'Student'}
          </Typography>
          <Typography sx={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user?.email || ''}
          </Typography>
        </Box>
        <Tooltip title="Logout">
          <IconButton size="small" onClick={logout} sx={{ color: 'rgba(255,255,255,0.4)', '&:hover': { color: '#e8673a' } }}>
            <LogoutRounded fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Desktop */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          width: DRAWER_WIDTH,
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box', border: 'none' },
        }}
      >
        {drawerContent}
      </Drawer>
      {/* Mobile */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box', border: 'none' },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
}

export { DRAWER_WIDTH };

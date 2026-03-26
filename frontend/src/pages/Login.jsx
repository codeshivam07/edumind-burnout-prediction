import { useState } from 'react';
import {
  Box, Card, CardContent, TextField, Button, Typography,
  InputAdornment, IconButton, Alert, Divider, Link,
} from '@mui/material';
import { Visibility, VisibilityOff, AutoGraphRounded, LockRounded, EmailRounded } from '@mui/icons-material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { loginUser } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, loginAsGuest } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await loginUser(form);
      login(res.data.user, res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Demo login shortcut

  return (
    <Box sx={{
      minHeight: '100vh', display: 'flex', bgcolor: '#f5f4f0',
    }}>
      {/* Left panel */}
      <Box sx={{
        display: { xs: 'none', md: 'flex' }, flex: 1,
        bgcolor: '#1a1a2e', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'flex-start',
        p: 8, position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        <Box sx={{ position: 'absolute', top: -80, right: -80, width: 320, height: 320, borderRadius: '50%', bgcolor: 'rgba(232,103,58,0.12)' }} />
        <Box sx={{ position: 'absolute', bottom: -40, left: -60, width: 220, height: 220, borderRadius: '50%', bgcolor: 'rgba(46,204,143,0.08)' }} />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 6 }}>
          <Box sx={{
            width: 48, height: 48, borderRadius: '14px',
            background: 'linear-gradient(135deg, #e8673a, #f5b833)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <AutoGraphRounded sx={{ color: '#fff', fontSize: 26 }} />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ color: '#fff', fontWeight: 700 }}>EduMind</Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', fontFamily: '"DM Mono", monospace', letterSpacing: '0.1em' }}>
              BURNOUT PREDICTION
            </Typography>
          </Box>
        </Box>

        <Typography variant="h2" sx={{ color: '#fff', mb: 2, maxWidth: 400, lineHeight: 1.15 }}>
          Your mental wellness,<br />
          <Box component="span" sx={{ color: '#e8673a' }}>predicted.</Box>
        </Typography>
        <Typography sx={{ color: 'rgba(255,255,255,0.55)', maxWidth: 380, lineHeight: 1.7, fontSize: '0.95rem' }}>
          Detect burnout risk early using AI-powered analysis of anxiety, depression, and stress patterns.
        </Typography>

        <Box sx={{ mt: 6, display: 'flex', gap: 3 }}>
          {[
            { val: '94%', label: 'Accuracy' },
            { val: '3', label: 'ML Models' },
            { val: '∞', label: 'Insights' },
          ].map(({ val, label }) => (
            <Box key={label}>
              <Typography variant="h4" sx={{ color: '#e8673a', fontWeight: 700 }}>{val}</Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem' }}>{label}</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Right panel */}
      <Box sx={{
        flex: { xs: 1, md: '0 0 440px' },
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        p: { xs: 3, md: 6 },
      }}>
        <Box sx={{ width: '100%', maxWidth: 380 }}>
          {/* Mobile logo */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1.5, mb: 4 }}>
            <Box sx={{
              width: 36, height: 36, borderRadius: '10px',
              background: 'linear-gradient(135deg, #e8673a, #f5b833)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <AutoGraphRounded sx={{ color: '#fff', fontSize: 20 }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a1a2e' }}>EduMind</Typography>
          </Box>

          <Typography variant="h4" sx={{ mb: 0.5, fontWeight: 700 }}>Welcome back</Typography>
          <Typography variant="body2" sx={{ color: '#6b6b8a', mb: 4 }}>
            Sign in to access your dashboard
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 3, borderRadius: '10px' }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField
              label="Email address"
              name="email"
              type="email"
              required
              fullWidth
              value={form.email}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailRounded sx={{ fontSize: 18, color: '#6b6b8a' }} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Password"
              name="password"
              type={showPwd ? 'text' : 'password'}
              required
              fullWidth
              value={form.password}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockRounded sx={{ fontSize: 18, color: '#6b6b8a' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setShowPwd(!showPwd)} edge="end">
                      {showPwd ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              disabled={loading}
              sx={{ mt: 0.5 }}
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </Button>
          </Box>

          <Divider sx={{ my: 3 }}>
            <Typography variant="caption" sx={{ color: '#6b6b8a', px: 1 }}>or</Typography>
          </Divider>

          <Button variant="outlined" fullWidth onClick={() => { loginAsGuest(); navigate('/dashboard'); }} sx={{ borderColor: '#e8e8f0', color: '#6b6b8a', '&:hover': { borderColor: '#1a1a2e', color: '#1a1a2e' } }}>
            Continue as Guest
          </Button>

          <Typography sx={{ textAlign: 'center', mt: 3, fontSize: '0.875rem', color: '#6b6b8a' }}>
            Don't have an account?{' '}
            <Link component={RouterLink} to="/register" sx={{ color: '#e8673a', fontWeight: 600, textDecoration: 'none' }}>
              Sign up
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

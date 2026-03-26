import { useState } from 'react';
import {
  Box, TextField, Button, Typography,
  InputAdornment, IconButton, Alert, Link,
} from '@mui/material';
import { Visibility, VisibilityOff, AutoGraphRounded, PersonRounded, LockRounded, EmailRounded } from '@mui/icons-material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { registerUser } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      const res = await registerUser({ name: form.name, email: form.email, password: form.password });
      login(res.data.user, res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', bgcolor: '#f5f4f0' }}>
      {/* Left panel */}
      <Box sx={{
        display: { xs: 'none', md: 'flex' }, flex: 1,
        bgcolor: '#1a1a2e', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'flex-start',
        p: 8, position: 'relative', overflow: 'hidden',
      }}>
        <Box sx={{ position: 'absolute', top: -80, right: -80, width: 320, height: 320, borderRadius: '50%', bgcolor: 'rgba(46,204,143,0.1)' }} />
        <Box sx={{ position: 'absolute', bottom: -40, left: -60, width: 220, height: 220, borderRadius: '50%', bgcolor: 'rgba(232,103,58,0.08)' }} />

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
          Start your<br />
          <Box component="span" sx={{ color: '#2ecc8f' }}>wellness journey.</Box>
        </Typography>
        <Typography sx={{ color: 'rgba(255,255,255,0.55)', maxWidth: 380, lineHeight: 1.7, fontSize: '0.95rem' }}>
          Join EduMind to track your mental wellness, receive AI-powered burnout predictions, and gain insights for a healthier academic life.
        </Typography>
      </Box>

      {/* Right panel */}
      <Box sx={{
        flex: { xs: 1, md: '0 0 440px' },
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        p: { xs: 3, md: 6 },
      }}>
        <Box sx={{ width: '100%', maxWidth: 380 }}>
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

          <Typography variant="h4" sx={{ mb: 0.5, fontWeight: 700 }}>Create account</Typography>
          <Typography variant="body2" sx={{ color: '#6b6b8a', mb: 4 }}>
            Start monitoring your academic wellness
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 3, borderRadius: '10px' }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField
              label="Full name"
              name="name"
              required
              fullWidth
              value={form.name}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonRounded sx={{ fontSize: 18, color: '#6b6b8a' }} />
                  </InputAdornment>
                ),
              }}
            />
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
              helperText="Minimum 6 characters"
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
            <TextField
              label="Confirm password"
              name="confirm"
              type={showPwd ? 'text' : 'password'}
              required
              fullWidth
              value={form.confirm}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockRounded sx={{ fontSize: 18, color: '#6b6b8a' }} />
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
              {loading ? 'Creating account…' : 'Create account'}
            </Button>
          </Box>

          <Typography sx={{ textAlign: 'center', mt: 3, fontSize: '0.875rem', color: '#6b6b8a' }}>
            Already have an account?{' '}
            <Link component={RouterLink} to="/login" sx={{ color: '#e8673a', fontWeight: 600, textDecoration: 'none' }}>
              Sign in
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

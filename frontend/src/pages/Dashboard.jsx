import { useState, useEffect } from 'react';
import {
  Box, Grid, Typography, Card, CardContent, Button, Alert,
  Stepper, Step, StepLabel, StepContent,
} from '@mui/material';
import {
  LocalFireDepartmentRounded, GroupsRounded, SchoolRounded,
  ArrowForwardRounded, TrendingUpRounded, AutoGraphRounded,
  PersonAddRounded, PsychologyRounded, HistoryRounded, BarChartRounded,
  CheckCircleRounded,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getHistory } from '../services/api';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/common/StatCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import {
  burnoutLabel, burnoutColor,
  clusterLabel, clusterColor,
  academicLabel, academicColor,
  overallSeverity, severityLabel, severityColor,
  formatDate,
} from '../utils/labels';

// ── Onboarding state for brand new users ─────────────────────────────────
function NewUserWelcome({ userName, onStart }) {
  const steps = [
    {
      icon: <PersonAddRounded />,
      label: 'Account created',
      desc: 'You are registered and logged in.',
      done: true,
    },
    {
      icon: <PsychologyRounded />,
      label: 'Run your first prediction',
      desc: 'Enter 6 scores — anxiety, depression, stress, sleep hours, study hours, and social support. The AI models will analyse your burnout risk instantly.',
      done: false,
    },
    {
      icon: <HistoryRounded />,
      label: 'Track over time',
      desc: 'Each prediction is saved to your history. Run weekly assessments to track your mental wellness trends.',
      done: false,
    },
    {
      icon: <BarChartRounded />,
      label: 'View analytics',
      desc: 'Once you have a few predictions, the Analytics page will show charts and trends across your data.',
      done: false,
    },
  ];

  return (
    <Box>
      {/* Welcome banner */}
      <Card sx={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #2d2d4e 100%)',
        border: 'none', mb: 3, overflow: 'hidden', position: 'relative',
      }}>
        {/* Decorative circles */}
        <Box sx={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, borderRadius: '50%', bgcolor: 'rgba(232,103,58,0.12)', pointerEvents: 'none' }} />
        <Box sx={{ position: 'absolute', bottom: -30, left: '40%', width: 120, height: 120, borderRadius: '50%', bgcolor: 'rgba(46,204,143,0.08)', pointerEvents: 'none' }} />

        <CardContent sx={{ p: { xs: 3, md: 4 }, position: 'relative' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Box sx={{
              width: 44, height: 44, borderRadius: '12px',
              background: 'linear-gradient(135deg, #e8673a, #f5b833)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <AutoGraphRounded sx={{ color: '#fff', fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ color: '#fff', fontWeight: 700, lineHeight: 1.2 }}>
                Welcome to EduMind, {userName}! 👋
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem', mt: 0.25 }}>
                Your AI-powered burnout prediction system
              </Typography>
            </Box>
          </Box>
          <Typography sx={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.9rem', lineHeight: 1.7, maxWidth: 560, mb: 3 }}>
            You have no predictions yet. Your dashboard will populate with your burnout risk, student cluster, and academic pressure data after your first assessment. It only takes 30 seconds.
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            endIcon={<ArrowForwardRounded />}
            onClick={onStart}
          >
            Run my first prediction
          </Button>
        </CardContent>
      </Card>

      {/* Empty stat cards — ghost/placeholder state */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {[
          { title: 'Burnout Risk', icon: <LocalFireDepartmentRounded />, placeholder: 'Awaiting first prediction' },
          { title: 'Student Type', icon: <GroupsRounded />, placeholder: 'Cluster will appear here' },
          { title: 'Academic Pressure', icon: <SchoolRounded />, placeholder: 'Prediction unlocks this' },
        ].map(({ title, icon, placeholder }) => (
          <Grid item xs={12} sm={4} key={title}>
            <Card sx={{ bgcolor: 'rgba(26,26,46,0.03)', borderStyle: 'dashed', borderColor: '#d8d8e8' }}>
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="overline" sx={{ color: '#b0b0c8' }}>{title}</Typography>
                  <Box sx={{ width: 32, height: 32, borderRadius: '8px', bgcolor: 'rgba(26,26,46,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c0c0d8' }}>
                    {icon}
                  </Box>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#d0d0e0', mb: 0.5 }}>—</Typography>
                <Typography sx={{ fontSize: '0.75rem', color: '#b0b0c8', fontStyle: 'italic' }}>{placeholder}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Getting started steps */}
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2.5 }}>Getting Started</Typography>
          <Stepper orientation="vertical" sx={{ '& .MuiStepConnector-line': { borderColor: '#e8e8f0' } }}>
            {steps.map(({ icon, label, desc, done }, idx) => (
              <Step key={label} active={!done} completed={done}>
                <StepLabel
                  StepIconComponent={() => (
                    <Box sx={{
                      width: 32, height: 32, borderRadius: '50%',
                      bgcolor: done ? 'rgba(46,204,143,0.15)' : idx === 1 ? 'rgba(232,103,58,0.12)' : 'rgba(26,26,46,0.06)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: done ? '#2ecc8f' : idx === 1 ? '#e8673a' : '#b0b0c8',
                      flexShrink: 0,
                    }}>
                      {done ? <CheckCircleRounded sx={{ fontSize: 18 }} /> : icon}
                    </Box>
                  )}
                >
                  <Typography variant="body2" sx={{ fontWeight: 600, color: done ? '#9b9bbf' : '#1a1a2e' }}>
                    {label}
                  </Typography>
                </StepLabel>
                <StepContent sx={{ borderColor: '#e8e8f0' }}>
                  <Typography variant="body2" sx={{ color: '#6b6b8a', lineHeight: 1.6, pb: 1.5 }}>{desc}</Typography>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </CardContent>
      </Card>
    </Box>
  );
}

// ── Returning user dashboard ──────────────────────────────────────────────
function ReturningUserDashboard({ user, latest, count, navigate }) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const severity   = overallSeverity(latest.burnout_score, latest.student_cluster, latest.academic_prediction);
  const sevLabel   = severityLabel(severity);
  const sevColor   = severityColor(severity);

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          {greeting}, {user?.name?.split(' ')[0] || 'Student'} 👋
        </Typography>
        <Typography variant="body1" sx={{ color: '#6b6b8a', mt: 0.5 }}>
          {count} assessment{count !== 1 ? 's' : ''} on record · Last run {formatDate(latest.createdAt)}
        </Typography>
      </Box>

      {/* Overall severity callout */}
      <Card sx={{ border: `2px solid ${sevColor}35`, bgcolor: `${sevColor}06`, mb: 3 }}>
        <CardContent sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
          <Box sx={{ flex: 1, minWidth: 180 }}>
            <Typography variant="overline" sx={{ color: '#6b6b8a' }}>Latest Overall Risk</Typography>
            <Typography variant="h3" sx={{ fontWeight: 700, color: sevColor, mt: 0.25 }}>{sevLabel}</Typography>
            <Typography sx={{ fontSize: '0.8rem', color: '#9b9bbf', fontFamily: '"DM Mono", monospace' }}>
              Composite score: {severity}/100
            </Typography>
          </Box>
          <Button
            variant="contained" color="secondary"
            endIcon={<ArrowForwardRounded />}
            onClick={() => navigate('/predict')}
          >
            New prediction
          </Button>
        </CardContent>
      </Card>

      {/* Three model cards */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Burnout Risk"
            value={burnoutLabel(latest.burnout_score)}
            label={`Score: ${latest.burnout_score}`}
            color={burnoutColor(latest.burnout_score)}
            icon={<LocalFireDepartmentRounded />}
            subtitle={`Last assessed ${formatDate(latest.createdAt)}`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Student Type"
            value={clusterLabel(latest.student_cluster)}
            label={`Cluster: ${latest.student_cluster}`}
            color={clusterColor(latest.student_cluster)}
            icon={<GroupsRounded />}
            subtitle="Based on your stress pattern clustering"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Academic Pressure"
            value={academicLabel(latest.academic_prediction)}
            label={`Prediction: ${latest.academic_prediction}`}
            color={academicColor(latest.academic_prediction)}
            icon={<SchoolRounded />}
            subtitle="Academic performance pressure level"
          />
        </Grid>
      </Grid>

      {/* CTAs */}
      <Grid container spacing={2.5}>
        <Grid item xs={12} md={6}>
          <Card sx={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #2d2d4e 100%)', border: 'none' }}>
            <CardContent sx={{ p: 3.5 }}>
              <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.4)' }}>Run again</Typography>
              <Typography variant="h5" sx={{ color: '#fff', mt: 0.5, mb: 1.5 }}>New prediction</Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.875rem', mb: 3 }}>
                Update your 6 scores to get a fresh burnout analysis and track changes over time.
              </Typography>
              <Button variant="contained" color="secondary" endIcon={<ArrowForwardRounded />} onClick={() => navigate('/predict')}>
                Start prediction
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ bgcolor: 'rgba(46,204,143,0.06)', borderColor: 'rgba(46,204,143,0.2)' }}>
            <CardContent sx={{ p: 3.5 }}>
              <Typography variant="overline" sx={{ color: '#6b6b8a' }}>Your stats</Typography>
              <Typography variant="h5" sx={{ mt: 0.5, mb: 1.5 }}>Total assessments</Typography>
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 1.5 }}>
                <Typography variant="h2" sx={{ fontWeight: 700, color: '#2ecc8f' }}>{count}</Typography>
                <Typography sx={{ color: '#6b6b8a' }}>predictions</Typography>
              </Box>
              <Button
                variant="outlined" endIcon={<TrendingUpRounded />}
                onClick={() => navigate('/analytics')}
                sx={{ borderColor: '#2ecc8f', color: '#2ecc8f', '&:hover': { borderColor: '#20a870', bgcolor: 'rgba(46,204,143,0.06)' } }}
              >
                View analytics
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

// ── Main export ───────────────────────────────────────────────────────────
export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [latest, setLatest]   = useState(null);
  const [count, setCount]     = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    getHistory()
      .then((res) => {
        const history = res.data?.history || res.data || [];
        setCount(history.length);
        if (history.length > 0) setLatest(history[0]);
      })
      .catch(() => setError('Could not load dashboard data.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner message="Loading dashboard..." />;

  return (
    <Box>
      {error && <Alert severity="warning" sx={{ mb: 3, borderRadius: '10px' }}>{error}</Alert>}

      {/* Branch: new user vs returning user */}
      {!latest ? (
        <NewUserWelcome
          userName={user?.name?.split(' ')[0] || 'there'}
          onStart={() => navigate('/predict')}
        />
      ) : (
        <ReturningUserDashboard
          user={user}
          latest={latest}
          count={count}
          navigate={navigate}
        />
      )}
    </Box>
  );
}

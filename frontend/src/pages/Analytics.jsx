import { useState, useEffect } from 'react';
import {
  Box, Grid, Typography, Card, CardContent, Alert, Chip,
} from '@mui/material';
import {
  Chart as ChartJS,
  ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale, BarElement, Title,
  PointElement, LineElement, Filler,
} from 'chart.js';
import { Doughnut, Bar, Line, Scatter } from 'react-chartjs-2';
import { getHistory } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import { burnoutLabel, clusterLabel, academicLabel } from '../utils/labels';

// Register all Chart.js components needed
ChartJS.register(
  ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale, BarElement, Title,
  PointElement, LineElement, Filler,
);

const FONT      = '"DM Sans", sans-serif';
const FONT_MONO = '"DM Mono", monospace';

// ── Shared tooltip style ──────────────────────────────────────────────────
const tooltip = {
  backgroundColor: '#1a1a2e',
  titleFont: { family: FONT, size: 13 },
  bodyFont: { family: FONT, size: 12 },
  padding: 12,
  cornerRadius: 10,
};

// ── Doughnut options ──────────────────────────────────────────────────────
const doughnutOpts = () => ({
  responsive: true,
  maintainAspectRatio: true,
  cutout: '68%',
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        font: { family: FONT, size: 12 },
        color: '#6b6b8a',
        padding: 16,
        usePointStyle: true,
        pointStyleWidth: 8,
      },
    },
    tooltip: {
      ...tooltip,
      callbacks: {
        label: (ctx) => {
          const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
          const pct   = total ? Math.round((ctx.parsed / total) * 100) : 0;
          return `  ${ctx.label}: ${ctx.parsed} (${pct}%)`;
        },
      },
    },
  },
});

// ── Bar options ───────────────────────────────────────────────────────────
const barOpts = (extraPlugins = {}) => ({
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: { display: false },
    tooltip,
    ...extraPlugins,
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { font: { family: FONT, size: 12 }, color: '#6b6b8a' },
      border: { display: false },
    },
    y: {
      beginAtZero: true,
      ticks: { font: { family: FONT_MONO, size: 11 }, color: '#6b6b8a', stepSize: 1 },
      grid: { color: '#f0f0f8' },
      border: { display: false },
    },
  },
  borderRadius: 8,
  barPercentage: 0.7,
  categoryPercentage: 0.8,
});

// ── Line options ──────────────────────────────────────────────────────────
const lineOpts = (yLabel = '', yMax = null) => ({
  responsive: true,
  maintainAspectRatio: true,
  interaction: { mode: 'index', intersect: false },
  plugins: {
    legend: {
      display: true,
      position: 'top',
      labels: {
        font: { family: FONT, size: 12 },
        color: '#6b6b8a',
        usePointStyle: true,
        pointStyleWidth: 8,
        padding: 16,
      },
    },
    tooltip,
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { font: { family: FONT, size: 11 }, color: '#6b6b8a' },
      border: { display: false },
    },
    y: {
      beginAtZero: true,
      ...(yMax !== null ? { max: yMax } : {}),
      title: {
        display: !!yLabel,
        text: yLabel,
        font: { family: FONT_MONO, size: 10 },
        color: '#9b9bbf',
      },
      ticks: { font: { family: FONT_MONO, size: 11 }, color: '#6b6b8a' },
      grid: { color: '#f0f0f8' },
      border: { display: false },
    },
  },
});

// ── Scatter options ───────────────────────────────────────────────────────
const scatterOpts = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      display: true,
      position: 'top',
      labels: {
        font: { family: FONT, size: 12 },
        color: '#6b6b8a',
        usePointStyle: true,
        pointStyleWidth: 8,
        padding: 16,
      },
    },
    tooltip: {
      ...tooltip,
      callbacks: {
        label: (ctx) =>
          `  Sleep: ${ctx.parsed.x}h  |  Stress: ${ctx.parsed.y}`,
      },
    },
  },
  scales: {
    x: {
      title: {
        display: true,
        text: 'Sleep Hours',
        font: { family: FONT_MONO, size: 10 },
        color: '#9b9bbf',
      },
      min: 0, max: 14,
      grid: { color: '#f0f0f8' },
      ticks: { font: { family: FONT_MONO, size: 11 }, color: '#6b6b8a' },
      border: { display: false },
    },
    y: {
      title: {
        display: true,
        text: 'Stress Score',
        font: { family: FONT_MONO, size: 10 },
        color: '#9b9bbf',
      },
      min: 0, max: 40,
      grid: { color: '#f0f0f8' },
      ticks: { font: { family: FONT_MONO, size: 11 }, color: '#6b6b8a' },
      border: { display: false },
    },
  },
};

// ── Reusable chart card wrapper ───────────────────────────────────────────
function ChartCard({ title, subtitle, badge, children }) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>{title}</Typography>
          {badge && (
            <Chip label={badge} size="small" sx={{ fontSize: '0.65rem', fontFamily: FONT_MONO, bgcolor: 'rgba(26,26,46,0.06)', color: '#6b6b8a' }} />
          )}
        </Box>
        <Typography variant="body2" sx={{ color: '#6b6b8a', mb: 3 }}>{subtitle}</Typography>
        {children}
      </CardContent>
    </Card>
  );
}

// ── Main component ────────────────────────────────────────────────────────
export default function Analytics() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    getHistory()
      .then((res) => {
        const data = res.data?.history || res.data || [];
        setHistory(data);
      })
      .catch(() => setError('Failed to load analytics data.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner message="Loading analytics..." />;

  if (history.length === 0 && !error) {
    return (
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>Analytics</Typography>
        <Typography variant="body2" sx={{ color: '#6b6b8a', mb: 4 }}>
          Visualize your mental wellness trends over time.
        </Typography>
        <EmptyState
          message="No data to display. Run a few predictions first!"
          actionLabel="Run Prediction"
          actionPath="/predict"
        />
      </Box>
    );
  }

  // ── Chronological order (oldest → newest) for trend charts ───────────
  const chronological = [...history].reverse();
  const recent10      = chronological.slice(-10);
  const timeLabels    = recent10.map((_, i) => `#${chronological.length - recent10.length + i + 1}`);

  // ── Distribution counts ───────────────────────────────────────────────
  const burnoutCounts  = [0, 1, 2].map((v) => history.filter((r) => r.burnout_score === v).length);
  const clusterCounts  = [0, 1, 2].map((v) => history.filter((r) => r.student_cluster === v).length);
  const academicCounts = [0, 1].map((v) => history.filter((r) => r.academic_prediction === v).length);

  // ── Summary stats ─────────────────────────────────────────────────────
  const avg = (key, fallback = 0) =>
    history.length
      ? (history.reduce((s, r) => s + (r[key] ?? fallback), 0) / history.length).toFixed(1)
      : '—';

  const avgAnxiety    = avg('anxiety');
  const avgDepression = avg('depression');
  const avgStress     = avg('stress');
  const avgSleep      = avg('sleep_hours');
  const highBurnoutPct = history.length
    ? Math.round((burnoutCounts[2] / history.length) * 100)
    : 0;

  // ════════════════════════════════════════════════════════════════════════
  // CHART 1 — Burnout Distribution (Doughnut)
  // ════════════════════════════════════════════════════════════════════════
  const burnoutDistData = {
    labels: [burnoutLabel(0), burnoutLabel(1), burnoutLabel(2)],
    datasets: [{
      data: burnoutCounts,
      backgroundColor: ['rgba(46,204,143,0.85)', 'rgba(240,165,0,0.85)', 'rgba(232,64,64,0.85)'],
      borderColor: ['#2ecc8f', '#f0a500', '#e84040'],
      borderWidth: 2,
      hoverOffset: 6,
    }],
  };

  // ════════════════════════════════════════════════════════════════════════
  // CHART 2 — Cluster Distribution (Doughnut)
  // ════════════════════════════════════════════════════════════════════════
  const clusterDistData = {
    labels: [clusterLabel(0), clusterLabel(1), clusterLabel(2)],
    datasets: [{
      data: clusterCounts,
      backgroundColor: ['rgba(46,204,143,0.85)', 'rgba(240,165,0,0.85)', 'rgba(232,64,64,0.85)'],
      borderColor: ['#2ecc8f', '#f0a500', '#e84040'],
      borderWidth: 2,
      hoverOffset: 6,
    }],
  };

  // ════════════════════════════════════════════════════════════════════════
  // CHART 3 — Academic Pressure Distribution (Doughnut)
  // ════════════════════════════════════════════════════════════════════════
  const academicDistData = {
    labels: [academicLabel(0), academicLabel(1)],
    datasets: [{
      data: academicCounts,
      backgroundColor: ['rgba(58,134,232,0.85)', 'rgba(232,103,58,0.85)'],
      borderColor: ['#3a86e8', '#e8673a'],
      borderWidth: 2,
      hoverOffset: 6,
    }],
  };

  // ════════════════════════════════════════════════════════════════════════
  // CHART 4 — Score Trends Grouped Bar (Anxiety / Depression / Stress)
  // ════════════════════════════════════════════════════════════════════════
  const scoreTrendData = {
    labels: timeLabels,
    datasets: [
      {
        label: 'Anxiety',
        data: recent10.map((r) => r.anxiety ?? 0),
        backgroundColor: 'rgba(232,64,64,0.75)',
        borderRadius: 6,
      },
      {
        label: 'Depression',
        data: recent10.map((r) => r.depression ?? 0),
        backgroundColor: 'rgba(58,134,232,0.75)',
        borderRadius: 6,
      },
      {
        label: 'Stress',
        data: recent10.map((r) => r.stress ?? 0),
        backgroundColor: 'rgba(240,165,0,0.75)',
        borderRadius: 6,
      },
    ],
  };

  const scoreTrendOpts = {
    ...barOpts({
      legend: {
        display: true,
        position: 'top',
        labels: {
          font: { family: FONT, size: 12 },
          color: '#6b6b8a',
          usePointStyle: true,
          pointStyleWidth: 8,
          padding: 16,
        },
      },
    }),
  };

  // ════════════════════════════════════════════════════════════════════════
  // CHART 5 — Burnout Trend Line (NEW)
  // Shows burnout_score (0/1/2) over time as a smooth filled line
  // Tells the student if their burnout is improving or worsening
  // ════════════════════════════════════════════════════════════════════════
  const burnoutTrendData = {
    labels: chronological.map((_, i) => `#${i + 1}`),
    datasets: [
      {
        label: 'Burnout Score',
        data: chronological.map((r) => r.burnout_score ?? 0),
        borderColor: '#e84040',
        backgroundColor: 'rgba(232,64,64,0.08)',
        borderWidth: 2.5,
        pointBackgroundColor: chronological.map((r) =>
          r.burnout_score === 2 ? '#e84040' :
          r.burnout_score === 1 ? '#f0a500' : '#2ecc8f'
        ),
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const burnoutTrendOpts = {
    ...lineOpts('Burnout Score', 2),
    plugins: {
      ...lineOpts('Burnout Score', 2).plugins,
      tooltip: {
        ...tooltip,
        callbacks: {
          label: (ctx) => {
            const labels = ['  Low burnout', '  Moderate burnout', '  High burnout'];
            return labels[ctx.parsed.y] ?? `  Score: ${ctx.parsed.y}`;
          },
        },
      },
    },
    scales: {
      ...lineOpts('Burnout Score', 2).scales,
      y: {
        ...lineOpts('Burnout Score', 2).scales.y,
        min: 0,
        max: 2,
        ticks: {
          font: { family: FONT_MONO, size: 11 },
          color: '#6b6b8a',
          stepSize: 1,
          callback: (v) => ['Low', 'Moderate', 'High'][v] ?? v,
        },
      },
    },
  };

  // ════════════════════════════════════════════════════════════════════════
  // CHART 6 — Stress vs Sleep Scatter (NEW)
  // Each dot = one prediction. X = sleep hours, Y = stress score.
  // Colour = burnout level. Shows correlation between sleep and stress.
  // ════════════════════════════════════════════════════════════════════════
  const scatterByBurnout = [
    {
      label: 'Low Burnout',
      color: '#2ecc8f',
      data: history
        .filter((r) => r.burnout_score === 0)
        .map((r) => ({ x: r.sleep_hours ?? 0, y: r.stress ?? 0 })),
    },
    {
      label: 'Moderate Burnout',
      color: '#f0a500',
      data: history
        .filter((r) => r.burnout_score === 1)
        .map((r) => ({ x: r.sleep_hours ?? 0, y: r.stress ?? 0 })),
    },
    {
      label: 'High Burnout',
      color: '#e84040',
      data: history
        .filter((r) => r.burnout_score === 2)
        .map((r) => ({ x: r.sleep_hours ?? 0, y: r.stress ?? 0 })),
    },
  ];

  const stressVsSleepData = {
    datasets: scatterByBurnout.map(({ label, color, data }) => ({
      label,
      data,
      backgroundColor: color + 'cc',
      borderColor: color,
      borderWidth: 1.5,
      pointRadius: 8,
      pointHoverRadius: 11,
    })),
  };

  // ── Render ────────────────────────────────────────────────────────────
  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>Analytics</Typography>
      <Typography variant="body2" sx={{ color: '#6b6b8a', mb: 4 }}>
        Visualize your mental wellness trends across {history.length} prediction{history.length !== 1 ? 's' : ''}.
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: '10px' }}>{error}</Alert>}

      {/* ── Summary stat strip ── */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
        {[
          { label: 'Avg Anxiety',    value: avgAnxiety,    color: '#e84040', max: '/21' },
          { label: 'Avg Depression', value: avgDepression, color: '#3a86e8', max: '/21' },
          { label: 'Avg Stress',     value: avgStress,     color: '#f0a500', max: '/40' },
          { label: 'Avg Sleep',      value: avgSleep,      color: '#8b5cf6', max: 'hrs' },
          { label: 'High Burnout',   value: `${highBurnoutPct}%`, color: '#e84040', max: '' },
        ].map(({ label, value, color, max }) => (
          <Box key={label} sx={{
            flex: '1 1 130px', p: 2, borderRadius: '12px',
            border: `1.5px solid ${color}25`, bgcolor: `${color}08`,
          }}>
            <Typography variant="overline" sx={{ color: '#6b6b8a', display: 'block' }}>{label}</Typography>
            <Typography sx={{ fontFamily: FONT_MONO, fontSize: '1.4rem', fontWeight: 700, color }}>
              {value}
              <Typography component="span" sx={{ fontSize: '0.75rem', color: '#6b6b8a' }}>{max}</Typography>
            </Typography>
          </Box>
        ))}
      </Box>

      <Grid container spacing={3}>

        {/* ── Row 1: Three doughnuts ── */}
        <Grid item xs={12} sm={6} lg={4}>
          <ChartCard title="Burnout Distribution" subtitle="How your risk levels are spread across all predictions">
            <Box sx={{ maxWidth: 280, mx: 'auto' }}>
              <Doughnut data={burnoutDistData} options={doughnutOpts()} />
            </Box>
          </ChartCard>
        </Grid>

        <Grid item xs={12} sm={6} lg={4}>
          <ChartCard title="Student Cluster" subtitle="Your student stress-type profile across all predictions">
            <Box sx={{ maxWidth: 280, mx: 'auto' }}>
              <Doughnut data={clusterDistData} options={doughnutOpts()} />
            </Box>
          </ChartCard>
        </Grid>

        <Grid item xs={12} sm={6} lg={4}>
          <ChartCard title="Academic Pressure" subtitle="Distribution of Low vs High academic pressure predictions">
            <Box sx={{ maxWidth: 280, mx: 'auto' }}>
              <Doughnut data={academicDistData} options={doughnutOpts()} />
            </Box>
          </ChartCard>
        </Grid>

        {/* ── Row 2: Burnout trend line (NEW) ── */}
        <Grid item xs={12} md={7}>
          <ChartCard
            title="Burnout Trend"
            subtitle="Your burnout score over time — are you improving or worsening?"
            badge={`${chronological.length} sessions`}
          >
            <Line data={burnoutTrendData} options={burnoutTrendOpts} />
          </ChartCard>
        </Grid>

        {/* ── Row 2: Stress vs Sleep scatter (NEW) ── */}
        <Grid item xs={12} md={5}>
          <ChartCard
            title="Stress vs Sleep"
            subtitle="Each dot is one prediction. More sleep → lower stress?"
            badge="scatter"
          >
            <Scatter data={stressVsSleepData} options={scatterOpts} />
          </ChartCard>
        </Grid>

        {/* ── Row 3: Score trends grouped bar ── */}
        <Grid item xs={12}>
          <ChartCard
            title="Score Trends"
            subtitle={`Anxiety, Depression & Stress across your last ${recent10.length} predictions`}
            badge="bar"
          >
            <Bar data={scoreTrendData} options={scoreTrendOpts} />
          </ChartCard>
        </Grid>

      </Grid>
    </Box>
  );
}
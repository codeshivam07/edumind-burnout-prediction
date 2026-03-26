import { useState } from 'react';
import {
  Box, Grid, Typography, TextField, Button, Card, CardContent,
  Alert, Chip, LinearProgress, InputAdornment, Tooltip,
  Divider,
} from '@mui/material';
import {
  SentimentVeryDissatisfiedRounded, MoodBadRounded, PsychologyAltRounded,
  BedtimeRounded, MenuBookRounded, PeopleRounded,
  AutoGraphRounded, LocalFireDepartmentRounded, GroupsRounded, SchoolRounded,
  LightbulbRounded, WarningAmberRounded, InfoOutlined,
} from '@mui/icons-material';
import { predict } from '../services/api';
import {
  burnoutLabel, burnoutColor, burnoutDescription,
  clusterLabel, clusterColor, clusterDescription,
  academicLabel, academicColor, academicDescription,
  overallSeverity, severityLabel, severityColor,
  combinedInterpretation, getRecommendations,
} from '../utils/labels';

// ── Field definitions ──────────────────────────────────────────────────────
// Two groups: Mental Health Scores (clinical scales) and Lifestyle Factors

const MENTAL_FIELDS = [
  {
    name: 'anxiety',
    label: 'Anxiety',
    icon: <SentimentVeryDissatisfiedRounded />,
    color: '#e84040',
    min: 0, max: 21, step: 1,
    unit: '/ 21',
    tooltip: 'Based on the DASS-21 scale. 0–7 Normal, 8–9 Mild, 10–14 Moderate, 15–19 Severe, 20–21 Extremely Severe.',
    placeholder: '0–21',
  },
  {
    name: 'depression',
    label: 'Depression',
    icon: <MoodBadRounded />,
    color: '#3a86e8',
    min: 0, max: 21, step: 1,
    unit: '/ 21',
    tooltip: 'Based on the DASS-21 scale. 0–9 Normal, 10–12 Mild, 13–20 Moderate, 21+ Severe.',
    placeholder: '0–21',
  },
  {
    name: 'stress',
    label: 'Stress',
    icon: <PsychologyAltRounded />,
    color: '#f0a500',
    min: 0, max: 40, step: 1,
    unit: '/ 40',
    tooltip: 'Based on the DASS-21 scale. 0–14 Normal, 15–18 Mild, 19–25 Moderate, 26–33 Severe, 34+ Extremely Severe.',
    placeholder: '0–40',
  },
];

const LIFESTYLE_FIELDS = [
  {
    name: 'sleep_hours',
    label: 'Sleep Hours',
    icon: <BedtimeRounded />,
    color: '#8b5cf6',
    min: 0, max: 24, step: 0.5,
    unit: 'hrs/day',
    tooltip: 'Average hours of sleep per night over the last week. Recommended: 7–9 hours.',
    placeholder: '0–24',
  },
  {
    name: 'study_hours',
    label: 'Study Hours',
    icon: <MenuBookRounded />,
    color: '#e8673a',
    min: 0, max: 16, step: 0.5,
    unit: 'hrs/day',
    tooltip: 'Average hours spent studying per day. Includes classes, self-study and assignments.',
    placeholder: '0–16',
  },
  {
    name: 'social_support',
    label: 'Social Support',
    icon: <PeopleRounded />,
    color: '#2ecc8f',
    min: 0, max: 10, step: 1,
    unit: '/ 10',
    tooltip: 'Perceived quality of your social support network. 0 = Isolated, 10 = Strongly supported by friends/family.',
    placeholder: '0–10',
  },
];

const priorityStyles = {
  high:   { bg: 'rgba(232,64,64,0.06)',  border: 'rgba(232,64,64,0.25)',  dot: '#e84040', label: 'HIGH PRIORITY' },
  medium: { bg: 'rgba(240,165,0,0.06)',  border: 'rgba(240,165,0,0.25)',  dot: '#f0a500', label: 'MEDIUM' },
  low:    { bg: 'rgba(46,204,143,0.06)', border: 'rgba(46,204,143,0.25)', dot: '#2ecc8f', label: 'LOW' },
};

// ── Range bar — shows where the entered value sits visually ───────────────
function RangeBar({ value, min, max, color }) {
  const pct = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
  return (
    <Box sx={{ mt: 0.75, mb: 0.25 }}>
      <LinearProgress
        variant="determinate"
        value={pct}
        sx={{
          height: 4, borderRadius: 2,
          bgcolor: `${color}18`,
          '& .MuiLinearProgress-bar': { bgcolor: color, borderRadius: 2, transition: 'transform 0.2s ease' },
        }}
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.3 }}>
        <Typography sx={{ fontSize: '0.65rem', color: '#b0b0c8', fontFamily: '"DM Mono", monospace' }}>{min}</Typography>
        <Typography sx={{ fontSize: '0.65rem', color: '#b0b0c8', fontFamily: '"DM Mono", monospace' }}>{max}</Typography>
      </Box>
    </Box>
  );
}

// ── Single input field ────────────────────────────────────────────────────
function ScoreField({ field, value, onChange }) {
  const { name, label, icon, color, min, max, step, unit, tooltip, placeholder } = field;
  const numVal = value === '' ? '' : Number(value);
  const isValid = value === '' || (numVal >= min && numVal <= max);

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.75 }}>
        <Box sx={{ color, display: 'flex', fontSize: 16 }}>{icon}</Box>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#1a1a2e', flex: 1 }}>{label}</Typography>
        <Tooltip title={tooltip} placement="top" arrow>
          <InfoOutlined sx={{ fontSize: 14, color: '#b0b0c8', cursor: 'help' }} />
        </Tooltip>
      </Box>
      <TextField
        name={name}
        type="number"
        size="small"
        fullWidth
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        error={!isValid}
        helperText={!isValid ? `Must be between ${min} and ${max}` : ''}
        inputProps={{ min, max, step }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Typography sx={{ fontSize: '0.72rem', color: '#9b9bbf', fontFamily: '"DM Mono", monospace', whiteSpace: 'nowrap' }}>
                {unit}
              </Typography>
            </InputAdornment>
          ),
          sx: {
            fontFamily: '"DM Mono", monospace',
            fontWeight: 600,
            fontSize: '0.95rem',
            '& input': { color },
          },
        }}
      />
      {value !== '' && isValid && (
        <RangeBar value={numVal} min={min} max={max} color={color} />
      )}
    </Box>
  );
}

// ── Main component ────────────────────────────────────────────────────────
export default function Predict() {
  const [form, setForm] = useState({
    anxiety: '', depression: '', stress: '',
    sleep_hours: '', study_hours: '', social_support: '',
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const all = [...MENTAL_FIELDS, ...LIFESTYLE_FIELDS];
    for (const f of all) {
      const v = form[f.name];
      if (v === '' || v === null || v === undefined) return `${f.label} is required.`;
      const n = Number(v);
      if (isNaN(n)) return `${f.label} must be a number.`;
      if (n < f.min || n > f.max) return `${f.label} must be between ${f.min} and ${f.max}.`;
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    setLoading(true);
    try {
      const payload = Object.fromEntries(
        Object.entries(form).map(([k, v]) => [k, Number(v)])
      );
      const res = await predict(payload);
      setResult({ ...res.data.prediction, input: payload });
    } catch (err) {
      setError(err.response?.data?.message || 'Prediction failed. Please check your backend connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm({ anxiety: '', depression: '', stress: '', sleep_hours: '', study_hours: '', social_support: '' });
    setResult(null);
    setError('');
  };

  // Derived values
  const severity      = result ? overallSeverity(result.burnout_score, result.student_cluster, result.academic_prediction) : null;
  const sevLabel      = result ? severityLabel(severity) : null;
  const sevColor      = result ? severityColor(severity) : null;
  const interpretation  = result ? combinedInterpretation(result.burnout_score, result.student_cluster, result.academic_prediction) : null;
  const recommendations = result ? getRecommendations(result.burnout_score, result.student_cluster, result.academic_prediction) : [];

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>Burnout Prediction</Typography>
      <Typography variant="body2" sx={{ color: '#6b6b8a', mb: 4 }}>
        Enter your current scores across all 6 factors to receive a personalised AI-powered wellness analysis.
      </Typography>

      <Grid container spacing={3}>

        {/* ── Input form ── */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ position: { lg: 'sticky' }, top: { lg: 24 } }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <Box sx={{
                  width: 34, height: 34, borderRadius: '10px',
                  background: 'linear-gradient(135deg, #e8673a, #f5b833)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <AutoGraphRounded sx={{ color: '#fff', fontSize: 18 }} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontSize: '0.95rem', lineHeight: 1.2 }}>Assessment Form</Typography>
                  <Typography sx={{ fontSize: '0.7rem', color: '#9b9bbf' }}>6 inputs · hover ⓘ for guidance</Typography>
                </Box>
              </Box>

              {error && (
                <Alert severity="error" sx={{ mb: 2.5, borderRadius: '10px', fontSize: '0.82rem' }}>{error}</Alert>
              )}

              <Box component="form" onSubmit={handleSubmit}>

                {/* Mental health group */}
                <Typography variant="overline" sx={{ color: '#6b6b8a', display: 'block', mb: 1.5 }}>
                  Mental Health Scores
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
                  {MENTAL_FIELDS.map((f) => (
                    <ScoreField key={f.name} field={f} value={form[f.name]} onChange={handleChange} />
                  ))}
                </Box>

                <Divider sx={{ my: 2.5 }} />

                {/* Lifestyle group */}
                <Typography variant="overline" sx={{ color: '#6b6b8a', display: 'block', mb: 1.5 }}>
                  Lifestyle Factors
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
                  {LIFESTYLE_FIELDS.map((f) => (
                    <ScoreField key={f.name} field={f} value={form[f.name]} onChange={handleChange} />
                  ))}
                </Box>

                <Box sx={{ display: 'flex', gap: 1.5 }}>
                  <Button
                    type="submit" variant="contained" color="secondary"
                    size="large" fullWidth disabled={loading}
                    startIcon={<AutoGraphRounded />}
                  >
                    {loading ? 'Analysing…' : 'Run Prediction'}
                  </Button>
                  <Button
                    type="button" variant="outlined" size="large"
                    onClick={handleReset}
                    sx={{ minWidth: 48, px: 1.5, borderColor: '#e8e8f0', color: '#9b9bbf' }}
                  >
                    ↺
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* ── Results panel ── */}
        <Grid item xs={12} lg={8}>
          {!result ? (
            <Card sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 440 }}>
              <CardContent sx={{ textAlign: 'center', py: 8, px: 4 }}>
                <AutoGraphRounded sx={{ fontSize: 52, color: '#e0e0f0', mb: 2 }} />
                <Typography variant="h6" sx={{ color: '#6b6b8a', fontWeight: 500 }}>
                  Results will appear here
                </Typography>
                <Typography variant="body2" sx={{ color: '#b0b0c8', mt: 1, maxWidth: 300, mx: 'auto' }}>
                  Fill all 6 fields and click Run Prediction. Hover the ⓘ icons for guidance on each score.
                </Typography>

                {/* Input reference guide */}
                <Box sx={{ mt: 4, textAlign: 'left', bgcolor: 'rgba(26,26,46,0.03)', borderRadius: '12px', p: 2.5 }}>
                  <Typography variant="overline" sx={{ color: '#6b6b8a', display: 'block', mb: 1.5 }}>Quick Reference</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {[
                      { label: 'Anxiety / Depression', range: '0–21', note: 'DASS-21 clinical scale' },
                      { label: 'Stress', range: '0–40', note: 'DASS-21 clinical scale' },
                      { label: 'Sleep Hours', range: '0–24', note: 'avg hours per night' },
                      { label: 'Study Hours', range: '0–16', note: 'avg hours per day' },
                      { label: 'Social Support', range: '0–10', note: '0 = isolated, 10 = very supported' },
                    ].map(({ label, range, note }) => (
                      <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography sx={{ fontSize: '0.78rem', color: '#6b6b8a' }}>{label}</Typography>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                          <Chip label={range} size="small" sx={{ height: 18, fontSize: '0.65rem', fontFamily: '"DM Mono", monospace', bgcolor: 'rgba(26,26,46,0.06)' }} />
                          <Typography sx={{ fontSize: '0.7rem', color: '#b0b0c8' }}>{note}</Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>

              {/* Overall severity */}
              <Card sx={{ border: `2px solid ${sevColor}40`, bgcolor: `${sevColor}06` }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
                    <Box>
                      <Typography variant="overline" sx={{ color: '#6b6b8a' }}>Overall Wellness Risk</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5, mt: 0.5 }}>
                        <Typography variant="h3" sx={{ fontWeight: 700, color: sevColor }}>{sevLabel}</Typography>
                        <Typography sx={{ fontFamily: '"DM Mono", monospace', fontSize: '1rem', color: '#9b9bbf' }}>
                          {severity}/100
                        </Typography>
                      </Box>
                    </Box>
                    {/* Input echo */}
                    <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap', maxWidth: 340 }}>
                      {Object.entries(result.input).map(([k, v]) => (
                        <Chip
                          key={k}
                          label={`${k.replace('_', ' ')}: ${v}`}
                          size="small"
                          sx={{ fontFamily: '"DM Mono", monospace', fontSize: '0.67rem', bgcolor: 'rgba(26,26,46,0.06)', color: '#6b6b8a' }}
                        />
                      ))}
                    </Box>
                  </Box>
                  <Box sx={{ mt: 2 }}>
                    <LinearProgress
                      variant="determinate"
                      value={severity}
                      sx={{
                        height: 8, borderRadius: 4,
                        bgcolor: `${sevColor}18`,
                        '& .MuiLinearProgress-bar': { bgcolor: sevColor, borderRadius: 4 },
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>

              {/* Three model output cards */}
              <Grid container spacing={2}>
                {[
                  {
                    title: 'Burnout Risk',
                    value: burnoutLabel(result.burnout_score),
                    raw: `Score: ${result.burnout_score}`,
                    color: burnoutColor(result.burnout_score),
                    desc: burnoutDescription(result.burnout_score),
                    icon: <LocalFireDepartmentRounded />,
                    progress: [0, 50, 100][result.burnout_score],
                  },
                  {
                    title: 'Student Cluster',
                    value: clusterLabel(result.student_cluster),
                    raw: `Cluster: ${result.student_cluster}`,
                    color: clusterColor(result.student_cluster),
                    desc: clusterDescription(result.student_cluster),
                    icon: <GroupsRounded />,
                    progress: [0, 50, 100][result.student_cluster],
                  },
                  {
                    title: 'Academic Pressure',
                    value: academicLabel(result.academic_prediction),
                    raw: `Prediction: ${result.academic_prediction}`,
                    color: academicColor(result.academic_prediction),
                    desc: academicDescription(result.academic_prediction),
                    icon: <SchoolRounded />,
                    progress: [0, 100][result.academic_prediction],
                  },
                ].map(({ title, value, raw, color, desc, icon, progress }) => {
                  const colorMap = { success: '#2ecc8f', warning: '#f0a500', error: '#e84040', info: '#3a86e8', secondary: '#e8673a', primary: '#1a1a2e' };
                  const accent = colorMap[color] || '#1a1a2e';
                  return (
                    <Grid item xs={12} sm={4} key={title}>
                      <Card sx={{ border: `1.5px solid ${accent}30`, bgcolor: `${accent}06`, height: '100%' }}>
                        <CardContent sx={{ p: 2.5 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1.5 }}>
                            <Box sx={{ color: accent, display: 'flex', fontSize: 18 }}>{icon}</Box>
                            <Typography variant="overline" sx={{ color: '#6b6b8a', fontSize: '0.63rem' }}>{title}</Typography>
                          </Box>
                          <Typography variant="h5" sx={{ fontWeight: 700, color: accent, mb: 0.5 }}>{value}</Typography>
                          <Typography sx={{ fontFamily: '"DM Mono", monospace', fontSize: '0.68rem', color: '#9b9bbf', mb: 1.5 }}>{raw}</Typography>
                          <LinearProgress
                            variant="determinate" value={progress}
                            sx={{ height: 4, borderRadius: 2, mb: 1.5, bgcolor: `${accent}18`, '& .MuiLinearProgress-bar': { bgcolor: accent, borderRadius: 2 } }}
                          />
                          <Typography variant="body2" sx={{ color: '#6b6b8a', fontSize: '0.78rem', lineHeight: 1.55 }}>{desc}</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>

              {/* Combined interpretation */}
              <Card sx={{ border: '1.5px solid rgba(26,26,46,0.10)', bgcolor: 'rgba(26,26,46,0.02)' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, flexWrap: 'wrap' }}>
                    <WarningAmberRounded sx={{ color: '#f0a500', fontSize: 20 }} />
                    <Typography variant="h6" sx={{ fontSize: '0.95rem', fontWeight: 600 }}>Combined Interpretation</Typography>
                    <Chip
                      label={`${burnoutLabel(result.burnout_score)} · ${clusterLabel(result.student_cluster)} · Academic ${academicLabel(result.academic_prediction)}`}
                      size="small"
                      sx={{ ml: 'auto', bgcolor: 'rgba(26,26,46,0.06)', color: '#6b6b8a', fontSize: '0.67rem', fontFamily: '"DM Mono", monospace' }}
                    />
                  </Box>
                  <Typography variant="body1" sx={{ color: '#1a1a2e', lineHeight: 1.75, fontSize: '0.9rem' }}>
                    {interpretation}
                  </Typography>
                </CardContent>
              </Card>

              {/* Recommendations */}
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
                    <LightbulbRounded sx={{ color: '#e8673a', fontSize: 20 }} />
                    <Typography variant="h6" sx={{ fontSize: '0.95rem', fontWeight: 600 }}>Personalised Recommendations</Typography>
                    <Chip label={`${recommendations.length} actions`} size="small" sx={{ ml: 'auto', bgcolor: 'rgba(232,103,58,0.10)', color: '#e8673a', fontSize: '0.7rem' }} />
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {recommendations.map(({ category, icon, priority, text }) => {
                      const s = priorityStyles[priority];
                      return (
                        <Box key={category} sx={{ p: 2, borderRadius: '12px', border: `1px solid ${s.border}`, bgcolor: s.bg }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
                            <Typography sx={{ fontSize: '1.05rem' }}>{icon}</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 700, color: '#1a1a2e' }}>{category}</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 'auto' }}>
                              <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: s.dot }} />
                              <Typography sx={{ fontFamily: '"DM Mono", monospace', fontSize: '0.6rem', color: '#9b9bbf', letterSpacing: '0.06em' }}>
                                {s.label}
                              </Typography>
                            </Box>
                          </Box>
                          <Typography variant="body2" sx={{ color: '#6b6b8a', lineHeight: 1.65, fontSize: '0.82rem' }}>{text}</Typography>
                        </Box>
                      );
                    })}
                  </Box>
                </CardContent>
              </Card>

            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}

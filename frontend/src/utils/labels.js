// ─────────────────────────────────────────────
// labels.js  —  Human-friendly text + combined
//               recommendation engine
// ─────────────────────────────────────────────

// ── Individual label maps ──────────────────────

export const burnoutLabel = (score) => ({ 0: 'Low', 1: 'Moderate', 2: 'High' }[score] ?? 'Unknown');
export const burnoutColor = (score) => ({ 0: 'success', 1: 'warning', 2: 'error' }[score] ?? 'default');

export const clusterLabel = (cluster) => ({ 0: 'Balanced', 1: 'Moderate Stress', 2: 'High Stress' }[cluster] ?? 'Unknown');
export const clusterColor = (cluster) => ({ 0: 'success', 1: 'warning', 2: 'error' }[cluster] ?? 'default');

export const academicLabel = (pred) => ({ 0: 'Low', 1: 'High' }[pred] ?? 'Unknown');
export const academicColor = (pred) => ({ 0: 'info', 1: 'secondary' }[pred] ?? 'default');

// ── Individual descriptions ────────────────────

export const burnoutDescription = (score) => ({
  0: 'Your burnout indicators are within a healthy range. You are managing your academic workload well.',
  1: 'You are showing early signs of burnout. Some stress factors are present and worth monitoring closely.',
  2: 'You are experiencing significant burnout. Immediate attention and intervention is strongly recommended.',
}[score] ?? '');

export const clusterDescription = (cluster) => ({
  0: 'You belong to the Balanced student group — your anxiety, depression, and stress levels are relatively stable and well-distributed.',
  1: 'You are in the Moderate Stress group — you experience periodic stress spikes, especially around deadlines or evaluations.',
  2: 'You are in the High Stress group — persistent and elevated stress is a defining characteristic of your current academic experience.',
}[cluster] ?? '');

export const academicDescription = (pred) => ({
  0: 'Your academic pressure is currently low. You have adequate capacity to handle your coursework.',
  1: 'Your academic pressure is high. The demands of your studies are significantly contributing to your mental load.',
}[pred] ?? '');

// ── Severity score (0–100) ─────────────────────
// Weighted composite across all three model outputs

export const overallSeverity = (burnout_score, student_cluster, academic_prediction) => {
  const b = ({ 0: 0, 1: 50, 2: 100 }[burnout_score] ?? 0);
  const c = ({ 0: 0, 1: 50, 2: 100 }[student_cluster] ?? 0);
  const a = ({ 0: 0, 1: 100 }[academic_prediction] ?? 0);
  // Burnout 50% weight, cluster 30%, academic 20%
  return Math.round(b * 0.5 + c * 0.3 + a * 0.2);
};

export const severityLabel = (severity) => {
  if (severity <= 20) return 'Healthy';
  if (severity <= 45) return 'Mild Risk';
  if (severity <= 70) return 'Moderate Risk';
  if (severity <= 85) return 'High Risk';
  return 'Critical';
};

export const severityColor = (severity) => {
  if (severity <= 20) return '#2ecc8f';
  if (severity <= 45) return '#3a86e8';
  if (severity <= 70) return '#f0a500';
  if (severity <= 85) return '#e84040';
  return '#c42020';
};

// ── Combined interpretation ────────────────────
// Reads across all three model outputs together

export const combinedInterpretation = (burnout_score, student_cluster, academic_prediction) => {
  const key = `${burnout_score}-${student_cluster}-${academic_prediction}`;

  const interpretations = {
    // ── Low burnout ──────────────────────────────
    '0-0-0': 'You are in an excellent state. Low burnout, balanced stress profile, and manageable academic pressure — your current habits and routines are working well. Keep maintaining your balance.',
    '0-0-1': 'You are coping well despite high academic pressure. Your balanced stress profile is protecting you from burnout for now, but the workload is significant. Stay proactive with rest and boundaries.',
    '0-1-0': 'You show low burnout overall, though you belong to a moderately stressed student group. The current academic pressure is low, which is helping. Be mindful as pressure increases during exam seasons.',
    '0-1-1': 'Low burnout but you are in a moderately stressed group with high academic pressure. You are managing well right now, but this combination can escalate quickly. Monitor your energy levels carefully.',
    '0-2-0': 'Interestingly, despite belonging to the High Stress student cluster, your burnout is currently low and academic pressure is manageable. You may have strong coping mechanisms — continue using them.',
    '0-2-1': 'You are in the High Stress cluster with significant academic pressure, yet burnout is still low. This is a fragile balance. Without intervention, burnout risk will likely rise soon.',

    // ── Moderate burnout ─────────────────────────
    '1-0-0': 'Moderate burnout is present even though you are in the Balanced cluster with low academic pressure. Something outside your academic environment may be contributing — consider personal stressors.',
    '1-0-1': 'Moderate burnout with high academic pressure, but your stress profile is otherwise balanced. The workload is the primary driver here. Setting clear study limits and recovery time is essential.',
    '1-1-0': 'Moderate burnout combined with a moderately stressed student profile. Even though academic pressure is currently low, the ongoing stress pattern is wearing you down. Rest and routine adjustments are needed.',
    '1-1-1': 'You are showing moderate burnout with both a stressed student profile and high academic demands. This is a concerning combination that needs active management before it escalates to high burnout.',
    '1-2-0': 'Moderate burnout alongside a High Stress cluster profile, even with low academic pressure. Your stress response pattern itself is a key factor. Focus on stress regulation techniques and recovery.',
    '1-2-1': 'Moderate burnout, high stress profile, and high academic pressure together. This triad is a strong warning signal. Immediate action is needed — reduce load, seek support, and prioritise sleep and downtime.',

    // ── High burnout ─────────────────────────────
    '2-0-0': 'High burnout despite a balanced stress profile and low academic pressure is unusual and worth investigating. Hidden stressors, personal circumstances, or sleep disruption may be significant factors.',
    '2-0-1': 'High burnout driven primarily by intense academic pressure. Your stress profile is otherwise balanced, so reducing academic load or getting structured support could lead to meaningful recovery.',
    '2-1-0': 'High burnout with a moderately stressed student profile, despite low current academic pressure. The chronic nature of your stress pattern has accumulated. Recovery will require consistent effort over time.',
    '2-1-1': 'High burnout, persistent moderate stress, and high academic demands — you are significantly overloaded. This requires immediate intervention: talk to a counsellor, reduce commitments, and prioritise recovery.',
    '2-2-0': 'High burnout in a High Stress student cluster, even with low academic pressure. Your stress system is overstimulated. Without meaningful rest and professional support, this will be very difficult to recover from alone.',
    '2-2-1': 'This is the most critical combination. High burnout, a High Stress profile, and intense academic pressure are all present simultaneously. Please seek support immediately — from your institution, a counsellor, or a trusted person.',
  };

  return interpretations[key] ?? 'Unable to generate a combined interpretation for this result set.';
};

// ── Personalised recommendations ──────────────
// Returns array of { category, icon, priority, text }

export const getRecommendations = (burnout_score, student_cluster, academic_prediction) => {
  const recs = [];

  // Sleep
  if (burnout_score >= 1 || student_cluster >= 1) {
    recs.push({
      category: 'Sleep',
      icon: '🌙',
      priority: burnout_score === 2 ? 'high' : 'medium',
      text: burnout_score === 2
        ? 'Prioritise 8–9 hours of sleep immediately. High burnout severely disrupts cognitive recovery — sleep is your most critical tool right now.'
        : 'Aim for 7–8 hours of consistent sleep. Irregular sleep amplifies stress responses and reduces your ability to handle academic pressure.',
    });
  }

  // Study load
  if (academic_prediction === 1) {
    recs.push({
      category: 'Study Load',
      icon: '📚',
      priority: burnout_score === 2 ? 'high' : 'medium',
      text: burnout_score === 2
        ? 'Immediately reduce your study load. Speak to your academic advisor about extensions, deferred submissions, or a reduced course load this semester.'
        : 'Break your study sessions into 25–30 minute focused blocks with 5–10 minute breaks (Pomodoro). Avoid marathon sessions exceeding 2 hours.',
    });
  }

  // Physical activity
  if (burnout_score >= 1 || student_cluster >= 1) {
    recs.push({
      category: 'Physical Activity',
      icon: '🏃',
      priority: 'medium',
      text: student_cluster === 2
        ? 'Even 20–30 minutes of walking or light exercise daily significantly reduces cortisol (stress hormone) levels. Physical movement is clinically proven to reduce burnout symptoms.'
        : 'Regular moderate exercise (3–4 times per week) helps regulate stress hormones and improves mental resilience during high-pressure periods.',
    });
  }

  // Social support
  if (student_cluster >= 1 || burnout_score >= 1) {
    recs.push({
      category: 'Social Support',
      icon: '🤝',
      priority: (student_cluster === 2 && burnout_score === 2) ? 'high' : 'medium',
      text: (student_cluster === 2 && burnout_score === 2)
        ? 'Isolation worsens high-stress burnout significantly. Reach out to at least one trusted friend, family member, or peer today. Consider speaking to a counsellor at your institution.'
        : 'Maintain social connections even when busy. Scheduling regular low-pressure social time acts as a stress buffer and prevents emotional exhaustion.',
    });
  }

  // Mindfulness
  if (burnout_score >= 1) {
    recs.push({
      category: 'Mindfulness',
      icon: '🧘',
      priority: burnout_score === 2 ? 'high' : 'low',
      text: burnout_score === 2
        ? 'Practice 4-7-8 breathing (inhale 4s, hold 7s, exhale 8s) whenever overwhelmed. Even 5 minutes of mindful breathing measurably reduces acute stress response.'
        : 'A daily 10-minute mindfulness or meditation session reduces cumulative stress buildup. Apps like Headspace or Calm are good starting points.',
    });
  }

  // Professional help
  if (burnout_score === 2 && student_cluster === 2) {
    recs.push({
      category: 'Professional Support',
      icon: '💬',
      priority: 'high',
      text: 'Your results suggest you would meaningfully benefit from speaking to a mental health professional. Most institutions offer free counselling — reaching out is a sign of strength, not weakness.',
    });
  }

  // Nutrition
  if (burnout_score >= 1 || academic_prediction === 1) {
    recs.push({
      category: 'Nutrition & Hydration',
      icon: '🥗',
      priority: 'low',
      text: 'Under stress, many students skip meals or rely on caffeine. Aim for 3 regular meals, limit caffeine after 2pm, and drink at least 2L of water daily. These basics have a surprisingly large impact on mental clarity.',
    });
  }

  // Digital detox
  if (student_cluster >= 1 || burnout_score >= 1) {
    recs.push({
      category: 'Digital Detox',
      icon: '📵',
      priority: 'low',
      text: 'Set a hard cutoff for screens 1 hour before bed. Constant notifications and social media comparison are underestimated contributors to student stress and sleep disruption.',
    });
  }

  // Positive baseline
  if (burnout_score === 0 && student_cluster === 0 && academic_prediction === 0) {
    recs.push({
      category: 'Maintain Your Balance',
      icon: '✅',
      priority: 'low',
      text: 'Your results are positive. Continue your current routines — consistent sleep, regular breaks, and social connection are likely what is keeping your indicators healthy.',
    });
  }

  // Sort: high → medium → low
  const order = { high: 0, medium: 1, low: 2 };
  return recs.sort((a, b) => order[a.priority] - order[b.priority]);
};

// ── Date formatter ────────────────────────────

export const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
};
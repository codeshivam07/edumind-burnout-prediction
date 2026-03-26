// ── Mock data returned in Guest mode ─────────────────────────────────────
// No API calls are made. All pages use this static data.

export const GUEST_HISTORY = [
  {
    _id: 'g1',
    anxiety: 14, depression: 12, stress: 22,
    sleep_hours: 5, study_hours: 9, social_support: 3,
    burnout_score: 2, student_cluster: 2, academic_prediction: 1,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'g2',
    anxiety: 10, depression: 8, stress: 18,
    sleep_hours: 6, study_hours: 8, social_support: 5,
    burnout_score: 1, student_cluster: 1, academic_prediction: 1,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'g3',
    anxiety: 6, depression: 5, stress: 12,
    sleep_hours: 7, study_hours: 6, social_support: 7,
    burnout_score: 0, student_cluster: 0, academic_prediction: 0,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'g4',
    anxiety: 8, depression: 7, stress: 15,
    sleep_hours: 6.5, study_hours: 7, social_support: 6,
    burnout_score: 1, student_cluster: 1, academic_prediction: 0,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'g5',
    anxiety: 4, depression: 3, stress: 8,
    sleep_hours: 8, study_hours: 5, social_support: 9,
    burnout_score: 0, student_cluster: 0, academic_prediction: 0,
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Mock prediction result for guest — returned instantly, no API call
export const GUEST_PREDICTION = {
  burnout_score: 1,
  student_cluster: 1,
  academic_prediction: 1,
};

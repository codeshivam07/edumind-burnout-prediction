import axios from 'axios';
import { GUEST_HISTORY, GUEST_PREDICTION } from '../utils/guestData';

const API_BASE = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('edumind_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('edumind_token');
      localStorage.removeItem('edumind_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ── Helper — checks if running in guest mode ──────────────────────────────
const isGuest = () => localStorage.getItem('edumind_token') === null &&
  sessionStorage.getItem('edumind_guest') === 'true';

// ── Auth ──────────────────────────────────────────────────────────────────
export const loginUser    = (data) => api.post('/auth/login', data);
export const registerUser = (data) => api.post('/auth/register', data);

// ── Predict ───────────────────────────────────────────────────────────────
// Guest: return mock prediction instantly, no API call
export const predict = (data) => {
  if (sessionStorage.getItem('edumind_guest') === 'true') {
    return Promise.resolve({
      data: {
        prediction: GUEST_PREDICTION,
      }
    });
  }
  return api.post('/predict', data);
};

// ── History ───────────────────────────────────────────────────────────────
// Guest: return mock history, no API call
export const getHistory = () => {
  if (sessionStorage.getItem('edumind_guest') === 'true') {
    return Promise.resolve({ data: GUEST_HISTORY });
  }
  return api.get('/predict/history');
};

export default api;

import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
});

// Attach JWT if present
api.interceptors.request.use(config => {
  const token = localStorage.getItem('admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Location endpoints ──────────────────────────────────────
export const getDistricts = () => api.get('/districts');
export const getDsDivisions = districtId => api.get(`/ds-divisions/${districtId}`);
export const getGnDivisions = dsId => api.get(`/gn-divisions/${dsId}`);

// ── Project endpoints ───────────────────────────────────────
export const getProjects = (params = {}) => api.get('/projects', { params });
export const getProject = id => api.get(`/projects/${id}`);
export const createProject = data => api.post('/projects', data);
export const updateProject = (id, data) => api.put(`/projects/${id}`, data);
export const deleteProject = id => api.delete(`/projects/${id}`);
export const uploadProjectImage = (id, file) => {
  const formData = new FormData();
  formData.append('image', file);
  const token = localStorage.getItem('admin_token');
  return axios.post(`${BASE_URL}/projects/${id}/upload`, formData, {
    headers: { ...(token && { Authorization: `Bearer ${token}` }) }
  });
};

// ── Auth endpoints ──────────────────────────────────────────
export const login = credentials => api.post('/auth/login', credentials);

export default api;

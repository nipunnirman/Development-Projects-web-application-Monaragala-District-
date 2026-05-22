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

// ── Cache Helper Utilities ──────────────────────────────────
const cacheGet = (key) => {
  try {
    const item = sessionStorage.getItem(key);
    if (!item) return null;
    const parsed = JSON.parse(item);
    if (Date.now() > parsed.expiry) {
      sessionStorage.removeItem(key);
      return null;
    }
    return parsed.value;
  } catch (e) {
    return null;
  }
};

const cacheSet = (key, value, ttlMs) => {
  try {
    sessionStorage.setItem(key, JSON.stringify({
      value,
      expiry: Date.now() + ttlMs
    }));
  } catch (e) {
    // Ignore quota issues
  }
};

const cacheClear = () => {
  try {
    for (let i = sessionStorage.length - 1; i >= 0; i--) {
      const key = sessionStorage.key(i);
      if (key && key.startsWith('api-')) {
        sessionStorage.removeItem(key);
      }
    }
  } catch (e) {}
};

// ── Location endpoints ──────────────────────────────────────
export const getDistricts = async () => {
  const cacheKey = 'api-districts';
  const cached = cacheGet(cacheKey);
  if (cached) return cached;

  const res = await api.get('/districts');
  const cacheValue = { data: res.data };
  cacheSet(cacheKey, cacheValue, 600000); // Cache districts for 10 minutes
  return cacheValue;
};

export const getDsDivisions = async (districtId) => {
  const cacheKey = `api-ds-divisions-${districtId}`;
  const cached = cacheGet(cacheKey);
  if (cached) return cached;

  const res = await api.get(`/ds-divisions/${districtId}`);
  const cacheValue = { data: res.data };
  cacheSet(cacheKey, cacheValue, 600000); // Cache DS divisions for 10 minutes
  return cacheValue;
};

export const getGnDivisions = async (dsId) => {
  const cacheKey = `api-gn-divisions-${dsId}`;
  const cached = cacheGet(cacheKey);
  if (cached) return cached;

  const res = await api.get(`/gn-divisions/${dsId}`);
  const cacheValue = { data: res.data };
  cacheSet(cacheKey, cacheValue, 600000); // Cache GN divisions for 10 minutes
  return cacheValue;
};

// ── Project endpoints ───────────────────────────────────────
export const getProjects = async (params = {}) => {
  const cacheKey = `api-projects-${JSON.stringify(params)}`;
  const cached = cacheGet(cacheKey);
  if (cached) return cached;

  const res = await api.get('/projects', { params });
  const cacheValue = { data: res.data };
  cacheSet(cacheKey, cacheValue, 120000); // Cache project queries for 2 minutes
  return cacheValue;
};

export const getProject = async (id) => {
  const cacheKey = `api-project-${id}`;
  const cached = cacheGet(cacheKey);
  if (cached) return cached;

  const res = await api.get(`/projects/${id}`);
  const cacheValue = { data: res.data };
  cacheSet(cacheKey, cacheValue, 60000); // Cache specific project for 1 minute
  return cacheValue;
};

export const createProject = async (data) => {
  cacheClear();
  return api.post('/projects', data);
};

export const updateProject = async (id, data) => {
  cacheClear();
  return api.put(`/projects/${id}`, data);
};

export const deleteProject = async (id) => {
  cacheClear();
  return api.delete(`/projects/${id}`);
};

export const uploadProjectImage = async (id, file) => {
  cacheClear();
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

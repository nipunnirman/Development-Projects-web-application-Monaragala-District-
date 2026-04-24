import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import authRoutes from './routes/auth.js';
import locationRoutes from './routes/locations.js';
import projectRoutes from './routes/projects.js';

const app = express();

// ── Middleware ──────────────────────────────────────────────
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Routes ──────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'SL Dev Projects API is running' });
});

app.get('/', (req, res) => {
  res.json({
    message: '🇱🇰 Sri Lanka Development Projects API',
    version: '1.0.0',
    endpoints: {
      auth: 'POST /api/auth/login',
      districts: 'GET /api/districts',
      dsDivisions: 'GET /api/ds-divisions/:districtId',
      gnDivisions: 'GET /api/gn-divisions/:dsId',
      projects: 'GET|POST /api/projects',
      projectById: 'GET|PUT|DELETE /api/projects/:id',
    },
  });
});

app.use('/api/auth', authRoutes);
app.use('/api', locationRoutes);
app.use('/api/projects', projectRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

export default app;

import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config/env.js';
import aiRoutes from './routes/aiRoutes.js';
import apiRoutes from './routes/index.js';
import authRoutes from './routes/authRoutes.js';
import careerRoutes from './routes/careerRoutes.js';
import healthRoutes from './routes/healthRoutes.js';
import meRoutes from './routes/meRoutes.js';
import materialRoutes from './routes/materialRoutes.js';
import resourceRequestRoutes from './routes/resourceRequestRoutes.js';
import adminMaterialRoutes from './routes/adminMaterialRoutes.js';
import updateRoutes from './routes/updateRoutes.js';
import {
  connectionsRouter,
  peersRouter,
  sessionsRouter,
  skillOffersRouter,
} from './routes/communityRoutes.js';
import { apiRateLimiter } from './middleware/rateLimiters.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const app = express();
const allowedOrigins = new Set([
  config.clientUrl,
  'http://localhost:5173',
].filter(Boolean).map((origin) => origin.replace(/\/$/, '')));

// Add security headers and permit the deployed frontend plus local Vite development.
app.use(helmet());
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin.replace(/\/$/, ''))) {
      return callback(null, true);
    }
    return callback(null, false);
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Log HTTP requests, parse bounded JSON bodies, and limit API request bursts.
app.use(morgan(config.environment === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '1mb' }));
app.use('/api', apiRateLimiter);

// Register health and feature routes before the not-found and error middleware.
app.use('/api/health', healthRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/careers', careerRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/resource-requests', resourceRequestRoutes);
app.use('/api/admin', adminMaterialRoutes);
app.use('/api/peers', peersRouter);
app.use('/api/skill-offers', skillOffersRouter);
app.use('/api/connections', connectionsRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/updates', updateRoutes);
app.use('/api/me', meRoutes);
app.use('/api/v1', apiRoutes);

// Format unknown routes and thrown errors through one response convention.
app.use(notFoundHandler);
app.use(errorHandler);

export default app;

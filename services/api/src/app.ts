import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import { errorHandler } from './middlewares/errorHandler.js';
import routes from './routes/index.js';
import { AppError } from './errors/AppError.js';

export const app = express();

// Security headers
app.use(helmet());

// CORS
const origins = env.CORS_ORIGINS.split(',').map(o => o.trim());
app.use(cors({ origin: origins, credentials: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 2000, // limit each IP to 2000 requests per windowMs (relaxed for dev/testing)
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Request parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(morgan('combined'));

import path from 'path';
import { fileURLToPath } from 'url';

// Fix dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static uploads
app.use(
  helmet.crossOriginResourcePolicy({ policy: "cross-origin" }) // allow images to be loaded cross-origin
);
app.use('/uploads', express.static(path.join(__dirname, '..', 'public', 'uploads')));

// Routes
app.use('/api/v1', routes);

// 404 handler
app.use((req, res, next) => {
  next(AppError.notFound(`Route ${req.originalUrl} not found`));
});

// Global Error Handler
app.use(errorHandler);

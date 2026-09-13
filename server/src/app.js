import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './config/env.js';
import statusRoutes from './routes/statusRoutes.js';
import menuRoutes from './routes/menuRoutes.js';
import authRoutes from './routes/authRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import adminMenuRoutes from './routes/adminMenuRoutes.js';
import staffRoutes from './routes/staffRoutes.js';
import auditRoutes from './routes/auditRoutes.js';
import { notFound } from './middleware/notFound.js';
import { errorHandler } from './middleware/errorHandler.js';
import { csrfProtection, generateCsrfToken } from './middleware/csrfMiddleware.js';
import { generalLimiter, loginLimiter, uploadLimiter } from './middleware/rateLimiters.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set('trust proxy', 1);

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// Middleware
app.use(cors({
  origin: config.clientOrigin,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Serve uploads statically
const uploadsPath = path.resolve(process.env.LOCAL_UPLOAD_DIRECTORY || path.join(__dirname, '../../client/public/uploads'));
app.use('/uploads', express.static(uploadsPath));

// General Rate Limiting
app.use('/api', generalLimiter);

// Routes
app.use('/api', statusRoutes);
app.use('/api', menuRoutes);

app.get('/api/admin/csrf', generateCsrfToken);
app.use('/api/admin', csrfProtection);

// Apply strict limiters to specific routes
app.use('/api/admin/auth/login', loginLimiter);
app.use('/api/admin/auth', authRoutes);

app.use('/api/admin/upload', uploadLimiter);
app.use('/api/admin/upload', uploadRoutes);

app.use('/api/admin/menu', adminMenuRoutes);
app.use('/api/admin/staff', staffRoutes);
app.use('/api/admin/audit', auditRoutes);

if (process.env.NODE_ENV === 'production') {
  const clientDistPath = path.join(__dirname, '../../client/dist');
  app.use(express.static(clientDistPath));
}

// Error Handling
app.use(notFound);
app.use(errorHandler);

export default app;

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './config/env.js';
import statusRoutes from './routes/statusRoutes.js';
import menuRoutes from './routes/menuRoutes.js';
import { notFound } from './middleware/notFound.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// Middleware
app.use(cors({
  origin: config.clientOrigin
}));
app.use(express.json());

// Routes
app.use('/api', statusRoutes);
app.use('/api', menuRoutes);

if (process.env.NODE_ENV === 'production') {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const clientDistPath = path.join(__dirname, '../../client/dist');
  app.use(express.static(clientDistPath));
}

// Error Handling
app.use(notFound);
app.use(errorHandler);

export default app;

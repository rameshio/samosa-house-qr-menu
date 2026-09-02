import express from 'express';
import cors from 'cors';
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

// Error Handling
app.use(notFound);
app.use(errorHandler);

export default app;

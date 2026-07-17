import './config/env.js';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import assessmentRoutes from './routes/assessment.routes.js';
import certificateRoutes from './routes/certificate.routes.js';
import reportRoutes from './routes/report.routes.js';
import { errorHandler, notFound } from './middleware/error.middleware.js';

const app = express();

// Middlewares
const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? allowedOrigin : true,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mounting API endpoints
app.use('/api/auth', authRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/reports', reportRoutes);

// Root test route
app.get('/', (req, res) => {
  res.json({ message: 'AI Adaptive Certification Assessment Platform API is running...' });
});

// Fallback Middlewares
app.use(notFound);
app.use(errorHandler);

export default app;

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import passport from 'passport';
import { startNotificationCron } from './src/utils/notificationCron.js';
import './src/utils/passport.js';
import authRoutes from './src/routes/auth.routes.js';
import clientRoutes from './src/routes/client.routes.js';
import projectRoutes from './src/routes/project.routes.js';
import invoiceRoutes from './src/routes/invoice.routes.js';
import reminderRoutes from './src/routes/reminder.routes.js';
import dashboardRoutes from './src/routes/dashboard.routes.js';
import userRoutes from './src/routes/user.routes.js';

dotenv.config();

if (!process.env.JWT_SECRET) {
  console.error('FATAL: JWT_SECRET env var is not set');
  process.exit(1);
}
if (!process.env.MONGO_URI) {
  console.error('FATAL: MONGO_URI env var is not set');
  process.exit(1);
}

const app = express();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many attempts, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(helmet());

const ALLOWED_ORIGINS = [
  process.env.CLIENT_URL ?? 'http://localhost:5174',
  'http://localhost:5173',
  'http://localhost:5174',
];

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
    cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json({ limit: '50kb' }));
app.use(cookieParser());
app.use(passport.initialize());

app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'Raqib API is running' });
});

app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/user', userRoutes);

const PORT = process.env.PORT ?? 5000;

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    startNotificationCron();
  })
  .catch((err: Error) => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });

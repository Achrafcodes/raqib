import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './src/routes/auth.routes.js';
import clientRoutes from './src/routes/client.routes.js';
import projectRoutes from './src/routes/project.routes.js';
import invoiceRoutes from './src/routes/invoice.routes.js';
import reminderRoutes from './src/routes/reminder.routes.js';
import dashboardRoutes from './src/routes/dashboard.routes.js';

dotenv.config();

const app = express();

app.use(cors({ origin: (origin, cb) => cb(null, true) }));
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'Raqib API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/dashboard', dashboardRoutes);

const PORT = process.env.PORT ?? 5000;

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err: Error) => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });

// Server initialized at: 2026-05-13
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import interviewRoutes from './routes/interviewRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect DB
(async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    await connectDB();
    console.log('MongoDB connection successful');
  } catch (err) {
    console.error(`MongoDB connection failed: ${err.message}`);
  }
})();

// Universal Routes (handles both /api/* and /* for Vercel compatibility)
const prefixes = ['/api', ''];

prefixes.forEach(prefix => {
  app.use(`${prefix}/auth`, authRoutes);
  app.use(`${prefix}/users`, userRoutes);
  app.use(`${prefix}/jobs`, jobRoutes);
  app.use(`${prefix}/applications`, applicationRoutes);
  app.use(`${prefix}/interviews`, interviewRoutes);
  
  // Health check
  app.get(`${prefix}/health`, (req, res) => {
    res.status(200).json({ message: 'Server is running' });
  });
});

// Error handling
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

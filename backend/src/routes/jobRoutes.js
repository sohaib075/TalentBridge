import express from 'express';
import { getAllJobs, getJobDetail, createJob, updateJob, deleteJob, getBranches } from '../controllers/jobController.js';
import { authenticateToken, requireHROrAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAllJobs);
router.get('/branches', getBranches);
router.get('/:jobId', getJobDetail);

// HR/Admin routes
router.post('/', authenticateToken, requireHROrAdmin, createJob);
router.put('/:jobId', authenticateToken, requireHROrAdmin, updateJob);
router.delete('/:jobId', authenticateToken, requireHROrAdmin, deleteJob);

export default router;

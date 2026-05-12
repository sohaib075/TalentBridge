import express from 'express';
import {
  scheduleInterview,
  getJobInterviews,
  getCandidateInterviews,
  getInterviewDetail,
  updateInterview,
  cancelInterview,
} from '../controllers/interviewController.js';
import { authenticateToken, requireHROrAdmin, requireCandidate } from '../middleware/auth.js';

const router = express.Router();

// HR/Admin routes
router.post('/', authenticateToken, requireHROrAdmin, scheduleInterview);
router.get('/job/:jobId', authenticateToken, requireHROrAdmin, getJobInterviews);
router.put('/:interviewId', authenticateToken, requireHROrAdmin, updateInterview);
router.put('/:interviewId/cancel', authenticateToken, requireHROrAdmin, cancelInterview);

// Candidate routes
router.get('/', authenticateToken, requireCandidate, getCandidateInterviews);
router.get('/:interviewId', authenticateToken, getInterviewDetail);

export default router;

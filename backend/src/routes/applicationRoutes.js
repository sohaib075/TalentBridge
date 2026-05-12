import express from 'express';
import {
  applyForJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
  getApplicationDetail,
  rejectApplication,
  sendCustomMessage,
} from '../controllers/applicationController.js';
import { authenticateToken, requireCandidate, requireHROrAdmin } from '../middleware/auth.js';
import { uploadResume } from '../middleware/upload.js';

const router = express.Router();

// Candidate routes
router.post('/:jobId/apply', authenticateToken, requireCandidate, (req, res, next) => {
  uploadResume(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  });
}, applyForJob);

router.get('/my-applications', authenticateToken, requireCandidate, getMyApplications);

// HR/Admin routes
router.get('/job/:jobId', authenticateToken, requireHROrAdmin, getJobApplications);
router.get('/:applicationId', authenticateToken, getApplicationDetail);
router.put('/:applicationId/status', authenticateToken, requireHROrAdmin, updateApplicationStatus);
router.put('/:applicationId/reject', authenticateToken, requireHROrAdmin, rejectApplication);
router.post('/:applicationId/message', authenticateToken, requireHROrAdmin, sendCustomMessage);

export default router;

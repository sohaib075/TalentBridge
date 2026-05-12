import express from 'express';
import { updateProfile, uploadResume, uploadCoverLetter, getProfile } from '../controllers/userController.js';
import { authenticateToken, requireCandidate } from '../middleware/auth.js';
import { uploadProfilePicture, uploadResume as uploadResumeMiddleware, uploadCoverLetter as uploadCoverLetterMiddleware } from '../middleware/upload.js';

const router = express.Router();

router.put('/profile', authenticateToken, updateProfile);
router.post('/upload-resume', authenticateToken, requireCandidate, (req, res, next) => {
  uploadResumeMiddleware(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  });
}, uploadResume);

router.post('/upload-cover-letter', authenticateToken, requireCandidate, (req, res, next) => {
  uploadCoverLetterMiddleware(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  });
}, uploadCoverLetter);

router.get('/profile/:userId', getProfile);

export default router;

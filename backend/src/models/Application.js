import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  candidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
  },
  status: {
    type: String,
    enum: ['Submitted', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Rejected', 'Selected'],
    default: 'Submitted',
  },
  resume: {
    type: String, // Cloudinary URL
    required: true,
  },
  coverLetter: String, // Cloudinary URL (optional)
  appliedAt: {
    type: Date,
    default: Date.now,
  },
  reviewedAt: Date,
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  reviewNotes: String,
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Prevent duplicate applications for same candidate-job pair
applicationSchema.index({ candidate: 1, job: 1 }, { unique: true });

export default mongoose.model('Application', applicationSchema);

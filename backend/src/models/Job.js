import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
    required: true,
  },
  salaryMin: Number,
  salaryMax: Number,
  currency: {
    type: String,
    default: 'PKR',
  },
  experience: String, // e.g., "2-5 years"
  qualification: String,
  employmentType: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
    default: 'Full-time',
  },
  availableSeats: {
    type: Number,
    default: 1,
  },
  requiredSkills: [String],
  responsibilities: [String],
  benefits: [String],
  isActive: {
    type: Boolean,
    default: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  closedAt: Date,
});

export default mongoose.model('Job', jobSchema);

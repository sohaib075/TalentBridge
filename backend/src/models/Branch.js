import mongoose from 'mongoose';

const branchSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    enum: ['Islamabad', 'Lahore', 'Karachi', 'Remote'],
  },
  city: String,
  country: String,
  address: String,
  contactPerson: String,
  email: String,
  phone: String,
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Branch', branchSchema);

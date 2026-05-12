import Job from '../models/Job.js';
import Branch from '../models/Branch.js';

export const getAllJobs = async (req, res) => {
  try {
    const { branch, department, search, page = 1, limit = 10 } = req.query;

    const filter = { isActive: true };
    if (branch) filter.branch = branch;
    if (department) filter.department = department;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;

    const jobs = await Job.find(filter)
      .populate('branch', 'name')
      .populate('createdBy', 'firstName lastName email')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Job.countDocuments(filter);

    res.status(200).json({
      jobs,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getJobDetail = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId)
      .populate('branch')
      .populate('createdBy', 'firstName lastName email');

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createJob = async (req, res) => {
  try {
    const { title, description, department, branch, salaryMin, salaryMax, experience, employmentType, availableSeats, requiredSkills, responsibilities, benefits } = req.body;

    const job = new Job({
      title,
      description,
      department,
      branch,
      salaryMin,
      salaryMax,
      experience,
      employmentType,
      availableSeats,
      requiredSkills,
      responsibilities,
      benefits,
      createdBy: req.user.userId,
    });

    await job.save();
    await job.populate('branch');
    await job.populate('createdBy', 'firstName lastName email');

    res.status(201).json({
      message: 'Job created successfully',
      job,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const updates = req.body;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Only HR/Admin who created the job can update
    if (job.createdBy.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    Object.assign(job, updates);
    job.updatedAt = new Date();
    await job.save();

    res.status(200).json({
      message: 'Job updated successfully',
      job,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.createdBy.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    await Job.findByIdAndDelete(jobId);

    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBranches = async (req, res) => {
  try {
    const branches = await Branch.find({ isActive: true }) || [];
    res.status(200).json(branches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

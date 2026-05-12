import Application from '../models/Application.js';
import Job from '../models/Job.js';
import Interview from '../models/Interview.js';
import { sendShortlistEmail, sendRejectionEmail, sendInterviewEmail, sendCustomEmail } from '../utils/emailService.js';

export const applyForJob = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Resume required' });
    }

    const { jobId } = req.params;
    const { coverLetter } = req.body;
    const candidateId = req.user.userId;

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      candidate: candidateId,
      job: jobId,
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    const application = new Application({
      candidate: candidateId,
      job: jobId,
      resume: req.file.path,
      coverLetter,
    });

    await application.save();
    await application.populate('candidate').populate('job');

    res.status(201).json({
      message: 'Application submitted successfully',
      application,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyApplications = async (req, res) => {
  try {
    const candidateId = req.user.userId;

    const applications = await Application.find({ candidate: candidateId })
      .populate('job')
      .sort({ appliedAt: -1 });

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params;

    const applications = await Application.find({ job: jobId })
      .populate('candidate', 'firstName lastName email phone resume')
      .sort({ appliedAt: -1 });

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status, reviewNotes } = req.body;

    const application = await Application.findById(applicationId)
      .populate('candidate')
      .populate('job');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    application.status = status;
    if (reviewNotes) application.reviewNotes = reviewNotes;
    application.reviewedBy = req.user.userId;
    application.reviewedAt = new Date();
    application.updatedAt = new Date();

    await application.save();

    // Send email based on status
    if (status === 'Shortlisted') {
      await sendShortlistEmail(
        application.candidate.email,
        application.candidate.firstName,
        application.job.title
      );
    } else if (status === 'Rejected') {
      await sendRejectionEmail(
        application.candidate.email,
        application.candidate.firstName,
        application.job.title
      );
    }

    res.status(200).json({
      message: 'Application status updated',
      application,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getApplicationDetail = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const application = await Application.findById(applicationId)
      .populate('candidate')
      .populate('job')
      .populate('reviewedBy', 'firstName lastName');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.status(200).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const rejectApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const application = await Application.findById(applicationId)
      .populate('candidate')
      .populate('job');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    application.status = 'Rejected';
    application.reviewedBy = req.user.userId;
    application.reviewedAt = new Date();
    await application.save();

    await sendRejectionEmail(
      application.candidate.email,
      application.candidate.firstName,
      application.job.title
    );

    res.status(200).json({
      message: 'Application rejected',
      application,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const sendCustomMessage = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { subject, message } = req.body;

    if (!subject || !message) {
      return res.status(400).json({ message: 'Subject and message are required' });
    }

    const application = await Application.findById(applicationId)
      .populate('candidate')
      .populate('job');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    await sendCustomEmail(application.candidate.email, subject, message);

    res.status(200).json({ message: 'Custom message sent successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

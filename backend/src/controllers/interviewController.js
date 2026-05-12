import Interview from '../models/Interview.js';
import Application from '../models/Application.js';
import { sendInterviewEmail } from '../utils/emailService.js';

export const scheduleInterview = async (req, res) => {
  try {
    const { applicationId, interviewType, scheduledDate, endTime, location, meetingLink, message } = req.body;

    const application = await Application.findById(applicationId)
      .populate('candidate')
      .populate('job');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const interview = new Interview({
      application: applicationId,
      candidate: application.candidate._id,
      job: application.job._id,
      scheduledBy: req.user.userId,
      interviewType,
      scheduledDate,
      endTime,
      location,
      meetingLink,
      message,
    });

    await interview.save();

    // Update application status
    application.status = 'Interview Scheduled';
    await application.save();

    // Send email
    await sendInterviewEmail(
      application.candidate.email,
      application.candidate.firstName,
      application.job.title,
      scheduledDate,
      message
    );

    res.status(201).json({
      message: 'Interview scheduled successfully',
      interview,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getJobInterviews = async (req, res) => {
  try {
    const { jobId } = req.params;

    const interviews = await Interview.find({ job: jobId })
      .populate('candidate', 'firstName lastName email phone')
      .populate('job', 'title')
      .sort({ scheduledDate: 1 });

    res.status(200).json(interviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCandidateInterviews = async (req, res) => {
  try {
    const candidateId = req.user.userId;

    const interviews = await Interview.find({ candidate: candidateId })
      .populate('job', 'title')
      .sort({ scheduledDate: -1 });

    res.status(200).json(interviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getInterviewDetail = async (req, res) => {
  try {
    const { interviewId } = req.params;

    const interview = await Interview.findById(interviewId)
      .populate('candidate')
      .populate('job')
      .populate('scheduledBy', 'firstName lastName email');

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    res.status(200).json(interview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateInterview = async (req, res) => {
  try {
    const { interviewId } = req.params;
    const { status, feedback, rating } = req.body;

    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    if (status) interview.status = status;
    if (feedback) interview.feedback = feedback;
    if (rating) interview.rating = rating;
    interview.updatedAt = new Date();

    await interview.save();

    res.status(200).json({
      message: 'Interview updated successfully',
      interview,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const cancelInterview = async (req, res) => {
  try {
    const { interviewId } = req.params;

    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    interview.status = 'Cancelled';
    interview.updatedAt = new Date();
    await interview.save();

    res.status(200).json({
      message: 'Interview cancelled',
      interview,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

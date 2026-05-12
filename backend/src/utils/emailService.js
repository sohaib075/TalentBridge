import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD,
  },
});

export const sendEmail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to,
      subject,
      html,
    });
    console.log('Email sent:', info.response);
    return true;
  } catch (error) {
    console.error('Email send error:', error);
    return false;
  }
};

export const sendShortlistEmail = async (candidateEmail, candidateName, jobTitle) => {
  const html = `
    <h2>Congratulations, ${candidateName}!</h2>
    <p>We are excited to inform you that you have been shortlisted for the position of <strong>${jobTitle}</strong>.</p>
    <p>Our HR team will contact you soon with further details.</p>
    <p>Best regards,<br/>Our Recruitment Team</p>
  `;
  return sendEmail(candidateEmail, `Shortlisted for ${jobTitle}`, html);
};

export const sendInterviewEmail = async (candidateEmail, candidateName, jobTitle, interviewDate, message) => {
  const html = `
    <h2>Interview Invitation</h2>
    <p>Dear ${candidateName},</p>
    <p>We are pleased to invite you for an interview for the position of <strong>${jobTitle}</strong>.</p>
    <p><strong>Interview Date & Time:</strong> ${new Date(interviewDate).toLocaleString()}</p>
    <p><strong>Message:</strong> ${message}</p>
    <p>Best regards,<br/>Our Recruitment Team</p>
  `;
  return sendEmail(candidateEmail, `Interview Invitation for ${jobTitle}`, html);
};

export const sendRejectionEmail = async (candidateEmail, candidateName, jobTitle) => {
  const html = `
    <h2>Application Update</h2>
    <p>Dear ${candidateName},</p>
    <p>Thank you for your interest in the position of <strong>${jobTitle}</strong>.</p>
    <p>Unfortunately, we have decided to move forward with other candidates.</p>
    <p>We encourage you to apply for future opportunities with us.</p>
    <p>Best regards,<br/>Our Recruitment Team</p>
  `;
  return sendEmail(candidateEmail, `Application Status for ${jobTitle}`, html);
};

export const sendCustomEmail = async (candidateEmail, subject, message) => {
  const html = `
    <h2>${subject}</h2>
    <p>${message}</p>
    <p>Best regards,<br/>Our Recruitment Team</p>
  `;
  return sendEmail(candidateEmail, subject, html);
};

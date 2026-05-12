import apiClient from './api';

export const authAPI = {
  register: (data) => apiClient.post('/auth/register', data),
  login: (data) => apiClient.post('/auth/login', data),
  getMe: () => apiClient.get('/auth/me'),
};

export const userAPI = {
  updateProfile: (data) => apiClient.put('/users/profile', data),
  uploadResume: (formData) =>
    apiClient.post('/users/upload-resume', formData),
  uploadCoverLetter: (formData) =>
    apiClient.post('/users/upload-cover-letter', formData),
  getProfile: (userId) => apiClient.get(`/users/profile/${userId}`),
};

export const jobAPI = {
  getAllJobs: (params) => apiClient.get('/jobs', { params }),
  getJobDetail: (jobId) => apiClient.get(`/jobs/${jobId}`),
  createJob: (data) => apiClient.post('/jobs', data),
  updateJob: (jobId, data) => apiClient.put(`/jobs/${jobId}`, data),
  deleteJob: (jobId) => apiClient.delete(`/jobs/${jobId}`),
  getBranches: () => apiClient.get('/jobs/branches'),
};

export const applicationAPI = {
  applyForJob: (jobId, formData) =>
    apiClient.post(`/applications/${jobId}/apply`, formData),
  getMyApplications: () => apiClient.get('/applications/my-applications'),
  getJobApplications: (jobId) => apiClient.get(`/applications/job/${jobId}`),
  getApplicationDetail: (applicationId) => apiClient.get(`/applications/${applicationId}`),
  updateApplicationStatus: (applicationId, data) =>
    apiClient.put(`/applications/${applicationId}/status`, data),
  rejectApplication: (applicationId) =>
    apiClient.put(`/applications/${applicationId}/reject`),
  sendCustomMessage: (applicationId, data) =>
    apiClient.post(`/applications/${applicationId}/message`, data),
};

export const interviewAPI = {
  scheduleInterview: (data) => apiClient.post('/interviews', data),
  getJobInterviews: (jobId) => apiClient.get(`/interviews/job/${jobId}`),
  getCandidateInterviews: () => apiClient.get('/interviews'),
  getInterviewDetail: (interviewId) => apiClient.get(`/interviews/${interviewId}`),
  updateInterview: (interviewId, data) =>
    apiClient.put(`/interviews/${interviewId}`, data),
  cancelInterview: (interviewId) =>
    apiClient.put(`/interviews/${interviewId}/cancel`),
};

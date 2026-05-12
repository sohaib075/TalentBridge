import { useEffect, useState } from 'react';
import { jobAPI, interviewAPI } from '../../lib/apiService';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function ManageInterviews() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState('');
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadJobs();
  }, []);

  useEffect(() => {
    if (selectedJob) loadInterviews();
  }, [selectedJob]);

  const loadJobs = async () => {
    try {
      const response = await jobAPI.getAllJobs();
      setJobs(response.data.jobs || []);
    } catch (error) {
      console.error('Failed to load jobs:', error);
    }
  };

  const loadInterviews = async () => {
    try {
      setLoading(true);
      const response = await interviewAPI.getJobInterviews(selectedJob);
      setInterviews(response.data || []);
    } catch (error) {
      console.error('Failed to load interviews:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-6">Manage Interviews</h1>

        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">Select Job</label>
          <select
            value={selectedJob}
            onChange={(e) => setSelectedJob(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
          >
            <option value="">Choose a job</option>
            {jobs.map((job) => (
              <option key={job._id} value={job._id}>{job.title}</option>
            ))}
          </select>
        </div>

        {!selectedJob ? (
          <div className="text-slate-500">Select a job to view interviews.</div>
        ) : loading ? (
          <div>Loading...</div>
        ) : interviews.length === 0 ? (
          <div className="text-center py-12 text-slate-500">No interviews scheduled</div>
        ) : (
          <div className="space-y-4">
            {interviews.map((interview) => (
              <div key={interview._id} className="border rounded-lg p-4">
                <div className="font-semibold text-slate-900">
                  {interview.candidate?.firstName} {interview.candidate?.lastName}
                </div>
                <div className="text-slate-600 text-sm">Type: {interview.interviewType}</div>
                <div className="text-slate-600 text-sm">Date: {new Date(interview.scheduledDate).toLocaleString()}</div>
                <div className="text-slate-600 text-sm">Status: {interview.status}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

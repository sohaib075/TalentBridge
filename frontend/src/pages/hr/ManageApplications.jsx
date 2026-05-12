import { useEffect, useState } from 'react';
import { jobAPI, applicationAPI, interviewAPI } from '../../lib/apiService';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Users, FileText, Mail, Calendar, CheckCircle, XCircle, Clock, ChevronLeft, Search, Filter, ExternalLink, MessageSquare, Briefcase } from 'lucide-react';

export default function ManageApplications() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState('');
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadJobs();
  }, []);

  useEffect(() => {
    if (selectedJob) loadApplications();
  }, [selectedJob]);

  const loadJobs = async () => {
    try {
      const response = await jobAPI.getAllJobs();
      setJobs(response.data.jobs || []);
    } catch (error) {
      console.error('Failed to load jobs:', error);
    }
  };

  const loadApplications = async () => {
    try {
      setLoading(true);
      const response = await applicationAPI.getJobApplications(selectedJob);
      setApplications(response.data || []);
    } catch (error) {
      console.error('Failed to load applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (applicationId, status) => {
    try {
      await applicationAPI.updateApplicationStatus(applicationId, { status });
      await loadApplications();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const sendCustomMessage = async (applicationId) => {
    const subject = prompt('Subject');
    const body = prompt('Message');
    if (!subject || !body) return;

    try {
      await applicationAPI.sendCustomMessage(applicationId, { subject, message: body });
      setMessage('Custom email sent successfully.');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Failed to send message:', error);
      setMessage('Failed to send email.');
    }
  };

  const scheduleInterview = async (applicationId) => {
    const interviewType = prompt('Interview type (Phone, Video, In-person, Online Test):', 'Video');
    const scheduledDate = prompt('Interview date/time (YYYY-MM-DD HH:mm):');
    const message = prompt('Message to candidate:');
    if (!interviewType || !scheduledDate) return;

    try {
      await interviewAPI.scheduleInterview({
        applicationId,
        interviewType,
        scheduledDate,
        message: message || 'We look forward to speaking with you.',
      });
      await loadApplications();
      setMessage('Interview scheduled successfully.');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Failed to schedule interview:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Shortlisted': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Rejected': return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'Interview Scheduled': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      case 'Under Review': return 'bg-amber-50 text-amber-600 border-amber-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-indigo-100">
      <Navbar />

      <div className="bg-slate-900 pt-16 pb-32">
        <div className="max-w-7xl mx-auto px-6">
          <Link to="/hr-dashboard" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors font-bold">
            <ChevronLeft size={20} /> Back to Dashboard
          </Link>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-black text-white mb-2">Applicant Tracking</h1>
              <p className="text-slate-400 font-medium">Review and manage candidates for your active postings.</p>
            </div>
            
            <div className="relative w-full md:w-80">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <select
                value={selectedJob}
                onChange={(e) => setSelectedJob(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-white/10 border border-white/20 text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none font-bold"
              >
                <option value="" className="text-slate-900">Select Job Position</option>
                {jobs.map((job) => (
                  <option key={job._id} value={job._id} className="text-slate-900">{job.title}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-16 pb-20">
        {message && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-600 text-sm font-bold flex items-center gap-3 animate-fadeIn">
            <CheckCircle size={18} /> {message}
          </div>
        )}

        <div className="glass-card rounded-[40px] overflow-hidden shadow-2xl shadow-indigo-100/50">
          {!selectedJob ? (
            <div className="p-32 text-center bg-white">
              <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-indigo-100/50">
                <Search size={48} />
              </div>
              <h3 className="text-3xl font-black text-slate-900 mb-4">No Position Selected</h3>
              <p className="text-slate-500 max-w-sm mx-auto font-medium text-lg leading-relaxed">
                Please select a job from the dropdown above to view and manage candidate applications.
              </p>
            </div>
          ) : loading ? (
            <div className="p-32 text-center bg-white">
              <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mx-auto mb-6"></div>
              <p className="text-slate-500 font-black text-xl tracking-tight">Fetching Candidate Profiles...</p>
            </div>
          ) : applications.length === 0 ? (
            <div className="p-32 text-center bg-white">
              <div className="w-24 h-24 bg-slate-50 text-slate-300 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8">
                <Users size={48} />
              </div>
              <h3 className="text-3xl font-black text-slate-900 mb-4">No Applicants Yet</h3>
              <p className="text-slate-500 max-w-sm mx-auto font-medium text-lg">
                There are currently no applications for this position.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto bg-white">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">Candidate</th>
                    <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">Resume</th>
                    <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Workflow Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {applications.map((app) => (
                    <tr key={app._id} className="group hover:bg-slate-50/30 transition-colors">
                      <td className="px-8 py-8">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center font-black text-lg">
                            {app.candidate?.firstName?.[0]}{app.candidate?.lastName?.[0]}
                          </div>
                          <div>
                            <div className="font-black text-slate-900 text-lg group-hover:text-indigo-600 transition-colors">
                              {app.candidate?.firstName} {app.candidate?.lastName}
                            </div>
                            <div className="text-sm text-slate-500 font-medium flex items-center gap-1">
                              <Mail size={14} /> {app.candidate?.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-8">
                        {app.resume || app.candidate?.resume ? (
                          <a 
                            href={app.resume || app.candidate.resume} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-indigo-50 text-indigo-600 rounded-xl text-sm font-bold border border-slate-200 transition-all"
                          >
                            <FileText size={16} /> View PDF <ExternalLink size={14} />
                          </a>
                        ) : (
                          <span className="text-slate-400 text-sm font-medium">Not provided</span>
                        )}
                      </td>
                      <td className="px-8 py-8">
                        <span className={`px-4 py-1.5 rounded-full text-xs font-black border uppercase tracking-wider ${getStatusColor(app.status)}`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="px-8 py-8 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => updateStatus(app._id, 'Shortlisted')}
                            className="p-3 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                            title="Shortlist"
                          >
                            <CheckCircle size={18} />
                          </button>
                          <button
                            onClick={() => scheduleInterview(app._id)}
                            className="p-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                            title="Schedule Interview"
                          >
                            <Calendar size={18} />
                          </button>
                          <button
                            onClick={() => sendCustomMessage(app._id)}
                            className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                            title="Send Message"
                          >
                            <MessageSquare size={18} />
                          </button>
                          <button
                            onClick={() => updateStatus(app._id, 'Rejected')}
                            className="p-3 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                            title="Reject Candidate"
                          >
                            <XCircle size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

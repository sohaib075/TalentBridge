import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Briefcase, Clock, DollarSign, Users, Calendar, ChevronLeft, CheckCircle2, Share2, AlertCircle, Sparkles, Send } from 'lucide-react';
import { jobAPI, applicationAPI } from '../lib/apiService';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function JobDetail() {
  const { jobId } = useParams();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [applied, setApplied] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadJobDetail();
  }, [jobId]);

  const loadJobDetail = async () => {
    try {
      setLoading(true);
      const response = await jobAPI.getJobDetail(jobId);
      setJob(response.data);
    } catch (err) {
      console.error(err);
      setError('Could not load job details.');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!user) {
      window.location.href = `/login?redirect=/job-detail/${jobId}`;
      return;
    }
    
    if (user.role !== 'candidate') {
      setError('Only candidates can apply for jobs.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      await applicationAPI.applyToJob({ jobId });
      setApplied(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to apply. You might have already applied.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-white">
      <Navbar isDarkPage={true} />
      <div className="max-w-7xl mx-auto px-6">
        <div className="h-[400px] bg-slate-900 rounded-b-[64px] mb-12 -mx-6"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-12 bg-slate-100 rounded-2xl w-2/3 animate-pulse"></div>
            <div className="h-40 bg-slate-100 rounded-2xl animate-pulse"></div>
          </div>
          <div className="h-96 bg-slate-100 rounded-[40px] animate-pulse"></div>
        </div>
      </div>
    </div>
  );

  if (!job) return <div>Job not found</div>;

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-indigo-100">
      <Navbar isDarkPage={true} />

      {/* Hero Header */}
      <div className="bg-slate-900 pt-48 pb-48 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-full bg-indigo-600/10 blur-[120px] rounded-full translate-x-1/2"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <Link to="/jobs" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors font-bold group">
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back to listings
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="px-4 py-1.5 bg-indigo-500/10 text-indigo-300 rounded-full text-xs font-black uppercase tracking-widest border border-indigo-500/20">
                  {job.department}
                </span>
                <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-300 rounded-full text-xs font-black uppercase tracking-widest border border-emerald-500/20">
                  {job.employmentType}
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-[0.95]">
                {job.title}
              </h1>
              <div className="flex flex-wrap items-center gap-10 text-slate-400 font-bold">
                <div className="flex items-center gap-2">
                  <MapPin size={22} className="text-indigo-500" />
                  {job.branch?.name}
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={22} className="text-indigo-500" />
                  Posted {new Date(job.createdAt).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-2">
                  <Users size={22} className="text-indigo-500" />
                  {job.availableSeats} Open Roles
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <button className="p-4 bg-white/5 border border-white/10 rounded-2xl text-white hover:bg-white/10 transition-all shadow-xl">
                <Share2 size={24} />
              </button>
              <button 
                onClick={handleApply}
                disabled={applied || submitting}
                className="btn-primary !px-12 !py-5 text-xl flex items-center gap-3 shadow-2xl shadow-indigo-500/20"
              >
                {applied ? <CheckCircle2 size={24} /> : <Sparkles size={24} />}
                {applied ? 'Application Sent' : 'Apply for this Role'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="max-w-7xl mx-auto px-6 -mt-24 pb-32 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-12">
            <div className="bg-white p-12 rounded-[48px] shadow-2xl shadow-slate-900/10 border border-slate-100">
              <h2 className="text-3xl font-black text-slate-900 mb-8 flex items-center gap-4">
                <div className="w-2 h-8 bg-indigo-600 rounded-full"></div>
                About the Position
              </h2>
              <div className="prose prose-slate prose-lg max-w-none text-slate-600 font-medium leading-relaxed">
                {job.description}
              </div>

              <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                    <CheckCircle2 className="text-emerald-500" size={24} /> Requirements
                  </h3>
                  <ul className="space-y-4">
                    {job.requiredSkills?.map((skill, i) => (
                      <li key={i} className="flex items-start gap-3 text-slate-600 font-bold">
                        <div className="w-2 h-2 rounded-full bg-slate-300 mt-2.5"></div>
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                    <Sparkles className="text-amber-500" size={24} /> Key Benefits
                  </h3>
                  <ul className="space-y-4">
                    {job.benefits?.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-3 text-slate-600 font-bold">
                        <div className="w-2 h-2 rounded-full bg-slate-300 mt-2.5"></div>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Responsibilities */}
            <div className="bg-white p-12 rounded-[48px] shadow-2xl shadow-slate-900/10 border border-slate-100">
              <h2 className="text-3xl font-black text-slate-900 mb-8 flex items-center gap-4">
                <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
                Responsibilities
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {job.responsibilities?.map((res, i) => (
                  <div key={i} className="p-6 bg-slate-50 border border-slate-100 rounded-2xl flex items-start gap-4 hover:border-indigo-200 transition-all">
                    <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-slate-900 font-black shadow-sm shrink-0">{i + 1}</div>
                    <p className="text-slate-600 font-bold leading-relaxed">{res}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar / Quick Apply */}
          <aside className="relative">
            <div className="sticky top-32 space-y-8">
              <div className="bg-white p-10 rounded-[48px] shadow-2xl shadow-slate-900/10 border border-slate-100">
                <h2 className="text-2xl font-black text-slate-900 mb-8">Job Summary</h2>
                
                <div className="space-y-6 mb-10">
                  <div className="flex items-center justify-between py-4 border-b border-slate-100">
                    <span className="text-slate-400 font-bold uppercase text-xs tracking-widest flex items-center gap-2">
                      <DollarSign size={14} /> Annual Salary
                    </span>
                    <span className="text-slate-900 font-black">
                      {job.salaryMin ? `${(job.salaryMin / 1000).toFixed(0)}k` : 'Negotiable'}
                      {job.salaryMax ? ` - ${(job.salaryMax / 1000).toFixed(0)}k` : ''}
                      <span className="text-slate-400 ml-1">PKR</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-4 border-b border-slate-100">
                    <span className="text-slate-400 font-bold uppercase text-xs tracking-widest flex items-center gap-2">
                      <MapPin size={14} /> Experience
                    </span>
                    <span className="text-slate-900 font-black">{job.experience || 'Not specified'}</span>
                  </div>
                  <div className="flex items-center justify-between py-4 border-b border-slate-100">
                    <span className="text-slate-400 font-bold uppercase text-xs tracking-widest flex items-center gap-2">
                      <Calendar size={14} /> Deadline
                    </span>
                    <span className="text-slate-900 font-black">30 Days Left</span>
                  </div>
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-xs font-black flex items-center gap-2">
                    <AlertCircle size={16} /> {error}
                  </div>
                )}

                {applied ? (
                  <div className="p-8 bg-emerald-50 rounded-3xl border border-emerald-100 text-center">
                    <CheckCircle2 size={40} className="text-emerald-600 mx-auto mb-4" />
                    <div className="text-emerald-900 font-black text-lg mb-1">Application Received!</div>
                    <p className="text-emerald-600 text-sm font-bold leading-relaxed">
                      Our hiring team will review your profile and reach out via email.
                    </p>
                  </div>
                ) : (
                  <button 
                    onClick={handleApply}
                    disabled={submitting}
                    className="w-full btn-primary !rounded-[2.5rem] !py-6 text-xl shadow-2xl shadow-indigo-100 flex items-center justify-center gap-3"
                  >
                    {submitting ? (
                      <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>Submit Application <Send size={20} /></>
                    )}
                  </button>
                )}

                <p className="mt-8 text-center text-slate-400 text-[10px] font-bold leading-relaxed">
                  By applying, you agree to our <a href="#" className="text-indigo-600 underline">Terms</a> and confirm you have the required legal right to work.
                </p>
              </div>

              <div className="p-10 bg-slate-900 rounded-[48px] text-white relative overflow-hidden shadow-2xl shadow-slate-900/20">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/20 blur-2xl rounded-full"></div>
                <h3 className="text-xl font-black mb-4 relative z-10">Pro Tip</h3>
                <p className="text-slate-400 text-sm font-medium leading-relaxed relative z-10">
                  Ensure your <Link to="/candidate-profile" className="text-indigo-400 hover:underline font-black">resume is updated</Link> before applying to increase your chances by 40%.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
}

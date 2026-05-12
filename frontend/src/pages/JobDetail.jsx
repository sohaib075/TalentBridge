import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, 
  Briefcase, 
  Clock, 
  DollarSign, 
  Users, 
  Calendar, 
  ChevronLeft, 
  CheckCircle2, 
  Share2, 
  AlertCircle, 
  Sparkles, 
  Send,
  X,
  FileText,
  Upload,
  User as UserIcon,
  Phone,
  Mail,
  ShieldCheck,
  Check
} from 'lucide-react';
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
  
  // Application Form States
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user ? `${user.firstName} ${user.lastName}` : '',
    email: user?.email || '',
    phone: user?.phone || '',
    coverLetter: ''
  });
  const [resumeFile, setResumeFile] = useState(null);

  useEffect(() => {
    loadJobDetail();
  }, [jobId]);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: `${user.firstName} ${user.lastName}`,
        email: user.email,
        phone: user.phone || ''
      }));
    }
  }, [user]);

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

  const handleOpenApply = async () => {
    if (!user) {
      window.location.href = `/login?redirect=/job-detail/${jobId}`;
      return;
    }
    
    // Open modal immediately for responsiveness
    setShowModal(true);
    setError('');

    try {
      if (user.role !== 'candidate') {
        setError('Only candidates can apply for jobs.');
        return;
      }
      // Refresh user data in background to ensure resume status is up to date
      await refreshUser();
    } catch (err) {
      console.error("Refresh failed:", err);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      console.log('Frontend Submission Check:', {
        resumeFile: resumeFile ? resumeFile.name : 'NONE',
        profileResume: user?.resume || 'NONE'
      });

      if (!resumeFile && (!user?.resume || user?.resume === 'null')) {
        setError('A resume is required. Please upload one or add it to your profile.');
        setSubmitting(false);
        return;
      }

      const submission = new FormData();
      submission.append('coverLetter', formData.coverLetter);
      if (resumeFile) {
        submission.append('resume', resumeFile);
      }
      
      // Note: We currently store candidate details in their User profile, 
      // but we send the cover letter and resume specifically for this application.
      await applicationAPI.applyForJob(jobId, submission);
      
      setApplied(true);
      setShowModal(false);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit application. Please try again.';
      setError(msg);
      setSubmitting(false);
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

  if (!job) return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mb-8 shadow-xl">
        <AlertCircle size={48} className="text-rose-500" />
      </div>
      <h1 className="text-3xl font-black text-slate-900 mb-4">Job Not Found</h1>
      <Link to="/jobs" className="text-indigo-600 font-bold hover:underline">Back to all jobs</Link>
    </div>
  );

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
                <span className="px-4 py-1.5 bg-indigo-500/10 text-indigo-300 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-500/20">
                  {job.department}
                </span>
                <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-300 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
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
                onClick={handleOpenApply}
                disabled={applied || submitting}
                className="btn-primary !px-12 !py-5 text-xl flex items-center gap-3 shadow-2xl shadow-indigo-500/20 group"
              >
                {applied ? <CheckCircle2 size={24} /> : <Sparkles size={24} className="group-hover:rotate-12 transition-transform" />}
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
                  <div key={i} className="p-6 bg-slate-50 border border-slate-100 rounded-2xl flex items-start gap-4 hover:border-indigo-200 transition-all group">
                    <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-slate-900 font-black shadow-sm shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">{i + 1}</div>
                    <p className="text-slate-600 font-bold leading-relaxed">{res}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar / Job Summary */}
          <aside className="relative">
            <div className="sticky top-32 space-y-8">
              <div className="bg-white p-10 rounded-[48px] shadow-2xl shadow-slate-900/10 border border-slate-100">
                <h2 className="text-2xl font-black text-slate-900 mb-8">Job Summary</h2>
                
                <div className="space-y-6 mb-10">
                  <div className="flex items-center justify-between py-4 border-b border-slate-100">
                    <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest flex items-center gap-2">
                      <DollarSign size={14} /> Annual Salary
                    </span>
                    <span className="text-slate-900 font-black">
                      {job.salaryMin ? `${(job.salaryMin / 1000).toFixed(0)}k` : 'Neg.'}
                      {job.salaryMax ? ` - ${(job.salaryMax / 1000).toFixed(0)}k` : ''}
                      <span className="text-slate-400 ml-1">PKR</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-4 border-b border-slate-100">
                    <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest flex items-center gap-2">
                      <Briefcase size={14} /> Experience
                    </span>
                    <span className="text-slate-900 font-black">{job.experience || '3-5 Years'}</span>
                  </div>
                  <div className="flex items-center justify-between py-4 border-b border-slate-100">
                    <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest flex items-center gap-2">
                      <Calendar size={14} /> Deadline
                    </span>
                    <span className="text-slate-900 font-black">30 Days Left</span>
                  </div>
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-xs font-black flex items-center gap-3 animate-pulse">
                    <AlertCircle size={20} className="shrink-0" /> {error}
                  </div>
                )}

                {applied ? (
                  <div className="p-8 bg-emerald-50 rounded-[32px] border border-emerald-100 text-center shadow-xl shadow-emerald-500/5">
                    <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white shadow-lg shadow-emerald-500/20">
                      <Check size={32} />
                    </div>
                    <div className="text-emerald-900 font-black text-xl mb-2">Success!</div>
                    <p className="text-emerald-600 text-sm font-bold leading-relaxed mb-6">
                      Your application has been logged. Our recruiters will reach out soon.
                    </p>
                    <Link to="/candidate-dashboard" className="inline-block w-full py-4 bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-700 transition-all text-sm">
                      Track Application
                    </Link>
                  </div>
                ) : (
                  <button 
                    onClick={handleOpenApply}
                    disabled={submitting}
                    className="w-full btn-primary !rounded-[2.5rem] !py-6 text-xl shadow-2xl shadow-indigo-100 flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
                  >
                    {submitting ? (
                      <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>Apply for Position <Send size={20} /></>
                    )}
                  </button>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* ========== ELITE APPLICATION FORM MODAL ========== */}
      {showModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 sm:p-12">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl transition-all duration-500" onClick={() => setShowModal(false)}></div>
          
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[48px] shadow-[0_40px_120px_rgba(0,0,0,0.4)] overflow-hidden relative z-10 animate-in zoom-in-95 fade-in slide-in-from-bottom-8 duration-500 flex flex-col">
            
            {/* Modal Header */}
            <div className="bg-slate-900 p-8 sm:p-12 text-white relative shrink-0">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <button onClick={() => setShowModal(false)} className="absolute top-8 right-8 w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all">
                <X size={24} />
              </button>
              <div className="flex items-center gap-3 mb-4">
                <div className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-[9px] font-black uppercase tracking-widest border border-indigo-500/30">Application Portal</div>
                <div className="w-1 h-1 bg-white/20 rounded-full"></div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Job ID: TB-{job._id.slice(-6).toUpperCase()}</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-[0.95] max-w-2xl">
                Submit your <span className="text-indigo-400 italic">candidacy</span>
              </h2>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-8 sm:p-12">
              {error && (
                <div className="mb-8 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-xs font-black flex items-center gap-3 animate-in slide-in-from-top-2 duration-300">
                  <AlertCircle size={20} className="shrink-0" /> {error}
                </div>
              )}
              <form onSubmit={handleFinalSubmit} className="space-y-10">
                
                {/* Contact Information Section */}
                <div className="space-y-8">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                      <UserIcon size={18} />
                    </div>
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">Contact Details</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                      <div className="relative group">
                        <UserIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                        <input
                          required
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-14 pr-6 py-4 text-slate-900 font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                          placeholder="John Doe"
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                      <div className="relative group">
                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                        <input
                          required
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-14 pr-6 py-4 text-slate-900 font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                    <div className="relative group">
                      <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                      <input
                        required
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-14 pr-6 py-4 text-slate-900 font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                        placeholder="+92 000 0000000"
                      />
                    </div>
                  </div>
                </div>

                <hr className="border-slate-100" />

                {/* Professional Content Section */}
                <div className="space-y-10">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                      <FileText size={18} />
                    </div>
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">Professional Dossier</h3>
                  </div>

                  {/* Cover Letter */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between ml-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cover Letter</label>
                      <span className="text-[9px] font-bold text-slate-300">Min 50 characters recommended</span>
                    </div>
                    <textarea
                      required
                      name="coverLetter"
                      value={formData.coverLetter}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-6 py-5 text-slate-900 font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all min-h-[160px] resize-none"
                      placeholder="Draft your pitch to the hiring team..."
                    />
                  </div>

                  {/* Resume Upload */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between ml-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Supporting Documents (PDF)</label>
                      {user?.resume && (
                        <div className="flex items-center gap-2 text-emerald-600 font-black text-[9px] uppercase tracking-widest">
                          <Check size={12} strokeWidth={4} /> Profile Resume Ready
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      id="modal-resume-file"
                      accept="application/pdf"
                      onChange={(e) => setResumeFile(e.target.files[0])}
                      className="hidden"
                    />
                    <label 
                      htmlFor="modal-resume-file"
                      className={`flex flex-col sm:flex-row items-center gap-6 p-8 border-2 border-dashed rounded-[32px] cursor-pointer transition-all duration-500 ${
                        resumeFile 
                          ? 'bg-emerald-50 border-emerald-200' 
                          : user?.resume 
                            ? 'bg-slate-50 border-slate-200 hover:border-indigo-400 hover:bg-white' 
                            : 'bg-rose-50 border-rose-100 hover:border-rose-300'
                      }`}
                    >
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 transition-all ${
                        resumeFile || user?.resume ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
                      }`}>
                        {resumeFile || user?.resume ? <ShieldCheck size={32} /> : <Upload size={32} />}
                      </div>
                      <div className="flex-1 text-center sm:text-left">
                        <div className={`text-lg font-black mb-1 ${resumeFile ? 'text-emerald-900' : user?.resume ? 'text-slate-900' : 'text-rose-900'}`}>
                          {resumeFile ? resumeFile.name : (user?.resume ? 'Using Profile Resume' : 'Resume Required')}
                        </div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                          {resumeFile ? `${(resumeFile.size / 1024 / 1024).toFixed(2)} MB • Ready` : user?.resume ? 'Click to change or leave as is' : 'Please upload a PDF to apply'}
                        </p>
                      </div>
                    </label>
                    {!resumeFile && !user?.resume && (
                      <p className="text-[10px] font-black text-rose-500 ml-1 flex items-center gap-1">
                        <AlertCircle size={12} /> A resume is required for this application
                      </p>
                    )}
                  </div>
                </div>

                {/* Submit Actions */}
                <div className="pt-8 flex flex-col sm:flex-row gap-6">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-8 py-5 bg-slate-50 text-slate-600 font-black rounded-3xl hover:bg-slate-100 transition-all border border-slate-100"
                  >
                    Discard Draft
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || (!resumeFile && (!user?.resume || user?.resume === 'null'))}
                    className={`flex-[2] btn-primary !rounded-3xl !py-5 text-xl flex items-center justify-center gap-4 shadow-2xl shadow-indigo-100 active:scale-[0.98] transition-all ${
                      (!resumeFile && (!user?.resume || user?.resume === 'null')) ? 'opacity-50 cursor-not-allowed grayscale' : ''
                    }`}
                  >
                    {submitting ? (
                      <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>Push Application <Send size={20} className="group-hover:translate-x-1 transition-transform" /></>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

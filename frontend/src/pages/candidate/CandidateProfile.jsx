import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { userAPI } from '../../lib/apiService';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { 
  User, 
  Phone, 
  FileText, 
  Upload, 
  Save, 
  LogOut, 
  LayoutDashboard, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Briefcase,
  Code,
  ArrowUpRight
} from 'lucide-react';

export default function CandidateProfile() {
  const navigate = useNavigate();
  const { user, logout, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    skills: user?.skills?.join(', ') || '',
    experience: user?.experience || '',
  });
  
  const [resumeFile, setResumeFile] = useState(null);
  const [coverLetterFile, setCoverLetterFile] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });
  
  const resumeRef = useRef(null);
  const coverLetterRef = useRef(null);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const payload = {
        ...form,
        skills: form.skills
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
      };
      await userAPI.updateProfile(payload);

      if (resumeFile) {
        const resumeData = new FormData();
        resumeData.append('resume', resumeFile);
        await userAPI.uploadResume(resumeData);
      }

      if (coverLetterFile) {
        const coverData = new FormData();
        coverData.append('coverLetter', coverLetterFile);
        await userAPI.uploadCoverLetter(coverData);
      }

      await refreshUser();
      setMessage({ text: 'Profile updated successfully!', type: 'success' });
      
      // Clear files after upload
      setResumeFile(null);
      setCoverLetterFile(null);
    } catch (error) {
      console.error('Failed to update profile:', error);
      const errorMsg = error.response?.data?.message || 'Failed to update profile. Please try again.';
      setMessage({ text: errorMsg, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-indigo-100">
      <Navbar />

      <div className="pt-32 pb-24 max-w-5xl mx-auto px-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100">
                Candidate Settings
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              Personal <span className="text-indigo-600 font-black">Profile</span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/candidate-dashboard')}
              className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 transition-all shadow-sm"
            >
              <LayoutDashboard size={18} /> Dashboard
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-3 bg-rose-50 text-rose-600 font-bold rounded-2xl hover:bg-rose-100 transition-all border border-rose-100"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>

        <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Info Card */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-10 rounded-[40px] shadow-2xl shadow-slate-200/50 border border-slate-100">
              <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
                <User className="text-indigo-600" /> Basic Information
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">First Name</label>
                  <input
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                    placeholder="Enter first name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Last Name</label>
                  <input
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                    placeholder="Enter last name"
                  />
                </div>
              </div>

              <div className="space-y-8">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Professional Bio</label>
                  <textarea
                    name="bio"
                    value={form.bio}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-6 py-4 text-slate-900 font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all min-h-[120px]"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                    <div className="relative group">
                      <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                      <input
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-16 pr-6 py-4 text-slate-900 font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                        placeholder="+92 000 0000000"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Experience (Years)</label>
                    <div className="relative group">
                      <Briefcase className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                      <input
                        name="experience"
                        value={form.experience}
                        onChange={handleChange}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-16 pr-6 py-4 text-slate-900 font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                        placeholder="e.g. 5"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Skills & Technologies</label>
                  <div className="relative group">
                    <Code className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                    <input
                      name="skills"
                      value={form.skills}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-16 pr-6 py-4 text-slate-900 font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                      placeholder="React, Node.js, Python..."
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar / Upload Card */}
          <div className="space-y-8">
            <div className="bg-white p-10 rounded-[40px] shadow-2xl shadow-slate-200/50 border border-slate-100">
              <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
                <FileText className="text-indigo-600" /> Documents
              </h2>

              <div className="space-y-6">
                {/* Resume Upload */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between ml-1">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Resume (PDF)</label>
                    {user?.resume && (
                      <a 
                        href={user.resume} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[10px] font-black text-indigo-600 hover:text-indigo-700 flex items-center gap-1 uppercase tracking-widest"
                      >
                        View Current <ArrowUpRight size={12} />
                      </a>
                    )}
                  </div>
                  <input
                    type="file"
                    ref={resumeRef}
                    accept="application/pdf"
                    onChange={(e) => setResumeFile(e.target.files && e.target.files[0])}
                    className="hidden"
                  />
                  <div 
                    onClick={() => resumeRef.current.click()}
                    className={`w-full p-6 border-2 border-dashed rounded-3xl cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group ${
                      resumeFile || (user?.resume && user?.resume !== 'null')
                        ? 'bg-emerald-50 border-emerald-200' 
                        : 'bg-slate-50 border-slate-200 hover:border-indigo-400 hover:bg-indigo-50'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                      resumeFile || (user?.resume && user?.resume !== 'null') ? 'bg-emerald-500 text-white' : 'bg-white text-slate-400 group-hover:text-indigo-600 shadow-sm'
                    }`}>
                      {resumeFile || (user?.resume && user?.resume !== 'null') ? <CheckCircle2 size={24} /> : <Upload size={24} />}
                    </div>
                    <span className={`text-sm font-black ${resumeFile || (user?.resume && user?.resume !== 'null') ? 'text-emerald-700' : 'text-slate-500'}`}>
                      {resumeFile ? resumeFile.name : (user?.resume && user?.resume !== 'null' ? 'Resume Attached' : 'Click to Upload Resume')}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">PDF Max 5MB</span>
                  </div>
                </div>

                {/* Cover Letter Upload */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between ml-1">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Cover Letter</label>
                    {user?.coverLetter && (
                      <a 
                        href={user.coverLetter} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[10px] font-black text-indigo-600 hover:text-indigo-700 flex items-center gap-1 uppercase tracking-widest"
                      >
                        View Current <ArrowUpRight size={12} />
                      </a>
                    )}
                  </div>
                  <input
                    type="file"
                    ref={coverLetterRef}
                    accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={(e) => setCoverLetterFile(e.target.files && e.target.files[0])}
                    className="hidden"
                  />
                  <div 
                    onClick={() => coverLetterRef.current.click()}
                    className={`w-full p-6 border-2 border-dashed rounded-3xl cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group ${
                      coverLetterFile || (user?.coverLetter && user?.coverLetter !== 'null')
                        ? 'bg-indigo-50 border-indigo-200' 
                        : 'bg-slate-50 border-slate-200 hover:border-indigo-400 hover:bg-indigo-50'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                      coverLetterFile || (user?.coverLetter && user?.coverLetter !== 'null') ? 'bg-indigo-600 text-white' : 'bg-white text-slate-400 group-hover:text-indigo-600 shadow-sm'
                    }`}>
                      {coverLetterFile || (user?.coverLetter && user?.coverLetter !== 'null') ? <CheckCircle2 size={24} /> : <Upload size={24} />}
                    </div>
                    <span className={`text-sm font-black ${coverLetterFile || (user?.coverLetter && user?.coverLetter !== 'null') ? 'text-indigo-700' : 'text-slate-500'}`}>
                      {coverLetterFile ? coverLetterFile.name : (user?.coverLetter && user?.coverLetter !== 'null' ? 'Cover Letter Attached' : 'Click to Upload Cover Letter')}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">PDF/DOCX Max 5MB</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Messages */}
            {message.text && (
              <div className={`p-6 rounded-3xl flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500 border ${
                message.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-rose-50 border-rose-100 text-rose-700'
              }`}>
                {message.type === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                <span className="font-black text-sm">{message.text}</span>
              </div>
            )}

            {/* Actions */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary !rounded-[2.5rem] !py-6 text-xl shadow-2xl shadow-indigo-100 flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
            >
              {loading ? (
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><Save size={24} /> Save Profile Changes</>
              )}
            </button>
            
            <p className="text-center text-slate-400 text-[10px] font-bold leading-relaxed px-6">
              Complete your profile and upload a high-quality resume to increase your chances of getting shortlisted by <span className="text-indigo-600">65%</span>.
            </p>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
}

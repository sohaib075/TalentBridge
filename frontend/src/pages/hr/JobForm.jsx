import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { jobAPI } from '../../lib/apiService';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Briefcase, MapPin, DollarSign, Clock, ListPlus, ChevronLeft, Save, AlertCircle } from 'lucide-react';

export default function JobForm() {
  const navigate = useNavigate();
  const { jobId } = useParams();
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    department: '',
    branch: '',
    salaryMin: '',
    salaryMax: '',
    experience: '',
    employmentType: 'Full-time',
    availableSeats: 1,
    requiredSkills: '',
    responsibilities: '',
    benefits: '',
  });

  useEffect(() => {
    loadBranches();
    if (jobId) loadJob();
  }, [jobId]);

  const loadBranches = async () => {
    try {
      const response = await jobAPI.getBranches();
      setBranches(response.data || []);
    } catch (error) {
      console.error('Failed to load branches:', error);
    }
  };

  const loadJob = async () => {
    try {
      const response = await jobAPI.getJobDetail(jobId);
      const job = response.data;
      setForm({
        title: job.title || '',
        description: job.description || '',
        department: job.department || '',
        branch: job.branch?._id || job.branch || '',
        salaryMin: job.salaryMin || '',
        salaryMax: job.salaryMax || '',
        experience: job.experience || '',
        employmentType: job.employmentType || 'Full-time',
        availableSeats: job.availableSeats || 1,
        requiredSkills: (job.requiredSkills || []).join(', '),
        responsibilities: (job.responsibilities || []).join(', '),
        benefits: (job.benefits || []).join(', '),
      });
    } catch (error) {
      console.error('Failed to load job:', error);
    }
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        salaryMin: form.salaryMin ? Number(form.salaryMin) : undefined,
        salaryMax: form.salaryMax ? Number(form.salaryMax) : undefined,
        availableSeats: Number(form.availableSeats),
        requiredSkills: form.requiredSkills.split(',').map((s) => s.trim()).filter(Boolean),
        responsibilities: form.responsibilities.split(',').map((s) => s.trim()).filter(Boolean),
        benefits: form.benefits.split(',').map((s) => s.trim()).filter(Boolean),
      };

      if (jobId) {
        await jobAPI.updateJob(jobId, payload);
      } else {
        await jobAPI.createJob(payload);
      }

      navigate('/hr-dashboard/manage-jobs');
    } catch (error) {
      console.error('Failed to save job:', error);
      alert('Failed to save job. Check if you selected a Branch.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-indigo-100">
      <Navbar />

      <div className="bg-slate-900 pt-16 pb-32">
        <div className="max-w-5xl mx-auto px-6">
          <Link to="/hr-dashboard" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors font-bold">
            <ChevronLeft size={20} /> Back to Dashboard
          </Link>
          <h1 className="text-4xl font-black text-white flex items-center gap-4">
            <div className="bg-indigo-600 p-2 rounded-xl">
              <ListPlus size={28} />
            </div>
            {jobId ? 'Update Opportunity' : 'Create New Opportunity'}
          </h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-16 pb-20">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Main Info */}
          <div className="glass-card p-10 rounded-[48px] shadow-2xl shadow-indigo-100 border-white/80">
            <h2 className="text-xl font-black text-slate-900 mb-8 uppercase tracking-widest flex items-center gap-3">
              <div className="w-1.5 h-6 bg-indigo-600 rounded-full"></div>
              Core Details
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-widest ml-1">Job Title</label>
                <input 
                  name="title" 
                  value={form.title} 
                  onChange={handleChange} 
                  required
                  placeholder="e.g. Senior Full Stack Engineer"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium" 
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-widest ml-1">Department</label>
                <div className="relative">
                  <Briefcase className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input 
                    name="department" 
                    value={form.department} 
                    onChange={handleChange} 
                    required
                    placeholder="Engineering"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-14 pr-6 py-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-widest ml-1">Hiring Branch</label>
                <div className="relative">
                  <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <select 
                    name="branch" 
                    value={form.branch} 
                    onChange={handleChange} 
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-14 pr-6 py-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold appearance-none"
                  >
                    <option value="">Select Location</option>
                    {branches.map((b) => (
                      <option key={b._id} value={b._id}>{b.name}</option>
                    ))}
                  </select>
                </div>
                {branches.length === 0 && (
                  <p className="mt-2 text-xs text-amber-600 font-bold flex items-center gap-1">
                    <AlertCircle size={14} /> Please run "npm run seed" to load branches.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Logistics */}
          <div className="glass-card p-10 rounded-[48px] shadow-2xl shadow-indigo-100 border-white/80">
            <h2 className="text-xl font-black text-slate-900 mb-8 uppercase tracking-widest flex items-center gap-3">
              <div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
              Compensation & Terms
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-widest ml-1">Salary Range (PKR)</label>
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input name="salaryMin" value={form.salaryMin} onChange={handleChange} placeholder="Min" className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-emerald-500 outline-none" />
                  </div>
                  <span className="text-slate-300 font-bold">to</span>
                  <div className="relative flex-1">
                    <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input name="salaryMax" value={form.salaryMax} onChange={handleChange} placeholder="Max" className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-emerald-500 outline-none" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-widest ml-1">Employment Type</label>
                <div className="relative">
                  <Clock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <select name="employmentType" value={form.employmentType} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-14 pr-6 py-4 font-bold appearance-none focus:ring-2 focus:ring-indigo-500 outline-none">
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Contract</option>
                    <option>Internship</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Description & Skills */}
          <div className="glass-card p-10 rounded-[48px] shadow-2xl shadow-indigo-100 border-white/80">
            <h2 className="text-xl font-black text-slate-900 mb-8 uppercase tracking-widest flex items-center gap-3">
              <div className="w-1.5 h-6 bg-blue-500 rounded-full"></div>
              Requirements
            </h2>
            
            <div className="space-y-8">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-widest ml-1">Job Description</label>
                <textarea 
                  name="description" 
                  value={form.description} 
                  onChange={handleChange} 
                  rows="6"
                  placeholder="Describe the role, the team, and what a typical day looks like..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-[32px] px-8 py-6 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium leading-relaxed" 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-widest ml-1">Required Skills (Comma-separated)</label>
                  <input name="requiredSkills" value={form.requiredSkills} onChange={handleChange} placeholder="React, Node.js, AWS" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-widest ml-1">Experience (Years)</label>
                  <input name="experience" value={form.experience} onChange={handleChange} placeholder="3-5" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 justify-end">
            <button 
              type="button" 
              onClick={() => navigate('/hr-dashboard/manage-jobs')} 
              className="px-10 py-4 bg-white text-slate-500 font-black rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all"
            >
              Discard Changes
            </button>
            <button 
              type="submit" 
              disabled={loading} 
              className="btn-primary !px-12 !py-4 text-xl flex items-center gap-3 shadow-xl shadow-indigo-200"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <Save size={20} />
              )}
              {jobId ? 'Update Post' : 'Publish Job'}
            </button>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
}

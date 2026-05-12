import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jobAPI } from '../../lib/apiService';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Briefcase, Plus, Edit3, Trash2, MapPin, Clock, ChevronLeft, Search, AlertCircle } from 'lucide-react';

export default function ManageJobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const response = await jobAPI.getAllJobs();
      setJobs(response.data.jobs || []);
    } catch (error) {
      console.error('Failed to load jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jobId) => {
    if (!confirm('Are you sure you want to permanently delete this job listing?')) return;
    try {
      await jobAPI.deleteJob(jobId);
      await loadJobs();
    } catch (error) {
      console.error('Failed to delete job:', error);
      alert('Failed to delete job');
    }
  };

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    job.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              <h1 className="text-4xl font-black text-white mb-2">Manage Vacancies</h1>
              <p className="text-slate-400 font-medium">Tracking {jobs.length} active job postings across all departments.</p>
            </div>
            <Link 
              to="/hr-dashboard/post-job" 
              className="btn-primary !px-8 !py-4 flex items-center gap-2 shadow-2xl shadow-indigo-500/20"
            >
              <Plus size={20} /> Post New Position
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-16 pb-20">
        <div className="glass-card rounded-[40px] overflow-hidden shadow-2xl shadow-indigo-100/50">
          
          {/* Table Header / Search */}
          <div className="p-8 border-b border-slate-100 bg-white/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <h2 className="text-xl font-bold text-slate-900">Active Listings</h2>
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Filter by title or department..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-6 py-3 bg-slate-100 border-transparent focus:bg-white focus:ring-2 focus:ring-indigo-500 rounded-2xl outline-none transition-all text-sm font-medium"
              />
            </div>
          </div>

          {loading ? (
            <div className="p-20 text-center">
              <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-500 font-bold">Loading your listings...</p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="p-20 text-center bg-white">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                <Briefcase size={40} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">No jobs found</h3>
              <p className="text-slate-500 mb-8 max-w-sm mx-auto font-medium">
                {searchTerm ? "No results match your search criteria." : "You haven't posted any jobs yet. Start by creating your first listing."}
              </p>
              {!searchTerm && (
                <Link to="/hr-dashboard/post-job" className="btn-primary inline-block">Post Your First Job</Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto bg-white">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Position</th>
                    <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Department</th>
                    <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Location</th>
                    <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredJobs.map((job) => (
                    <tr key={job._id} className="group hover:bg-slate-50/30 transition-colors">
                      <td className="px-8 py-6">
                        <div className="font-black text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">{job.title}</div>
                        <div className="flex items-center gap-2 text-xs text-slate-400 font-bold">
                          <Clock size={12} /> {job.employmentType}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold border border-slate-200">
                          {job.department}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                          <MapPin size={14} className="text-indigo-400" />
                          {job.branch?.name || 'Main Branch'}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <button
                            onClick={() => navigate(`/hr-dashboard/edit-job/${job._id}`)}
                            className="p-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                            title="Edit Job"
                          >
                            <Edit3 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(job._id)}
                            className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                            title="Delete Job"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          <div className="p-6 bg-slate-50 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
              <AlertCircle size={14} /> End of active listings
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

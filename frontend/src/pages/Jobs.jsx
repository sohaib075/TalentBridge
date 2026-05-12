import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, MapPin, Briefcase, Clock, Filter, ArrowRight, Star, ChevronDown, LayoutGrid, List as ListIcon } from 'lucide-react';
import { jobAPI } from '../lib/apiService';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Jobs() {
  const [searchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [filters, setFilters] = useState({
    branch: searchParams.get('branch') || '',
    search: searchParams.get('q') || '',
    department: '',
    type: ''
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    loadJobs();
  }, [filters]);

  const loadInitialData = async () => {
    try {
      const branchRes = await jobAPI.getBranches();
      setBranches(branchRes.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const loadJobs = async () => {
    try {
      setLoading(true);
      const response = await jobAPI.getAllJobs(filters);
      setJobs(response.data.jobs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const departments = ['Engineering', 'Product', 'Design', 'Marketing', 'Sales', 'Human Resources', 'Finance'];

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-indigo-100">
      <Navbar isDarkPage={true} />

      <div className="pb-24">
        {/* Modern Search Header */}
        <div className="bg-slate-900 pt-44 pb-20 mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-full bg-indigo-600/10 blur-[100px] rounded-full translate-x-1/2"></div>
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <h1 className="text-5xl font-black text-white mb-8 tracking-tight">Discover your <span className="text-indigo-400">next challenge</span></h1>
            <div className="max-w-3xl">
              <div className="relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-400 transition-colors" size={24} />
                <input
                  type="text"
                  placeholder="Search by title, skills, or keywords..."
                  className="w-full pl-16 pr-6 py-6 bg-white/10 border border-white/20 rounded-3xl text-white placeholder:text-slate-500 focus:outline-none focus:bg-white focus:text-slate-900 focus:ring-8 focus:ring-indigo-500/10 transition-all font-bold text-xl"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 pb-24">
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Elite Filter Sidebar */}
            <aside className="lg:w-80 shrink-0 space-y-8">
              <div className="glass-panel !bg-white p-8 rounded-[40px] sticky top-28 border-slate-100 shadow-xl shadow-slate-200/50">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <Filter size={20} className="text-indigo-600" /> Filters
                  </h2>
                  <button 
                    onClick={() => setFilters({ branch: '', search: '', department: '', type: '' })}
                    className="text-xs font-black text-indigo-600 uppercase tracking-widest hover:underline"
                  >
                    Reset
                  </button>
                </div>

                <div className="space-y-10">
                  {/* Location Filter */}
                  <div>
                    <label className="block text-xs font-black text-slate-400 mb-4 uppercase tracking-widest ml-1">Office Location</label>
                    <div className="space-y-3">
                      <button
                        onClick={() => setFilters({ ...filters, branch: '' })}
                        className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${!filters.branch ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-600 hover:bg-slate-50'}`}
                      >
                        All Branches
                      </button>
                      {branches.map((b) => (
                        <button
                          key={b._id}
                          onClick={() => setFilters({ ...filters, branch: b._id })}
                          className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${filters.branch === b._id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-600 hover:bg-slate-50'}`}
                        >
                          {b.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Department Filter */}
                  <div>
                    <label className="block text-xs font-black text-slate-400 mb-4 uppercase tracking-widest ml-1">Department</label>
                    <div className="relative">
                      <select 
                        value={filters.department}
                        onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none cursor-pointer"
                      >
                        <option value="">All Departments</option>
                        {departments.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                      <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Job Type Filter */}
                  <div className="pt-4 border-t border-slate-50">
                    <label className="block text-xs font-black text-slate-400 mb-6 uppercase tracking-widest ml-1">Employment Type</label>
                    <div className="space-y-4">
                      {['Full-time', 'Part-time', 'Contract', 'Internship'].map(type => (
                        <label key={type} className="flex items-center gap-3 cursor-pointer group">
                          <div className="relative flex items-center justify-center">
                            <input 
                              type="checkbox" 
                              checked={filters.type === type}
                              onChange={() => setFilters({ ...filters, type: filters.type === type ? '' : type })}
                              className="peer appearance-none w-6 h-6 border-2 border-slate-200 rounded-lg checked:bg-indigo-600 checked:border-indigo-600 transition-all cursor-pointer"
                            />
                            <svg className="absolute w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span className="text-sm font-bold text-slate-600 group-hover:text-indigo-600 transition-colors">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Newsletter Sub */}
              <div className="bg-indigo-600 rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl shadow-indigo-100 mt-8">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <h3 className="text-xl font-black mb-2 relative z-10">Job Alerts</h3>
                <p className="text-indigo-100 text-sm mb-6 relative z-10 font-medium">Get notified about new roles instantly.</p>
                <div className="space-y-3 relative z-10">
                  <input type="email" placeholder="email@example.com" className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm placeholder:text-indigo-300 focus:outline-none focus:bg-white focus:text-indigo-600 transition-all" />
                  <button className="w-full bg-white text-indigo-600 font-black py-3 rounded-xl hover:bg-indigo-50 transition-all">Subscribe</button>
                </div>
              </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1">
              <div className="flex items-center justify-between mb-10">
                <div className="text-slate-500 font-bold">
                  Showing <span className="text-slate-900 font-black">{jobs.length}</span> open positions
                </div>
                <div className="flex items-center gap-2 bg-white p-1 rounded-xl shadow-sm border border-slate-100">
                  <button 
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'text-indigo-600 bg-indigo-50 shadow-inner' : 'text-slate-400 hover:text-indigo-600'}`}
                  >
                    <LayoutGrid size={20} />
                  </button>
                  <button 
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'text-indigo-600 bg-indigo-50 shadow-inner' : 'text-slate-400 hover:text-indigo-600'}`}
                  >
                    <ListIcon size={20} />
                  </button>
                </div>
              </div>

              {loading ? (
                <div className={`grid gap-8 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                  {[1, 2, 4, 6].map(i => (
                    <div key={i} className={`glass-panel rounded-[48px] animate-pulse ${viewMode === 'grid' ? 'h-72' : 'h-32'}`}></div>
                  ))}
                </div>
              ) : jobs.length === 0 ? (
                <div className="glass-panel !bg-white p-24 text-center rounded-[56px] border-slate-100">
                  <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 text-slate-300 shadow-inner">
                    <Search size={48} />
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 mb-4">No positions found</h3>
                  <p className="text-slate-500 max-w-sm mx-auto font-medium text-lg leading-relaxed">
                    Try adjusting your filters or search terms to find what you're looking for.
                  </p>
                </div>
              ) : (
                <div className={`grid gap-8 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                  {jobs.map((job) => (
                    <Link 
                      key={job._id} 
                      to={`/job-detail/${job._id}`}
                      className={`group glass-panel !bg-white rounded-[48px] border-slate-100 hover:shadow-2xl hover:shadow-indigo-100/50 transition-all duration-700 flex ${viewMode === 'grid' ? 'flex-col p-10' : 'flex-row items-center p-8 gap-8'}`}
                    >
                      {viewMode === 'grid' ? (
                        <>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-8">
                              <div className="px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                {job.department}
                              </div>
                              <button className="text-slate-200 hover:text-amber-400 transition-colors">
                                <Star size={22} className="fill-current" />
                              </button>
                            </div>
                            <h2 className="text-3xl font-black text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors leading-tight">
                              {job.title}
                            </h2>
                            <div className="flex flex-wrap items-center gap-6 text-slate-500 font-bold text-sm">
                              <span className="flex items-center gap-2"><MapPin size={18} className="text-indigo-400" /> {job.branch?.name}</span>
                              <span className="flex items-center gap-2"><Clock size={18} className="text-indigo-400" /> {job.employmentType}</span>
                            </div>
                          </div>

                          <div className="mt-10 pt-8 border-t border-slate-50 flex items-center justify-between">
                            <div className="text-slate-900 font-black text-xl">
                              {job.salaryMin ? `${(job.salaryMin / 1000).toFixed(0)}k` : 'Neg.'}
                              {job.salaryMax ? ` - ${(job.salaryMax / 1000).toFixed(0)}k` : ''}
                              <span className="text-slate-400 font-bold text-xs ml-1 uppercase">PKR</span>
                            </div>
                            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                              <ArrowRight size={24} />
                            </div>
                          </div>
                        </>
                      ) : (
                        /* Modern List Item */
                        <>
                          <div className="w-20 h-20 bg-slate-50 text-indigo-600 rounded-3xl flex items-center justify-center font-black text-3xl shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors shadow-inner">
                            {job.title[0]}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                              <h2 className="text-2xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">{job.title}</h2>
                              <div className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-indigo-100">{job.department}</div>
                            </div>
                            <div className="flex items-center gap-6 text-xs font-bold text-slate-400 uppercase tracking-widest">
                              <span className="flex items-center gap-1.5"><MapPin size={14} className="text-slate-300" /> {job.branch?.name}</span>
                              <span className="flex items-center gap-1.5"><Clock size={14} className="text-slate-300" /> {job.employmentType}</span>
                            </div>
                          </div>
                          <div className="text-right flex items-center gap-12">
                            <div className="hidden sm:block">
                              <div className="text-2xl font-black text-slate-900">
                                {job.salaryMin ? `${(job.salaryMin / 1000).toFixed(0)}k` : 'Neg.'}
                              </div>
                              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Starting PKR</div>
                            </div>
                            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                              <ArrowRight size={24} />
                            </div>
                          </div>
                        </>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </main>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

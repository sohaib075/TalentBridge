import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, MapPin, Briefcase, Users, Building2, Star, CheckCircle2, Globe, ShieldCheck, Clock, Sparkles, TrendingUp, Zap } from 'lucide-react';
import { jobAPI } from '../lib/apiService';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Landing() {
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    loadFeaturedJobs();
  }, []);

  const loadFeaturedJobs = async () => {
    try {
      setLoadingJobs(true);
      const response = await jobAPI.getAllJobs();
      setFeaturedJobs(response.data.jobs?.slice(0, 4) || []);
    } catch (err) {
      console.error("Failed to load featured jobs", err);
    } finally {
      setLoadingJobs(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    window.location.href = `/jobs?q=${encodeURIComponent(searchQuery)}`;
  };

  return (
    <div className="min-h-screen bg-white selection:bg-indigo-100 selection:text-indigo-900">
      <Navbar />

      {/* Modern Hero Section */}
      <div className="relative pt-44 pb-32 overflow-hidden">
        {/* Dynamic Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-50 rounded-full blur-[150px] opacity-60 animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-blue-50 rounded-full blur-[150px] opacity-60" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            {/* Hero Text */}
            <div className={`flex-1 text-center lg:text-left transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-black mb-8 uppercase tracking-[0.2em] shadow-sm">
                <Zap size={14} className="fill-indigo-700" /> Accelerate your career
              </div>
              
              <h1 className="text-6xl md:text-8xl font-black text-slate-900 mb-8 tracking-tighter leading-[0.85]">
                Hire <span className="text-indigo-600">Faster</span><br />
                Work <span className="text-indigo-600">Smarter</span>
              </h1>
              
              <p className="text-slate-500 text-xl md:text-2xl mb-12 font-medium leading-relaxed max-w-2xl">
                TalentBridge is the next-generation recruitment ecosystem connecting top 
                tier professionals with Pakistan's leading technology hubs.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 lg:justify-start justify-center mb-12">
                <Link to="/register" className="btn-primary !px-10 !py-5 text-lg group w-full sm:w-auto">
                  Get Started Free <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                </Link>
                <Link to="/jobs" className="btn-secondary !px-10 !py-5 text-lg w-full sm:w-auto">
                  Browse Openings
                </Link>
              </div>

              <div className="flex items-center gap-6 justify-center lg:justify-start">
                <div className="flex -space-x-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-slate-100 flex items-center justify-center font-black text-slate-400 text-xs shadow-sm">
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <div className="text-sm font-bold text-slate-500">
                  <span className="text-slate-900 font-black">12k+</span> professionals joined this week
                </div>
              </div>
            </div>

            {/* Hero Visual Mockup */}
            <div className="flex-1 relative w-full lg:max-w-xl animate-float">
              <div className="glass-panel p-8 rounded-[48px] shadow-2xl relative z-10 overflow-hidden border-indigo-100 bg-white/90">
                <div className="flex items-center justify-between mb-10">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                  </div>
                  <div className="px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100">HR Live Dashboard</div>
                </div>
                
                <div className="space-y-8">
                  {/* Header Metrics */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-indigo-600 rounded-3xl text-white shadow-lg shadow-indigo-100">
                      <div className="text-[10px] font-black uppercase opacity-60 mb-1">Active</div>
                      <div className="text-xl font-black">24</div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-3xl">
                      <div className="text-[10px] font-black uppercase text-slate-400 mb-1">New</div>
                      <div className="text-xl font-black text-slate-900">+12</div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-3xl">
                      <div className="text-[10px] font-black uppercase text-slate-400 mb-1">Hired</div>
                      <div className="text-xl font-black text-slate-900">85%</div>
                    </div>
                  </div>

                  {/* Candidate List */}
                  <div className="space-y-4">
                    <div className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Recent Candidates</div>
                    {[
                      { name: 'Muhammad Sohaib', role: 'Full Stack Engineer', status: 'Interview', color: 'bg-emerald-500' },
                      { name: 'Muhammad Uzair', role: 'Backend Developer', status: 'Review', color: 'bg-amber-500' },
                      { name: 'Ibrahim Zahid', role: 'DevOps Specialist', status: 'Hired', color: 'bg-indigo-600' }
                    ].map((c, i) => (
                      <div key={i} className="p-4 bg-white border border-slate-100 rounded-[28px] flex items-center justify-between shadow-sm hover:border-indigo-100 transition-all">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-2xl ${i === 0 ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'} flex items-center justify-center font-black text-sm`}>
                            {c.name === 'Muhammad Sohaib' ? 'MS' : c.name === 'Muhammad Uzair' ? 'MU' : 'IZ'}
                          </div>
                          <div>
                            <div className="text-sm font-black text-slate-900">{c.name}</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{c.role}</div>
                          </div>
                        </div>
                        <div className={`px-3 py-1 ${c.color} text-white rounded-lg text-[9px] font-black uppercase`}>{c.status}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Decorative Bottom Fade */}
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
              </div>
              {/* Decorative Glow */}
              <div className="absolute -inset-10 bg-indigo-400/20 blur-[100px] -z-10 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Jobs - Ultra Modern Grid */}
      <div className="max-w-7xl mx-auto px-6 py-32">
        <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
          <div className="max-w-2xl">
            <h2 className="text-5xl font-black text-slate-900 mb-6 tracking-tight">
              Featured <span className="text-indigo-600 italic">Opportunities</span>
            </h2>
            <p className="text-slate-500 text-xl font-medium leading-relaxed">
              Curated roles from the most innovative technology companies in the region.
            </p>
          </div>
          <Link to="/jobs" className="btn-secondary !rounded-2xl flex items-center gap-2 group">
            View Job Board <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loadingJobs ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-72 bg-slate-50 rounded-[40px] animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredJobs.map((job) => (
              <Link 
                key={job._id} 
                to={`/job-detail/${job._id}`}
                className="group glass-panel !bg-white p-10 rounded-[48px] border-slate-100 hover:border-indigo-200 hover:shadow-2xl hover:shadow-indigo-100/50 transition-all duration-700 flex flex-col justify-between h-full"
              >
                <div>
                  <div className="w-16 h-16 bg-slate-50 text-indigo-600 rounded-3xl flex items-center justify-center font-black text-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 mb-8 shadow-inner">
                    {job.title[0]}
                  </div>
                  <div className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-indigo-100 inline-block mb-4">
                    {job.department}
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight mb-4">
                    {job.title}
                  </h3>
                  <div className="flex items-center gap-2 text-slate-400 font-bold text-sm">
                    <MapPin size={16} className="text-slate-300" /> {job.branch?.name}
                  </div>
                </div>
                
                <div className="mt-10 flex items-center justify-between">
                  <div className="text-slate-900 font-black text-lg">
                    {job.salaryMin ? `${(job.salaryMin/1000).toFixed(0)}k` : 'Neg.'}
                  </div>
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <ArrowRight size={24} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Services/Value Proposition */}
      <div className="bg-slate-900 py-32 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-indigo-600/10 blur-[150px] -z-0"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            <div className="space-y-8">
              <div className="w-16 h-16 rounded-[24px] bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-900/40">
                <TrendingUp size={32} />
              </div>
              <h3 className="text-3xl font-black text-white leading-tight">Smart Talent Matching</h3>
              <p className="text-slate-400 text-lg font-medium leading-relaxed">
                Our AI-driven algorithms analyze skills and experience to connect the 
                right candidate with the right company instantly.
              </p>
            </div>
            <div className="space-y-8 lg:mt-12">
              <div className="w-16 h-16 rounded-[24px] bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-900/40">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-3xl font-black text-white leading-tight">Verified Ecosystem</h3>
              <p className="text-slate-400 text-lg font-medium leading-relaxed">
                Every employer and job listing on TalentBridge is verified to ensure a 
                secure and professional experience for everyone.
              </p>
            </div>
            <div className="space-y-8 lg:mt-24">
              <div className="w-16 h-16 rounded-[24px] bg-emerald-600 flex items-center justify-center text-white shadow-xl shadow-emerald-900/40">
                <Sparkles size={32} />
              </div>
              <h3 className="text-3xl font-black text-white leading-tight">Liquid Hiring Flow</h3>
              <p className="text-slate-400 text-lg font-medium leading-relaxed">
                From application to interview, our platform provides a fluid, unified 
                experience that eliminates recruitment friction.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

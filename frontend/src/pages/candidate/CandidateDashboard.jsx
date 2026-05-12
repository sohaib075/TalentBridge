import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Clock, CheckCircle2, XCircle, ChevronRight, Star, TrendingUp, Search, Bell, Sparkles, MapPin, ArrowUpRight, Zap } from 'lucide-react';
import { applicationAPI, jobAPI } from '../../lib/apiService';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function CandidateDashboard() {
  const [applications, setApplications] = useState([]);
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [appRes, jobRes] = await Promise.all([
        applicationAPI.getMyApplications(),
        jobAPI.getAllJobs()
      ]);
      setApplications(appRes.data || []);
      setFeaturedJobs(jobRes.data.jobs?.slice(0, 3) || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { label: 'Total Applications', value: applications.length, icon: Briefcase, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'In Review', value: applications.filter(a => a.status === 'pending').length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Shortlisted', value: '3', icon: Star, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Profile Views', value: '124', icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-indigo-100">
      <Navbar />

      <div className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6">
          {/* Hero Welcome */}
          <div className="bg-slate-900 rounded-[48px] p-12 md:p-16 mb-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[400px] h-full bg-indigo-600/20 blur-[100px] rounded-full translate-x-1/2"></div>
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-indigo-300 text-xs font-black mb-6 uppercase tracking-widest">
                <Sparkles size={14} className="fill-indigo-300" /> Career Growth Active
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight leading-tight">
                Accelerate your <span className="text-indigo-400 italic">career journey</span>
              </h1>
              <p className="text-slate-400 text-lg font-medium max-w-xl mb-10">
                You have 3 active interviews this week. We've matched 5 new roles to your profile.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/jobs" className="btn-primary !px-8 !py-4 shadow-none">Explore New Roles</Link>
                <Link to="/candidate-profile" className="btn-secondary !bg-white/5 !text-white !border-white/10 !px-8 !py-4 hover:!bg-white/10 transition-all flex items-center justify-center">Complete Profile</Link>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {stats.map((s, i) => (
              <div key={i} className="glass-panel !bg-white p-8 rounded-[40px] border-slate-100 flex items-center gap-6 group hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-500">
                <div className={`${s.bg} ${s.color} w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-inner`}>
                  <s.icon size={28} />
                </div>
                <div>
                  <div className="text-3xl font-black text-slate-900">{s.value}</div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* My Applications */}
            <div className="lg:col-span-2 space-y-8">
              <div className="glass-panel !bg-white p-10 rounded-[48px] border-slate-100">
                <div className="flex items-center justify-between mb-10">
                  <h3 className="text-2xl font-black text-slate-900">Application Tracking</h3>
                  <div className="flex items-center gap-2 text-slate-400 font-bold text-sm">
                    Status: <span className="text-indigo-600 font-black">All active</span>
                  </div>
                </div>

                {applications.length === 0 ? (
                  <div className="py-20 text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-slate-300">
                      <Search size={32} />
                    </div>
                    <p className="text-slate-500 font-bold">You haven't applied for any jobs yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {applications.map((app) => (
                      <div key={app._id} className="group p-6 rounded-[32px] border border-slate-50 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                        <div className="flex items-center gap-5">
                          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-xl shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                            {app.job?.title[0]}
                          </div>
                          <div>
                            <div className="font-black text-slate-900 text-lg group-hover:text-indigo-600 transition-colors">{app.job?.title}</div>
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                              <MapPin size={14} className="text-slate-300" /> {app.job?.branch?.name}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between w-full sm:w-auto gap-8">
                          <div className="flex flex-col items-end">
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                              app.status === 'pending' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                              app.status === 'accepted' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                              'bg-rose-50 text-rose-600 border border-rose-100'
                            }`}>
                              {app.status}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 mt-2 uppercase">Applied 2d ago</span>
                          </div>
                          <Link to={`/job-detail/${app.job?._id}`} className="p-3 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 transition-all">
                            <ArrowUpRight size={20} />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Smart Matches Sidebar */}
            <div className="space-y-8">
              <div className="glass-panel !bg-white p-10 rounded-[48px] border-slate-100">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-black text-slate-900">Top Matches</h3>
                  <Zap size={20} className="text-amber-500 fill-amber-500" />
                </div>
                <div className="space-y-6">
                  {featuredJobs.map((job) => (
                    <Link key={job._id} to={`/job-detail/${job._id}`} className="block group">
                      <div className="p-5 rounded-[28px] border border-slate-50 hover:bg-slate-50 transition-all duration-300">
                        <div className="text-indigo-600 font-black text-xs uppercase tracking-widest mb-2">{job.department}</div>
                        <div className="font-black text-slate-900 group-hover:text-indigo-600 transition-colors mb-4">{job.title}</div>
                        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{job.branch?.name}</span>
                          <span className="text-slate-900 font-black text-sm">PKR {(job.salaryMin/1000).toFixed(0)}k+</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                  <button className="w-full mt-4 py-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-2xl font-black text-sm transition-all">
                    View Personalized Board
                  </button>
                </div>
              </div>

              <div className="glass-panel !bg-gradient-to-br from-indigo-600 to-blue-700 p-10 rounded-[48px] text-white">
                <Bell className="mb-6 animate-bounce-slow" size={32} />
                <h3 className="text-xl font-black mb-4">Job Alerts On</h3>
                <p className="text-indigo-100 text-sm font-medium mb-8 leading-relaxed">
                  We'll notify you the moment a Senior React Role opens in Islamabad.
                </p>
                <button className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl font-black text-sm transition-all border border-white/10 backdrop-blur-md">
                  Edit Preferences
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

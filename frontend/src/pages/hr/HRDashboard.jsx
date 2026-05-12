import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Users, FileText, Plus, TrendingUp, Clock, ChevronRight, Activity, Calendar, Filter, MoreHorizontal, CheckCircle2, Clock3 } from 'lucide-react';
import { jobAPI, applicationAPI } from '../../lib/apiService';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function HRDashboard() {
  const [stats, setStats] = useState({ jobs: 0, applications: 0, pending: 0, hires: 12 });
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [jobRes, appRes] = await Promise.all([
        jobAPI.getAllJobs(),
        applicationAPI.getMyApplications() // Mocking for now
      ]);
      setStats(prev => ({ ...prev, jobs: jobRes.data.jobs.length }));
      setRecentApplications(appRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const metrics = [
    { label: 'Active Postings', value: stats.jobs, icon: Briefcase, trend: '+12%', color: 'bg-indigo-600' },
    { label: 'Total Applicants', value: '482', icon: Users, trend: '+28%', color: 'bg-blue-600' },
    { label: 'Interviews', value: '18', icon: Activity, trend: '+4%', color: 'bg-emerald-600' },
    { label: 'Avg. Fill Time', value: '14d', icon: Clock, trend: '-2d', color: 'bg-amber-600' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-indigo-100">
      <Navbar />

      <div className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header Area */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Command Center</h1>
              <p className="text-slate-500 font-medium">Welcome back, HR Manager. Here's your recruitment overview.</p>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <button className="flex-1 md:flex-none btn-secondary !px-6 !py-3 border-slate-200">
                <Filter size={18} /> Filters
              </button>
              <Link to="/jobs" className="flex-1 md:flex-none btn-primary !px-6 !py-3">
                <Plus size={18} /> Post New Job
              </Link>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {metrics.map((m, i) => (
              <div key={i} className="glass-panel !bg-white p-8 rounded-[40px] border-slate-100 group hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-500">
                <div className="flex items-center justify-between mb-6">
                  <div className={`${m.color} w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                    <m.icon size={28} />
                  </div>
                  <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black tracking-widest">{m.trend}</div>
                </div>
                <div className="text-4xl font-black text-slate-900 mb-1">{m.value}</div>
                <div className="text-slate-400 font-bold text-sm uppercase tracking-widest">{m.label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Recent Pipeline */}
            <div className="lg:col-span-2 space-y-8">
              <div className="glass-panel !bg-white p-10 rounded-[48px] border-slate-100">
                <div className="flex items-center justify-between mb-10">
                  <h3 className="text-2xl font-black text-slate-900">Recent Candidates</h3>
                  <button className="text-indigo-600 font-black text-sm flex items-center gap-1 hover:underline">
                    View Pipeline <ChevronRight size={18} />
                  </button>
                </div>
                
                <div className="space-y-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="group p-5 rounded-[32px] border border-slate-50 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all duration-300 flex items-center justify-between">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-slate-400">
                          {String.fromCharCode(64 + i)}
                        </div>
                        <div>
                          <div className="font-black text-slate-900 group-hover:text-indigo-600 transition-colors">Candidate Name {i}</div>
                          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Applied for Senior Frontend Engineer</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="hidden sm:block text-right">
                          <div className="text-xs font-black text-slate-900 italic">82% Match</div>
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">AI Score</div>
                        </div>
                        <button className="p-3 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 transition-all">
                          <MoreHorizontal size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Stats/Activity */}
            <div className="space-y-8">
              <div className="glass-panel !bg-slate-900 p-10 rounded-[48px] text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/20 blur-[60px] rounded-full"></div>
                <h3 className="text-xl font-black mb-8 relative z-10 flex items-center gap-2">
                  <Activity className="text-indigo-400" size={20} /> Recruitment Activity
                </h3>
                <div className="space-y-8 relative z-10">
                  {[
                    { label: 'New Job Posted', time: '2h ago', icon: CheckCircle2, color: 'text-emerald-400' },
                    { label: 'Interview Scheduled', time: '4h ago', icon: Calendar, color: 'text-blue-400' },
                    { label: 'Application Rejected', time: '5h ago', icon: Clock3, color: 'text-rose-400' },
                  ].map((act, i) => (
                    <div key={i} className="flex gap-4">
                      <div className={`${act.color} mt-1`}><act.icon size={18} /></div>
                      <div>
                        <div className="font-bold text-sm">{act.label}</div>
                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{act.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-10 py-4 bg-white/10 hover:bg-white/20 rounded-2xl font-black text-sm transition-all border border-white/5 backdrop-blur-md">
                  Download Report
                </button>
              </div>

              <div className="glass-panel !bg-white p-10 rounded-[48px] border-slate-100">
                <h3 className="text-xl font-black text-slate-900 mb-6">Pipeline Health</h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-xs font-black mb-2">
                      <span className="text-slate-400 uppercase tracking-widest">Active Leads</span>
                      <span className="text-indigo-600">65%</span>
                    </div>
                    <div className="h-3 bg-slate-50 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-600 rounded-full w-[65%] shadow-[0_0_15px_rgba(79,70,229,0.3)]"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-black mb-2">
                      <span className="text-slate-400 uppercase tracking-widest">Interview Stage</span>
                      <span className="text-blue-600">22%</span>
                    </div>
                    <div className="h-3 bg-slate-50 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full w-[22%] shadow-[0_0_15px_rgba(37,99,235,0.3)]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

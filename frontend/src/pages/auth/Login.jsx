import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Briefcase, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

import Logo from '../../components/Logo';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    // Smart Redirect: Go to intended page OR default dashboard
    const from = location.state?.from?.pathname || 
                (result.user.role === 'candidate' ? '/candidate-dashboard' : '/hr-dashboard');
    
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row">
      {/* Left Side: Branded Panel (Hidden on small screens) */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative items-center justify-center p-12 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200" 
            alt="Modern Office" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900/95 to-indigo-900/80"></div>
        </div>
        
        <div className="relative z-10 max-w-lg">
          <Link to="/" className="inline-flex items-center gap-3 mb-16 group">
            <Logo className="w-12 h-12" textClassName="text-4xl" light={true} />
          </Link>

          <h2 className="text-5xl font-black text-white leading-tight mb-8">
            Your next big <span className="text-indigo-400">career move</span> starts here.
          </h2>

          <div className="space-y-6">
            {[
              "Access to 500+ premium tech companies",
              "Direct communication with hiring managers",
              "Smart application tracking system",
              "Personalized job recommendations"
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-4 text-slate-300 font-medium">
                <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
                  <CheckCircle2 size={16} className="text-indigo-400" />
                </div>
                {text}
              </div>
            ))}
          </div>

          <div className="mt-20 p-8 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
            <p className="text-white font-medium italic leading-relaxed">
              "TalentBridge completely changed how I look for jobs. The interface is professional and the response rate from HR is amazing."
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white">MS</div>
              <div>
                <div className="text-white font-bold text-sm">Muhammad Sohaib</div>
                <div className="text-slate-500 text-xs uppercase tracking-widest font-bold">Frontend Engineer</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 bg-slate-50 md:bg-white relative">
        {/* Top Navigation */}
        <div className="absolute top-8 left-8 right-8 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold transition-colors group">
            <ArrowRight className="rotate-180 group-hover:-translate-x-1 transition-transform" size={20} />
            Back to Home
          </Link>
        </div>

        <div className="w-full max-w-md">
          <Link to="/" className="lg:hidden inline-flex items-center gap-2 mb-12">
            <Logo />
          </Link>

          <div className="mb-10">
            <h1 className="text-4xl font-black text-slate-900 mb-2">Sign In</h1>
            <p className="text-slate-500 font-medium">Enter your credentials to access your dashboard.</p>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-sm font-bold flex items-center gap-3 animate-fadeIn">
              <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest ml-1">Work Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all font-medium"
                placeholder="name@company.com"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2 px-1">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">Password</label>
                <a href="#" className="text-xs font-black text-indigo-600 hover:underline">Forgot password?</a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 pr-14 text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all font-medium"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-black py-5 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 shadow-xl shadow-indigo-100 hover:shadow-indigo-200 transform hover:-translate-y-1 active:translate-y-0 text-lg"
            >
              {loading ? (
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Sign In to Dashboard <ArrowRight size={20} /></>
              )}
            </button>
          </form>

          <p className="text-center text-slate-500 font-bold mt-12">
            Don't have an account yet?{' '}
            <Link to="/register" className="text-indigo-600 hover:underline">
              Create an account
            </Link>
          </p>

          <div className="mt-20 flex items-center justify-center gap-2 text-slate-300">
            <ShieldCheck size={18} />
            <span className="text-[10px] uppercase font-black tracking-[0.2em]">Secure Enterprise Authentication</span>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Briefcase, ArrowRight, User, Building2, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

import Logo from '../../components/Logo';

export default function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('candidate');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const result = await register(firstName, lastName, email, password, role);
    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    // Smart Redirect
    const from = location.state?.from?.pathname || 
                (result.user.role === 'candidate' ? '/candidate-dashboard' : '/hr-dashboard');
    
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row">
      {/* Left Side: Branded Panel */}
      <div className="hidden lg:flex lg:w-2/5 bg-indigo-900 relative items-center justify-center p-12 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200" 
            alt="Collaboration" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-indigo-900/95 to-blue-900/80"></div>
        </div>
        
        <div className="relative z-10 max-w-md text-center lg:text-left">
          <Link to="/" className="inline-flex items-center gap-3 mb-16 group">
            <Logo className="w-12 h-12" textClassName="text-4xl" light={true} />
          </Link>

          <h2 className="text-5xl font-black text-white leading-tight mb-8">
            Start your <span className="text-indigo-200">professional</span> journey today.
          </h2>

          <div className="space-y-8 mt-12 text-left">
            {[
              { title: "Candidate Profile", desc: "Build a professional profile that gets noticed." },
              { title: "Job Matching", desc: "Get recommended for jobs that fit your skills." },
              { title: "Direct Contact", desc: "Chat directly with top recruiters and HR managers." }
            ].map((item, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  <CheckCircle2 size={20} className="text-white" />
                </div>
                <div>
                  <div className="text-white font-bold text-lg">{item.title}</div>
                  <div className="text-indigo-100 text-sm">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 bg-slate-50 md:bg-white overflow-y-auto relative">
        {/* Top Navigation */}
        <div className="absolute top-8 left-8 right-8 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold transition-colors group">
            <ArrowRight className="rotate-180 group-hover:-translate-x-1 transition-transform" size={20} />
            Back to Home
          </Link>
        </div>

        <div className="w-full max-w-xl py-12">
          <Link to="/" className="lg:hidden inline-flex items-center gap-2 mb-12">
            <Logo />
          </Link>

          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-4xl font-black text-slate-900 mb-2">Create Account</h1>
            <p className="text-slate-500 font-medium">Join thousands of professionals on TalentBridge.</p>
          </div>

          <div className="flex gap-4 mb-10 p-1.5 bg-slate-100 rounded-[2rem]">
            <button
              type="button"
              onClick={() => setRole('candidate')}
              className={`flex items-center justify-center gap-3 flex-1 px-6 py-4 rounded-[1.8rem] transition-all duration-300 font-bold ${
                role === 'candidate'
                  ? 'bg-white text-indigo-600 shadow-lg'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <User size={20} />
              Candidate
            </button>
            <button
              type="button"
              onClick={() => setRole('hr')}
              className={`flex items-center justify-center gap-3 flex-1 px-6 py-4 rounded-[1.8rem] transition-all duration-300 font-bold ${
                role === 'hr'
                  ? 'bg-white text-indigo-600 shadow-lg'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Building2 size={20} />
              HR / Recruiter
            </button>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-sm font-bold flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest ml-1">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all font-medium"
                  placeholder="John"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest ml-1">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all font-medium"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest ml-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all font-medium"
                placeholder="john.doe@example.com"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest ml-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 pr-14 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all font-medium"
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
              <div>
                <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest ml-1">Confirm</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all font-medium"
                  placeholder="••••••••"
                />
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
                <>Join the Community <ArrowRight size={20} /></>
              )}
            </button>
          </form>

          <p className="text-center text-slate-500 font-bold mt-12">
            Already a member?{' '}
            <Link to="/login" className="text-indigo-600 hover:underline">
              Sign in to your account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

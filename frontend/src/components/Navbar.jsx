import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, LayoutDashboard, Briefcase, Building2, Menu, X, Bell, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import Logo from './Logo';

export default function Navbar({ isDarkPage = false }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { name: 'Browse Jobs', path: '/jobs', icon: Briefcase },
    { name: 'Our Branches', path: '/branches', icon: Building2 },
  ];

  const isTransparentTop = !isScrolled && isDarkPage;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 px-6 py-4 ${
      isScrolled ? 'pt-4' : 'pt-6'
    }`}>
      <div className={`max-w-7xl mx-auto rounded-[32px] transition-all duration-500 border ${
        isTransparentTop 
          ? 'bg-white/5 border-white/10 py-4 px-4 backdrop-blur-md' 
          : 'bg-white/80 backdrop-blur-2xl border-white/40 py-3 px-8 shadow-2xl shadow-indigo-100/30'
      }`}>
        <div className="flex items-center justify-between">
          <Link to="/" className="transition-transform hover:scale-105 active:scale-95">
            <Logo 
              className="w-10 h-10" 
              textClassName="text-2xl" 
              light={isTransparentTop} 
            />
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path}
                className={`font-bold text-sm transition-all flex items-center gap-2 group ${
                  isTransparentTop ? 'text-white/90 hover:text-white' : 'text-slate-600 hover:text-indigo-600'
                }`}
              >
                <link.icon size={18} className={`transition-colors ${
                  isTransparentTop ? 'text-white/50 group-hover:text-white' : 'text-slate-400 group-hover:text-indigo-600'
                }`} />
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-2">
                <button className={`p-3 transition-colors ${isTransparentTop ? 'text-white/50 hover:text-white' : 'text-slate-400 hover:text-indigo-600'}`}>
                  <Bell size={20} />
                </button>
                
                <div className={`w-px h-6 mx-2 ${isTransparentTop ? 'bg-white/10' : 'bg-slate-200'}`}></div>
                
                <div className="flex items-center gap-3 pl-2 py-1">
                  <div className="relative group cursor-pointer">
                    {/* ADAPTIVE PROFILE PILL */}
                    <div className={`flex items-center gap-3 p-1.5 pr-4 rounded-full transition-all border ${
                      isTransparentTop 
                        ? 'bg-white/10 border-white/10 hover:bg-white/20' 
                        : 'bg-slate-50/50 border-slate-100 hover:bg-slate-100 shadow-sm'
                    }`}>
                      <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-black text-xs border-2 border-white shadow-sm">
                        {user.firstName[0]}{user.lastName[0]}
                      </div>
                      <div className="text-left">
                        <div className={`text-xs font-black leading-none mb-1 ${
                          isTransparentTop ? 'text-white' : 'text-slate-900'
                        }`}>{user.firstName}</div>
                        <div className={`text-[10px] font-bold uppercase tracking-widest leading-none ${
                          isTransparentTop ? 'text-white/40' : 'text-slate-400'
                        }`}>{user.role}</div>
                      </div>
                      <ChevronDown size={14} className={`ml-1 transition-transform group-hover:rotate-180 ${
                        isTransparentTop ? 'text-white/40' : 'text-slate-400'
                      }`} />
                    </div>
                    
                    {/* Premium Dropdown */}
                    <div className="absolute right-0 top-full pt-3 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 z-50">
                      <div className="bg-white border border-slate-100 rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-2 w-52 overflow-hidden">
                        <div className="px-4 py-3 border-b border-slate-50 mb-1">
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Account</div>
                        </div>
                        <Link to={user.role === 'candidate' ? '/candidate-dashboard' : '/hr-dashboard'} className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all group/item">
                          <div className="w-8 h-8 rounded-lg bg-slate-50 group-hover/item:bg-indigo-100 flex items-center justify-center transition-colors">
                            <LayoutDashboard size={16} />
                          </div>
                          Dashboard
                        </Link>
                        <Link to="/candidate-profile" className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all group/item">
                          <div className="w-8 h-8 rounded-lg bg-slate-50 group-hover/item:bg-indigo-100 flex items-center justify-center transition-colors">
                            <User size={16} />
                          </div>
                          My Profile
                        </Link>
                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-rose-500 hover:bg-rose-50 rounded-xl transition-all group/item">
                          <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center transition-colors">
                            <LogOut size={16} />
                          </div>
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className={`px-6 py-3 font-bold text-sm transition-colors ${
                  isTransparentTop ? 'text-white/90 hover:text-white' : 'text-slate-600 hover:text-indigo-600'
                }`}>
                  Sign In
                </Link>
                <Link to="/register" className={`btn-primary !py-3 !px-8 !text-sm !rounded-2xl ${
                  isTransparentTop ? '!bg-white !text-indigo-600 hover:!bg-indigo-50 shadow-none' : ''
                }`}>
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className={`lg:hidden p-2 ${isTransparentTop ? 'text-white' : 'text-slate-600'}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>
    </nav>
  );
}

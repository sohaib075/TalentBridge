import { Link } from 'react-router-dom';
import { Github, Linkedin, Twitter, Mail, MapPin, Phone } from 'lucide-react';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 pt-20 pb-10 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
        {/* Brand Column */}
        <div className="space-y-6">
          <Link to="/">
            <Logo textClassName="text-xl" light={true} />
          </Link>
          <p className="text-sm leading-relaxed max-w-xs">
            Connecting talented professionals with industry-leading companies. 
            Build your future with TalentBridge today.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all">
              <Twitter size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all">
              <Linkedin size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all">
              <Github size={18} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-bold mb-6 uppercase text-sm tracking-widest">Platform</h3>
          <ul className="space-y-4 text-sm font-medium">
            <li><Link to="/jobs" className="hover:text-white transition-colors">Browse Jobs</Link></li>
            <li><Link to="/branches" className="hover:text-white transition-colors">Branches</Link></li>
            <li><Link to="/login" className="hover:text-white transition-colors">Sign In</Link></li>
            <li><Link to="/register" className="hover:text-white transition-colors">Create Account</Link></li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-white font-bold mb-6 uppercase text-sm tracking-widest">Support</h3>
          <ul className="space-y-4 text-sm font-medium">
            <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white font-bold mb-6 uppercase text-sm tracking-widest">Contact Us</h3>
          <ul className="space-y-4 text-sm font-medium">
            <li className="flex items-start gap-3">
              <MapPin size={18} className="text-indigo-500 shrink-0" />
              <span>Blue Area, Jinnah Avenue, Islamabad, Pakistan</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={18} className="text-indigo-500 shrink-0" />
              <span>+92 (300) 123-4567</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={18} className="text-indigo-500 shrink-0" />
              <span>support@talentbridge.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-10 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-xs font-medium">
          &copy; {new Date().getFullYear()} TalentBridge. All rights reserved. Built for Semester 8 Web Final.
        </p>
        <div className="flex gap-8 text-xs font-bold uppercase tracking-widest">
          <a href="#" className="hover:text-white transition-colors">Status</a>
          <a href="#" className="hover:text-white transition-colors">Security</a>
          <a href="#" className="hover:text-white transition-colors">API Docs</a>
        </div>
      </div>
    </footer>
  );
}

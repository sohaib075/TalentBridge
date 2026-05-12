import React from 'react';

export default function Logo({ className = "w-8 h-8", textClassName = "text-2xl", light = false }) {
  return (
    <div className="flex items-center gap-3 group">
      <div className={`relative ${className} flex items-center justify-center`}>
        {/* Logo Background with Gradient */}
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600 to-blue-500 rounded-xl rotate-6 group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-indigo-200"></div>
        <div className="absolute inset-0 bg-slate-900 rounded-xl group-hover:scale-95 transition-transform duration-300"></div>
        
        {/* Abstract Bridge SVG */}
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="relative z-10 w-1/2 h-1/2 text-white"
        >
          <path d="M4 19c0-4.4 3.6-8 8-8s8 3.6 8 8" />
          <path d="M12 11V3" />
          <circle cx="12" cy="3" r="1" fill="currentColor" />
        </svg>
      </div>
      
      <span className={`font-black tracking-tighter ${textClassName} ${
        light 
          ? 'text-white drop-shadow-[0_0_15px_rgba(99,102,241,0.3)]' 
          : 'bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-600'
      }`}>
        TalentBridge
      </span>
    </div>
  );
}

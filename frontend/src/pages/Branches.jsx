import { useEffect, useState } from 'react';
import { MapPin, Building2, Users, ArrowRight, Search, Globe, Sparkles } from 'lucide-react';
import { jobAPI } from '../lib/apiService';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Verified, high-reliability city photography
const BRANCH_IMAGES = {
  islamabad: "https://images.unsplash.com/photo-1627833116896-17b2b0056637?q=80&w=1200&auto=format&fit=crop",
  lahore: "https://images.unsplash.com/photo-1598414441582-8418f7734444?q=80&w=1200&auto=format&fit=crop",
  karachi: "https://images.unsplash.com/photo-1568285521997-761356877f88?q=80&w=1200&auto=format&fit=crop",
  remote: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1200&auto=format&fit=crop"
};

export default function Branches() {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBranches();
  }, []);

  const loadBranches = async () => {
    try {
      setLoading(true);
      const response = await jobAPI.getBranches();
      setBranches(response.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getBranchImage = (name) => {
    const n = name.toLowerCase();
    if (n.includes('islamabad')) return BRANCH_IMAGES.islamabad;
    if (n.includes('lahore')) return BRANCH_IMAGES.lahore;
    if (n.includes('karachi')) return BRANCH_IMAGES.karachi;
    return BRANCH_IMAGES.remote;
  };

  const getBranchDescription = (name) => {
    const n = name.toLowerCase();
    if (n.includes('islamabad')) return "Our headquarters located in the heart of the capital, focusing on government relations and enterprise tech.";
    if (n.includes('lahore')) return "The cultural and tech heartland, where our largest engineering and creative teams collaborate.";
    if (n.includes('karachi')) return "Our financial hub, driving fintech innovation and large-scale infrastructure projects.";
    return "Our global network of experts working from the comfort of their homes across the country.";
  };

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-indigo-100">
      <Navbar isDarkPage={true} />

      <div className="pb-32">
        {/* Header */}
        <div className="bg-slate-900 pt-44 pb-24 mb-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-full bg-indigo-600/10 blur-[120px] rounded-full translate-x-1/2"></div>
          <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
            <h1 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-tight">
              Our <span className="text-indigo-400">Global Presence</span>
            </h1>
            <p className="text-slate-400 text-xl md:text-2xl max-w-3xl mx-auto font-medium leading-relaxed">
              TalentBridge operates across Pakistan's major tech hubs and remote-first 
              environments, bridging the gap between talent and opportunity.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-[400px] bg-white rounded-[48px] animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {branches.map((branch) => (
                <div key={branch._id} className="group glass-card rounded-[48px] overflow-hidden flex flex-col lg:flex-row hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-700">
                  <div className="lg:w-1/2 h-64 lg:h-auto overflow-hidden relative">
                    <img 
                      src={getBranchImage(branch.name)} 
                      alt={branch.name}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
                  </div>
                  <div className="p-10 lg:w-1/2 flex flex-col justify-between bg-white">
                    <div>
                      <div className="flex items-center justify-between mb-8">
                        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                          <Building2 size={24} />
                        </div>
                        <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">Active</span>
                      </div>
                      <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight group-hover:text-indigo-600 transition-colors">
                        {branch.name}
                      </h2>
                      <p className="text-slate-500 font-bold flex items-center gap-2 mb-6 text-sm">
                        <MapPin size={16} className="text-indigo-400" /> {branch.address || 'Central District'}
                      </p>
                      <p className="text-slate-500 font-medium leading-relaxed mb-8">
                        {getBranchDescription(branch.name)}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between pt-8 border-t border-slate-50">
                      <div className="flex items-center gap-3">
                        <div className="flex -space-x-3">
                          {[1, 2, 3].map(i => (
                            <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400">
                              {String.fromCharCode(64 + i)}
                            </div>
                          ))}
                        </div>
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Local Team</span>
                      </div>
                      <button 
                        onClick={() => window.location.href = `/jobs?branch=${branch._id}`}
                        className="btn-primary !px-6 !py-3 !rounded-2xl !text-sm flex items-center gap-2"
                      >
                        View Jobs <ArrowRight size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

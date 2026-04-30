import React from 'react';
import { motion } from 'motion/react';
import { 
    CheckCircle2, 
    Sparkles, 
    Zap, 
    ShieldCheck, 
    Star, 
    X,
    ArrowRight,
    Trophy,
    Flame,
    ZapIcon,
    SparklesIcon,
    ShieldCheckIcon
} from 'lucide-react';

interface PricingPageProps {
  onClose: () => void;
  onUpgrade: (amount: number) => void;
  isUpgrading: boolean;
}

export const PricingPage: React.FC<PricingPageProps> = ({ onClose, onUpgrade, isUpgrading }) => {
  return (
    <div className="fixed inset-0 z-[100] bg-white overflow-y-auto">
      <nav className="fixed top-0 w-full z-[110] bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-900 rounded-xl">
                  <Sparkles size={20} className="text-white" />
              </div>
              <span className="text-xl font-black tracking-tighter text-slate-900 uppercase">Upgrade Workspace</span>
          </div>
          <button 
            onClick={onClose}
            className="p-3 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-2xl transition-all"
          >
            <X size={24} />
          </button>
        </div>
      </nav>

      <div className="pt-32 pb-24 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-[0.9] mb-6">
              Unlock the <br /> <span className="text-indigo-600">Power of Elite</span>
            </h1>
            <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto">
              Eliminate all barriers. One singular micro-payment unlocks the full neural potential of resumeforme forever.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {/* Starter Tier */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="p-8 rounded-[2.5rem] border-2 border-slate-100 flex flex-col text-left hover:border-indigo-100 transition-colors"
            >
              <div className="mb-8">
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Starter Core</span>
                <div className="text-4xl font-black text-slate-900 mt-2">₹29</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase mt-1">Single Refill</div>
              </div>
              
              <div className="space-y-4 flex-1 mb-10">
                {[
                  { text: "2 AI Strategic Imports" },
                  { text: "10 Neural Audits" },
                  { text: "20 Smart Enhancements" },
                  { text: "Watermark-Free Access" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="p-1 rounded-full bg-indigo-50 text-indigo-500">
                      <CheckCircle2 size={12} />
                    </div>
                    <span className="text-sm font-bold text-slate-600">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => onUpgrade(29)}
                disabled={isUpgrading}
                className="w-full py-4 rounded-xl border-2 border-slate-900 text-slate-900 font-black hover:bg-slate-50 transition-all active:scale-[0.98]"
              >
                Buy Starter
              </button>
            </motion.div>

            {/* Professional Tier (Recommended) */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-8 rounded-[2.5rem] bg-slate-900 text-white relative overflow-hidden flex flex-col text-left shadow-2xl scale-105 z-10"
            >
              <div className="absolute top-0 right-0 p-6 opacity-10">
                <Flame size={120} />
              </div>

              <div className="mb-8 relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] text-indigo-400">Professional</span>
                  <span className="px-2 py-0.5 bg-indigo-500 rounded-full text-[8px] font-black uppercase tracking-widest">Most Popular</span>
                </div>
                <div className="text-4xl font-black">₹49</div>
                <div className="text-[10px] font-bold text-white/40 uppercase mt-1">Full Workload Pack</div>
              </div>
              
              <div className="space-y-4 flex-1 mb-10 relative z-10">
                {[
                  { text: "3 AI Strategic Imports" },
                  { text: "20 Neural Audits" },
                  { text: "50 Smart Enhancements" },
                  { text: "Elite Template Access" },
                  { text: "Priority Neural Processing" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="p-1 text-indigo-400">
                      <CheckCircle2 size={14} />
                    </div>
                    <span className="text-sm font-bold text-white/90">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => onUpgrade(49)}
                disabled={isUpgrading}
                className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black transition-all active:scale-[0.98] relative z-10 flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30"
              >
                {isUpgrading ? 'Processing...' : 'Get Professional'}
              </button>
            </motion.div>

            {/* Elite Tier */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="p-8 rounded-[2.5rem] border-2 border-slate-100 flex flex-col text-left hover:border-amber-100 transition-colors"
            >
              <div className="mb-8">
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-amber-500">Elite Architect</span>
                <div className="text-4xl font-black text-slate-900 mt-2">₹99</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase mt-1">Unlimited Potential</div>
              </div>
              
              <div className="space-y-4 flex-1 mb-10">
                {[
                  { text: "4 AI Strategic Imports" },
                  { text: "50 Neural Audits" },
                  { text: "Unlimited Enhancements" },
                  { text: "All Premium Templates" },
                  { text: "Direct Expert Channel" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="p-1 rounded-full bg-amber-50 text-amber-500">
                      <CheckCircle2 size={12} />
                    </div>
                    <span className="text-sm font-bold text-slate-600">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => onUpgrade(99)}
                disabled={isUpgrading}
                className="w-full py-4 rounded-xl border-2 border-amber-500 text-amber-600 font-black hover:bg-amber-50 transition-all active:scale-[0.98]"
              >
                Buy 4-Import Elite
              </button>
            </motion.div>
          </div>

          <div className="mt-20 pt-12 border-t border-slate-100 flex flex-col items-center">
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mb-6 text-center">Trusted by Engineers at</span>
            <div className="flex flex-wrap justify-center gap-12 grayscale opacity-30">
              <span className="text-lg font-black tracking-tighter">GOOGLE</span>
              <span className="text-lg font-black tracking-tighter">META</span>
              <span className="text-lg font-black tracking-tighter">STRIPE</span>
              <span className="text-lg font-black tracking-tighter">NETFLIX</span>
              <span className="text-lg font-black tracking-tighter">TESLA</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

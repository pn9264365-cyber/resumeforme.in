import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, CheckCircle2, Zap, ArrowRight, ShieldCheck, Star } from 'lucide-react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: (amount: number) => void;
  onViewPlans: () => void;
  title?: string;
  description?: string;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({ 
  isOpen, 
  onClose, 
  onUpgrade,
  onViewPlans,
  title = "Unlock Neural Potential",
  description = "You've reached your free limit. Refill your neural bank to continue architecting your career."
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-xl"
        />
        
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative w-full max-w-lg bg-white rounded-[3rem] shadow-[0_30px_100px_rgba(0,0,0,0.15)] overflow-hidden"
        >
          {/* Header Visual */}
          <div className="relative h-48 bg-slate-900 flex items-center justify-center overflow-hidden">
             <div className="absolute inset-0 grid-pattern opacity-10" />
             <motion.div 
                animate={{ 
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.05, 0.95, 1]
                }}
                transition={{ duration: 10, repeat: Infinity }}
                className="p-8 bg-white/5 rounded-[2.5rem] backdrop-blur-2xl border border-white/10 shadow-2xl"
             >
                <Zap size={48} className="text-indigo-400 fill-indigo-400 drop-shadow-[0_0_20px_rgba(129,140,248,0.5)]" />
             </motion.div>
             <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-2 text-white/30 hover:text-white hover:bg-white/10 rounded-full transition-all"
             >
                <X size={24} />
             </button>
          </div>

          <div className="p-10 text-center">
            <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">{title}</h2>
            <p className="text-slate-500 mb-8 leading-relaxed font-medium">
              {description}
            </p>

            <div className="bg-slate-50/50 rounded-[2.5rem] p-8 border border-slate-100 mb-8 relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-4 opacity-5">
                    <Star size={80} className="fill-slate-900" />
                </div>
              <div className="flex items-center justify-between mb-6 relative z-10">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-left">Starter Core Refill</span>
                <span className="bg-emerald-500 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Entry Tier</span>
              </div>
              
              <div className="space-y-4 relative z-10 text-left">
                {[
                  { text: "2 AI Strategic Imports", icon: Sparkles, color: "text-emerald-500" },
                  { text: "10 Neural Audits", icon: Zap, color: "text-indigo-500" },
                  { text: "20 Smart Enhancements", icon: Star, color: "text-amber-500" },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-4 text-slate-700 font-bold">
                    <div className={`p-2 rounded-xl bg-white shadow-sm border border-slate-100 ${item.color}`}>
                      <item.icon size={14} />
                    </div>
                    <span className="text-sm tracking-tight">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => onUpgrade(29)}
                className="w-full bg-slate-900 hover:bg-black text-white font-black py-5 rounded-2xl shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-3"
              >
                Buy Starter Pack for ₹29
                <ArrowRight size={18} />
              </button>
              <button 
                onClick={onViewPlans}
                className="w-full text-indigo-600 hover:text-indigo-700 font-black py-2 text-[11px] transition-all uppercase tracking-widest border-2 border-indigo-50 rounded-xl hover:bg-indigo-50/50"
              >
                View Professional & Elite Plans
              </button>
              <button 
                onClick={onClose}
                className="w-full text-slate-400 hover:text-slate-900 font-black py-2 text-[11px] transition-all uppercase tracking-widest"
              >
                Return to Editor
              </button>
            </div>
          </div>

          <div className="bg-slate-50 border-t border-slate-100 px-10 py-6 flex items-center justify-between text-[10px] text-slate-400 font-black uppercase tracking-widest">
            <div className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-emerald-500" />
              <span>Razorpay Secure</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
              <span>Instant Activation</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

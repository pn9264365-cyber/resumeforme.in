import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SparklesIcon, XIcon, CheckCircle2Icon, CrownIcon, ArrowRightIcon } from 'lucide-react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  title?: string;
  description?: string;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({ 
  isOpen, 
  onClose, 
  onUpgrade,
  title = "Unlock More Potential",
  description = "You've reached your free limit. Get a Power Pack to continue building your perfect career path."
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
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Header Image/Pattern */}
          <div className="relative h-32 bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center overflow-hidden">
             <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent animate-pulse" />
             <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md">
                <CrownIcon size={40} className="text-white drop-shadow-lg" />
             </div>
             <button 
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-colors"
             >
                <XIcon size={20} />
             </button>
          </div>

          <div className="p-8 text-center">
            <h2 className="text-2xl font-black text-slate-900 mb-2">{title}</h2>
            <p className="text-slate-500 mb-8 leading-relaxed">
              {description}
            </p>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 mb-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest text-left">Refill Pack Includes</span>
                <span className="bg-primary/10 text-primary text-[10px] font-black px-2 py-0.5 rounded-full uppercase">One-time Upgrade</span>
              </div>
              
              <div className="space-y-3">
                {[
                  { text: "2 Additional Resume Imports", icon: SparklesIcon },
                  { text: "10 AI Enhancements", icon: CheckCircle2Icon },
                  { text: "3 Strategic Rewrites (Optimization)", icon: ArrowRightIcon },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3 text-slate-700 font-medium">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      <CheckCircle2Icon size={12} />
                    </div>
                    <span className="text-sm">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={onUpgrade}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-2xl shadow-lg shadow-slate-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
              >
                <span>Upgrade Now for ₹9</span>
                <ArrowRightIcon size={18} className="transition-transform group-hover:translate-x-1" />
              </button>
              <button 
                onClick={onClose}
                className="w-full text-slate-400 hover:text-slate-600 font-bold py-2 text-sm transition-colors"
              >
                Maybe Later
              </button>
            </div>
          </div>

          <div className="bg-slate-50 border-t border-slate-100 px-8 py-4 flex items-center justify-center gap-4 text-[10px] text-slate-400 font-medium">
            <div className="flex items-center gap-1">
              <div className="w-1 h-1 bg-green-500 rounded-full" />
              Secure Payment via Razorpay
            </div>
            <div className="w-1 h-1 bg-slate-300 rounded-full" />
            <span>Lifetime Access to Upgraded Limits</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

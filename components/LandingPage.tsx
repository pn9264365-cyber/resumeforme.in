import React from 'react';
import { motion } from 'motion/react';
import { 
    SparklesIcon, 
    ZapIcon, 
    ShieldCheckIcon, 
    GlobeIcon, 
    ArrowRightIcon, 
    CheckCircle2Icon,
    FlameIcon,
    TrophyIcon,
    LayoutIcon,
    DownloadIcon,
    SearchIcon
} from 'lucide-react';

interface LandingPageProps {
    onLogin: () => void;
    isLoggingIn: boolean;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLogin, isLoggingIn }) => {
    return (
        <div className="min-h-screen bg-white selection:bg-indigo-100 selection:text-indigo-900">
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 border-b border-slate-100 bg-white/80 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-900 rounded-xl shadow-lg ring-4 ring-slate-900/5">
                            <SparklesIcon size={20} className="text-white" />
                        </div>
                        <span className="text-2xl font-black tracking-tighter text-slate-900">resumeforme</span>
                    </div>
                    
                    <div className="hidden lg:flex flex-col items-center ml-12 border-l border-slate-100 pl-12">
                        <span className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-300 mb-1">Architected by</span>
                        <a href="https://mjforyou.in" target="_blank" rel="noopener noreferrer" className="text-[10px] font-black text-slate-900 uppercase tracking-widest hover:text-indigo-600 transition-colors">team mjforyou.in</a>
                    </div>
                    
                    <div className="hidden md:flex items-center gap-10">
                        <a href="#features" className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">Features</a>
                        <a href="#templates" className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">Templates</a>
                        <a href="#pricing" className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">Pricing</a>
                    </div>

                    <button 
                        onClick={onLogin}
                        disabled={isLoggingIn}
                        className="btn-primary-elegant !py-2 !px-6 !rounded-full !text-sm"
                    >
                        {isLoggingIn ? 'Connecting...' : 'Launch App'}
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-40 pb-24 px-6 overflow-hidden relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
                   <div className="absolute top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-50/50 blur-[120px] rounded-full" />
                </div>

                <div className="max-w-5xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 border border-slate-100 mb-10 shadow-sm"
                    >
                        <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
                        <span className="text-[11px] font-black uppercase tracking-widest text-slate-500">v4.0 Final Release</span>
                    </motion.div>

                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-7xl md:text-9xl font-black text-slate-900 tracking-tighter leading-[0.85] mb-10"
                    >
                        Master Your <br /> 
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-900 to-slate-900">Professional Identity</span>
                    </motion.h1>

                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl md:text-2xl text-slate-500 font-medium max-w-3xl mx-auto mb-16 leading-relaxed"
                    >
                        The world's most sophisticated AI resume architect. We don't just format documents; we engineer strategic career narratives designed for the global elite.
                    </motion.p>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <button 
                            onClick={onLogin}
                            className="btn-primary-elegant !py-5 !px-12 !rounded-2xl !text-lg !font-black w-full sm:w-auto"
                        >
                            Start Building Now
                            <ArrowRightIcon size={20} />
                        </button>
                        <button className="btn-secondary-elegant !py-5 !px-12 !rounded-2xl !text-lg !font-black w-full sm:w-auto">
                            View Showcase
                        </button>
                    </motion.div>

                    {/* Trust Indicators */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-24 pt-12 border-t border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-12"
                    >
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-3xl font-black text-slate-900">4.9/5</span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">User Satisfaction</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-3xl font-black text-slate-900">500k+</span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Resumes Optimized</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-3xl font-black text-slate-900">85%</span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Interview Rate</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-3xl font-black text-slate-900">60s</span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Mean Build Time</span>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Bento Grid */}
            <section id="features" className="py-24 px-6 bg-slate-50 flex justify-center">
                <div className="max-w-7xl w-full">
                    <div className="text-center mb-20">
                        <h2 className="text-5xl font-black text-slate-900 tracking-tight mb-4">Precision Engineering</h2>
                        <p className="text-lg text-slate-500 font-medium max-w-xl mx-auto">Every module is designed to give you an unfair advantage in the hiring process.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Feature 1 */}
                        <div className="md:col-span-2 glass p-10 rounded-[2.5rem] relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:opacity-20 transition-opacity">
                                <SparklesIcon size={240} className="text-indigo-600" />
                            </div>
                            <div className="relative z-10 max-w-md">
                                <div className="h-14 w-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mb-8 shadow-xl shadow-indigo-200">
                                    <ZapIcon size={28} />
                                </div>
                                <h3 className="text-3xl font-black text-slate-900 mb-4">Neural ATS Audit</h3>
                                <p className="text-lg text-slate-500 font-medium leading-relaxed">
                                    Our proprietary neural network simulate 40+ different ATS algorithms to score your resume before you ever hit send.
                                </p>
                            </div>
                        </div>

                        {/* Feature 2 */}
                        <div className="glass p-10 rounded-[2.5rem] group">
                            <div className="h-14 w-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white mb-8 shadow-xl">
                                <ShieldCheckIcon size={28} />
                            </div>
                            <h3 className="text-3xl font-black text-slate-900 mb-4">Privacy First</h3>
                            <p className="text-lg text-slate-500 font-medium leading-relaxed">
                                End-to-end encryption for your career data. We never sell your info.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="glass p-10 rounded-[2.5rem] group">
                            <div className="h-14 w-14 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 mb-8">
                                <LayoutIcon size={28} />
                            </div>
                            <h3 className="text-3xl font-black text-slate-900 mb-4">Premium Layouts</h3>
                            <p className="text-lg text-slate-500 font-medium leading-relaxed">
                                Hand-crafted architectures designed by elite product designers.
                            </p>
                        </div>

                        {/* Feature 4 */}
                        <div className="md:col-span-2 glass p-10 rounded-[2.5rem] flex flex-col md:flex-row gap-10 items-center">
                            <div className="flex-1">
                                <div className="h-14 w-14 bg-emerald-500 rounded-2xl flex items-center justify-center text-white mb-8 shadow-xl shadow-emerald-100">
                                    <GlobeIcon size={28} />
                                </div>
                                <h3 className="text-3xl font-black text-slate-900 mb-4">Global Reach</h3>
                                <p className="text-lg text-slate-500 font-medium leading-relaxed">
                                    Adaptive formatting for US, UK, and EU standards. One-click region swapping.
                                </p>
                            </div>
                            <div className="flex-1 bg-slate-900 aspect-video rounded-3xl p-6 overflow-hidden flex flex-col justify-end">
                                <div className="flex gap-2 mb-2">
                                    <div className="w-12 h-1 bg-white/20 rounded-full" />
                                    <div className="w-8 h-1 bg-emerald-400 rounded-full" />
                                </div>
                                <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Live Optimization Analytics</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-24 px-6 bg-white flex justify-center">
                <div className="max-w-5xl w-full">
                    <div className="text-center mb-20">
                        <h2 className="text-5xl font-black text-slate-900 tracking-tight mb-4">Pure Value, No Gimmicks</h2>
                        <p className="text-lg text-slate-500 font-medium">Simple credit-based usage or unlimited elite access.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
                        {/* Starter Pack */}
                        <div className="p-10 rounded-[2.5rem] border-2 border-slate-100 flex flex-col hover:border-indigo-100 transition-colors">
                            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4">Starter Pack</span>
                            <div className="flex items-baseline gap-1 mb-8">
                                <span className="text-4xl font-black text-slate-900">₹29</span>
                                <span className="text-slate-400 font-bold uppercase text-[10px] ml-2">Neural Refill</span>
                            </div>
                            <ul className="space-y-4 mb-12 flex-1">
                                {[
                                    '2 AI Strategic Imports',
                                    '10 Neural ATS Audits',
                                    '20 Smart Enhancements',
                                    'Watermark-Free Access',
                                    'Standard Template Suite'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-slate-600 font-bold text-sm">
                                        <CheckCircle2Icon size={16} className="text-indigo-400" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <button 
                                onClick={onLogin}
                                className="w-full py-4 rounded-xl border-2 border-slate-900 text-slate-900 font-black hover:bg-slate-50 transition-all font-mono tracking-widest text-[10px] uppercase"
                            >
                                Get Started
                            </button>
                        </div>

                        {/* Professional Pack */}
                        <div className="p-10 rounded-[2.5rem] bg-slate-900 text-white relative overflow-hidden flex flex-col shadow-2xl scale-105 z-10 border-4 border-indigo-600/30">
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <FlameIcon size={120} />
                            </div>
                            <div className="flex items-center gap-3 mb-6 relative z-10">
                                <span className="px-3 py-1 bg-indigo-600 rounded-full text-[9px] font-black uppercase tracking-widest leading-none">Most Popular</span>
                            </div>
                            <div className="flex items-baseline gap-1 mb-2 relative z-10">
                                <span className="text-5xl font-black">₹49</span>
                                <span className="text-white/40 font-bold uppercase text-[10px] ml-2">Career Mover</span>
                            </div>
                            <div className="flex flex-col mb-10 relative z-10">
                                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">3 Strategic Imports</span>
                                <span className="text-[9px] text-white/40 uppercase font-black">Inclusive Credits</span>
                            </div>
                            <ul className="space-y-4 mb-12 flex-1 relative z-10">
                                {[
                                    '3 AI Strategic Imports',
                                    '20 Neural ATS Audits',
                                    '50 Smart Enhancements',
                                    'Premium Template Access',
                                    'Priority Processing'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-white/90 font-bold text-sm leading-tight">
                                        <CheckCircle2Icon size={16} className="text-indigo-400" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <button 
                                onClick={onLogin}
                                className="w-full py-4 rounded-xl bg-white text-slate-900 font-black hover:bg-indigo-50 transition-all shadow-lg font-mono tracking-widest text-[10px] uppercase relative z-10"
                            >
                                Secure Professional
                            </button>
                        </div>

                        {/* Elite Pack */}
                        <div className="p-10 rounded-[2.5rem] border-2 border-slate-100 flex flex-col hover:border-amber-100 transition-colors">
                            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-amber-500 mb-4">Elite Pack</span>
                            <div className="flex items-baseline gap-1 mb-8">
                                <span className="text-4xl font-black text-slate-900">₹99</span>
                                <span className="text-slate-400 font-bold uppercase text-[10px] ml-2">Global Elite</span>
                            </div>
                            <ul className="space-y-4 mb-12 flex-1">
                                {[
                                    '4 AI Strategic Imports',
                                    '50 Neural ATS Audits',
                                    'Unlimited Enhancements',
                                    'All Premium Templates',
                                    'Direct Expert Channel'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-slate-600 font-bold text-sm">
                                        <CheckCircle2Icon size={16} className="text-amber-500" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <button 
                                onClick={onLogin}
                                className="w-full py-4 rounded-xl border-2 border-amber-500 text-amber-600 font-black hover:bg-amber-50 transition-all font-mono tracking-widest text-[10px] uppercase"
                            >
                                Upgrade to Elite
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-24 px-6 bg-slate-50 border-t border-slate-100 flex justify-center">
              <div className="max-w-7xl w-full">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                      { name: "Sarah J.", role: "Senior UX Designer at Google", content: "Resula basically did my job for me. I got an interview at Apple 48 hours after using the Strategic Polish." },
                      { name: "Marcus L.", role: "Software Architect at Stripe", content: "The level of design in these templates is insane. Most builders look like basic Word docs. This looks like a studio portfolio." },
                      { name: "Jessica K.", role: "Product Manager at Meta", content: "The ATS audit is a game changer. I finally understood why my old resume wasn't getting past the initial filters." }
                    ].map((t, i) => (
                      <div key={i} className="glass p-8 rounded-[2rem]">
                        <div className="flex items-center gap-1 mb-6">
                            {[1,2,3,4,5].map(s => <SparklesIcon key={s} size={12} className="text-amber-400" />)}
                        </div>
                        <p className="text-slate-600 font-medium italic mb-8 leading-relaxed">"{t.content}"</p>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-slate-200 rounded-full" />
                            <div>
                                <div className="text-sm font-black text-slate-900">{t.name}</div>
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.role}</div>
                            </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </section>

            {/* Footer */}
            <footer className="py-20 px-6 border-t border-slate-100 flex justify-center text-center">
                <div className="max-w-xl">
                    <div className="flex items-center justify-center gap-3 mb-8">
                        <div className="p-2 bg-slate-900 rounded-xl">
                            <SparklesIcon size={16} className="text-white" />
                        </div>
                        <span className="text-xl font-black tracking-tighter text-slate-900">resumeforme</span>
                    </div>
                    <p className="text-slate-400 font-medium mb-4">Engineering the future of professional identity. Built with precision for the elite 1%.</p>
                    <div className="flex flex-col items-center gap-1 mb-10">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">Proudly Developed by</span>
                        <a href="https://mjforyou.in" target="_blank" rel="noopener noreferrer" className="text-xs font-black text-slate-900 hover:text-indigo-600 transition-colors uppercase tracking-[0.2em]">team mjforyou.in</a>
                    </div>
                    <div className="flex justify-center gap-8 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                        <a href="#" className="hover:text-slate-900">Privacy</a>
                        <a href="#" className="hover:text-slate-900">Terms</a>
                        <a href="#" className="hover:text-slate-900">Support</a>
                        <a href="#" className="hover:text-slate-900">Twitter</a>
                    </div>
                    <div className="mt-12 text-[10px] text-slate-300">© 2026 resumeforme AI Architect. Crafted by team mjforyou.in</div>
                </div>
            </footer>
        </div>
    );
};

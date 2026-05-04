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
        <div className="min-h-screen bg-white selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden scroll-smooth">
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 border-b border-slate-100 bg-white/80 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3 group cursor-pointer">
                        <div className="p-2 bg-slate-900 rounded-xl shadow-lg ring-4 ring-slate-900/5 group-hover:rotate-12 transition-transform">
                            <SparklesIcon size={20} className="text-white" />
                        </div>
                        <span className="text-2xl font-black tracking-tighter text-slate-900">resumeforme</span>
                    </div>
                    
                    <div className="hidden lg:flex flex-col items-center ml-12 border-l border-slate-100 pl-12">
                        <span className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-300 mb-1">Architected by</span>
                        <a href="https://mjforyou.in" target="_blank" rel="noopener noreferrer" className="text-[10px] font-black text-slate-900 uppercase tracking-widest hover:text-indigo-600 transition-colors">team mjforyou.in</a>
                    </div>
                    
                    <div className="hidden md:flex items-center gap-10">
                        <a href="#features" className="text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">Features</a>
                        <a href="#templates" className="text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">Templates</a>
                        <a href="#pricing" className="text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">Pricing</a>
                    </div>

                    <button 
                        onClick={onLogin}
                        disabled={isLoggingIn}
                        className="bg-indigo-600 text-white px-10 py-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:bg-slate-900 transition-all shadow-[0_20px_40px_-10px_rgba(79,70,229,0.3)] hover:shadow-indigo-500/40 disabled:opacity-50 active:scale-95"
                    >
                        {isLoggingIn ? 'CONNECTING...' : 'GET STARTED / SIGN IN'}
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-60 pb-32 px-6 overflow-hidden relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 bg-[radial-gradient(circle_at_50%_-20%,#f0f4ff,transparent_60%)]" />

                <div className="max-w-6xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white border border-slate-100 mb-12 shadow-sm"
                    >
                        <span className="flex h-2.5 w-2.5 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                        <span className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-400">Intelligent Career Architect 2026 // v4.2</span>
                    </motion.div>

                    <motion.h1 
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="text-8xl md:text-[12rem] font-black text-slate-900 tracking-tighter leading-[0.75] mb-16"
                    >
                        RESUME <br /> 
                        <span className="text-indigo-600">EVOLUTION.</span>
                    </motion.h1>

                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-xl md:text-2xl text-slate-500 font-medium max-w-2xl mx-auto mb-20 leading-relaxed tracking-tight"
                    >
                        The world's most sophisticated design-first AI resume engineer. Stop applying—start being hunted by top-tier global companies.
                    </motion.p>

                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                        className="flex flex-col items-center justify-center gap-10 relative z-20"
                    >
                        <button 
                            onClick={onLogin}
                            disabled={isLoggingIn}
                            className="group relative bg-indigo-600 text-white px-28 py-14 rounded-[5rem] text-4xl font-black uppercase tracking-[0.25em] transform hover:scale-105 active:scale-95 transition-all shadow-[0_60px_120px_-20px_rgba(79,70,229,0.4)] hover:shadow-[0_60px_150px_-20px_rgba(79,70,229,0.6)] hover:bg-indigo-700 disabled:opacity-70 disabled:cursor-wait cursor-pointer z-30"
                        >
                            <span className="flex flex-col items-center">
                                <span className="flex items-center gap-8 mb-2">
                                    {isLoggingIn ? (
                                        <>CONNECTING... <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin" /></>
                                    ) : (
                                        <>LAUNCH APP <ArrowRightIcon size={48} className="group-hover:translate-x-6 transition-transform" /></>
                                    )}
                                </span>
                                {!isLoggingIn && <span className="text-xs font-black text-indigo-200/60 tracking-[0.4em]">AUTHENTICATE WITH GOOGLE</span>}
                            </span>
                        </button>
                        
                        <div className="flex items-center gap-12">
                            <a href="#features" className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-300 hover:text-slate-900 transition-colors">Neural Features</a>
                            <div className="w-1 h-1 bg-slate-200 rounded-full" />
                            <a href="#templates" className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-300 hover:text-slate-900 transition-colors">Visual Showcase</a>
                        </div>
                    </motion.div>

                    {/* Quick Stats Grid */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-32 pt-16 border-t border-slate-100 flex flex-wrap justify-center gap-x-20 gap-y-12"
                    >
                        {[
                            { value: '15+', label: 'Elite Layouts' },
                            { value: 'ATS', label: 'Optimized' },
                            { value: 'AI', label: 'Analysis' },
                            { value: '24/7', label: 'Live Editor' }
                        ].map((stat, i) => (
                            <div key={i} className="flex flex-col items-start min-w-[120px]">
                                <span className="text-4xl font-black text-slate-900 tracking-tighter mb-1">{stat.value}</span>
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">{stat.label}</span>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Features Bento Grid */}
            <section id="features" className="py-32 px-6 bg-slate-50 flex justify-center scroll-mt-20 relative">
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
                <div className="max-w-7xl w-full">
                    <div className="text-center mb-24">
                        <h2 className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.4em] mb-6">Autonomous Core Engine</h2>
                        <h3 className="text-6xl font-black text-slate-900 tracking-tighter mb-6 leading-[0.9]">Strategic Precision. <br />No Compromises.</h3>
                        <p className="text-xl text-slate-500 font-medium max-w-xl mx-auto leading-relaxed tracking-tight">Every interaction is architected to exploit hiring algorithms and maximize your professional value.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                        {/* Feature 1 */}
                        <div className="md:col-span-2 bg-white border border-slate-100 p-16 rounded-[4rem] relative overflow-hidden group hover:shadow-[0_80px_100px_-20px_rgba(79,70,229,0.08)] transition-all duration-700">
                            <div className="absolute -top-24 -right-24 h-96 w-96 bg-indigo-50/50 rounded-full blur-[100px]" />
                            <div className="relative z-10 max-w-md">
                                <div className="h-20 w-20 bg-slate-900 rounded-[1.5rem] flex items-center justify-center text-indigo-400 mb-12 shadow-2xl">
                                    <ZapIcon size={40} />
                                </div>
                                <h3 className="text-5xl font-black text-slate-900 mb-8 tracking-tighter">Neural ATS Audit <span className="text-indigo-600">v4.2</span></h3>
                                <p className="text-2xl text-slate-500 font-medium leading-relaxed tracking-tight">
                                    Simulate over 140+ real-world recruiter screening behaviors. Locate and fix dead zones in your resume before they reject you.
                                </p>
                            </div>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-slate-900 p-16 rounded-[4rem] group overflow-hidden relative shadow-2xl shadow-indigo-100/20">
                            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-indigo-600/30 to-transparent" />
                            <div className="relative z-10">
                                <div className="h-20 w-20 bg-white/10 backdrop-blur-md rounded-[1.5rem] flex items-center justify-center text-white mb-12 border border-white/20">
                                    <ShieldCheckIcon size={40} />
                                </div>
                                <h3 className="text-4xl font-black text-white mb-8 tracking-tighter leading-none">Privacy By Design.</h3>
                                <p className="text-xl text-indigo-100/60 font-medium leading-relaxed tracking-tight">
                                    End-to-end encryption. Your data is isolated and ephemeral. We never share, sell, or train models on your private identity.
                                </p>
                            </div>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-white border border-slate-100 p-12 rounded-[3.5rem] group hover:border-indigo-200 transition-colors">
                            <div className="h-16 w-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-10">
                                <ArrowRightIcon size={32} />
                            </div>
                            <h3 className="text-3xl font-black text-slate-900 mb-6 tracking-tighter">One-Click Migration</h3>
                            <p className="text-lg text-slate-500 font-medium leading-relaxed tracking-tight">
                                Import your existing profile and let our AI handle the mapping, normalization, and optimization automatically.
                            </p>
                        </div>

                        {/* Feature 4 */}
                        <div className="md:col-span-2 bg-slate-50 p-12 rounded-[3.5rem] flex flex-col md:flex-row gap-12 items-center border border-slate-100">
                            <div className="flex-1">
                                <div className="h-16 w-16 bg-emerald-500 rounded-2xl flex items-center justify-center text-white mb-8 shadow-xl shadow-emerald-100">
                                    <GlobeIcon size={32} />
                                </div>
                                <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tighter">Global Protocols</h3>
                                <p className="text-lg text-slate-500 font-medium leading-relaxed tracking-tight">
                                    Adaptive formatting for US, UK, and EU standards. Seamlessly pivot your professional identity across borders.
                                </p>
                            </div>
                            <div className="flex-1 bg-slate-900 aspect-video rounded-3xl p-8 overflow-hidden flex flex-col justify-end relative">
                                <div className="absolute top-0 right-0 p-8 opacity-20">
                                    <ZapIcon size={120} className="text-indigo-400" />
                                </div>
                                <div className="flex gap-2 mb-4 relative z-10">
                                    <div className="w-16 h-1.5 bg-white/20 rounded-full" />
                                    <div className="w-10 h-1.5 bg-indigo-400 rounded-full" />
                                </div>
                                <span className="text-[11px] font-black text-white/40 uppercase tracking-[0.3em] relative z-10">Neural Velocity Engine</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Templates Section */}
            <section id="templates" className="py-32 px-6 bg-white flex justify-center scroll-mt-20">
                <div className="max-w-7xl w-full">
                    <div className="flex flex-col md:flex-row items-end justify-between gap-12 mb-24">
                        <div className="max-w-2xl">
                            <h3 className="text-6xl font-black text-slate-900 tracking-tighter mb-8 leading-[0.9]">Designed for <br/>Global Impact.</h3>
                            <p className="text-2xl text-slate-500 font-medium leading-relaxed tracking-tight">
                                Curated "Elite Architectures" that satisfy the aesthetic demands of Fortune 500 decision makers.
                            </p>
                        </div>
                        <button 
                            onClick={onLogin}
                            disabled={isLoggingIn}
                            className="px-12 py-6 bg-white border-4 border-indigo-600 text-indigo-600 rounded-[2rem] font-black uppercase tracking-[0.2em] text-sm hover:bg-indigo-600 hover:text-white transition-all shadow-2xl active:scale-95 disabled:opacity-50"
                        >
                            {isLoggingIn ? 'CONNECTING...' : 'OPEN FULL VAULT'}
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                        {[
                            { name: 'Executive Modern', tag: 'High Velocity' },
                            { name: 'Creative Studio', tag: 'Aesthetic' },
                            { name: 'The Technical One', tag: 'Logic Max' },
                            { name: 'Compact Synergy', tag: 'Efficient' }
                        ].map((t, i) => (
                            <div key={i} className="group cursor-pointer">
                                <div className="aspect-[3/4.2] bg-slate-50 border border-slate-100 rounded-[3.5rem] p-8 shadow-sm group-hover:shadow-[0_40px_80px_rgba(0,0,0,0.1)] group-hover:-translate-y-4 transition-all duration-500 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-white opacity-20 pointer-events-none" />
                                    <div className="absolute top-10 left-10 flex flex-col gap-3">
                                        <div className="w-16 h-1.5 bg-indigo-600 rounded-full" />
                                        <div className="w-10 h-1.5 bg-slate-200 rounded-full" />
                                    </div>
                                    <div className="absolute bottom-10 left-10 right-10">
                                        <span className="px-5 py-2 bg-slate-900 text-[10px] font-black uppercase tracking-widest text-white rounded-full">
                                            {t.tag}
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-8 text-center">
                                    <span className="text-[13px] font-black uppercase tracking-[0.3em] text-slate-300 group-hover:text-slate-900 transition-colors">
                                        {t.name}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>


            {/* Pricing Section */}
            <section id="pricing" className="py-32 px-6 bg-slate-50 border-y border-slate-100 flex justify-center scroll-mt-20">
                <div className="max-w-5xl w-full">
                    <div className="text-center mb-24">
                        <h2 className="text-6xl font-black text-slate-900 tracking-tighter mb-6">Investment in Self.</h2>
                        <p className="text-xl text-slate-500 font-medium tracking-tight">Pure value architecture. No subscription traps.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-stretch">
                        {/* Starter Pack */}
                        <div className="p-12 rounded-[4rem] bg-white border border-slate-100 flex flex-col hover:border-indigo-200 transition-all hover:shadow-2xl">
                            <span className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 mb-8">Access Token</span>
                            <div className="flex items-baseline gap-1 mb-12">
                                <span className="text-5xl font-black text-slate-900 tracking-tighter">₹29</span>
                                <span className="text-slate-300 font-black uppercase text-[11px] ml-3 tracking-widest">Single Burst</span>
                            </div>
                            <ul className="space-y-6 mb-16 flex-1">
                                {[
                                    '2 Neural Imports',
                                    '10 Strategic Audits',
                                    '20 Smart Enhancements',
                                    'Standard Vault Access'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-4 text-slate-600 font-bold text-sm tracking-tight">
                                        <CheckCircle2Icon size={18} className="text-indigo-500 mt-0.5 shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <button 
                                onClick={onLogin}
                                disabled={isLoggingIn}
                                className="w-full py-6 rounded-2xl border-2 border-indigo-600 text-indigo-600 font-black hover:bg-indigo-600 hover:text-white transition-all tracking-[0.2em] text-[11px] uppercase disabled:opacity-50"
                            >
                                {isLoggingIn ? 'CONNECTING...' : 'SECURE ACCESS'}
                            </button>
                        </div>

                        {/* Professional Pack - ENHANCED */}
                        <div className="p-12 rounded-[4rem] bg-slate-900 text-white relative flex flex-col shadow-[0_50px_100px_rgba(79,70,229,0.2)] scale-110 z-10 border-[6px] border-indigo-600/20">
                            <div className="absolute top-0 right-0 p-12 opacity-[0.05]">
                                <TrophyIcon size={160} />
                            </div>
                            <div className="flex items-center gap-3 mb-10 relative z-10">
                                <span className="px-5 py-2 bg-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest">Master Protocol</span>
                            </div>
                            <div className="flex items-baseline gap-1 mb-4 relative z-10">
                                <span className="text-7xl font-black tracking-tighter">₹49</span>
                                <span className="text-white/30 font-black uppercase text-[11px] ml-4 tracking-widest">Deep Engine</span>
                            </div>
                            <div className="flex flex-col mb-12 relative z-10">
                                <span className="text-[13px] font-black text-indigo-400 uppercase tracking-[0.25em]">Ultimate Utility</span>
                            </div>
                            <ul className="space-y-6 mb-16 flex-1 relative z-10">
                                {[
                                    '3 Neural Imports',
                                    '20 Strategic Audits',
                                    '50 Smart Enhancements',
                                    'Full Premium Vault',
                                    'Elite Priority Path'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-4 text-white font-bold text-sm tracking-tight">
                                        <CheckCircle2Icon size={18} className="text-indigo-400 mt-0.5 shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <button 
                                onClick={onLogin}
                                disabled={isLoggingIn}
                                className="w-full py-7 rounded-[2rem] bg-indigo-600 text-white font-black hover:bg-indigo-700 transition-all shadow-xl tracking-[0.25em] text-[11px] uppercase relative z-10 disabled:opacity-50"
                            >
                                {isLoggingIn ? 'CONNECTING...' : 'ACTIVATE PROTOCOL'}
                            </button>
                        </div>

                        {/* Elite Pack */}
                        <div className="p-12 rounded-[4rem] bg-white border border-slate-100 flex flex-col hover:border-amber-200 transition-all hover:shadow-2xl">
                            <span className="text-[11px] font-black uppercase tracking-[0.3em] text-amber-500 mb-8">Unlimited Burst</span>
                            <div className="flex items-baseline gap-1 mb-12">
                                <span className="text-5xl font-black text-slate-900 tracking-tighter">₹99</span>
                                <span className="text-slate-300 font-black uppercase text-[11px] ml-3 tracking-widest">Total Global</span>
                            </div>
                            <ul className="space-y-6 mb-16 flex-1">
                                {[
                                    '4 Neural Imports',
                                    '50 Strategic Audits',
                                    'Unlimited Genius AI',
                                    'Direct Logic Channel',
                                    'All Current/Future Assets'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-4 text-slate-600 font-bold text-sm tracking-tight">
                                        <CheckCircle2Icon size={18} className="text-amber-500 mt-0.5 shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <button 
                                onClick={onLogin}
                                disabled={isLoggingIn}
                                className="w-full py-6 rounded-2xl border-2 border-amber-500 text-amber-600 font-black hover:bg-amber-500 hover:text-white transition-all tracking-[0.2em] text-[11px] uppercase disabled:opacity-50"
                            >
                                {isLoggingIn ? 'CONNECTING...' : 'EXECUTIVE UPGRADE'}
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="py-40 px-6 bg-slate-900 relative overflow-hidden flex justify-center">
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <div className="absolute inset-0 mix-blend-overlay opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
                
                <div className="max-w-4xl w-full text-center relative z-10">
                    <h2 className="text-7xl md:text-9xl font-black text-white tracking-tighter mb-16 leading-[0.8]">READY TO <br />DOMINATE?</h2>
                    
                    <button 
                        onClick={onLogin}
                        disabled={isLoggingIn}
                        className="group relative bg-indigo-600 text-white px-40 py-16 rounded-[6rem] text-5xl font-black uppercase tracking-[0.35em] transform hover:scale-105 active:scale-95 transition-all shadow-[0_40px_100px_-20px_rgba(79,70,229,0.4)] hover:bg-indigo-700 disabled:opacity-70 z-10"
                    >
                        <span className="flex items-center gap-10">
                            {isLoggingIn ? 'CONNECTING...' : 'SIGN IN & LAUNCH'} 
                            {!isLoggingIn && <ArrowRightIcon size={64} className="group-hover:translate-x-8 transition-transform" />}
                        </span>
                    </button>

                    <p className="mt-20 text-[10px] font-black uppercase tracking-[0.6em] text-white/30">Trusted by elites at Google, Stripe, Apple, and McKinsey.</p>
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

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
    SparklesIcon, 
    PrinterIcon, 
    LayoutIcon, 
    UploadIcon,
    TrendingUpIcon,
    SettingsIcon,
    HistoryIcon,
    ChevronLeftIcon,
    LogOutIcon,
    CreditCardIcon,
    CheckCircle2Icon,
    AlertCircleIcon,
    HelpCircleIcon
} from 'lucide-react';
import { ResumeData, TemplateId, ATSScore, UserProfile } from '../types';
import { User } from 'firebase/auth';

interface DashboardProps {
    user: User;
    userData: UserProfile | null;
    resumeData: ResumeData;
    onDataChange: (data: ResumeData) => void;
    activeTemplate: TemplateId;
    onTemplateOpen: () => void;
    onImportOpen: () => void;
    onAnalyzeATS: () => void;
    onFullEnhance: () => void;
    onPrint: () => void;
    onLogout: () => void;
    onUpgrade: () => void;
    isAnalyzing: boolean;
    isEnhancing: boolean;
    children: React.ReactNode;
}

export const Dashboard: React.FC<DashboardProps> = ({
    user,
    userData,
    resumeData,
    onDataChange,
    activeTemplate,
    onTemplateOpen,
    onImportOpen,
    onAnalyzeATS,
    onFullEnhance,
    onPrint,
    onLogout,
    onUpgrade,
    isAnalyzing,
    isEnhancing,
    children
}) => {
    return (
        <div className="flex h-screen bg-white overflow-hidden dot-pattern print:block print:h-auto print:bg-white print:overflow-visible">
            {/* Minimal Sidebar Navigation */}
            <aside className="w-16 md:w-20 bg-slate-900 flex flex-col items-center py-8 shrink-0 z-50 print:hidden">
                <div className="p-3 bg-indigo-500 rounded-2xl shadow-lg shadow-indigo-500/20 mb-10">
                    <SparklesIcon size={20} className="text-white" />
                </div>

                <div className="flex flex-col gap-8 flex-1">
                    <div className="flex flex-col gap-6">
                        {[
                            { icon: LayoutIcon, label: 'Editor', active: true },
                            { icon: CreditCardIcon, label: 'Upgrade', active: false, onClick: onUpgrade },
                        ].map((item, i) => (
                            <button 
                                key={i} 
                                onClick={item.onClick}
                                className={`p-3 rounded-2xl transition-all group relative ${item.active ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                            >
                                <item.icon size={22} />
                                <span className="absolute left-full ml-4 px-2 py-1 bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-[100]">
                                    {item.label}
                                </span>
                            </button>
                        ))}
                    </div>

                    <div className="mt-auto flex flex-col items-center gap-4 pb-4">
                        {userData && (
                            <div className="flex flex-col items-center gap-3 w-full px-2">
                                <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest text-center">Neural Bank</div>
                                
                                <div className="flex flex-col gap-2 w-full">
                                    {/* Import Credits */}
                                    <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group relative" title="Data Imports Remaining">
                                        <UploadIcon size={12} className="text-emerald-400 mb-1" />
                                        <span className="text-[10px] font-black text-white leading-none">
                                            {userData.importLimit ?? 0}
                                        </span>
                                        <div className="absolute left-full ml-4 px-2 py-1 bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-[100]">
                                            Imports
                                        </div>
                                    </div>

                                    {/* Intelligence/Optimize Credits */}
                                    <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group relative" title="Strategic Audits Remaining">
                                        <TrendingUpIcon size={12} className="text-indigo-400 mb-1" />
                                        <span className="text-[10px] font-black text-white leading-none">
                                            {userData.optimizeLimit ?? 0}
                                        </span>
                                        <div className="absolute left-full ml-4 px-2 py-1 bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-[100]">
                                            Intelligence
                                        </div>
                                    </div>

                                    {/* Enhancement Credits */}
                                    <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group relative" title="AI Enhancements Remaining">
                                        <SparklesIcon size={12} className="text-amber-400 mb-1" />
                                        <span className="text-[10px] font-black text-white leading-none">
                                            {userData.enhanceLimit ?? 0}
                                        </span>
                                        <div className="absolute left-full ml-4 px-2 py-1 bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-[100]">
                                            Enhancements
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-auto flex flex-col gap-6 items-center w-full px-2">
                   <div className="hidden md:flex flex-col items-center mb-4 opacity-50 group transition-opacity hover:opacity-100 cursor-default">
                        <span className="text-[7px] text-white/40 font-black uppercase tracking-[0.2em] text-center">Engineered by</span>
                        <a href="https://mjforyou.in" target="_blank" rel="noopener noreferrer" className="text-[8px] text-white font-bold uppercase tracking-widest text-center whitespace-nowrap hover:text-indigo-400 transition-colors">team mjforyou.in</a>
                   </div>

                   <button 
                        onClick={onLogout}
                        className="p-3 bg-white/5 hover:bg-red-500/10 text-slate-500 hover:text-red-400 rounded-2xl transition-all"
                    >
                        <LogOutIcon size={22} />
                   </button>
                   <div className="w-10 h-10 rounded-2xl overflow-hidden border-2 border-white/10 shadow-lg mb-4">
                        <img src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`} alt="User" />
                   </div>
                </div>
            </aside>

            <div className="flex-1 flex flex-col min-w-0">
                {/* Horizontal Shell Header */}
                <header className="h-20 border-b border-slate-100 bg-white/60 backdrop-blur-xl flex items-center justify-between px-8 z-40 print:hidden">
                    <div className="flex items-center gap-6">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Active Project</span>
                            <h2 className="text-lg font-black text-slate-900 tracking-tight leading-none">
                                {resumeData.personalInfo.fullName || 'Untitled Architecture'}
                            </h2>
                        </div>

                        <div className="h-8 w-px bg-slate-100 mx-2" />

                        {userData && !userData.isPremium && (
                            <button 
                                onClick={onUpgrade}
                                className="group flex items-center gap-3 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-xl transition-all hover:bg-indigo-600 hover:border-indigo-600"
                            >
                                <div className="p-1.5 bg-indigo-600 group-hover:bg-white rounded-lg transition-colors">
                                    <CreditCardIcon size={12} className="text-white group-hover:text-indigo-600" />
                                </div>
                                <div className="flex flex-col items-start leading-none">
                                    <span className="text-[9px] font-black text-indigo-400 group-hover:text-white/60 uppercase tracking-widest mb-0.5">Upgrade</span>
                                    <span className="text-[11px] font-black text-indigo-900 group-hover:text-white">Refuel Credits</span>
                                </div>
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                             <button
                                onClick={onImportOpen}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors rounded-xl"
                            >
                                <UploadIcon size={16} />
                                <span className="hidden xl:inline">Import</span>
                            </button>
                            <button
                                onClick={onTemplateOpen}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors rounded-xl"
                            >
                                <LayoutIcon size={16} />
                                <span className="hidden xl:inline">Templates</span>
                            </button>
                        </div>

                        <div className="w-px h-8 bg-slate-100 mx-2" />

                        <div className="flex gap-3">
                            <button 
                                onClick={onAnalyzeATS}
                                disabled={isAnalyzing}
                                className="btn-secondary-elegant !py-2.5 !px-5 !rounded-xl !text-sm !font-black border-slate-200"
                            >
                                <TrendingUpIcon className={isAnalyzing ? 'animate-pulse text-indigo-500' : 'text-slate-400'} size={16} />
                                <span className="hidden md:inline">ATS Audit</span>
                            </button>

                            <button 
                                onClick={onFullEnhance}
                                disabled={isEnhancing}
                                className="btn-primary-elegant !py-2.5 !px-6 !rounded-xl !text-sm !font-black !bg-indigo-600 hover:!bg-indigo-700 shadow-indigo-200"
                            >
                                <SparklesIcon className={isEnhancing ? 'animate-pulse' : ''} size={16} />
                                <span className="hidden md:inline">Neural Optimize</span>
                            </button>

                            <button 
                                onClick={onPrint}
                                className="btn-primary-elegant !py-2.5 !px-5 !rounded-xl !text-sm !font-black"
                            >
                                <PrinterIcon size={16} />
                                <span className="hidden md:inline text-white">Export</span>
                            </button>
                        </div>
                    </div>
                </header>

                {/* Content Area Overlaying the Dot Pattern */}
                <div className="flex-1 overflow-hidden print:block print:overflow-visible print:h-auto">
                    {children}
                </div>
            </div>
            
            {/* Global Help Button */}
            <button className="fixed bottom-8 right-8 p-4 bg-white border border-slate-100 shadow-2xl rounded-2xl text-slate-400 hover:text-indigo-600 transition-all hover:-translate-y-1 z-[100] print:hidden">
                <HelpCircleIcon size={24} />
            </button>
        </div>
    );
};

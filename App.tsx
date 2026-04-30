import React, { useState, useRef } from 'react';
import { ResumeData, TemplateId } from './types';
import { ResumeEditor } from './components/ResumeEditor';
import { ModernTemplate } from './components/templates/ModernTemplate';
import { ClassicTemplate } from './components/templates/ClassicTemplate';
import { MinimalTemplate } from './components/templates/MinimalTemplate';
import { ProfessionalTemplate } from './components/templates/ProfessionalTemplate';
import { ExecutiveTemplate } from './components/templates/ExecutiveTemplate';
import { CreativeTemplate } from './components/templates/CreativeTemplate';
import { TechnicalTemplate } from './components/templates/TechnicalTemplate';
import { ElegantTemplate } from './components/templates/ElegantTemplate';
import { CompactTemplate } from './components/templates/CompactTemplate';
import { PremiumTemplate } from './components/templates/PremiumTemplate';
import { 
    PrinterIcon, 
    SparklesIcon, 
    DownloadIcon, 
    CheckCircleIcon, 
    XCircleIcon, 
    AlertCircleIcon, 
    TrendingUpIcon, 
    FileTextIcon, 
    UploadIcon,
    LayoutIcon
} from './components/ui/Icons';
import { parseResumeFromText } from './services/geminiService';
import { extractTextFromPdf } from './services/pdfService';
import { analyzeATS, enhanceResume, fullEnhanceResume } from './services/aiService';
import { ATSScore, EnhancementSuggestion } from './types';
import { auth, db, onAuthStateChanged, User, UserProfile, onSnapshot, incrementUsage, signInWithGoogle } from './services/firebase';
import { GoogleLoginButton } from './components/Auth/GoogleLoginButton';
import { doc } from 'firebase/firestore';
import { upgradeToPremium, refillUsage } from './services/firebase';
import { UpgradeModal } from './components/UpgradeModal';
import { motion, AnimatePresence } from 'motion/react';

declare global {
    interface Window {
        Razorpay: any;
    }
}

const initialData: ResumeData = {
    personalInfo: {
        fullName: 'ALEX R. THOMPSON',
        email: 'alex.thompson@example.com',
        phone: '+1 (555) 012-3456',
        location: 'San Francisco, CA',
        website: 'https://alex-thompson.dev',
        linkedin: 'linkedin.com/in/alexthompson'
    },
    summary: 'Strategic Senior Software Engineer with over 8 years of experience in architecting scalable cloud solutions and leading cross-functional engineering teams. Expert in React, Node.js, and Distributed Systems. Proven track record of reducing infrastructure costs by 30% and improving system deployment velocity by 50% using modern CI/CD practices and containerization.',
    experience: [
        {
            id: '1',
            company: 'TechFlow Solutions',
            position: 'Senior Lead Engineer',
            startDate: 'Jan 2021',
            endDate: '',
            current: true,
            description: '• Orchestrated the migration of legacy monolithic architecture to high-performance microservices, resulting in a 40% reduction in downtime.\n• Spearheaded the implementation of an AI-driven monitoring system that reduced incident response time by 25%.\n• Managed a distributed team of 12 engineers across 3 time zones, maintaining a 98% on-time delivery rate for major features.'
        },
        {
            id: '2',
            company: 'CloudScale Inc.',
            position: 'Software Developer II',
            startDate: 'Jun 2018',
            endDate: 'Dec 2020',
            current: false,
            description: '• Developed and maintained core API services serving 1M+ daily active users with 99.99% uptime.\n• Optimized database query performance by 60% through advanced indexing and caching strategies.\n• Mentored 4 junior developers and established standardized code review documentation.'
        }
    ],
    education: [
        {
            id: '1',
            institution: 'University of California, Berkeley',
            degree: 'Master of Science',
            fieldOfStudy: 'Computer Science',
            startDate: '2016',
            endDate: '2018',
            current: false
        },
        {
            id: '2',
            institution: 'Stanford University',
            degree: 'Bachelor of Science',
            fieldOfStudy: 'Software Engineering',
            startDate: '2012',
            endDate: '2016',
            current: false
        }
    ],
    skills: [
        { id: '1', name: 'React, Next.js, TypeScript, Tailwind CSS', category: 'Frontend Architecture', level: 'Expert' },
        { id: '2', name: 'Node.js, Go, Python, GraphQL, REST', category: 'Backend Systems', level: 'Expert' },
        { id: '3', name: 'AWS (S3, EC2, Lambda), Docker, Kubernetes', category: 'Cloud & DevOps', level: 'Expert' },
        { id: '4', name: 'PostgreSQL, Redis, MongoDB, ElasticSearch', category: 'Data Engineering', level: 'Intermediate' },
    ],
    certifications: [
        'AWS Certified Solutions Architect – Professional',
        'Google Professional Cloud Architect',
        'Scrum Alliance Certified Product Owner'
    ],
    projects: [
        {
            id: 'p1',
            name: 'OpenSource FlowEngine',
            description: 'High-speed event processing engine built with Go and Kafka. Processes 500k messages/sec with sub-50ms latency.',
            technologies: 'Go, Kafka, Redis'
        },
        {
            id: 'p2',
            name: 'AI-Powered Resume Optimizer',
            description: 'Built a transformer-based model to analyze resume ATS compatibility and provide real-time suggestions.',
            technologies: 'Python, PyTorch, React'
        }
    ]
};

const App: React.FC = () => {
    const [user, setUser] = React.useState<User | null>(null);
    const [authLoading, setAuthLoading] = React.useState(true);
    const [userData, setUserData] = React.useState<UserProfile | null>(null);
    const [resumeData, setResumeData] = useState<ResumeData>(initialData);
    const [activeTemplate, setActiveTemplate] = useState<TemplateId>('modern');
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
    const [importText, setImportText] = useState('');
    const [isParsing, setIsParsing] = useState(false);
    const [atsScore, setAtsScore] = useState<ATSScore | null>(null);
    const [suggestions, setSuggestions] = useState<EnhancementSuggestion[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isEnhancing, setIsEnhancing] = useState(false);
    const [showResultsModal, setShowResultsModal] = useState(false);
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
    const [upgradeReason, setUpgradeReason] = useState({ title: '', description: '' });
    const resumeRef = useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setAuthLoading(false);
        });
        return () => unsubscribeAuth();
    }, []);

    React.useEffect(() => {
        if (!user) {
            setUserData(null);
            return;
        }

        const unsubscribeData = onSnapshot(doc(db, 'users', user.uid), (doc) => {
            if (doc.exists()) {
                setUserData(doc.data() as UserProfile);
            }
        });

        return () => unsubscribeData();
    }, [user]);

    const handlePayment = async () => {
        if (!user) {
            alert('Please sign in to upgrade.');
            return;
        }
        
        try {
            const res = await fetch('/api/create-order', { method: 'POST' });
            if (!res.ok) throw new Error('Order creation failed');
            const order = await res.json();

            const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_Sjmgef8ZEFIByg';
            
            const options = {
                key: razorpayKey, 
                amount: order.amount,
                currency: order.currency,
                name: "ResuGenius AI",
                description: "Premium Lifetime Access",
                order_id: order.id,
                handler: async function (response: any) {
                    try {
                        const verifyRes = await fetch('/api/verify-payment', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(response)
                        });
                        
                        if (!verifyRes.ok) {
                            const errorData = await verifyRes.json().catch(() => ({ message: 'Verification failed' }));
                            throw new Error(errorData.message || 'Verification failed');
                        }

                        const verifyData = await verifyRes.json();
                        if (verifyData.status === 'ok') {
                            await refillUsage(user.uid);
                            setIsUpgradeModalOpen(false);
                            alert('Welcome to the higher tier! Your limits have been increased.');
                        } else {
                            throw new Error('Payment status not OK');
                        }
                    } catch (err: any) {
                        console.error('Verification failed:', err);
                        alert(`Payment verification failed: ${err.message || 'Please contact support.'}`);
                    }
                },
                prefill: {
                    name: user.displayName,
                    email: user.email,
                },
                theme: {
                    color: "#2563eb",
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error("Payment initiation failed:", error);
            alert("Payment failed to start. Please check your internet connection.");
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const handleAnalyzeATS = async () => {
        if (!user || !userData) return;
        if (!userData.isPremium && userData.optimizeCount >= (userData.optimizeLimit || 2)) {
            setUpgradeReason({
                title: "Strategic Rewrite Limit Reached",
                description: "Deep AI Optimization requires significant resources. Get a Power Pack for ₹9 to unlock 3 more strategic rewrites and 10 enhancements."
            });
            setIsUpgradeModalOpen(true);
            return;
        }

        setIsAnalyzing(true);
        try {
            const score = await analyzeATS(resumeData);
            setAtsScore(score);
            setShowResultsModal(true);
            await incrementUsage(user.uid, 'optimizeCount');
        } catch (error) {
            console.error(error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleEnhanceResume = async () => {
        if (!user || !userData) return;
        if (!userData.isPremium && userData.enhanceCount >= (userData.enhanceLimit || 5)) {
            setUpgradeReason({
                title: "Enhancement Limit Reached",
                description: "Our AI brain is working hard to polish your resume. Get a Power Pack for ₹9 for 10 more enhancements."
            });
            setIsUpgradeModalOpen(true);
            return;
        }

        setIsEnhancing(true);
        try {
            const newSuggestions = await enhanceResume(resumeData);
            setSuggestions(newSuggestions);
            setShowResultsModal(true);
            await incrementUsage(user.uid, 'enhanceCount');
        } catch (error) {
            console.error(error);
        } finally {
            setIsEnhancing(false);
        }
    };

    const handleFullEnhance = async () => {
        if (!user || !userData) return;
        if (!userData.isPremium && userData.optimizeCount >= (userData.optimizeLimit || 2)) {
            setUpgradeReason({
                title: "Deep Optimization Limit Reached",
                description: "The 85+ score strategic overhaul uses advanced AI logic. Unlock 3 more attempts for just ₹9."
            });
            setIsUpgradeModalOpen(true);
            return;
        }

        setIsEnhancing(true);
        try {
            // Step 1: Perform deep ATS analysis first to identify weaknesses
            const preAnalysis = await analyzeATS(resumeData);
            
            // Step 2: Use analysis insights to perform a surgical enhancement
            const enhancedData = await fullEnhanceResume(resumeData, preAnalysis);
            setResumeData(enhancedData);
            
            // Step 3: Final audit to show the improved score
            const postAnalysis = await analyzeATS(enhancedData);
            setAtsScore(postAnalysis);
            setShowResultsModal(true);
            await incrementUsage(user.uid, 'optimizeCount');
        } catch (error) {
            console.error(error);
            alert("Strategic overhaul failed. Please check your internet connection.");
        } finally {
            setIsEnhancing(false);
        }
    };

    const applySuggestion = (suggestion: EnhancementSuggestion) => {
        setResumeData(prev => {
            const newData = { ...prev };
            if (suggestion.section === 'summary') {
                newData.summary = suggestion.suggested;
            } else if (suggestion.section.startsWith('experience')) {
                const expId = suggestion.section.split(':')[1];
                newData.experience = newData.experience.map(exp => 
                    exp.id === expId ? { ...exp, description: suggestion.suggested } : exp
                );
            }
            return newData;
        });
        setSuggestions(prev => prev.filter(s => s !== suggestion));
    };

    const handleDownloadData = () => {
        const dataStr = JSON.stringify(resumeData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `resume-${resumeData.personalInfo.fullName.replace(/\s+/g, '-').toLowerCase()}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleImportText = async () => {
        if (!importText.trim() || !user || !userData) return;
        
        if (!userData.isPremium && userData.importCount >= (userData.importLimit || 2)) {
            setUpgradeReason({
                title: "Import Limit Reached",
                description: "Importing resumes from text or PDF requires powerful parsing. Get 2 more imports and 10 enhancements for ₹9."
            });
            setIsUpgradeModalOpen(true);
            return;
        }

        setIsParsing(true);
        try {
            const parsedData = await parseResumeFromText(importText);
            setResumeData(parsedData);
            setIsImportModalOpen(false);
            setImportText('');
            await incrementUsage(user.uid, 'importCount');
        } catch (error) {
            console.error(error);
            alert('Failed to parse resume text. Please try a cleaner format.');
        } finally {
            setIsParsing(false);
        }
    };

    const handleImportPdf = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsParsing(true);
        try {
            const text = await extractTextFromPdf(file);
            const parsedData = await parseResumeFromText(text);
            setResumeData(parsedData);
            setIsImportModalOpen(false);
        } catch (error) {
            console.error(error);
            alert('Failed to parse PDF. Please try copying the text manually.');
        } finally {
            setIsParsing(false);
        }
    };

    const renderTemplate = () => {
        switch (activeTemplate) {
            case 'classic': return <ClassicTemplate data={resumeData} />;
            case 'minimal': return <MinimalTemplate data={resumeData} />;
            case 'professional': return <ProfessionalTemplate data={resumeData} />;
            case 'executive': return <ExecutiveTemplate data={resumeData} />;
            case 'creative': return <CreativeTemplate data={resumeData} />;
            case 'technical': return <TechnicalTemplate data={resumeData} />;
            case 'elegant': return <ElegantTemplate data={resumeData} />;
            case 'compact': return <CompactTemplate data={resumeData} />;
            case 'premium': return <PremiumTemplate data={resumeData} />;
            case 'modern':
            default: return <ModernTemplate data={resumeData} />;
        }
    };

    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const handleLogin = async () => {
        setIsLoggingIn(true);
        try {
            await signInWithGoogle();
        } catch (error: any) {
            console.error('Login Error:', error);
            alert(`Login failed: ${error.message || 'Unknown error'}. Please ensure popups are allowed and try again.`);
        } finally {
            setIsLoggingIn(false);
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-6"
                >
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-primary/20 rounded-full"></div>
                        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
                    </div>
                    <p className="text-slate-500 font-display font-medium tracking-wide">Initializing ResuGenius...</p>
                </motion.div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen elegant-gradient flex flex-col items-center justify-center p-6 text-center">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-2xl w-full"
                >
                    <div className="mb-10 flex justify-center">
                        <motion.div 
                            animate={{ 
                                scale: [1, 1.05, 1],
                                rotate: [0, 5, -5, 0]
                            }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            className="p-6 glass rounded-3xl"
                        >
                            <SparklesIcon size={56} className="text-slate-900" />
                        </motion.div>
                    </div>
                    <h1 className="text-6xl font-black text-slate-900 mb-6 tracking-tight">ResuGenius <span className="text-primary">AI</span></h1>
                    <p className="text-slate-500 mb-10 text-xl font-medium leading-relaxed max-w-lg mx-auto">
                        The elite intelligence-driven resume architect. Create distinctive, ATS-shattering resumes with precision engineering.
                    </p>
                    <div className="flex justify-center">
                        <motion.button
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleLogin}
                            disabled={isLoggingIn}
                            className="flex items-center gap-4 bg-slate-900 hover:bg-black text-white font-bold px-10 py-5 rounded-2xl transition-all shadow-xl shadow-black/10 hover:shadow-2xl active:scale-95 text-lg disabled:opacity-50"
                        >
                            {isLoggingIn ? (
                                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <img 
                                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                                    alt="Google logo" 
                                    className="w-6 h-6 invert"
                                />
                            )}
                            <span>{isLoggingIn ? 'Establishing connection...' : 'Start Building with Google'}</span>
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100 flex flex-col h-screen overflow-hidden print:h-auto print:overflow-visible font-sans animate-in fade-in duration-700">
            {/* Header / Toolbar */}
            <header className="glass border-b border-white/40 px-8 h-20 flex items-center justify-between shrink-0 relative z-30 print:hidden">
                <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-slate-900 rounded-xl shadow-lg shadow-black/5">
                        <SparklesIcon size={20} className="text-white" />
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tighter">ResuGenius <span className="text-primary">AI</span></h1>
                    
                    {userData && (
                        <div className="ml-10 hidden xl:flex items-center gap-6 text-[11px] uppercase tracking-widest font-black text-slate-400">
                            {userData.isPremium ? (
                                <div className="flex items-center gap-2 bg-slate-900 text-white px-3 py-1.5 rounded-lg shadow-sm">
                                    <SparklesIcon size={12} className="text-amber-400" />
                                    <span>ELITE ACCESS</span>
                                </div>
                            ) : (
                                <>
                                    <div className="flex flex-col gap-0.5">
                                        <span className="opacity-60">Imports</span>
                                        <span className={`text-sm ${userData.importCount >= (userData.importLimit || 2) ? 'text-red-500' : 'text-slate-900'}`}>
                                            {userData.importCount}<span className="text-slate-300 mx-1">/</span>{(userData.importLimit || 2)}
                                        </span>
                                    </div>
                                    <div className="w-px h-6 bg-slate-200"></div>
                                    <div className="flex flex-col gap-0.5">
                                        <span className="opacity-60">Insights</span>
                                        <span className={`text-sm ${userData.optimizeCount >= (userData.optimizeLimit || 2) ? 'text-red-500' : 'text-slate-900'}`}>
                                            {userData.optimizeCount}<span className="text-slate-300 mx-1">/</span>{(userData.optimizeLimit || 2)}
                                        </span>
                                    </div>
                                    <div className="w-px h-6 bg-slate-200"></div>
                                    <div className="flex flex-col gap-0.5">
                                        <span className="opacity-60">AI Polish</span>
                                        <span className={`text-sm ${userData.enhanceCount >= (userData.enhanceLimit || 5) ? 'text-red-500' : 'text-slate-900'}`}>
                                            {userData.enhanceCount}<span className="text-slate-300 mx-1">/</span>{(userData.enhanceLimit || 5)}
                                        </span>
                                    </div>
                                    <button 
                                        onClick={() => setIsUpgradeModalOpen(true)}
                                        className="ml-2 bg-slate-100 hover:bg-slate-200 text-slate-900 px-4 py-2 rounded-xl text-[10px] transition-all flex items-center gap-2 font-black border border-slate-200"
                                    >
                                        <TrendingUpIcon size={12} />
                                        REFUEL (₹9)
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsImportModalOpen(true)}
                        className="btn-secondary-elegant"
                    >
                        <UploadIcon size={16} />
                        <span className="hidden md:inline">Import</span>
                    </button>

                    <button
                        onClick={() => setIsTemplateModalOpen(true)}
                        className="btn-secondary-elegant !border-primary/20 text-primary hover:bg-primary/5"
                    >
                        <LayoutIcon size={16} />
                        <span>Select Template</span>
                    </button>

                    <div className="h-8 w-px bg-slate-200 mx-2 hidden md:block"></div>

                    <div className="flex items-center gap-2">
                        <button 
                            onClick={handleAnalyzeATS}
                            disabled={isAnalyzing}
                            className={`btn-elegant ${isAnalyzing ? 'opacity-50' : 'bg-slate-100 hover:bg-slate-200 text-slate-900'}`}
                        >
                            <TrendingUpIcon className={isAnalyzing ? 'animate-pulse' : ''} size={16} />
                            <span className="hidden md:inline">Audit Score</span>
                        </button>

                        <button 
                            onClick={handleFullEnhance}
                            disabled={isEnhancing}
                            className="btn-primary-elegant !bg-indigo-600 hover:!bg-indigo-700"
                        >
                            <SparklesIcon className={isEnhancing ? 'animate-pulse' : ''} size={16} />
                            <span className="hidden md:inline">Strategic Polish</span>
                        </button>

                        <button 
                            onClick={handlePrint}
                            className="btn-primary-elegant"
                        >
                            <PrinterIcon size={16} />
                            <span className="hidden md:inline">Export PDF</span>
                        </button>
                    </div>

                    <div className="ml-2 pl-4 border-l border-slate-200">
                        <GoogleLoginButton user={user} loading={authLoading} />
                    </div>
                </div>
            </header>

            <UpgradeModal 
                isOpen={isUpgradeModalOpen} 
                onClose={() => setIsUpgradeModalOpen(false)} 
                onUpgrade={handlePayment}
                title={upgradeReason.title || "Upgrade Your Limits"}
                description={upgradeReason.description || "Unlock more AI-powered features to build your perfect resume."}
            />

            {/* Template Selection Modal */}
            <AnimatePresence>
                {isTemplateModalOpen && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsTemplateModalOpen(false)}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[85vh] overflow-hidden relative z-10 flex flex-col"
                        >
                            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                <div>
                                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Select Design Architecture</h2>
                                    <p className="text-slate-500 font-medium">Choose a template that aligns with your professional narrative.</p>
                                </div>
                                <button 
                                    onClick={() => setIsTemplateModalOpen(false)}
                                    className="p-3 bg-white hover:bg-slate-100 rounded-full transition-colors border border-slate-200 shadow-sm"
                                >
                                    <XCircleIcon size={24} className="text-slate-500" />
                                </button>
                            </div>
                            
                            <div className="p-8 overflow-y-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 elegant-gradient">
                                {(['modern', 'classic', 'minimal', 'professional', 'executive', 'creative', 'technical', 'elegant', 'compact', 'premium'] as TemplateId[]).map((t) => (
                                    <motion.button
                                        key={t}
                                        whileHover={{ y: -6, scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => {
                                            setActiveTemplate(t);
                                            setIsTemplateModalOpen(false);
                                        }}
                                        className={`group relative flex flex-col items-center p-5 rounded-3xl transition-all border-2 ${
                                            activeTemplate === t 
                                            ? 'border-indigo-500 bg-white shadow-xl shadow-indigo-100' 
                                            : 'border-transparent bg-white/60 hover:bg-white hover:shadow-lg'
                                        }`}
                                    >
                                        <div className={`w-full aspect-[1/1.4] rounded-xl mb-4 shadow-sm border border-slate-100 overflow-hidden ${
                                            activeTemplate === t ? 'ring-2 ring-indigo-500 ring-offset-4' : ''
                                        }`}>
                                            <div className="w-full h-full bg-white flex flex-col p-3 space-y-1.5">
                                                <div className={`h-2.5 w-3/4 rounded-full ${activeTemplate === t ? 'bg-indigo-300' : 'bg-slate-200'}`}></div>
                                                <div className="h-1.5 w-1/2 bg-slate-100 rounded-full"></div>
                                                <div className="flex gap-1.5 py-1.5">
                                                    <div className="w-full h-10 bg-slate-50 rounded-lg"></div>
                                                </div>
                                                {[1,2,3].map(i => (
                                                    <div key={i} className="space-y-1.5 py-1.5">
                                                        <div className="h-2 w-full bg-slate-100 rounded-full"></div>
                                                        <div className="h-1.5 w-5/6 bg-slate-50 rounded-full"></div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <span className={`text-[11px] font-black uppercase tracking-[0.2em] ${
                                            activeTemplate === t ? 'text-indigo-600' : 'text-slate-500 group-hover:text-slate-900'
                                        }`}>{t}</span>
                                        
                                        {activeTemplate === t && (
                                            <div className="absolute top-3 right-3">
                                                <div className="bg-indigo-600 rounded-full p-1 shadow-lg">
                                                    <CheckCircleIcon size={14} className="text-white" />
                                                </div>
                                            </div>
                                        )}
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Main Workspace */}
            <main className="flex-1 flex overflow-hidden print:block print:h-auto print:overflow-visible">
                {/* Editor Scrollable Area */}
                <div className="w-5/12 h-full overflow-y-auto border-r border-slate-200 no-scrollbar print:hidden bg-white/50 backdrop-blur-sm">
                    <div className="max-w-xl mx-auto p-10">
                        <ResumeEditor data={resumeData} onChange={setResumeData} />
                    </div>
                </div>

                {/* Preview Area */}
                <div className="w-7/12 h-full elegant-gradient overflow-y-auto p-12 flex justify-center items-start print:block print:w-full print:h-auto print:bg-white print:p-0 print:overflow-visible no-scrollbar">
                    {/* A4 container */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        id="resume-print-area"
                        ref={resumeRef}
                        className="bg-white shadow-[0_30px_70px_rgba(0,0,0,0.12)] mx-auto origin-top transition-transform duration-500 print:shadow-none print:m-0 print:w-full print:h-auto rounded-sm overflow-hidden"
                        style={{
                            width: '210mm',
                            minHeight: '297mm',
                        }}
                    >
                        {renderTemplate()}
                    </motion.div>
                </div>
            </main>
            {/* Import Modal */}
            {isImportModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="bg-slate-900 p-6 text-white flex justify-between items-center border-b border-white/10">
                            <div>
                                <h3 className="text-xl font-bold flex items-center gap-2">
                                    <UploadIcon className="text-emerald-400" />
                                    Import Your Resume
                                </h3>
                                <p className="text-xs text-white/60 mt-1">AI will extract and format your data automatically.</p>
                            </div>
                            <button onClick={() => setIsImportModalOpen(false)} className="hover:bg-white/10 p-2 rounded-full transition-colors">
                                <XCircleIcon />
                            </button>
                        </div>
                        
                        <div className="p-8">
                            {/* PDF Upload Area */}
                            <div className="mb-8 group">
                                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Upload PDF File</label>
                                <div className="relative border-2 border-dashed border-slate-200 rounded-xl p-8 transition-colors group-hover:border-blue-400 group-hover:bg-blue-50/50 flex flex-col items-center justify-center cursor-pointer text-center">
                                    <input 
                                        type="file" 
                                        accept=".pdf" 
                                        onChange={handleImportPdf}
                                        disabled={isParsing}
                                        className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
                                    />
                                    <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform mx-auto">
                                        <FileTextIcon size={24} />
                                    </div>
                                    <p className="text-sm font-bold text-slate-700">Drop your PDF here or click to browse</p>
                                    <p className="text-xs text-slate-400 mt-1 italic">Best results with text-based PDFs</p>
                                </div>
                            </div>
                            
                            <div className="relative flex items-center py-4 mb-4">
                                <div className="flex-grow border-t border-slate-100"></div>
                                <span className="flex-shrink mx-4 text-xs font-black text-slate-300 uppercase tracking-widest">Or paste text</span>
                                <div className="flex-grow border-t border-slate-100"></div>
                            </div>

                            <textarea
                                value={importText}
                                onChange={(e) => setImportText(e.target.value)}
                                placeholder="Paste your resume content here..."
                                className="w-full h-40 p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm font-medium text-slate-600 outline-none"
                            />
                        </div>
                        
                        <div className="bg-slate-50 p-6 flex justify-end gap-3">
                            <button
                                onClick={() => setIsImportModalOpen(false)}
                                className="px-6 py-2.5 rounded-lg text-sm font-bold text-slate-500 hover:text-slate-700 hover:bg-white border border-transparent transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleImportText}
                                disabled={isParsing || (!importText.trim() && !isParsing)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-lg font-bold shadow-lg shadow-blue-200 disabled:opacity-50 flex items-center gap-2 transition-all active:scale-95"
                            >
                                {isParsing ? 'Processing...' : 'Parse Text'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Results Modal */}
            {showResultsModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in slide-in-from-bottom-4 duration-300">
                        <div className="p-6 border-b flex items-center justify-between bg-slate-50">
                            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                {atsScore ? 'Full ATS Intelligence Audit' : 'AI Strategic Suggestions'}
                            </h2>
                            <button 
                                onClick={() => {
                                    setShowResultsModal(false);
                                    setAtsScore(null);
                                    setSuggestions([]);
                                }}
                                className="text-slate-400 hover:text-slate-600 p-2 transition-transform hover:rotate-90"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto bg-slate-50/30">
                            {atsScore && (
                                <div className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="flex flex-col items-center justify-center p-8 bg-white rounded-2xl border border-slate-200 shadow-sm">
                                            <span className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Overall ATS Score</span>
                                            <div className="text-7xl font-black text-indigo-600 tracking-tighter">
                                                {atsScore.score}<span className="text-2xl text-slate-300">/100</span>
                                            </div>
                                            <div className={`mt-4 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                                atsScore.verdict === 'Excellent' ? 'bg-green-100 text-green-700' :
                                                atsScore.verdict === 'Good' ? 'bg-blue-100 text-blue-700' :
                                                atsScore.verdict === 'Needs Improvement' ? 'bg-amber-100 text-amber-700' :
                                                'bg-red-100 text-red-700'
                                            }`}>
                                                Verdict: {atsScore.verdict}
                                            </div>
                                        </div>

                                        <div className="space-y-4 px-4 py-2">
                                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Detailed Metrics</h3>
                                            {[
                                                { label: 'ATS Compatibility', score: atsScore.detailedScores.atsCompatibility },
                                                { label: 'Keyword Matching', score: atsScore.detailedScores.keywordMatch },
                                                { label: 'Formatting Quality', score: atsScore.detailedScores.formatting },
                                                { label: 'Content Depth', score: atsScore.detailedScores.contentQuality },
                                                { label: 'Recruiter Appeal', score: atsScore.detailedScores.recruiterAppeal },
                                            ].map((m, i) => (
                                                <div key={i} className="space-y-1">
                                                    <div className="flex justify-between text-xs font-bold text-slate-600">
                                                        <span>{m.label}</span>
                                                        <span>{m.score}%</span>
                                                    </div>
                                                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                                        <div 
                                                            className={`h-full transition-all duration-1000 ${
                                                                m.score > 80 ? 'bg-green-500' : m.score > 60 ? 'bg-indigo-500' : 'bg-amber-500'
                                                            }`}
                                                            style={{ width: `${m.score}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div>
                                            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                                <AlertCircleIcon className="w-5 h-5 text-indigo-600" />
                                                Actionable Insights
                                            </h3>
                                            <ul className="space-y-3">
                                                {atsScore.feedback.map((f, i) => (
                                                    <li key={i} className="flex gap-3 text-sm text-slate-600 leading-relaxed bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                                                        <CheckCircleIcon className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                                        {f}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="space-y-6">
                                            <div>
                                                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                                    <TrendingUpIcon className="w-5 h-5 text-purple-600" />
                                                    Top Score-Booster Changes
                                                </h3>
                                                <div className="space-y-2">
                                                    {atsScore.topChanges.map((change, i) => (
                                                        <div key={i} className="bg-purple-50 p-3 rounded-xl border border-purple-100 text-sm text-purple-900 font-medium flex gap-3">
                                                            <span className="bg-purple-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 font-black">
                                                                {i + 1}
                                                            </span>
                                                            {change}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {atsScore.missingKeywords.length > 0 && (
                                                <div>
                                                    <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                                        <SparklesIcon className="w-5 h-5 text-amber-500" />
                                                        Missing Industry Keywords
                                                    </h3>
                                                    <div className="space-y-3">
                                                        {atsScore.missingKeywords.map((item, i) => (
                                                            <div key={i} className="bg-amber-50 border border-amber-100 rounded-xl p-4 shadow-sm">
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <span className="px-3 py-1 bg-amber-200 text-amber-900 rounded-lg text-xs font-black uppercase tracking-widest leading-none">
                                                                        {item.keyword}
                                                                    </span>
                                                                </div>
                                                                <p className="text-xs text-amber-900/80 leading-relaxed italic border-l-2 border-amber-300 pl-3">
                                                                    <span className="font-bold not-italic text-amber-900 block mb-1">Strategic Integration:</span>
                                                                    "{item.example}"
                                                                </p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {suggestions.length > 0 && (
                                <div className="space-y-6">
                                    <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 mb-6 flex flex-col gap-2">
                                        <h3 className="text-sm font-bold text-indigo-900 flex items-center gap-2">
                                            <SparklesIcon className="w-4 h-4" /> Professional Rephrasing Logic
                                        </h3>
                                        <p className="text-xs text-indigo-700 leading-relaxed">
                                            Our AI has analyzed your descriptions and suggested more professional, achievement-oriented alternatives that score better with both ATS and human recruiters.
                                        </p>
                                    </div>
                                    {suggestions.map((s, i) => (
                                        <div key={i} className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm transition hover:shadow-md">
                                            <div className="bg-slate-900 px-4 py-2 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                                <span>{s.section} Improvement</span>
                                            </div>
                                            <div className="p-5 space-y-5">
                                                <div className="space-y-2 opacity-60">
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                                        <XCircleIcon className="w-3 h-3" /> Current Draft
                                                    </span>
                                                    <p className="text-sm text-slate-600 italic line-through leading-relaxed">{s.original}</p>
                                                </div>
                                                <div className="space-y-2">
                                                    <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-1">
                                                        <CheckCircleIcon className="w-3 h-3" /> Enhanced Version
                                                    </span>
                                                    <p className="text-sm text-slate-900 font-bold leading-relaxed bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 outline outline-indigo-200/50 outline-offset-2">
                                                        {s.suggested}
                                                    </p>
                                                </div>
                                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                                    <p className="text-xs text-slate-500 leading-relaxed flex gap-3 italic">
                                                        <SparklesIcon className="w-4 h-4 shrink-0 text-amber-500" />
                                                        <span className="font-bold text-slate-800 not-italic">Strategic Reason:</span>
                                                        {s.reason}
                                                    </p>
                                                </div>
                                                <button 
                                                    onClick={() => applySuggestion(s)}
                                                    className="w-full py-3 bg-indigo-600 hover:bg-slate-900 text-white rounded-xl text-sm font-bold transition shadow-lg transform active:scale-[0.98]"
                                                >
                                                    Apply This Strategic Change
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="p-6 border-t bg-slate-50">
                            <button 
                                onClick={() => {
                                    setShowResultsModal(false);
                                    setAtsScore(null);
                                    setSuggestions([]);
                                }}
                                className="w-full py-4 bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 rounded-2xl font-black uppercase tracking-widest text-xs transition shadow-sm"
                            >
                                Continue Editing
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;

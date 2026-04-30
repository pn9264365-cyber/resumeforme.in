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
    TrendingUp, 
    Zap, 
    Sparkles, 
    X, 
    FileText, 
    Layout, 
    Star, 
    ShieldCheck, 
    CheckCircle2,
    Download,
    Printer,
    Upload,
    CheckCircle,
    XCircle,
    AlertCircle,
    TrendingUp as TrendingUpIconActual
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UpgradeModal } from './components/UpgradeModal';
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
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { PricingPage } from './components/PricingPage';

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
    const [isPricingOpen, setIsPricingOpen] = useState(false);
    const [isUpgrading, setIsUpgrading] = useState(false);
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

    const handlePayment = async (amount: number = 29) => {
        if (!user) {
            signInWithGoogle();
            return;
        }
        
        setIsUpgrading(true);
        try {
            const res = await fetch('/api/create-order', { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount })
            });
            if (!res.ok) throw new Error('Order creation failed');
            const order = await res.json();

            const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_Sjmgef8ZEFIByg';
            
            const options = {
                key: razorpayKey, 
                amount: order.amount,
                currency: order.currency,
                name: "resumeforme",
                description: `Elite Pack Upgrade - ${amount} INR`,
                image: "https://api.dicebear.com/7.x/shapes/svg?seed=resumeforme",
                order_id: order.id,
                handler: async function (response: any) {
                    try {
                        const verifyRes = await fetch('/api/verify-payment', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                            }),
                        });

                        const verifyData = await verifyRes.json();

                        if (verifyData.status === 'ok') {
                            // Calculate credits based on amount
                            let credits = { imports: 1, audits: 5, enhancements: 10 };
                            if (amount === 29) credits = { imports: 2, audits: 10, enhancements: 20 };
                            if (amount === 49) credits = { imports: 3, audits: 20, enhancements: 50 };
                            if (amount === 99) credits = { imports: 4, audits: 50, enhancements: 1000 };

                            await refillUsage(user.uid, credits);
                            setIsPricingOpen(false);
                            setIsUpgradeModalOpen(false);
                            alert('Welcome to Elite! Your credits have been refilled.');
                        } else {
                            alert('Payment verification failed.');
                        }
                    } catch (error) {
                        console.error('Refill error:', error);
                        alert('Something went wrong during verification.');
                    } finally {
                        setIsUpgrading(false);
                    }
                },
                prefill: {
                    name: user.displayName || '',
                    email: user.email || '',
                },
                theme: { color: "#4F46E5" },
                modal: {
                    ondismiss: function() {
                        setIsUpgrading(false);
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error('Payment error:', error);
            alert('Failed to initiate payment.');
            setIsUpgrading(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const handleLogin = async () => {
        try {
            await signInWithGoogle();
        } catch (error) {
            console.error("Login failed:", error);
        }
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

    const handleLogout = async () => {
        try {
            await auth.signOut();
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="flex flex-col items-center gap-6">
                    <div className="relative">
                        <div className="w-16 h-16 border-b-2 border-indigo-600 rounded-full animate-spin" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Sparkles className="text-indigo-600" size={24} />
                        </div>
                    </div>
                    <span className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Authenticating Neural Core</span>
                </div>
            </div>
        );
    }

    if (!user) {
        return <LandingPage onLogin={handleLogin} isLoggingIn={isLoggingIn} />;
    }

    return (
        <div className="h-screen bg-white overflow-hidden relative">
            <AnimatePresence>
                {isPricingOpen && (
                    <PricingPage 
                        onClose={() => setIsPricingOpen(false)} 
                        onUpgrade={handlePayment}
                        isUpgrading={isUpgrading}
                    />
                )}
            </AnimatePresence>

            <Dashboard
                user={user}
                userData={userData}
                resumeData={resumeData}
                onDataChange={setResumeData}
                activeTemplate={activeTemplate}
                onTemplateOpen={() => setIsTemplateModalOpen(true)}
                onImportOpen={() => setIsImportModalOpen(true)}
                onAnalyzeATS={handleAnalyzeATS}
                onFullEnhance={handleFullEnhance}
                onPrint={handlePrint}
                onLogout={handleLogout}
                onUpgrade={() => setIsPricingOpen(true)}
                isAnalyzing={isAnalyzing}
                isEnhancing={isEnhancing}
            >
            <div className="flex h-full overflow-hidden print:block print:h-auto print:overflow-visible">
                {/* Editor Scrollable Area */}
                <div className="w-5/12 h-full overflow-y-auto border-r border-slate-100 no-scrollbar print:hidden bg-white/40 backdrop-blur-sm">
                    <div className="max-w-xl mx-auto p-10">
                        <ResumeEditor data={resumeData} onChange={setResumeData} />
                    </div>
                </div>

                {/* Preview Area */}
                <div className="w-7/12 h-full bg-slate-50 overflow-y-auto p-12 flex justify-center items-start print:block print:w-full print:h-auto print:bg-white print:p-0 print:overflow-visible no-scrollbar">
                    {/* A4 container */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        id="resume-print-area"
                        ref={resumeRef}
                        className="bg-white shadow-[0_30px_100px_rgba(0,0,0,0.1)] mx-auto origin-top transition-transform duration-500 print:shadow-none print:m-0 print:w-full print:h-auto rounded-sm overflow-hidden"
                        style={{
                            width: '210mm',
                            minHeight: '297mm',
                        }}
                    >
                        {renderTemplate()}
                    </motion.div>
                </div>
            </div>

            <UpgradeModal 
                isOpen={isUpgradeModalOpen} 
                onClose={() => setIsUpgradeModalOpen(false)} 
                onUpgrade={handlePayment}
                onViewPlans={() => {
                    setIsUpgradeModalOpen(false);
                    setIsPricingOpen(true);
                }}
                title={upgradeReason.title}
                description={upgradeReason.description}
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
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-[3rem] shadow-2xl w-full max-w-5xl max-h-[85vh] overflow-hidden relative z-10 flex flex-col"
                        >
                            <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-white">
                                <div>
                                    <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Design Architecture</h2>
                                    <p className="text-slate-500 font-medium text-lg">Choose a template that aligns with your professional narrative.</p>
                                </div>
                                <button 
                                    onClick={() => setIsTemplateModalOpen(false)}
                                    className="p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all border border-slate-200"
                                >
                                    <XCircleIcon size={24} className="text-slate-400" />
                                </button>
                            </div>
                            
                            <div className="p-10 overflow-y-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 bg-slate-50/30">
                                    {(['modern', 'classic', 'minimal', 'professional', 'executive', 'creative', 'technical', 'elegant', 'compact', 'premium'] as TemplateId[]).map((t) => (
                                        <motion.button
                                            key={t}
                                            whileHover={{ y: -8 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => {
                                                setActiveTemplate(t);
                                                setIsTemplateModalOpen(false);
                                            }}
                                            className={`group relative flex flex-col items-center p-6 rounded-[2.5rem] transition-all border-2 ${
                                                activeTemplate === t 
                                                ? 'border-indigo-500 bg-white shadow-2xl shadow-indigo-100' 
                                                : 'border-transparent bg-white/40 hover:bg-white hover:shadow-xl'
                                            }`}
                                        >
                                            <div className={`w-full aspect-[1/1.4] rounded-2xl mb-5 shadow-sm border border-slate-100 overflow-hidden relative ${
                                                activeTemplate === t ? 'ring-4 ring-indigo-500/20' : ''
                                            }`}>
                                                {/* Simulated Template Visual */}
                                                <div className="absolute inset-0 bg-white flex flex-col p-3 space-y-1.5 translate-y-2 group-hover:translate-y-0 transition-transform">
                                                    {/* Layout Specifics */}
                                                    {t === 'creative' && (
                                                        <div className="flex h-full gap-2">
                                                            <div className="w-1/3 bg-indigo-600 rounded-sm" />
                                                            <div className="flex-1 space-y-2">
                                                                <div className="h-2 w-full bg-pink-100" />
                                                                <div className="h-4 w-full bg-slate-50" />
                                                                <div className="h-2 w-3/4 bg-slate-50" />
                                                            </div>
                                                        </div>
                                                    )}
                                                    {t === 'modern' && (
                                                        <div className="flex flex-col h-full items-center p-2">
                                                            <div className="h-6 w-full bg-indigo-50 rounded-md mb-2" />
                                                            <div className="h-2 w-3/4 bg-slate-100 rounded-full mb-4" />
                                                            <div className="w-full flex gap-2">
                                                                <div className="h-10 w-1/4 bg-slate-50 rounded-sm" />
                                                                <div className="h-10 flex-1 bg-slate-50 rounded-sm" />
                                                            </div>
                                                        </div>
                                                    )}
                                                    {t === 'classic' && (
                                                        <div className="flex flex-col h-full border p-2">
                                                            <div className="h-2 w-1/2 bg-slate-200 mx-auto mb-2" />
                                                            <div className="h-1 w-full bg-slate-100 mb-4" />
                                                            {[1,2,3,4].map(i => <div key={i} className="h-1 w-full bg-slate-50 mb-1" />)}
                                                        </div>
                                                    )}
                                                    {t === 'minimal' && (
                                                        <div className="flex flex-col h-full p-4">
                                                            <div className="h-1 w-1/3 bg-slate-900 mb-6" />
                                                            <div className="h-1 w-full bg-slate-100 mb-2" />
                                                            <div className="h-1 w-full bg-slate-100 mb-2" />
                                                            <div className="h-1 w-5/6 bg-slate-100" />
                                                        </div>
                                                    )}
                                                    {t === 'professional' && (
                                                        <div className="flex h-full gap-2">
                                                            <div className="flex-1 space-y-2">
                                                                <div className="h-3 w-3/4 bg-slate-900 mb-4" />
                                                                {[1,2,3].map(i => <div key={i} className="h-1 w-full bg-slate-100" />)}
                                                            </div>
                                                            <div className="w-1/4 bg-slate-50 rounded-sm p-1">
                                                                <div className="h-1 w-full bg-indigo-100 mb-1" />
                                                                <div className="h-1 w-full bg-indigo-100 mb-1" />
                                                            </div>
                                                        </div>
                                                    )}
                                                    {t === 'executive' && (
                                                        <div className="flex flex-col h-full">
                                                            <div className="h-10 w-full bg-indigo-900 mb-2" />
                                                            <div className="p-2 space-y-2">
                                                                <div className="h-1 w-full bg-slate-200" />
                                                                <div className="flex gap-2">
                                                                    <div className="h-20 w-1/2 bg-slate-50" />
                                                                    <div className="h-20 w-1/2 bg-slate-50" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {t === 'technical' && (
                                                        <div className="flex flex-col h-full p-2 gap-2">
                                                            <div className="h-4 w-full border border-slate-100" />
                                                            <div className="grid grid-cols-2 gap-2">
                                                                {[1,2,3,4].map(i => <div key={i} className="h-8 bg-slate-50" />)}
                                                            </div>
                                                        </div>
                                                    )}
                                                    {t === 'elegant' && (
                                                        <div className="flex flex-col h-full items-center p-4">
                                                            <div className="h-1 w-1/2 bg-amber-200 mb-2" />
                                                            <div className="h-4 w-3/4 bg-slate-50 mb-6" />
                                                            <div className="w-full space-y-2">
                                                                <div className="h-1 w-full bg-slate-100" />
                                                                <div className="h-1 w-full bg-slate-100" />
                                                            </div>
                                                        </div>
                                                    )}
                                                    {t === 'compact' && (
                                                        <div className="flex flex-col h-full p-1 gap-1">
                                                            {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="h-4 w-full bg-slate-50" />)}
                                                        </div>
                                                    )}
                                                    {t === 'premium' && (
                                                        <div className="flex flex-col h-full items-center bg-slate-50 p-2">
                                                            <div className="h-20 w-full bg-white rounded-xl shadow-lg mb-4" />
                                                            <div className="h-1 w-full bg-indigo-200 mb-2" />
                                                            <div className="h-1 w-full bg-indigo-100" />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <span className={`text-[11px] font-black uppercase tracking-[0.25em] ${
                                                activeTemplate === t ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-900'
                                            }`}>{t}</span>
                                            
                                            {activeTemplate === t && (
                                                <div className="absolute top-4 right-4">
                                                    <div className="bg-indigo-600 rounded-full p-1.5 shadow-lg">
                                                        <CheckCircleIcon size={16} className="text-white" />
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
            <AnimatePresence>
                {showResultsModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => {
                                setShowResultsModal(false);
                                setAtsScore(null);
                                setSuggestions([]);
                            }}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-xl"
                        />
                        
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="relative w-full max-w-4xl bg-white rounded-[3rem] shadow-[0_30px_100px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white relative z-10">
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                                        <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-100">
                                            {atsScore ? <TrendingUp size={20} /> : <Sparkles size={20} />}
                                        </div>
                                        {atsScore ? 'Full ATS Intelligence Audit' : 'Neural Suggestion Core'}
                                    </h2>
                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1 ml-11">
                                        Powered by resumeforme AI Engine v3.0
                                    </p>
                                </div>
                                <button 
                                    onClick={() => {
                                        setShowResultsModal(false);
                                        setAtsScore(null);
                                        setSuggestions([]);
                                    }}
                                    className="p-3 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-2xl transition-all"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="p-8 overflow-y-auto custom-scrollbar bg-slate-50/30">
                                {atsScore && (
                                    <div className="space-y-10">
                                        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                                            <div className="md:col-span-2 flex flex-col items-center justify-center p-10 bg-white rounded-[2.5rem] shadow-sm border border-slate-100 relative group">
                                                <div className="absolute inset-0 bg-indigo-50/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-[2.5rem]" />
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 relative z-10">Aggregated Score</span>
                                                <div className="text-8xl font-black text-slate-900 tracking-tighter relative z-10 flex items-baseline">
                                                    {isNaN(atsScore.score) ? 0 : atsScore.score}<span className="text-2xl text-slate-300 ml-1">/100</span>
                                                </div>
                                                <div className={`mt-6 px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] shadow-sm relative z-10 ${
                                                    atsScore.verdict === 'Excellent' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                                    atsScore.verdict === 'Good' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' :
                                                    'bg-amber-50 text-amber-600 border border-amber-100'
                                                }`}>
                                                    System Verdict: {atsScore.verdict}
                                                </div>
                                            </div>

                                            <div className="md:col-span-3 space-y-5 flex flex-col justify-center">
                                                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Dimensional Performance</h3>
                                                {[
                                                    { label: 'ATS Structural Synergy', score: atsScore.detailedScores.atsCompatibility, icon: FileText },
                                                    { label: 'Neural Keyword Match', score: atsScore.detailedScores.keywordMatch, icon: Zap },
                                                    { label: 'Formatting Precision', score: atsScore.detailedScores.formatting, icon: Layout },
                                                    { label: 'Strategic Narrative Depth', score: atsScore.detailedScores.contentQuality, icon: Sparkles },
                                                    { label: 'Recruiter Psychological Impact', score: atsScore.detailedScores.recruiterAppeal, icon: Star },
                                                ].map((m, i) => (
                                                    <div key={i} className="space-y-2">
                                                        <div className="flex justify-between items-center px-1">
                                                            <div className="flex items-center gap-2">
                                                                <m.icon size={12} className="text-slate-400" />
                                                                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{m.label}</span>
                                                            </div>
                                                            <span className="text-[11px] font-black text-slate-900 tracking-tight">{isNaN(m.score) ? 0 : m.score}%</span>
                                                        </div>
                                                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                                            <motion.div 
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${isNaN(m.score) ? 0 : m.score}%` }}
                                                                transition={{ delay: 0.5 + (i * 0.1), duration: 1 }}
                                                                className={`h-full ${
                                                                    m.score > 80 ? 'bg-emerald-500' : m.score > 60 ? 'bg-indigo-500' : 'bg-amber-500'
                                                                }`}
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                            <div className="space-y-6">
                                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                                                    <span className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                                                        <ShieldCheck size={16} />
                                                    </span>
                                                    System Corrections
                                                </h3>
                                                <div className="space-y-3">
                                                    {atsScore.feedback.map((f, i) => (
                                                        <motion.div 
                                                            key={i} 
                                                            initial={{ opacity: 0, x: -10 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: 1 + (i * 0.1) }}
                                                            className="flex gap-4 text-sm text-slate-600 leading-relaxed bg-white p-5 rounded-3xl shadow-sm border border-slate-100 group hover:border-indigo-200 transition-colors"
                                                        >
                                                            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                                                            <span className="font-medium">{f}</span>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="space-y-8">
                                                <div className="space-y-6">
                                                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                                                        <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                                                            <TrendingUp size={16} />
                                                        </span>
                                                        High-Impact Pivots
                                                    </h3>
                                                    <div className="space-y-2">
                                                        {atsScore.topChanges.map((change, i) => (
                                                            <motion.div 
                                                                key={i} 
                                                                initial={{ opacity: 0, y: 10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                transition={{ delay: 1.5 + (i * 0.1) }}
                                                                className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100 text-sm text-indigo-900 font-bold flex gap-4 items-center group cursor-default"
                                                            >
                                                                <span className="bg-indigo-600 text-white w-6 h-6 rounded-lg flex items-center justify-center text-[11px] shrink-0 font-black shadow-md shadow-indigo-200">
                                                                    {i + 1}
                                                                </span>
                                                                {change}
                                                            </motion.div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {atsScore.missingKeywords.length > 0 && (
                                                    <div className="space-y-6">
                                                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                                                            <span className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center">
                                                                <Zap size={16} />
                                                            </span>
                                                            Target Keywords
                                                        </h3>
                                                        <div className="space-y-4">
                                                            {atsScore.missingKeywords.map((item, i) => (
                                                                <div key={i} className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm group hover:border-amber-200 transition-colors">
                                                                    <div className="flex items-center gap-3 mb-3">
                                                                        <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-lg text-[10px] font-black uppercase tracking-[0.1em]">
                                                                            {item.keyword}
                                                                        </span>
                                                                    </div>
                                                                    <p className="text-xs text-slate-500 leading-relaxed font-medium italic border-l-[3px] border-amber-300 pl-4 py-1">
                                                                        <span className="font-black not-italic text-slate-900 block mb-1 text-[10px] uppercase tracking-wider">Example Integration:</span>
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
                                    <div className="space-y-8">
                                        <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] relative overflow-hidden shadow-2xl">
                                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                                <Zap size={120} />
                                            </div>
                                            <div className="relative z-10 space-y-2">
                                                <h3 className="text-xl font-black tracking-tight flex items-center gap-3">
                                                    <Sparkles className="text-amber-400" size={24} /> Neural Rephrasing Log
                                                </h3>
                                                <p className="text-slate-400 text-sm max-w-xl font-medium leading-relaxed">
                                                    resumeforme Engine has intercepted your drafts and generated high-performance narratives optimized for both neural ATS scanners and human decision-makers.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 gap-6">
                                            {suggestions.map((s, i) => (
                                                <motion.div 
                                                    key={i} 
                                                    initial={{ opacity: 0, y: 30 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: i * 0.15 }}
                                                    className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm transition-all hover:shadow-xl group"
                                                >
                                                    <div className="bg-slate-50 px-8 py-4 flex items-center justify-between">
                                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Section Context: {s.section}</span>
                                                        <div className="flex gap-2">
                                                            <div className="w-2 h-2 rounded-full bg-indigo-500" />
                                                            <div className="w-2 h-2 rounded-full bg-slate-200" />
                                                        </div>
                                                    </div>
                                                    <div className="p-8 space-y-8">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                            <div className="space-y-3 opacity-40 grayscale transition-all group-hover:opacity-60 group-hover:grayscale-0">
                                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                                    <X size={14} /> Legacy Draft
                                                                </span>
                                                                <div className="text-sm text-slate-600 italic bg-slate-50 p-6 rounded-3xl border border-slate-100">
                                                                    {s.original}
                                                                </div>
                                                            </div>
                                                            <div className="space-y-3">
                                                                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2">
                                                                    <CheckCircle2 size={14} /> resumeforme Enhancement
                                                                </span>
                                                                <div className="text-sm text-slate-900 font-bold leading-relaxed bg-white p-6 rounded-3xl border-2 border-indigo-600 shadow-[0_10px_30px_rgba(79,70,229,0.1)] relative">
                                                                    <div className="absolute -top-3 -right-3 p-2 bg-indigo-600 text-white rounded-lg shadow-xl shadow-indigo-100 scale-0 group-hover:scale-100 transition-transform">
                                                                        <Zap size={12} />
                                                                    </div>
                                                                    {s.suggested}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="bg-amber-50/50 p-6 rounded-3xl border border-amber-100 flex gap-4">
                                                            <Sparkles className="text-amber-500 shrink-0 mt-1" size={18} />
                                                            <div className="space-y-1">
                                                                <p className="text-[10px] font-black text-amber-900 uppercase tracking-widest">Neural Impact Strategy</p>
                                                                <p className="text-xs text-amber-900/70 font-medium leading-relaxed italic">
                                                                    {s.reason}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <button 
                                                            onClick={() => applySuggestion(s)}
                                                            className="w-full py-5 bg-slate-900 hover:bg-black text-white rounded-2xl text-sm font-black transition-all shadow-xl group/btn overflow-hidden relative"
                                                        >
                                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                                                            Commit Strategic Enhancement
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="p-8 border-t border-slate-100 bg-white relative z-10">
                                <button 
                                    onClick={() => {
                                        setShowResultsModal(false);
                                        setAtsScore(null);
                                        setSuggestions([]);
                                    }}
                                    className="w-full py-5 bg-white border-2 border-slate-900 hover:bg-slate-50 text-slate-900 rounded-2xl font-black uppercase tracking-widest text-xs transition shadow-sm active:scale-[0.98]"
                                >
                                    Return to Strategy Workspace
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </Dashboard>
        </div>
    );
};

export default App;

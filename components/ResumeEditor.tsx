import React, { useState } from 'react';
import { ResumeData, WorkExperience, Education, Skill, Project } from '../types';
import { 
    Sparkles, 
    Plus, 
    Trash2, 
    User, 
    FileText, 
    Briefcase, 
    GraduationCap, 
    Code2, 
    Award, 
    Layers,
    ChevronDown,
    Zap
} from 'lucide-react';
import * as geminiService from '../services/geminiService';
import { enhanceField } from '../services/aiService';
import { motion, AnimatePresence } from 'motion/react';

interface EditorProps {
    data: ResumeData;
    onChange: (data: ResumeData) => void;
}

export const ResumeEditor: React.FC<EditorProps> = ({ data, onChange }) => {
    const [loadingAI, setLoadingAI] = useState<string | null>(null);

    const updatePersonal = (field: keyof ResumeData['personalInfo'], value: string) => {
        onChange({
            ...data,
            personalInfo: { ...data.personalInfo, [field]: value }
        });
    };

    const handleGenerateSummary = async () => {
        setLoadingAI('summary');
        try {
            const summary = await geminiService.generateSummary(data);
            onChange({ ...data, summary });
        } catch (e) {
            alert("Failed to generate summary. Check API Key.");
        } finally {
            setLoadingAI(null);
        }
    };

    const handleEnhanceField = async (fieldPath: string, currentContent: string, fieldName: string) => {
        if (!currentContent.trim()) return;
        setLoadingAI(fieldPath);
        try {
            const context = `Improving ${fieldName} for a ${data.experience[0]?.position || 'professional'} resume.`;
            const enhanced = await enhanceField(fieldName, currentContent, context);
            
            if (fieldPath === 'summary') {
                onChange({ ...data, summary: enhanced });
            } else if (fieldPath.startsWith('exp-')) {
                const id = fieldPath.split('-')[1];
                const newExp = data.experience.map(e => e.id === id ? { ...e, description: enhanced } : e);
                onChange({ ...data, experience: newExp });
            } else if (fieldPath.startsWith('proj-')) {
                const id = fieldPath.split('-')[1];
                const newProj = (data.projects || []).map(p => p.id === id ? { ...p, description: enhanced } : p);
                onChange({ ...data, projects: newProj });
            }
        } catch (e) {
            console.error(e);
            alert("Strategic enhancement failed. Please try again.");
        } finally {
            setLoadingAI(null);
        }
    };

    const handleEnhanceDescription = async (id: string, position: string, company: string, currentDesc: string) => {
        setLoadingAI(`desc-${id}`);
        try {
            const enhanced = await geminiService.enhanceJobDescription(position, company, currentDesc);
            const newExp = data.experience.map(e => e.id === id ? { ...e, description: enhanced } : e);
            onChange({ ...data, experience: newExp });
        } catch (e) {
            alert("Failed to enhance description.");
        } finally {
            setLoadingAI(null);
        }
    };

    const handleSuggestSkills = async () => {
        // Find most recent job title
        const title = data.experience[0]?.position;
        if (!title) {
            alert("Please add work experience first to get suggestions.");
            return;
        }

        setLoadingAI('skills');
        try {
            const suggestions = await geminiService.suggestSkills(title);
            const newSkills = [...data.skills];
            suggestions.forEach(s => {
                if (!newSkills.find(existing => existing.name === s)) {
                    newSkills.push({ id: Math.random().toString(36).substr(2, 9), name: s, level: 'Intermediate' });
                }
            });
            onChange({ ...data, skills: newSkills });
        } catch (e) {
            alert("Failed to suggest skills.");
        } finally {
            setLoadingAI(null);
        }
    };

    const addExperience = () => {
        const newExp: WorkExperience = {
            id: Math.random().toString(36).substr(2, 9),
            company: '', position: '', startDate: '', endDate: '', current: false, description: ''
        };
        onChange({ ...data, experience: [newExp, ...data.experience] });
    };

    const removeExperience = (id: string) => {
        onChange({ ...data, experience: data.experience.filter(e => e.id !== id) });
    };

    const updateExperience = (id: string, field: keyof WorkExperience, value: any) => {
        onChange({
            ...data,
            experience: data.experience.map(e => e.id === id ? { ...e, [field]: value } : e)
        });
    };

    const addEducation = () => {
        const newEdu: Education = {
            id: Math.random().toString(36).substr(2, 9),
            institution: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '', current: false
        };
        onChange({ ...data, education: [newEdu, ...data.education] });
    };

    const removeEducation = (id: string) => {
        onChange({ ...data, education: data.education.filter(e => e.id !== id) });
    };

    const updateEducation = (id: string, field: keyof Education, value: any) => {
        onChange({
            ...data,
            education: data.education.map(e => e.id === id ? { ...e, [field]: value } : e)
        });
    };

    const addSkill = () => {
        const newSkill: Skill = { id: Math.random().toString(36).substr(2, 9), name: '', category: '', level: 'Intermediate' };
        onChange({ ...data, skills: [...data.skills, newSkill] });
    };

    const removeSkill = (id: string) => {
        onChange({ ...data, skills: data.skills.filter(s => s.id !== id) });
    };

    const updateSkill = (id: string, field: keyof Skill, value: string) => {
        onChange({
            ...data,
            skills: data.skills.map(s => s.id === id ? { ...s, [field]: value } : s)
        });
    };

    const updateCertifications = (index: number, value: string) => {
        const newCerts = [...(data.certifications || [])];
        newCerts[index] = value;
        onChange({ ...data, certifications: newCerts });
    };

    const addCertification = () => {
        onChange({ ...data, certifications: [...(data.certifications || []), ''] });
    };

    const removeCertification = (index: number) => {
        const newCerts = (data.certifications || []).filter((_, i) => i !== index);
        onChange({ ...data, certifications: newCerts });
    };

    const updateProject = (id: string, field: keyof Project, value: string) => {
        onChange({
            ...data,
            projects: (data.projects || []).map(p => p.id === id ? { ...p, [field]: value } : p)
        });
    };

    const addProject = () => {
        const newProject: Project = { id: Math.random().toString(36).substr(2, 9), name: '', description: '', technologies: '' };
        onChange({ ...data, projects: [...(data.projects || []), newProject] });
    };

    const removeProject = (id: string) => {
        onChange({ ...data, projects: (data.projects || []).filter(p => p.id !== id) });
    };

    const inputClasses = "w-full p-4 bg-slate-50/50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all";
    const sectionClasses = "bg-white/80 backdrop-blur-md p-8 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 mb-8";
    const headerClasses = "text-xl font-black text-slate-900 mb-8 flex items-center gap-3 tracking-tight";

    return (
        <div className="space-y-4 pb-32 max-w-2xl mx-auto">
            {/* Personal Info */}
            <motion.section 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={sectionClasses}
            >
                <h2 className={headerClasses}>
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                        <User size={20} />
                    </div>
                    Identity
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Full Name</label>
                        <input type="text" placeholder="Leon S. Kennedy" className={inputClasses} value={data.personalInfo.fullName || ''} onChange={e => updatePersonal('fullName', e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Professional Email</label>
                        <input type="email" placeholder="leon@resula.ai" className={inputClasses} value={data.personalInfo.email || ''} onChange={e => updatePersonal('email', e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Contact Phone</label>
                        <input type="text" placeholder="+1 555-0123" className={inputClasses} value={data.personalInfo.phone || ''} onChange={e => updatePersonal('phone', e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Global Location</label>
                        <input type="text" placeholder="Raccoon City" className={inputClasses} value={data.personalInfo.location || ''} onChange={e => updatePersonal('location', e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Professional Network (LinkedIn)</label>
                        <input type="text" placeholder="linkedin.com/in/..." className={inputClasses} value={data.personalInfo.linkedin || ''} onChange={e => updatePersonal('linkedin', e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Portfolio / Website</label>
                        <input type="text" placeholder="resula.ai" className={inputClasses} value={data.personalInfo.website || ''} onChange={e => updatePersonal('website', e.target.value)} />
                    </div>
                </div>
            </motion.section>

            {/* Summary */}
            <motion.section 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className={sectionClasses}
            >
                <div className="flex justify-between items-center mb-8">
                    <h2 className={headerClasses}>
                        <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                            <FileText size={20} />
                        </div>
                        Executive Summary
                    </h2>
                    <div className="flex gap-2">
                        <button
                            onClick={handleGenerateSummary}
                            disabled={loadingAI === 'summary'}
                            className="btn-elegant !text-[10px] !px-3 !py-2 bg-purple-50 text-purple-700 border-purple-100 hover:bg-purple-100 disabled:opacity-50"
                        >
                            <Zap size={14} className={loadingAI === 'summary' ? 'animate-pulse' : ''} />
                            {loadingAI === 'summary' ? 'Cognitive drafting...' : 'Auto-Draft'}
                        </button>
                    </div>
                </div>
                <div className="relative">
                    <textarea
                        className={`${inputClasses} h-40 resize-none leading-relaxed p-6`}
                        placeholder="Define your professional narrative..."
                        value={data.summary || ''}
                        onChange={e => onChange({ ...data, summary: e.target.value })}
                    />
                    <div className="absolute top-4 right-4 group">
                        <button
                            onClick={() => handleEnhanceField('summary', data.summary || '', 'summary')}
                            disabled={loadingAI === 'summary' || !data.summary}
                            className="p-2 text-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all disabled:opacity-30"
                            title="Strategic Polish"
                        >
                            <Sparkles size={20} className={loadingAI === 'summary' ? 'animate-spin' : ''} />
                        </button>
                    </div>
                </div>
            </motion.section>

            {/* Experience */}
            <motion.section 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className={sectionClasses}
            >
                <div className="flex justify-between items-center mb-8">
                    <h2 className={headerClasses}>
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                            <Briefcase size={20} />
                        </div>
                        Career Trajectory
                    </h2>
                    <button onClick={addExperience} className="p-2.5 bg-slate-900 text-white rounded-xl hover:bg-black transition-all hover:scale-105 active:scale-95 shadow-lg shadow-black/10">
                        <Plus size={18} />
                    </button>
                </div>
                <div className="space-y-8">
                    <AnimatePresence initial={false}>
                        {data.experience.map(exp => (
                            <motion.div 
                                key={exp.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="group relative bg-slate-50/50 p-6 rounded-3xl border border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-slate-100 transition-all border-dashed hover:border-solid hover:border-slate-200"
                            >
                                <button onClick={() => removeExperience(exp.id)} className="absolute -top-3 -right-3 p-2 bg-white text-slate-300 hover:text-red-500 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all border border-slate-100 hover:scale-110">
                                    <Trash2 size={16} />
                                </button>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <input placeholder="Job Title" className={inputClasses} value={exp.position || ''} onChange={e => updateExperience(exp.id, 'position', e.target.value)} />
                                    <input placeholder="Project/Company" className={inputClasses} value={exp.company || ''} onChange={e => updateExperience(exp.id, 'company', e.target.value)} />
                                    <input type="text" placeholder="Launch Date" className={inputClasses} value={exp.startDate || ''} onChange={e => updateExperience(exp.id, 'startDate', e.target.value)} />
                                    <div className="flex items-center gap-3">
                                         <input type="text" placeholder="Sunset Date" disabled={exp.current} className={`${inputClasses} flex-1`} value={exp.endDate || ''} onChange={e => updateExperience(exp.id, 'endDate', e.target.value)} />
                                         <label className="flex items-center gap-2 text-[10px] uppercase font-black tracking-widest text-slate-400 whitespace-nowrap px-3 py-4 bg-white rounded-2xl border border-slate-100 shadow-sm cursor-pointer hover:bg-slate-50 transition-colors">
                                            <input type="checkbox" className="w-4 h-4 rounded-md border-slate-300 text-indigo-600 focus:ring-indigo-500" checked={exp.current || false} onChange={e => updateExperience(exp.id, 'current', e.target.checked)} /> 
                                            Present
                                         </label>
                                    </div>
                                </div>
                                <div className="relative">
                                    <textarea
                                        placeholder="Articulate your impact and achievements..."
                                        className={`${inputClasses} h-32 resize-none bg-white`}
                                        value={exp.description || ''}
                                        onChange={e => updateExperience(exp.id, 'description', e.target.value)}
                                    />
                                    <div className="absolute bottom-4 right-4">
                                        <button
                                            onClick={() => handleEnhanceField(`exp-${exp.id}`, exp.description, 'job description')}
                                            disabled={loadingAI === `exp-${exp.id}` || !exp.description}
                                            className="btn-elegant !text-[9px] !px-3 !py-2 bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100 disabled:opacity-50 shadow-sm"
                                        >
                                            <Sparkles size={12} className={loadingAI === `exp-${exp.id}` ? 'animate-spin' : ''} />
                                            {loadingAI === `exp-${exp.id}` ? 'Synthesizing...' : 'Neural Optimize'}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {data.experience.length === 0 && (
                        <div className="py-12 border-2 border-dashed border-slate-100 rounded-[2rem] flex flex-col items-center justify-center text-slate-400 space-y-4">
                            <Briefcase size={40} className="opacity-20" />
                            <p className="font-medium text-sm">Add your professional milestone.</p>
                        </div>
                    )}
                </div>
            </motion.section>

            {/* Education */}
            <motion.section 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className={sectionClasses}
            >
                <div className="flex justify-between items-center mb-8">
                    <h2 className={headerClasses}>
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                            <GraduationCap size={20} />
                        </div>
                        Academic Proof
                    </h2>
                    <button onClick={addEducation} className="p-2.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-all active:scale-95 border border-slate-200 shadow-sm">
                        <Plus size={18} />
                    </button>
                </div>
                <div className="space-y-6">
                    <AnimatePresence initial={false}>
                        {data.education.map(edu => (
                            <motion.div 
                                key={edu.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="group relative p-6 rounded-3xl border border-slate-100 bg-slate-50/30 hover:bg-white hover:shadow-xl hover:shadow-slate-100 transition-all"
                            >
                                <button onClick={() => removeEducation(edu.id)} className="absolute -top-3 -right-3 p-2 bg-white text-slate-300 hover:text-red-500 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all border border-slate-100">
                                    <Trash2 size={16} />
                                </button>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input placeholder="University/Institute" className={inputClasses} value={edu.institution || ''} onChange={e => updateEducation(edu.id, 'institution', e.target.value)} />
                                    <input placeholder="Degree (BSc, MBA...)" className={inputClasses} value={edu.degree || ''} onChange={e => updateEducation(edu.id, 'degree', e.target.value)} />
                                    <div className="md:col-span-2">
                                        <input placeholder="Thesis / Major specialization" className={inputClasses} value={edu.fieldOfStudy || ''} onChange={e => updateEducation(edu.id, 'fieldOfStudy', e.target.value)} />
                                    </div>
                                    <input placeholder="Initiation Year" className={inputClasses} value={edu.startDate || ''} onChange={e => updateEducation(edu.id, 'startDate', e.target.value)} />
                                    <input placeholder="Completion Year" className={inputClasses} value={edu.endDate || ''} onChange={e => updateEducation(edu.id, 'endDate', e.target.value)} />
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </motion.section>

             {/* Skills */}
             <motion.section 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className={sectionClasses}
            >
                <div className="flex justify-between items-center mb-8">
                    <h2 className={headerClasses}>
                        <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                            <Code2 size={20} />
                        </div>
                        Cognitive Stack
                    </h2>
                    <div className="flex gap-2">
                        <button
                            onClick={handleSuggestSkills}
                            disabled={loadingAI === 'skills'}
                            className="btn-elegant !text-[10px] !px-3 !py-2 bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-100 disabled:opacity-50"
                        >
                            <Sparkles size={14} className={loadingAI === 'skills' ? 'animate-pulse' : ''} />
                            {loadingAI === 'skills' ? 'Discovery phase...' : 'Neural Discovery'}
                        </button>
                        <button onClick={addSkill} className="p-2.5 bg-slate-900 text-white rounded-xl hover:bg-black transition-all shadow-lg active:scale-95">
                            <Plus size={18} />
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-4">
                    <AnimatePresence initial={false}>
                        {data.skills.map(skill => (
                            <motion.div 
                                key={skill.id}
                                layout
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                className="flex gap-4 p-4 rounded-[1.5rem] bg-slate-50/50 border border-slate-100 group relative"
                            >
                                <input
                                    className="flex-1 bg-transparent border-none p-2 text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:ring-0 outline-none"
                                    value={skill.category || ''}
                                    onChange={e => updateSkill(skill.id, 'category', e.target.value)}
                                    placeholder="Domain (e.g. Logic)"
                                />
                                <div className="w-px h-6 bg-slate-200 self-center"></div>
                                <input
                                    className="flex-[2] bg-transparent border-none p-2 text-sm font-medium text-slate-600 placeholder:text-slate-400 focus:ring-0 outline-none"
                                    value={skill.name || ''}
                                    onChange={e => updateSkill(skill.id, 'name', e.target.value)}
                                    placeholder="Specifics (e.g. React, Systems Design)"
                                />
                                <button onClick={() => removeSkill(skill.id)} className="p-2 text-slate-300 hover:text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                                    <Trash2 size={14} />
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </motion.section>

             {/* Certifications */}
             <motion.section 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className={sectionClasses}
            >
                <div className="flex justify-between items-center mb-8">
                    <h2 className={headerClasses}>
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                            <Award size={20} />
                        </div>
                        Verifications
                    </h2>
                    <button onClick={addCertification} className="p-2.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-all border border-slate-200 active:scale-95">
                        <Plus size={18} />
                    </button>
                </div>
                <div className="grid grid-cols-1 gap-3">
                    <AnimatePresence initial={false}>
                        {(data.certifications || []).map((cert, index) => (
                            <motion.div 
                                key={index}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="flex items-center gap-3 group bg-white/50 border border-slate-100 rounded-2xl p-2 px-4 shadow-sm hover:shadow-md transition-all"
                            >
                                <Award size={16} className="text-slate-400" />
                                <input
                                    className="flex-1 bg-transparent border-none p-2 text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:ring-0 outline-none"
                                    value={cert || ''}
                                    onChange={e => updateCertifications(index, e.target.value)}
                                    placeholder="Certification, Award or Honor"
                                />
                                <button onClick={() => removeCertification(index)} className="p-2 text-slate-300 hover:text-red-500 transition-all">
                                    <Trash2 size={16} />
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </motion.section>

            {/* Projects */}
            <motion.section 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className={sectionClasses}
            >
                <div className="flex justify-between items-center mb-8">
                    <h2 className={headerClasses}>
                        <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
                            <Layers size={20} />
                        </div>
                        Product & Research
                    </h2>
                    <button onClick={addProject} className="p-2.5 bg-slate-900 text-white rounded-xl hover:bg-black transition-all shadow-lg active:scale-95">
                        <Plus size={18} />
                    </button>
                </div>
                <div className="space-y-8">
                    <AnimatePresence initial={false}>
                        {(data.projects || []).map(project => (
                            <motion.div 
                                key={project.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="p-8 rounded-[2.5rem] bg-slate-50/50 border border-slate-100 relative group transition-all hover:bg-white hover:shadow-xl hover:shadow-slate-100 pb-10"
                            >
                                <button onClick={() => removeProject(project.id)} className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100">
                                    <Trash2 size={20} />
                                </button>
                                <div className="space-y-5">
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-4">Initiative Name</label>
                                        <input 
                                            className={inputClasses} 
                                            value={project.name || ''} 
                                            onChange={e => updateProject(project.id, 'name', e.target.value)} 
                                            placeholder="Neural Network Optimizer"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-4">Technology Stack</label>
                                        <input 
                                            className={inputClasses} 
                                            value={project.technologies || ''} 
                                            onChange={e => updateProject(project.id, 'technologies', e.target.value)} 
                                            placeholder="React, Tensorflow, Rust"
                                        />
                                    </div>
                                    <div className="space-y-1.5 relative">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-4">System Narrative</label>
                                        <textarea 
                                            className={`${inputClasses} h-24 resize-none bg-white p-5`}
                                            value={project.description || ''} 
                                            onChange={e => updateProject(project.id, 'description', e.target.value)} 
                                            placeholder="Describe the problem, solution and quantitative impact..."
                                        />
                                        <button
                                            onClick={() => handleEnhanceField(`proj-${project.id}`, project.description, 'project description')}
                                            disabled={loadingAI === `proj-${project.id}` || !project.description}
                                            className="absolute bottom-5 right-5 p-2 text-indigo-400 hover:text-indigo-600 transition-all disabled:opacity-30"
                                            title="AI Enhancement"
                                        >
                                            <Sparkles size={18} className={loadingAI === `proj-${project.id}` ? 'animate-spin' : ''} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </motion.section>
        </div>
    );
};

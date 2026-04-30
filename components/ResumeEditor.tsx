import React, { useState } from 'react';
import { ResumeData, WorkExperience, Education, Skill, Project } from '../types';
import { SparklesIcon, PlusIcon, TrashIcon } from './ui/Icons';
import * as geminiService from '../services/geminiService';
import { enhanceField } from '../services/aiService';

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

    return (
        <div className="space-y-6 pb-20">
            {/* Personal Info */}
            <section className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Personal Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" placeholder="Full Name" className="p-2 border rounded" value={data.personalInfo.fullName || ''} onChange={e => updatePersonal('fullName', e.target.value)} />
                    <input type="email" placeholder="Email" className="p-2 border rounded" value={data.personalInfo.email || ''} onChange={e => updatePersonal('email', e.target.value)} />
                    <input type="text" placeholder="Phone" className="p-2 border rounded" value={data.personalInfo.phone || ''} onChange={e => updatePersonal('phone', e.target.value)} />
                    <input type="text" placeholder="Location (City, Country)" className="p-2 border rounded" value={data.personalInfo.location || ''} onChange={e => updatePersonal('location', e.target.value)} />
                    <input type="text" placeholder="LinkedIn URL" className="p-2 border rounded" value={data.personalInfo.linkedin || ''} onChange={e => updatePersonal('linkedin', e.target.value)} />
                    <input type="text" placeholder="Website" className="p-2 border rounded" value={data.personalInfo.website || ''} onChange={e => updatePersonal('website', e.target.value)} />
                </div>
            </section>

            {/* Summary */}
            <section className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-gray-800">Professional Summary</h2>
                    <div className="flex gap-2">
                        <button
                            onClick={handleGenerateSummary}
                            disabled={loadingAI === 'summary'}
                            className="flex items-center gap-2 text-[10px] uppercase font-black tracking-widest bg-purple-100 text-purple-700 px-3 py-1.5 rounded-lg hover:bg-purple-200 transition disabled:opacity-50"
                        >
                            <SparklesIcon className="w-3 h-3" />
                            {loadingAI === 'summary' ? 'Writing...' : 'Auto-Write'}
                        </button>
                        <button
                            onClick={() => handleEnhanceField('summary', data.summary || '', 'summary')}
                            disabled={loadingAI === 'summary' || !data.summary}
                            className="flex items-center gap-2 text-[10px] uppercase font-black tracking-widest bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-lg hover:bg-indigo-200 transition disabled:opacity-50"
                        >
                            <SparklesIcon className="w-3 h-3" />
                            {loadingAI === 'summary' ? 'Refining...' : 'Refine'}
                        </button>
                    </div>
                </div>
                <textarea
                    className="w-full p-3 border rounded h-32 text-sm leading-relaxed"
                    placeholder="Briefly describe your professional background..."
                    value={data.summary || ''}
                    onChange={e => onChange({ ...data, summary: e.target.value })}
                />
            </section>

            {/* Experience */}
            <section className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-gray-800">Experience</h2>
                    <button onClick={addExperience} className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium">
                        <PlusIcon className="w-4 h-4" /> Add Job
                    </button>
                </div>
                <div className="space-y-6">
                    {data.experience.map(exp => (
                        <div key={exp.id} className="border border-gray-100 p-4 rounded-lg bg-gray-50 relative group">
                            <button onClick={() => removeExperience(exp.id)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition">
                                <TrashIcon className="w-5 h-5" />
                            </button>
                            <div className="grid grid-cols-2 gap-3 mb-3">
                                <input placeholder="Job Title" className="p-2 border rounded text-sm font-medium" value={exp.position || ''} onChange={e => updateExperience(exp.id, 'position', e.target.value)} />
                                <input placeholder="Company" className="p-2 border rounded text-sm" value={exp.company || ''} onChange={e => updateExperience(exp.id, 'company', e.target.value)} />
                                <input type="text" placeholder="Start Date" className="p-2 border rounded text-sm" value={exp.startDate || ''} onChange={e => updateExperience(exp.id, 'startDate', e.target.value)} />
                                <div className="flex items-center gap-2">
                                     <input type="text" placeholder="End Date" disabled={exp.current} className="p-2 border rounded text-sm w-full" value={exp.endDate || ''} onChange={e => updateExperience(exp.id, 'endDate', e.target.value)} />
                                     <label className="flex items-center gap-1 text-xs whitespace-nowrap">
                                        <input type="checkbox" checked={exp.current || false} onChange={e => updateExperience(exp.id, 'current', e.target.checked)} /> Current
                                     </label>
                                </div>
                            </div>
                            <div className="relative">
                                <textarea
                                    placeholder="Describe your responsibilities and achievements..."
                                    className="w-full p-3 border border-slate-200 rounded-xl text-sm h-32 focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={exp.description || ''}
                                    onChange={e => updateExperience(exp.id, 'description', e.target.value)}
                                />
                                <div className="absolute bottom-2 right-2 flex gap-2">
                                    <button
                                        onClick={() => handleEnhanceField(`exp-${exp.id}`, exp.description, 'job description')}
                                        disabled={loadingAI === `exp-${exp.id}` || !exp.description}
                                        className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-700 px-2 py-1 rounded-lg hover:bg-emerald-200 transition disabled:opacity-50"
                                    >
                                        <SparklesIcon className="w-3 h-3" />
                                        {loadingAI === `exp-${exp.id}` ? 'Strategic Rewrite...' : 'Optimize'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Education */}
            <section className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-gray-800">Education</h2>
                    <button onClick={addEducation} className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium">
                        <PlusIcon className="w-4 h-4" /> Add School
                    </button>
                </div>
                <div className="space-y-4">
                    {data.education.map(edu => (
                        <div key={edu.id} className="border border-gray-100 p-4 rounded-lg bg-gray-50 relative group">
                            <button onClick={() => removeEducation(edu.id)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition">
                                <TrashIcon className="w-5 h-5" />
                            </button>
                            <div className="grid grid-cols-2 gap-3">
                                <input placeholder="School/University" className="p-2 border rounded text-sm" value={edu.institution || ''} onChange={e => updateEducation(edu.id, 'institution', e.target.value)} />
                                <input placeholder="Degree (e.g. BS, MA)" className="p-2 border rounded text-sm" value={edu.degree || ''} onChange={e => updateEducation(edu.id, 'degree', e.target.value)} />
                                <input placeholder="Field of Study" className="p-2 border rounded text-sm col-span-2" value={edu.fieldOfStudy || ''} onChange={e => updateEducation(edu.id, 'fieldOfStudy', e.target.value)} />
                                <input placeholder="Start Year" className="p-2 border rounded text-sm" value={edu.startDate || ''} onChange={e => updateEducation(edu.id, 'startDate', e.target.value)} />
                                <input placeholder="End Year" className="p-2 border rounded text-sm" value={edu.endDate || ''} onChange={e => updateEducation(edu.id, 'endDate', e.target.value)} />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

             {/* Skills */}
             <section className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-gray-800">Skills</h2>
                    <div className="flex gap-2">
                        <button
                            onClick={handleSuggestSkills}
                            disabled={loadingAI === 'skills'}
                            className="flex items-center gap-1 text-xs bg-purple-100 text-purple-700 px-2 py-1.5 rounded hover:bg-purple-200 transition disabled:opacity-50"
                        >
                            <SparklesIcon className="w-3 h-3" /> AI Suggest
                        </button>
                        <button onClick={addSkill} className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium">
                            <PlusIcon className="w-4 h-4" /> Add
                        </button>
                    </div>
                </div>
                <div className="space-y-3">
                    {data.skills.map(skill => (
                        <div key={skill.id} className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-gray-50 border rounded p-3 relative group">
                            <button onClick={() => removeSkill(skill.id)} className="absolute -top-2 -right-2 bg-white border rounded-full p-1 text-gray-400 hover:text-red-500 shadow-sm opacity-0 group-hover:opacity-100 transition">
                                <TrashIcon className="w-3 h-3" />
                            </button>
                            <input
                                className="p-2 border rounded text-xs outline-none focus:ring-1 focus:ring-blue-500"
                                value={skill.category || ''}
                                onChange={e => updateSkill(skill.id, 'category', e.target.value)}
                                placeholder="Category (e.g. Languages)"
                            />
                            <input
                                className="p-2 border rounded text-xs outline-none focus:ring-1 focus:ring-blue-500"
                                value={skill.name || ''}
                                onChange={e => updateSkill(skill.id, 'name', e.target.value)}
                                placeholder="Skills (e.g. Java, Python)"
                            />
                        </div>
                    ))}
                </div>
            </section>

             {/* Certifications */}
             <section className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-gray-800">Certifications</h2>
                    <button onClick={addCertification} className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium">
                        <PlusIcon className="w-4 h-4" /> Add
                    </button>
                </div>
                <div className="space-y-2">
                    {(data.certifications || []).map((cert, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <input
                                className="flex-1 p-2 border rounded text-sm outline-none focus:ring-1 focus:ring-blue-500"
                                value={cert || ''}
                                onChange={e => updateCertifications(index, e.target.value)}
                                placeholder="Certification name"
                            />
                            <button onClick={() => removeCertification(index)} className="text-gray-400 hover:text-red-500">
                                <TrashIcon className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Projects */}
            <section className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-gray-800">Projects</h2>
                    <button onClick={addProject} className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium">
                        <PlusIcon className="w-4 h-4" /> Add
                    </button>
                </div>
                <div className="space-y-4">
                    {(data.projects || []).map(project => (
                        <div key={project.id} className="p-4 bg-gray-50 border rounded-lg relative group">
                            <button onClick={() => removeProject(project.id)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition">
                                <TrashIcon className="w-4 h-4" />
                            </button>
                            <div className="grid grid-cols-1 gap-3">
                                <input 
                                    className="p-2 border rounded text-sm font-bold w-full" 
                                    value={project.name || ''} 
                                    onChange={e => updateProject(project.id, 'name', e.target.value)} 
                                    placeholder="Project Title"
                                />
                                <input 
                                    className="p-2 border rounded text-xs w-full" 
                                    value={project.technologies || ''} 
                                    onChange={e => updateProject(project.id, 'technologies', e.target.value)} 
                                    placeholder="Technologies (e.g. React, Node.js)"
                                />
                                 <div className="relative">
                                    <textarea 
                                        className="p-3 border border-slate-200 rounded-xl text-sm w-full h-24 focus:ring-2 focus:ring-blue-500 outline-none" 
                                        value={project.description || ''} 
                                        onChange={e => updateProject(project.id, 'description', e.target.value)} 
                                        placeholder="Project description..."
                                    />
                                    <button
                                        onClick={() => handleEnhanceField(`proj-${project.id}`, project.description, 'project description')}
                                        disabled={loadingAI === `proj-${project.id}` || !project.description}
                                        className="absolute bottom-2 right-2 flex items-center gap-1 text-[10px] font-black uppercase tracking-widest bg-indigo-100 text-indigo-700 px-2 py-1 rounded-lg hover:bg-indigo-200 transition disabled:opacity-50"
                                    >
                                        <SparklesIcon className="w-3 h-3" />
                                        {loadingAI === `proj-${project.id}` ? 'Improving...' : 'AI Enhance'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

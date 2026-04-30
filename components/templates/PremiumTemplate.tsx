import React from 'react';
import { TemplateProps } from '../../types';

export const PremiumTemplate: React.FC<TemplateProps> = ({ data }) => {
    return (
        <div className="w-full min-h-full bg-slate-100 p-12 font-sans overflow-hidden">
            <div className="bg-white shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] min-h-full rounded-sm flex flex-col md:flex-row relative">
                {/* Visual Accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400 opacity-20 rounded-bl-full"></div>
                
                {/* Left Sidebar */}
                <div className="w-full md:w-[350px] bg-slate-900 p-12 text-white flex flex-col gap-10 z-10">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tighter leading-none mb-6">
                            {data.personalInfo.fullName.split(' ').map((n, i) => (
                                <span key={i} className={`block ${i === 0 ? 'text-amber-400' : 'text-slate-100'}`}>{n}</span>
                            ))}
                        </h1>
                        <div className="flex flex-col gap-4 text-xs font-medium text-slate-400">
                            <div className="flex items-center gap-3">
                                <span className="h-6 w-6 rounded-full bg-slate-800 flex items-center justify-center text-amber-400 italic font-serif leading-none">@</span>
                                <span className="break-all">{data.personalInfo.email}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="h-6 w-6 rounded-full bg-slate-800 flex items-center justify-center text-amber-400 text-[10px]">📞</span>
                                <span>{data.personalInfo.phone}</span>
                            </div>
                        </div>
                    </div>

                    {data.skills.length > 0 && (
                        <div className="space-y-6">
                            <h2 className="text-[10px] uppercase font-black tracking-[0.3em] text-slate-500 flex items-center gap-3">
                                CORE_ASSETS <span className="flex-1 h-px bg-slate-800"></span>
                            </h2>
                            <div className="space-y-5">
                                {data.skills.map(skill => (
                                    <div key={skill.id}>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-xs font-bold tracking-wide">{skill.name}</span>
                                            <span className="text-[8px] uppercase tracking-widest text-amber-400 font-black">{skill.level}</span>
                                        </div>
                                        <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-gradient-to-r from-amber-600 to-amber-300"
                                                style={{ width: skill.level === 'Expert' ? '100%' : skill.level === 'Intermediate' ? '70%' : '40%' }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {data.education.length > 0 && (
                        <div className="space-y-6 mt-auto">
                            <h2 className="text-[10px] uppercase font-black tracking-[0.3em] text-slate-500 flex items-center gap-3">
                                BACKGROUND <span className="flex-1 h-px bg-slate-800"></span>
                            </h2>
                            {data.education.map(edu => (
                                <div key={edu.id} className="border-l-2 border-amber-400 pl-4 py-1">
                                    <div className="text-xs font-bold">{edu.institution}</div>
                                    <div className="text-[10px] text-slate-400 italic mt-1">{edu.degree}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Main Section */}
                <div className="flex-1 p-16 flex flex-col gap-12 bg-white relative">
                    {data.summary && (
                        <section>
                            <h2 className="text-[10px] uppercase font-black tracking-[0.3em] text-amber-500 mb-6 font-mono tracking-tighter">/ Profile_Digest</h2>
                            <p className="text-xl font-medium text-slate-800 leading-tight tracking-tight">
                                {data.summary}
                            </p>
                        </section>
                    )}

                    {data.experience.length > 0 && (
                        <section>
                            <h2 className="text-[10px] uppercase font-black tracking-[0.3em] text-amber-500 mb-8 font-mono tracking-tighter">/ Career_Velocity</h2>
                            <div className="space-y-12">
                                {data.experience.map(exp => (
                                    <div key={exp.id} className="relative group">
                                        <div className="flex justify-between items-baseline mb-2">
                                            <h3 className="text-2xl font-black text-slate-900 group-hover:text-amber-600 transition-colors uppercase tracking-tighter">{exp.position}</h3>
                                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{exp.startDate} - {exp.current ? 'NOW' : exp.endDate}</span>
                                        </div>
                                        <div className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4">{exp.company}</div>
                                        <div className="text-md text-slate-600 leading-relaxed max-w-2xl whitespace-pre-line font-medium border-l border-slate-100 pl-8">
                                            {exp.description}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {data.projects && data.projects.length > 0 && (
                        <section>
                            <h2 className="text-[10px] uppercase font-black tracking-[0.3em] text-amber-500 mb-8 font-mono tracking-tighter">/ Project_Portfolio</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {data.projects.map(project => (
                                    <div key={project.id} className="border border-slate-100 p-6 rounded-lg hover:border-amber-200 transition-all cursor-default">
                                        <h4 className="font-black text-lg text-slate-900 mb-2 uppercase tracking-tighter">{project.name}</h4>
                                        <p className="text-sm text-slate-500 leading-relaxed font-medium mb-4">{project.description}</p>
                                        {project.technologies && <div className="text-[10px] font-black text-amber-600 uppercase tracking-widest">{project.technologies}</div>}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
};

import React from 'react';
import { TemplateProps } from '../../types';

export const ExecutiveTemplate: React.FC<TemplateProps> = ({ data }) => {
    return (
        <div className="w-full min-h-full bg-slate-50 p-16 text-slate-900 font-serif shadow-inner">
            <div className="max-w-4xl mx-auto bg-white p-12 shadow-xl border-t-8 border-slate-800">
                <header className="mb-10 text-center border-b border-slate-100 pb-10">
                    <h1 className="text-5xl font-light tracking-[0.2em] uppercase mb-4">{data.personalInfo.fullName}</h1>
                    <div className="font-sans text-xs tracking-[0.3em] uppercase text-slate-500 space-x-4">
                        <span>{data.personalInfo.email}</span>
                        <span>•</span>
                        <span>{data.personalInfo.phone}</span>
                        <span>•</span>
                        <span>{data.personalInfo.location}</span>
                    </div>
                </header>

                <div className="space-y-12">
                    {data.summary && (
                        <section className="relative">
                            <div className="absolute -left-6 top-0 bottom-0 w-1 bg-slate-800"></div>
                            <h2 className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-4 ml-2">Executive Summary</h2>
                            <p className="text-lg leading-relaxed italic text-slate-700 ml-2">
                                {data.summary}
                            </p>
                        </section>
                    )}

                    {data.experience.length > 0 && (
                        <section>
                            <h2 className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-8 text-center border-y border-slate-100 py-2">Professional Experience</h2>
                            <div className="space-y-10">
                                {data.experience.map(exp => (
                                    <div key={exp.id} className="group print:break-inside-avoid">
                                        <div className="flex justify-between items-baseline mb-2">
                                            <h3 className="text-xl font-bold tracking-tight">{exp.position}</h3>
                                            <span className="font-sans text-xs uppercase tracking-widest text-slate-400 font-medium whitespace-nowrap">
                                                {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                                            </span>
                                        </div>
                                        <div className="font-sans text-sm font-bold text-slate-600 mb-4">{exp.company}</div>
                                        <div className="text-md text-slate-600 leading-relaxed space-y-2 whitespace-pre-line">
                                            {exp.description}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {data.projects && data.projects.length > 0 && (
                        <section>
                            <h2 className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-8 text-center border-y border-slate-100 py-2">Selective Initiatives</h2>
                            <div className="space-y-10">
                                {data.projects.map(project => (
                                    <div key={project.id} className="group print:break-inside-avoid">
                                        <div className="flex justify-between items-baseline mb-2">
                                            <h3 className="text-xl font-bold tracking-tight">{project.name}</h3>
                                            {project.technologies && <span className="font-sans text-[10px] uppercase tracking-widest text-slate-400 font-medium whitespace-nowrap">{project.technologies}</span>}
                                        </div>
                                        <p className="text-md text-slate-600 leading-relaxed italic">{project.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    <div className="grid grid-cols-2 gap-16 border-t border-slate-100 pt-10">
                        <div className="space-y-12">
                            {data.skills.length > 0 && (
                                <section>
                                    <h2 className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-6">Strategic Skills</h2>
                                    <div className="grid grid-cols-1 gap-y-3">
                                        {data.skills.map(skill => (
                                            <div key={skill.id} className="flex justify-between items-center text-sm print:break-inside-avoid">
                                                <span className="text-slate-700 font-medium">{skill.name}</span>
                                                <span className="h-2 w-2 rounded-full bg-slate-800"></span>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {data.certifications && data.certifications.length > 0 && (
                                <section>
                                    <h2 className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-6">Certifications</h2>
                                    <div className="space-y-4">
                                        {data.certifications.map(cert => (
                                            <div key={cert.id} className="print:break-inside-avoid">
                                                <div className="text-sm font-bold text-slate-900 leading-tight">{cert.name}</div>
                                                <div className="text-xs text-slate-500 italic mt-0.5">{cert.issuer} {cert.date && `• ${cert.date}`}</div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>

                        <div className="space-y-12">
                            {data.education.length > 0 && (
                                <section>
                                    <h2 className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-6">Education</h2>
                                    <div className="space-y-6">
                                        {data.education.map(edu => (
                                            <div key={edu.id} className="print:break-inside-avoid">
                                                <h3 className="text-lg font-bold">{edu.institution}</h3>
                                                <div className="text-sm italic text-slate-600">{edu.degree} in {edu.fieldOfStudy}</div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

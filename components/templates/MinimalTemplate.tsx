import React from 'react';
import { TemplateProps } from '../../types';

export const MinimalTemplate: React.FC<TemplateProps> = ({ data }) => {
    return (
        <div className="w-full min-h-full bg-white p-10 text-slate-800 font-sans">
            {/* Header */}
            <div className="mb-10">
                <h1 className="text-4xl font-light tracking-tight mb-2 text-slate-900">{data.personalInfo.fullName}</h1>
                <div className="text-sm text-slate-500 space-y-1">
                    <div className="flex gap-4">
                         {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
                         {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
                    </div>
                    <div className="flex gap-4">
                        {data.personalInfo.location && <span>{data.personalInfo.location}</span>}
                        {data.personalInfo.website && <span>Portfolio Site: {data.personalInfo.website}</span>}
                        {data.personalInfo.linkedin && <span>{data.personalInfo.linkedin}</span>}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-4 gap-8">
                {/* Left Column (Main) */}
                <div className="col-span-3 space-y-8">
                    {/* Summary */}
                    {data.summary && (
                        <section>
                            <p className="text-md leading-relaxed text-slate-700">
                                {data.summary}
                            </p>
                        </section>
                    )}

                    {/* Experience */}
                    {data.experience.length > 0 && (
                        <section>
                            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Experience</h3>
                            <div className="space-y-8">
                                {data.experience.map(exp => (
                                    <div key={exp.id} className="relative pl-4 border-l-2 border-slate-100">
                                        <div className="mb-2">
                                            <h4 className="font-bold text-slate-800">{exp.position}</h4>
                                            <div className="text-sm text-slate-500">{exp.company}</div>
                                        </div>
                                        <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                                            {exp.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Projects */}
                    {data.projects && data.projects.length > 0 && (
                        <section>
                            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Projects</h3>
                            <div className="space-y-6">
                                {data.projects.map(project => (
                                    <div key={project.id} className="relative pl-4 border-l-2 border-slate-100">
                                        <div className="mb-2">
                                            <h4 className="font-bold text-slate-800">{project.name}</h4>
                                            {project.technologies && <div className="text-xs text-slate-500 italic mt-0.5">{project.technologies}</div>}
                                        </div>
                                        <p className="text-sm text-slate-600 leading-relaxed">
                                            {project.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Publications */}
                    {data.publications && data.publications.length > 0 && (
                        <section>
                            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Publications</h3>
                            <div className="space-y-4">
                                {data.publications.map((pub, idx) => (
                                    <div key={idx} className="relative pl-4 border-l-2 border-slate-100 italic text-sm text-slate-600 leading-relaxed">
                                        {pub}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* Right Column (Meta) */}
                <div className="col-span-1 space-y-8">
                    {/* Education */}
                    {data.education.length > 0 && (
                        <section>
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Education</h3>
                            <div className="space-y-4">
                                {data.education.map(edu => (
                                    <div key={edu.id}>
                                        <div className="font-medium text-sm">{edu.degree}</div>
                                        <div className="text-xs text-slate-500 mb-1">{edu.institution}</div>
                                        <div className="text-xs text-slate-400">
                                            {edu.startDate.slice(0, 4)} - {edu.current ? 'Now' : edu.endDate.slice(0, 4)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Skills */}
                    {data.skills.length > 0 && (
                        <section>
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Skills</h3>
                            <div className="space-y-4">
                                {Array.from(new Set(data.skills.map(s => s.category || 'Other'))).map(category => (
                                    <div key={category}>
                                        <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-1 tracking-tighter">{category}</h4>
                                        <ul className="space-y-1">
                                            {data.skills
                                                .filter(s => (s.category || 'Other') === category)
                                                .map(skill => (
                                                    <li key={skill.id} className="text-xs text-slate-700 border-b border-slate-50 pb-0.5">
                                                        {skill.name}
                                                    </li>
                                                ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                    {/* Certifications */}
                    {data.certifications && data.certifications.length > 0 && (
                        <section>
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Certifications</h3>
                            <ul className="space-y-2">
                                {data.certifications.map((cert, idx) => (
                                    <li key={idx} className="text-xs text-slate-600 border-b border-slate-50 pb-1">
                                        {cert}
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
};

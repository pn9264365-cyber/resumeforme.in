import React from 'react';
import { TemplateProps } from '../../types';

export const TechnicalTemplate: React.FC<TemplateProps> = ({ data }) => {
    return (
        <div className="w-full min-h-full bg-[#0f172a] text-[#94a3b8] font-mono p-12">
            <header className="border-b border-[#1e293b] pb-8 mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-bold text-white mb-2 tracking-tighter">&gt; {data.personalInfo.fullName}</h1>
                    <div className="text-xs opacity-70 grid grid-cols-2 gap-x-6 gap-y-1">
                        <span>[email]: {data.personalInfo.email}</span>
                        <span>[phone]: {data.personalInfo.phone}</span>
                        <span>[loc]: {data.personalInfo.location}</span>
                        <span>[link]: {data.personalInfo.linkedin}</span>
                    </div>
                </div>
                <div className="hidden sm:block">
                    <div className="text-right text-[10px] uppercase font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1 border border-emerald-500/20 rounded">
                        Verified Technical Expert
                    </div>
                </div>
            </header>

            <div className="space-y-10">
                {data.summary && (
                    <section>
                        <h2 className="text-xs uppercase font-bold text-emerald-400 mb-3 flex items-center gap-2">
                            <span className="h-3 w-1 bg-emerald-400"></span> Summary
                        </h2>
                        <p className="text-sm leading-relaxed max-w-3xl border-l border-[#1e293b] pl-6 ml-0.5">
                            {data.summary}
                        </p>
                    </section>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                    <div className="lg:col-span-3 space-y-10">
                        {data.experience.length > 0 && (
                            <section>
                                <h2 className="text-xs uppercase font-bold text-emerald-400 mb-6 flex items-center gap-2">
                                    <span className="h-3 w-1 bg-emerald-400"></span> Experience_Log
                                </h2>
                                <div className="space-y-8">
                                    {data.experience.map(exp => (
                                        <div key={exp.id} className="print:break-inside-avoid">
                                            <div className="flex justify-between items-baseline text-white mb-1">
                                                <h3 className="text-md font-bold">{exp.position}</h3>
                                                <span className="text-[10px] text-[#475569]">{exp.startDate}..{exp.current ? 'now' : exp.endDate}</span>
                                            </div>
                                            <div className="text-sm text-emerald-500 mb-3">@ {exp.company}</div>
                                            <div className="text-xs text-[#94a3b8] leading-relaxed whitespace-pre-line pl-4 border-l border-[#1e293b]">
                                                {exp.description}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {data.projects && data.projects.length > 0 && (
                            <section>
                                <h2 className="text-xs uppercase font-bold text-emerald-400 mb-6 flex items-center gap-2">
                                    <span className="h-3 w-1 bg-emerald-400"></span> Built_With_Code
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {data.projects.map(project => (
                                        <div key={project.id} className="p-4 bg-[#1e293b]/50 border border-[#1e293b] rounded-sm flex flex-col justify-between print:break-inside-avoid">
                                            <div>
                                                <h4 className="text-white font-bold text-sm mb-2">{project.name}</h4>
                                                <p className="text-[11px] leading-relaxed mb-4">{project.description}</p>
                                            </div>
                                            {project.technologies && <div className="text-[9px] text-emerald-500/80 font-bold overflow-hidden text-ellipsis whitespace-nowrap">{project.technologies}</div>}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    <div className="lg:col-span-1 space-y-10">
                        {/* Certifications for Technical Template */}
                        {data.certifications && data.certifications.length > 0 && (
                            <section>
                                <h2 className="text-xs uppercase font-bold text-emerald-400 mb-6 flex items-center gap-2">
                                    <span className="h-3 w-1 bg-emerald-400"></span> Verification
                                </h2>
                                <div className="space-y-4">
                                    {data.certifications.map(cert => (
                                        <div key={cert.id} className="text-[11px] print:break-inside-avoid">
                                            <div className="text-white font-bold mb-1 leading-tight">{cert.name}</div>
                                            <div className="opacity-70 text-[10px]">&gt; {cert.issuer}</div>
                                            {cert.date && <div className="text-emerald-500/60 text-[9px] mt-0.5">{cert.date}</div>}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        <section>
                            <h2 className="text-xs uppercase font-bold text-emerald-400 mb-6 flex items-center gap-2">
                                <span className="h-3 w-1 bg-emerald-400"></span> Tech_Stack
                            </h2>
                            <div className="space-y-6">
                                {Array.from(new Set(data.skills.map(s => s.category || 'misc'))).map(category => (
                                    <div key={category}>
                                        <h4 className="text-[10px] uppercase font-bold text-white mb-2 underline decoration-[#1e293b] underline-offset-4">{category}</h4>
                                        <div className="flex flex-wrap gap-x-3 gap-y-2">
                                            {data.skills.filter(s => (s.category || 'misc') === category).map(skill => (
                                                <span key={skill.id} className="text-[11px]">
                                                    {skill.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {data.education.length > 0 && (
                            <section>
                                <h2 className="text-xs uppercase font-bold text-emerald-400 mb-6 flex items-center gap-2">
                                    <span className="h-3 w-1 bg-emerald-400"></span> Academics
                                </h2>
                                <div className="space-y-4">
                                    {data.education.map(edu => (
                                        <div key={edu.id} className="text-[11px]">
                                            <div className="text-white font-bold">{edu.degree}</div>
                                            <div className="opacity-70">{edu.institution}</div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

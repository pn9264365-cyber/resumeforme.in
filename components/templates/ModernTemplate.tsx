import React from 'react';
import { TemplateProps } from '../../types';

export const ModernTemplate: React.FC<TemplateProps> = ({ data }) => {
    return (
        <div className="w-full min-h-full bg-white flex text-slate-800">
            {/* Sidebar */}
            <div className="w-1/3 bg-slate-900 text-white p-8 flex flex-col gap-6">
                <div className="mb-4">
                    <h1 className="text-2xl font-bold leading-tight uppercase tracking-wider mb-2 text-blue-400">
                        {data.personalInfo.fullName}
                    </h1>
                </div>

                {/* Contact */}
                <div className="text-sm space-y-2 opacity-90">
                    <p className="font-semibold text-slate-400 uppercase tracking-widest text-xs mb-2">Contact</p>
                    {data.personalInfo.email && <div className="break-all">{data.personalInfo.email}</div>}
                    {data.personalInfo.phone && <div>{data.personalInfo.phone}</div>}
                    {data.personalInfo.location && <div>{data.personalInfo.location}</div>}
                    {data.personalInfo.website && <div className="text-blue-400">Portfolio Site: {data.personalInfo.website}</div>}
                    {data.personalInfo.linkedin && <div className="text-blue-400">{data.personalInfo.linkedin}</div>}
                </div>

                {/* Education */}
                {data.education.length > 0 && (
                    <div className="text-sm">
                        <p className="font-semibold text-slate-400 uppercase tracking-widest text-xs mb-3">Education</p>
                        <div className="space-y-4">
                            {data.education.map(edu => (
                                <div key={edu.id}>
                                    <div className="font-bold">{edu.degree}</div>
                                    <div className="text-slate-300">{edu.institution}</div>
                                    <div className="text-xs text-slate-500 italic">
                                        {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Skills */}
                {data.skills.length > 0 && (
                    <div className="text-sm">
                        <p className="font-semibold text-slate-400 uppercase tracking-widest text-xs mb-3">Skills</p>
                        <div className="space-y-4">
                            {Array.from(new Set(data.skills.map(s => s.category || 'Other'))).map(category => (
                                <div key={category}>
                                    <h3 className="text-blue-400 font-bold text-xs uppercase mb-1">{category}</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {data.skills
                                            .filter(s => (s.category || 'Other') === category)
                                            .map(skill => (
                                                <span key={skill.id} className="bg-slate-800 px-2 py-1 rounded text-[10px] border border-slate-700 leading-tight">
                                                    {skill.name}
                                                </span>
                                            ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {/* Certifications */}
                {data.certifications && data.certifications.length > 0 && (
                    <div className="text-sm">
                        <p className="font-semibold text-slate-400 uppercase tracking-widest text-xs mb-3">Certifications</p>
                        <ul className="space-y-2 text-xs text-slate-300">
                            {data.certifications.map((cert, idx) => (
                                <li key={idx} className="flex gap-2">
                                    <span className="text-blue-400">•</span>
                                    {cert}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* Main Content */}
            <div className="w-2/3 p-8 flex flex-col gap-6">
                {/* Summary */}
                {data.summary && (
                    <div className="border-b border-slate-200 pb-6">
                        <h2 className="text-lg font-bold uppercase tracking-widest text-slate-900 mb-3">Profile</h2>
                        <p className="text-sm leading-relaxed text-slate-600">
                            {data.summary}
                        </p>
                    </div>
                )}

                {/* Experience */}
                {data.experience.length > 0 && (
                    <div>
                        <h2 className="text-lg font-bold uppercase tracking-widest text-slate-900 mb-4">Experience</h2>
                        <div className="space-y-6">
                            {data.experience.map(exp => (
                                <div key={exp.id}>
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="font-bold text-slate-800 text-md">{exp.position}</h3>
                                        <span className="text-xs text-slate-500 font-medium whitespace-nowrap ml-4">
                                            {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                                        </span>
                                    </div>
                                    <div className="text-sm text-blue-600 font-semibold mb-2">{exp.company}</div>
                                    <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                                        {exp.description}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Projects */}
                {data.projects && data.projects.length > 0 && (
                    <div className="mt-4">
                        <h2 className="text-lg font-bold uppercase tracking-widest text-slate-900 mb-4">Projects</h2>
                        <div className="space-y-6">
                            {data.projects.map(project => (
                                <div key={project.id}>
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="font-bold text-slate-800 text-md">{project.name}</h3>
                                        {project.technologies && <span className="text-[10px] uppercase font-bold text-blue-600 ml-4">{project.technologies}</span>}
                                    </div>
                                    <div className="text-sm text-slate-600 leading-relaxed">
                                        {project.description}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Publications */}
                {data.publications && data.publications.length > 0 && (
                    <div className="mt-6">
                        <h2 className="text-lg font-bold uppercase tracking-widest text-slate-900 mb-4">Publications</h2>
                        <ul className="space-y-3">
                            {data.publications.map((pub, idx) => (
                                <li key={idx} className="flex gap-3 text-sm text-slate-600 leading-relaxed">
                                    <span className="text-blue-600 font-bold">•</span>
                                    {pub}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

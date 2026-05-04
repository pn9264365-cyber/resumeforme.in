import React from 'react';
import { TemplateProps } from '../../types';

export const CompactTemplate: React.FC<TemplateProps> = ({ data }) => {
    return (
        <div className="w-full min-h-full bg-white text-gray-900 font-sans text-[11px] leading-snug">
            <div className="p-8 grid grid-cols-3 gap-6">
                {/* Header Block */}
                <div className="col-span-3 border-b-2 border-black pb-4 mb-2 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-black uppercase tracking-tighter leading-none">{data.personalInfo.fullName}</h1>
                        <p className="font-bold text-gray-500 uppercase tracking-widest mt-1 text-[9px]">{data.experience[0]?.position || 'Professional'}</p>
                    </div>
                    <div className="text-right flex flex-wrap justify-end gap-x-4 gap-y-1 font-bold text-[9px] uppercase tracking-tight text-gray-400">
                        <span>{data.personalInfo.email}</span>
                        <span>{data.personalInfo.phone}</span>
                        <span>{data.personalInfo.location}</span>
                        <span>{data.personalInfo.linkedin}</span>
                    </div>
                </div>

                {/* Left Column: Summary and Experience */}
                <div className="col-span-2 space-y-6">
                    {data.summary && (
                        <section>
                            <h2 className="text-[10px] font-black uppercase text-white bg-black px-2 py-0.5 mb-2 inline-block">Profile_Core</h2>
                            <p className="text-gray-700 leading-[1.4]">{data.summary}</p>
                        </section>
                    )}

                    {data.experience.length > 0 && (
                        <section>
                            <h2 className="text-[10px] font-black uppercase text-white bg-black px-2 py-0.5 mb-3 inline-block">History</h2>
                            <div className="space-y-4">
                                {data.experience.map(exp => (
                                    <div key={exp.id} className="print:break-inside-avoid">
                                        <div className="flex justify-between items-baseline font-bold mb-0.5">
                                            <span className="text-sm uppercase tracking-tight">{exp.position}</span>
                                            <span className="text-[9px] text-gray-400">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                                        </div>
                                        <div className="text-[10px] font-black text-gray-500 uppercase mb-1">{exp.company}</div>
                                        <div className="text-gray-600 whitespace-pre-line leading-relaxed">
                                            {exp.description}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {data.projects && data.projects.length > 0 && (
                        <section>
                            <h2 className="text-[10px] font-black uppercase text-white bg-black px-2 py-0.5 mb-3 inline-block">Builds</h2>
                            <div className="grid grid-cols-2 gap-4">
                                {data.projects.map(project => (
                                    <div key={project.id} className="border-l border-gray-100 pl-3 print:break-inside-avoid">
                                        <h3 className="font-bold mb-1 uppercase tracking-tight">{project.name}</h3>
                                        <p className="text-gray-500 text-[10px] line-clamp-3">{project.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* Right Column: Skills, Education, Etc */}
                <div className="col-span-1 space-y-6 bg-gray-50 p-4 rounded-lg">
                    {data.skills.length > 0 && (
                        <section>
                            <h2 className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-3 underline decoration-black decoration-2 underline-offset-4">Capacities</h2>
                            <div className="space-y-3">
                                {Array.from(new Set(data.skills.map(s => s.category || 'tools'))).map(category => (
                                    <div key={category}>
                                        <h4 className="text-[8px] font-black uppercase text-gray-400 mb-1">{category}</h4>
                                        <div className="flex flex-wrap gap-1">
                                            {data.skills.filter(s => (s.category || 'tools') === category).map(skill => (
                                                <span key={skill.id} className="bg-white border border-gray-200 px-2 py-0.5 rounded text-[9px] font-bold text-gray-600">
                                                    {skill.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {data.education.length > 0 && (
                        <section>
                            <h2 className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-3 underline decoration-black decoration-2 underline-offset-4">Training</h2>
                            <div className="space-y-3">
                                {data.education.map(edu => (
                                    <div key={edu.id} className="print:break-inside-avoid">
                                        <div className="font-bold text-[10px]">{edu.degree}</div>
                                        <div className="text-[9px] text-gray-500 uppercase font-black">{edu.institution}</div>
                                        <div className="text-[8px] text-gray-400 font-bold">{edu.startDate}..{edu.current ? 'CUR' : edu.endDate}</div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                     {data.certifications && data.certifications.length > 0 && (
                        <section>
                            <h2 className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-3 underline decoration-black decoration-2 underline-offset-4">Verified</h2>
                            <div className="space-y-4">
                                {data.certifications.map((cert) => (
                                    <div key={cert.id} className="text-[9px] print:break-inside-avoid">
                                        <div className="font-bold text-gray-900 leading-tight uppercase tracking-tighter">{cert.name}</div>
                                        <div className="text-gray-500 mt-0.5">{cert.issuer} {cert.date && ` / ${cert.date}`}</div>
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

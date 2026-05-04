import React from 'react';
import { TemplateProps } from '../../types';

export const ProfessionalTemplate: React.FC<TemplateProps> = ({ data }) => {
    return (
        <div className="w-full min-h-full bg-white p-12 text-gray-800 font-sans">
            <header className="border-b-4 border-blue-600 pb-6 mb-8 text-center">
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2 uppercase">{data.personalInfo.fullName}</h1>
                <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600 font-medium tracking-wide">
                    {data.personalInfo.email && <span className="flex items-center gap-1">✉ {data.personalInfo.email}</span>}
                    {data.personalInfo.phone && <span className="flex items-center gap-1">📞 {data.personalInfo.phone}</span>}
                    {data.personalInfo.location && <span className="flex items-center gap-1">📍 {data.personalInfo.location}</span>}
                    {data.personalInfo.linkedin && <span className="flex items-center gap-1">in {data.personalInfo.linkedin}</span>}
                </div>
            </header>

            <div className="grid grid-cols-1 gap-8">
                {data.summary && (
                    <section>
                        <h2 className="text-xl font-bold text-blue-700 uppercase tracking-wider mb-3 border-b border-gray-200 pb-1">Professional Summary</h2>
                        <p className="text-gray-700 leading-relaxed text-sm italic">{data.summary}</p>
                    </section>
                )}

                <div className="grid grid-cols-3 gap-12">
                    <div className="col-span-2 space-y-8">
                        {data.experience.length > 0 && (
                            <section>
                                <h2 className="text-xl font-bold text-blue-700 uppercase tracking-wider mb-4 border-b border-gray-200 pb-1">Work History</h2>
                                <div className="space-y-6">
                                    {data.experience.map(exp => (
                                        <div key={exp.id} className="print:break-inside-avoid">
                                            <div className="flex justify-between items-start mb-1">
                                                <h3 className="font-bold text-gray-900">{exp.position}</h3>
                                                <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                                                </span>
                                            </div>
                                            <div className="text-blue-600 font-semibold text-sm mb-2">{exp.company}</div>
                                            <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line pl-2 border-l-2 border-blue-100">
                                                {exp.description}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {data.projects && data.projects.length > 0 && (
                            <section>
                                <h2 className="text-xl font-bold text-blue-700 uppercase tracking-wider mb-4 border-b border-gray-200 pb-1">Key Projects</h2>
                                <div className="space-y-5">
                                    {data.projects.map(project => (
                                        <div key={project.id} className="print:break-inside-avoid">
                                            <h3 className="font-bold text-gray-900 flex justify-between">
                                                {project.name}
                                                {project.technologies && <span className="text-[10px] font-mono text-blue-500">{project.technologies}</span>}
                                            </h3>
                                            <p className="text-sm text-gray-700 mt-1">{project.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    <div className="col-span-1 space-y-8">
                        {data.skills.length > 0 && (
                            <section>
                                <h2 className="text-xl font-bold text-blue-700 uppercase tracking-wider mb-4 border-b border-gray-200 pb-1">Expertise</h2>
                                <div className="space-y-4">
                                    {data.skills.map(skill => (
                                        <div key={skill.id} className="print:break-inside-avoid">
                                            <div className="flex justify-between mb-1">
                                                <span className="text-xs font-bold text-gray-700">{skill.name}</span>
                                                <span className="text-[10px] text-blue-600 font-bold">{skill.level}</span>
                                            </div>
                                            <div className="w-full bg-gray-100 h-1 rounded-full overflow-hidden">
                                                <div 
                                                    className="bg-blue-600 h-full" 
                                                    style={{ width: skill.level === 'Expert' ? '100%' : skill.level === 'Intermediate' ? '70%' : '40%' }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {data.certifications && data.certifications.length > 0 && (
                            <section>
                                <h2 className="text-xl font-bold text-blue-700 uppercase tracking-wider mb-4 border-b border-gray-200 pb-1">Certifications</h2>
                                <div className="space-y-4">
                                    {data.certifications.map(cert => (
                                        <div key={cert.id} className="print:break-inside-avoid">
                                            <div className="font-bold text-sm text-gray-900 leading-tight">{cert.name}</div>
                                            <div className="text-xs text-blue-600 font-medium">{cert.issuer}</div>
                                            {cert.date && <div className="text-[10px] text-gray-400 mt-0.5">{cert.date}</div>}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {data.education.length > 0 && (
                            <section>
                                <h2 className="text-xl font-bold text-blue-700 uppercase tracking-wider mb-4 border-b border-gray-200 pb-1">Education</h2>
                                <div className="space-y-4">
                                    {data.education.map(edu => (
                                        <div key={edu.id} className="print:break-inside-avoid">
                                            <div className="font-bold text-sm text-gray-900">{edu.degree}</div>
                                            <div className="text-xs text-gray-600">{edu.institution}</div>
                                            <div className="text-[10px] text-gray-400 italic">
                                                {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
                                            </div>
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

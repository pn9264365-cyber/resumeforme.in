import React from 'react';
import { TemplateProps } from '../../types';

export const ClassicTemplate: React.FC<TemplateProps> = ({ data }) => {
    return (
        <div className="w-full min-h-full bg-white p-12 text-gray-900 font-serif">
            {/* Header */}
            <div className="text-center border-b-2 border-gray-800 pb-6 mb-8">
                <h1 className="text-3xl font-bold uppercase tracking-wide mb-3">{data.personalInfo.fullName}</h1>
                <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600 font-sans">
                    {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
                    {data.personalInfo.phone && <span>• {data.personalInfo.phone}</span>}
                    {data.personalInfo.location && <span>• {data.personalInfo.location}</span>}
                    {data.personalInfo.website && <span>• Portfolio Site: {data.personalInfo.website}</span>}
                    {data.personalInfo.linkedin && <span>• {data.personalInfo.linkedin}</span>}
                </div>
            </div>

            {/* Summary */}
            {data.summary && (
                <div className="mb-6">
                    <h2 className="text-sm font-bold uppercase border-b border-gray-300 mb-3 pb-1 font-sans">Professional Summary</h2>
                    <p className="text-sm leading-relaxed text-justify">
                        {data.summary}
                    </p>
                </div>
            )}

            {/* Experience */}
            {data.experience.length > 0 && (
                <div className="mb-6">
                    <h2 className="text-sm font-bold uppercase border-b border-gray-300 mb-4 pb-1 font-sans text-gray-900 tracking-wider">Work Experience</h2>
                    <div className="space-y-5">
                        {data.experience.map(exp => (
                            <div key={exp.id} className="print:break-inside-avoid">
                                <div className="flex justify-between font-bold text-md text-gray-900 mb-0.5">
                                    <span>{exp.company}</span>
                                    <span className="font-sans text-xs font-medium text-gray-500">
                                        {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                                    </span>
                                </div>
                                <div className="italic text-[13px] text-gray-700 font-medium mb-2">{exp.position}</div>
                                <div className="text-[13px] leading-relaxed whitespace-pre-line text-gray-700">
                                    {exp.description}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Education */}
            {data.education.length > 0 && (
                <div className="mb-6">
                    <h2 className="text-sm font-bold uppercase border-b border-gray-300 mb-4 pb-1 font-sans text-gray-900 tracking-wider">Education</h2>
                    <div className="space-y-4">
                        {data.education.map(edu => (
                            <div key={edu.id} className="flex justify-between print:break-inside-avoid">
                                <div>
                                    <div className="font-bold text-sm text-gray-900">{edu.institution}</div>
                                    <div className="text-sm italic text-gray-700">{edu.degree} in {edu.fieldOfStudy}</div>
                                </div>
                                <div className="text-xs font-sans text-gray-500 font-medium">
                                    {edu.startDate} – {edu.current ? 'Present' : edu.endDate}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Skills */}
            {data.skills.length > 0 && (
                <div className="mb-6">
                    <h2 className="text-sm font-bold uppercase border-b border-gray-300 mb-3 pb-1 font-sans text-gray-900 tracking-wider">Skills</h2>
                    <div className="space-y-2">
                        {Array.from(new Set(data.skills.map(s => s.category || 'Other'))).map(category => (
                            <div key={category} className="text-[13px] leading-relaxed text-gray-700 print:break-inside-avoid">
                                <span className="font-bold text-gray-900">{category}:</span> {data.skills.filter(s => (s.category || 'Other') === category).map(s => s.name).join(', ')}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Projects */}
            {data.projects && data.projects.length > 0 && (
                <div className="mb-6">
                    <h2 className="text-sm font-bold uppercase border-b border-gray-300 mb-3 pb-1 font-sans text-gray-900 tracking-wider">Projects</h2>
                    <div className="space-y-5">
                        {data.projects.map(project => (
                            <div key={project.id} className="print:break-inside-avoid">
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="text-sm font-bold text-gray-900">{project.name}</h3>
                                    {project.technologies && <span className="text-xs italic text-gray-500 font-sans">{project.technologies}</span>}
                                </div>
                                <div className="text-[13px] leading-relaxed text-gray-700">{project.description}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Certifications */}
            {data.certifications && data.certifications.length > 0 && (
                <div className="mb-6">
                    <h2 className="text-sm font-bold uppercase border-b border-gray-300 mb-3 pb-1 font-sans text-gray-900 tracking-wider">Certifications</h2>
                    <div className="space-y-3">
                        {data.certifications.map((cert) => (
                            <div key={cert.id} className="print:break-inside-avoid">
                                <div className="flex justify-between items-baseline">
                                    <div className="font-bold text-sm text-gray-900">{cert.name}</div>
                                    <div className="text-[10px] text-gray-500 font-sans">{cert.date}</div>
                                </div>
                                <div className="text-xs text-gray-600 italic leading-tight">{cert.issuer}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Publications */}
            {data.publications && data.publications.length > 0 && (
                <div className="mt-6">
                    <h2 className="text-sm font-bold uppercase border-b border-gray-300 mb-3 pb-1 font-sans">Publications</h2>
                    <ul className="text-sm space-y-1">
                        {data.publications.map((pub, idx) => (
                            <li key={idx}>• {pub}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

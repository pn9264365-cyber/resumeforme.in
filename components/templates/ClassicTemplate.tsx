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
                    <h2 className="text-sm font-bold uppercase border-b border-gray-300 mb-4 pb-1 font-sans">Work Experience</h2>
                    <div className="space-y-5">
                        {data.experience.map(exp => (
                            <div key={exp.id}>
                                <div className="flex justify-between font-bold text-md">
                                    <span>{exp.company}</span>
                                    <span className="font-sans text-sm font-normal text-gray-600">
                                        {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                                    </span>
                                </div>
                                <div className="italic text-sm mb-2">{exp.position}</div>
                                <div className="text-sm leading-relaxed whitespace-pre-line">
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
                    <h2 className="text-sm font-bold uppercase border-b border-gray-300 mb-4 pb-1 font-sans">Education</h2>
                    <div className="space-y-3">
                        {data.education.map(edu => (
                            <div key={edu.id} className="flex justify-between">
                                <div>
                                    <div className="font-bold text-sm">{edu.institution}</div>
                                    <div className="text-sm italic">{edu.degree} in {edu.fieldOfStudy}</div>
                                </div>
                                <div className="text-sm font-sans text-gray-600">
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
                    <h2 className="text-sm font-bold uppercase border-b border-gray-300 mb-3 pb-1 font-sans">Skills</h2>
                    <div className="space-y-2">
                        {Array.from(new Set(data.skills.map(s => s.category || 'Other'))).map(category => (
                            <div key={category} className="text-sm leading-relaxed">
                                <span className="font-bold">{category}:</span> {data.skills.filter(s => (s.category || 'Other') === category).map(s => s.name).join(', ')}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Projects */}
            {data.projects && data.projects.length > 0 && (
                <div className="mb-6">
                    <h2 className="text-sm font-bold uppercase border-b border-gray-300 mb-3 pb-1 font-sans">Projects</h2>
                    <div className="space-y-4">
                        {data.projects.map(project => (
                            <div key={project.id}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="text-sm font-bold">{project.name}</h3>
                                    {project.technologies && <span className="text-xs italic text-gray-500">{project.technologies}</span>}
                                </div>
                                <div className="text-sm leading-relaxed">{project.description}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Certifications */}
            {data.certifications && data.certifications.length > 0 && (
                <div>
                    <h2 className="text-sm font-bold uppercase border-b border-gray-300 mb-3 pb-1 font-sans">Certifications</h2>
                    <ul className="text-sm space-y-1">
                        {data.certifications.map((cert, idx) => (
                            <li key={idx}>• {cert}</li>
                        ))}
                    </ul>
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

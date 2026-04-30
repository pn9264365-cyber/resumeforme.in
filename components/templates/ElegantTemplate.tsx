import React from 'react';
import { TemplateProps } from '../../types';

export const ElegantTemplate: React.FC<TemplateProps> = ({ data }) => {
    return (
        <div className="w-full min-h-full bg-[#fdfbf7] text-[#334139] font-serif p-16">
            <div className="max-w-4xl mx-auto border-t-[0.5px] border-b-[0.5px] border-[#334139] py-12">
                <header className="mb-16 text-center">
                    <h1 className="text-4xl font-normal tracking-[0.15em] uppercase mb-6 leading-tight">
                        {data.personalInfo.fullName}
                    </h1>
                    <div className="font-sans text-[10px] tracking-[0.25em] uppercase text-[#667c71] flex justify-center flex-wrap gap-x-8 gap-y-2">
                        {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
                        {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
                        {data.personalInfo.location && <span>{data.personalInfo.location}</span>}
                        {data.personalInfo.linkedin && <span>LinkedIn</span>}
                    </div>
                </header>

                <div className="space-y-20">
                    {data.summary && (
                        <section className="max-w-2xl mx-auto text-center">
                            <p className="text-lg leading-relaxed font-light italic text-[#4a5d52]">
                                "{data.summary}"
                            </p>
                        </section>
                    )}

                    {data.experience.length > 0 && (
                        <section>
                            <h2 className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-[#a0af9f] text-center mb-12">Professional Narrative</h2>
                            <div className="space-y-12">
                                {data.experience.map(exp => (
                                    <div key={exp.id} className="flex flex-col md:flex-row gap-8">
                                        <div className="md:w-1/4 pt-1">
                                            <span className="font-sans text-[9px] uppercase tracking-widest text-[#a0af9f] font-bold">
                                                {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                                            </span>
                                        </div>
                                        <div className="md:w-3/4">
                                            <h3 className="text-xl font-bold mb-1 tracking-tight">{exp.position}</h3>
                                            <div className="font-sans text-[10px] uppercase tracking-[0.1em] text-[#667c71] font-bold mb-4">{exp.company}</div>
                                            <div className="text-[15px] text-[#4a5d52] leading-relaxed whitespace-pre-line font-light">
                                                {exp.description}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    <div className="flex flex-col md:flex-row gap-16 border-t border-[#334139]/10 pt-16">
                        {data.skills.length > 0 && (
                            <section className="flex-1">
                                <h2 className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-[#a0af9f] mb-8">Capabilities</h2>
                                <div className="flex flex-wrap gap-x-8 gap-y-4">
                                    {data.skills.map(skill => (
                                        <div key={skill.id} className="flex flex-col">
                                            <span className="text-sm font-semibold">{skill.name}</span>
                                            <span className="text-[9px] uppercase tracking-widest text-[#a0af9f] font-bold">{skill.level}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {data.education.length > 0 && (
                            <section className="md:w-1/3">
                                <h2 className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-[#a0af9f] mb-8">Education</h2>
                                <div className="space-y-6">
                                    {data.education.map(edu => (
                                        <div key={edu.id}>
                                            <h3 className="text-sm font-bold leading-tight">{edu.institution}</h3>
                                            <div className="text-[11px] italic text-[#667c71] mt-1">{edu.degree}</div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </div>
            <footer className="mt-12 text-center font-sans text-[8px] uppercase tracking-[0.4em] text-[#a0af9f]">
                Hand-finished Professional Document
            </footer>
        </div>
    );
};

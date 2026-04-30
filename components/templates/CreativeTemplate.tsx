import React from 'react';
import { TemplateProps } from '../../types';

export const CreativeTemplate: React.FC<TemplateProps> = ({ data }) => {
    return (
        <div className="w-full min-h-full bg-pink-50 text-indigo-900 font-sans p-8 md:p-12">
            <div className="flex flex-col md:flex-row gap-12 bg-white rounded-[2rem] overflow-hidden shadow-[20px_20px_0px_#818cf8]">
                {/* Visual Header / Left Column */}
                <div className="w-full md:w-2/5 bg-indigo-600 p-12 text-white flex flex-col justify-between">
                    <div>
                        <div className="h-16 w-16 bg-pink-400 rounded-full mb-8"></div>
                        <h1 className="text-5xl font-black leading-none mb-4 uppercase tracking-tighter">
                            {data.personalInfo.fullName.split(' ').map((name, i) => (
                                <span key={i} className="block">{name}</span>
                            ))}
                        </h1>
                        <p className="text-indigo-200 uppercase tracking-widest text-xs font-bold">ResuGenius Portfolio</p>
                    </div>

                    <div className="mt-12 space-y-6">
                        <div className="space-y-1">
                            <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-[0.2em]">Contact</p>
                            <p className="text-sm break-all font-medium">{data.personalInfo.email}</p>
                            <p className="text-sm font-medium">{data.personalInfo.phone}</p>
                            <p className="text-sm font-medium">{data.personalInfo.location}</p>
                        </div>
                        
                        {data.skills.length > 0 && (
                            <div className="space-y-4">
                                <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-[0.2em]">Superpowers</p>
                                <div className="flex flex-wrap gap-2">
                                    {data.skills.map(skill => (
                                        <span key={skill.id} className="bg-indigo-500/50 backdrop-blur-sm border border-indigo-400 px-3 py-1 rounded-full text-xs font-medium">
                                            {skill.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 p-12 overflow-y-auto">
                    {data.summary && (
                        <div className="mb-12">
                            <h2 className="text-3xl font-black mb-4 flex items-center gap-3">
                                <span className="h-2 w-8 bg-pink-400"></span> Hello.
                            </h2>
                            <p className="text-lg leading-relaxed font-medium text-indigo-800/80">
                                {data.summary}
                            </p>
                        </div>
                    )}

                    {data.experience.length > 0 && (
                        <div className="mb-12">
                            <h2 className="text-sm uppercase tracking-widest font-black text-indigo-300 mb-8">Work History</h2>
                            <div className="space-y-10">
                                {data.experience.map(exp => (
                                    <div key={exp.id} className="relative pl-8">
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-pink-200"></div>
                                        <div className="absolute left-[-4px] top-0 h-3 w-3 bg-indigo-600 rounded-full"></div>
                                        <h3 className="text-xl font-bold mb-1">{exp.position}</h3>
                                        <p className="text-indigo-600 font-black text-sm mb-3">@ {exp.company}</p>
                                        <p className="text-xs text-indigo-400 font-bold mb-4 uppercase tracking-wider">{exp.startDate} - {exp.current ? 'NOW' : exp.endDate}</p>
                                        <div className="text-sm leading-relaxed text-indigo-800 whitespace-pre-line font-medium">
                                            {exp.description}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {data.projects && data.projects.length > 0 && (
                        <div>
                            <h2 className="text-sm uppercase tracking-widest font-black text-indigo-300 mb-8">Selected Projects</h2>
                            <div className="grid grid-cols-1 gap-6">
                                {data.projects.map(project => (
                                    <div key={project.id} className="bg-pink-50 p-6 rounded-2xl border border-pink-100 flex flex-col justify-between">
                                        <div>
                                            <h4 className="font-bold text-lg mb-2">{project.name}</h4>
                                            <p className="text-sm text-indigo-800/70 mb-4">{project.description}</p>
                                        </div>
                                        {project.technologies && <span className="text-[10px] font-bold text-pink-500 uppercase">{project.technologies}</span>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

import React from 'react';
import { ResumeData } from '../../types';

const EliteTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  return (
    <div className="bg-white min-h-screen p-20 font-sans text-[#111] max-w-5xl mx-auto border border-black/5">
      <header className="mb-24 flex items-center justify-between border-b border-black pb-12">
        <div>
           <h1 className="text-4xl font-extrabold tracking-tighter leading-none mb-4 uppercase">{data.personalInfo.fullName}</h1>
           <div className="flex gap-6 text-[10px] font-bold uppercase tracking-[0.2em] text-black/50">
             <span>{data.personalInfo.email}</span>
             <span>{data.personalInfo.phone}</span>
             <span>{data.personalInfo.location}</span>
           </div>
        </div>
        <div className="text-right">
            <div className="text-[10px] font-black uppercase tracking-[0.5em] mb-2 opacity-20">Private Dossier</div>
            <div className="h-0.5 w-12 bg-black ml-auto" />
        </div>
      </header>

      <div className="space-y-24">
        {data.summary && (
            <section className="grid grid-cols-12 gap-8 items-start">
                <h2 className="col-span-3 text-[10px] font-black uppercase tracking-[0.4em] opacity-40">The Narrative</h2>
                <div className="col-span-9">
                    <p className="text-2xl font-light leading-snug tracking-tight max-w-2xl text-black/80">
                        {data.summary}
                    </p>
                </div>
            </section>
        )}

        <section className="grid grid-cols-12 gap-8 items-start">
            <h2 className="col-span-3 text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Professional</h2>
            <div className="col-span-9 space-y-20">
                {data.experience.map((exp) => (
                    <div key={exp.id} className="relative">
                        <div className="mb-6 flex items-baseline justify-between">
                            <h3 className="text-2xl font-bold uppercase tracking-tighter">{exp.position}</h3>
                            <span className="text-[10px] font-black opacity-30 uppercase tracking-widest">{exp.startDate} — {exp.endDate}</span>
                        </div>
                        <h4 className="text-sm font-black uppercase tracking-[0.25em] mb-6 text-black/40">{exp.company}</h4>
                        <div className="text-sm leading-relaxed text-black/60 max-w-2xl whitespace-pre-line font-medium border-l border-black/5 pl-8 ml-2">
                            {exp.description}
                        </div>
                    </div>
                ))}
            </div>
        </section>

        <section className="grid grid-cols-12 gap-8 items-start">
            <h2 className="col-span-3 text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Competence</h2>
            <div className="col-span-9 flex flex-wrap gap-x-12 gap-y-6">
                {data.skills.map((skill) => (
                    <div key={skill.id} className="group cursor-default">
                        <div className="text-sm font-bold uppercase tracking-[0.1em] mb-1 group-hover:text-black transition-colors">{skill.name}</div>
                        <div className="h-[2px] w-0 group-hover:w-full transition-all duration-500 bg-black" />
                    </div>
                ))}
            </div>
        </section>

        <section className="grid grid-cols-12 gap-8 items-start">
            <h2 className="col-span-3 text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Formation</h2>
            <div className="col-span-9 space-y-12">
                {data.education.map((edu) => (
                    <div key={edu.id}>
                        <h3 className="text-xl font-bold uppercase mb-2 tracking-tight">{edu.institution}</h3>
                        <div className="flex gap-4 text-[11px] font-bold uppercase tracking-[0.15em] opacity-50">
                            <span>{edu.degree}</span>
                            <span>•</span>
                            <span>{edu.fieldOfStudy}</span>
                            <span className="ml-auto opacity-100 text-black">{edu.endDate}</span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
      </div>
    </div>
  );
};

export default EliteTemplate;

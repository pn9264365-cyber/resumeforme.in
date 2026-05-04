import React from 'react';
import { ResumeData } from '../../types';

const SynergyTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  return (
    <div className="bg-white min-h-screen flex font-sans">
      {/* Sidebar */}
      <div className="w-80 bg-[#0a1128] text-white p-12 flex flex-col">
        <div className="mb-12">
            <h1 className="text-4xl font-black mb-2 tracking-tighter leading-none">{data.personalInfo.fullName.split(' ')[0]}<br />{data.personalInfo.fullName.split(' ').slice(1).join(' ')}</h1>
            <div className="h-2 w-16 bg-white/20 mt-6 rounded-full" />
        </div>

        <div className="space-y-10 flex-grow">
          <section>
            <h2 className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] mb-6">Contact</h2>
            <div className="space-y-4 text-sm font-medium text-white/80">
                {data.personalInfo.email && <div className="break-all">{data.personalInfo.email}</div>}
                {data.personalInfo.phone && <div>{data.personalInfo.phone}</div>}
                {data.personalInfo.location && <div>{data.personalInfo.location}</div>}
            </div>
          </section>

          <section>
            <h2 className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] mb-6">Social</h2>
            <div className="space-y-4 text-sm font-medium text-white/80 italic opacity-60">
                {data.personalInfo.linkedin && <div>LinkedIn</div>}
                {data.personalInfo.website && <div>Portfolio</div>}
            </div>
          </section>

          <section>
            <h2 className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] mb-6">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill) => (
                <span key={skill.id} className="text-[11px] font-bold px-3 py-1.5 bg-white/5 rounded-full border border-white/10">
                  {skill.name}
                </span>
              ))}
            </div>
          </section>
        </div>

        <footer className="mt-20 pt-10 border-t border-white/5 opacity-20 text-[9px] font-black uppercase tracking-widest leading-relaxed">
            Architected via ResuGenius Engine
        </footer>
      </div>

      {/* Main Content */}
      <div className="flex-grow p-16">
        <section className="mb-16">
          <h2 className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.3em] mb-6">Strategic Profile</h2>
          <p className="text-xl font-medium leading-relaxed text-slate-800">
            {data.summary}
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.3em] mb-10 pb-4 border-b border-slate-100 flex items-center justify-between">
            <span>Career Progression</span>
            <span className="h-px bg-slate-100 flex-grow ml-8" />
          </h2>
          <div className="space-y-12">
            {data.experience.map((exp) => (
              <div key={exp.id} className="group">
                <div className="flex items-baseline justify-between mb-4">
                  <h3 className="text-2xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{exp.position}</h3>
                  <span className="text-sm font-black text-slate-300 font-mono tracking-tighter">{exp.startDate} — {exp.endDate}</span>
                </div>
                <h4 className="text-sm font-black text-slate-400 mb-4 tracking-widest uppercase">{exp.company}</h4>
                <p className="text-md text-slate-600 leading-relaxed max-w-2xl whitespace-pre-line">
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.3em] mb-10 pb-4 border-b border-slate-100 flex items-center">
            <span>Academic Focus</span>
            <span className="h-px bg-slate-100 flex-grow ml-8" />
          </h2>
          <div className="grid grid-cols-2 gap-10">
            {data.education.map((edu) => (
              <div key={edu.id}>
                <h3 className="text-lg font-bold text-slate-900 mb-1">{edu.degree}</h3>
                <p className="text-sm font-medium text-slate-500 mb-2">{edu.institution}</p>
                <span className="text-xs font-black text-slate-300 tracking-widest uppercase">{edu.fieldOfStudy}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default SynergyTemplate;

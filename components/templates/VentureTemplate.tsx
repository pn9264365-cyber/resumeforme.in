import React from 'react';
import { ResumeData } from '../../types';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';

const VentureTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  return (
    <div className="bg-white p-8 font-sans text-slate-800">
      <header className="border-b-4 border-slate-900 pb-6 mb-8">
        <h1 className="text-5xl font-black uppercase tracking-tighter mb-4">{data.personalInfo.fullName}</h1>
        <div className="flex flex-wrap gap-4 text-sm font-bold text-slate-500 uppercase tracking-widest">
          {data.personalInfo.email && (
            <div className="flex items-center gap-1">
              <Mail size={14} className="text-slate-900" />
              {data.personalInfo.email}
            </div>
          )}
          {data.personalInfo.phone && (
            <div className="flex items-center gap-1">
              <Phone size={14} className="text-slate-900" />
              {data.personalInfo.phone}
            </div>
          )}
          {data.personalInfo.location && (
            <div className="flex items-center gap-1">
              <MapPin size={14} className="text-slate-900" />
              {data.personalInfo.location}
            </div>
          )}
        </div>
      </header>

      <div className="grid grid-cols-12 gap-10">
        <div className="col-span-8">
          {data.summary && (
            <section className="mb-8">
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Executive Summary</h2>
              <p className="text-lg leading-relaxed font-medium text-slate-700 italic border-l-4 border-slate-100 pl-6">
                {data.summary}
              </p>
            </section>
          )}

          <section className="mb-8">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Experience</h2>
            <div className="space-y-8">
              {data.experience.map((exp) => (
                <div key={exp.id} className="relative">
                  <div className="flex justify-between items-baseline mb-2">
                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{exp.position}</h3>
                    <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded">{exp.startDate} — {exp.endDate}</span>
                  </div>
                  <h4 className="text-md font-bold text-indigo-600 mb-3">{exp.company}</h4>
                  <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {data.projects && data.projects.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Key Projects</h2>
              <div className="grid grid-cols-2 gap-4">
                {data.projects.map((proj) => (
                  <div key={proj.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <h3 className="font-black text-slate-900 mb-2 uppercase tracking-tight text-sm">{proj.name}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{proj.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="col-span-4">
          <section className="mb-8 p-6 bg-slate-900 text-white rounded-3xl">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Core Competencies</h2>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill) => (
                <span key={skill.id} className="bg-white/10 hover:bg-white/20 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors">
                  {skill.name}
                </span>
              ))}
            </div>
          </section>

          <section className="mb-8 pl-4">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Education</h2>
            <div className="space-y-6">
              {data.education.map((edu) => (
                <div key={edu.id}>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight mb-1">{edu.degree}</h3>
                  <p className="text-xs font-bold text-indigo-600 mb-1">{edu.institution}</p>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{edu.fieldOfStudy} • {edu.endDate}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default VentureTemplate;

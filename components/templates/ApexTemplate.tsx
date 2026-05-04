import React from 'react';
import { ResumeData } from '../../types';

const ApexTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  return (
    <div className="bg-[#f8fafc] text-slate-900 font-sans p-10 min-h-screen">
      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200 overflow-hidden flex flex-col min-h-full border border-slate-100">
        {/* Header Ribbon */}
        <div className="bg-slate-900 p-10 text-white flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-5xl font-black tracking-tighter uppercase">{data.personalInfo.fullName}</h1>
            <p className="text-slate-400 font-bold uppercase tracking-[0.25em] text-xs">Principal Executive & Specialist</p>
          </div>
          <div className="flex flex-col text-right gap-2 text-xs font-black uppercase tracking-widest text-slate-400">
            <span>{data.personalInfo.email}</span>
            <span>{data.personalInfo.phone}</span>
            <span>{data.personalInfo.location}</span>
          </div>
        </div>

        <div className="flex flex-grow bg-white">
          {/* Main Strip */}
          <div className="flex-grow p-12 border-r border-slate-50">
            {data.summary && (
              <section className="mb-12">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-0.5 flex-grow bg-slate-100" />
                  <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Objective</h2>
                </div>
                <p className="text-xl font-medium leading-relaxed italic text-slate-700">
                  {data.summary}
                </p>
              </section>
            )}

            <section className="mb-12">
              <div className="flex items-center gap-4 mb-10">
                <div className="h-0.5 flex-grow bg-slate-100" />
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">History</h2>
              </div>
              <div className="space-y-16">
                {data.experience.map((exp) => (
                  <div key={exp.id} className="relative pl-8 border-l-2 border-slate-50 print:break-inside-avoid">
                    <div className="absolute top-0 -left-[1.25px] w-[2px] h-8 bg-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.5)]" />
                    <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-2">
                      <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">{exp.position}</h3>
                      <span className="text-[11px] font-black text-indigo-500 uppercase tracking-widest">{exp.startDate} — {exp.endDate}</span>
                    </div>
                    <div className="text-xs font-black text-slate-400 uppercase tracking-[0.15em] mb-6">{exp.company}</div>
                    <p className="text-md text-slate-600 leading-relaxed max-w-2xl whitespace-pre-line font-medium">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {data.projects && data.projects.length > 0 && (
              <section className="mb-12">
                <div className="flex items-center gap-4 mb-10">
                  <div className="h-0.5 flex-grow bg-slate-100" />
                  <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Collaborations</h2>
                </div>
                <div className="space-y-10">
                  {data.projects.map((project) => (
                    <div key={project.id} className="print:break-inside-avoid">
                      <div className="flex justify-between items-baseline mb-3">
                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">{project.name}</h3>
                        {project.technologies && <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">{project.technologies}</span>}
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed font-medium">{project.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Side Module */}
          <div className="w-[320px] bg-slate-50/50 p-12 flex flex-col gap-12">
            <section>
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 mb-8 pb-4 border-b border-slate-100">Toolkit</h2>
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill) => (
                  <span key={skill.id} className="bg-white border border-slate-200 text-slate-600 text-xs font-bold px-3 py-1.5 rounded-xl shadow-sm print:break-inside-avoid">
                    {skill.name}
                  </span>
                ))}
              </div>
            </section>

            {data.certifications && data.certifications.length > 0 && (
              <section>
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 mb-8 pb-4 border-b border-slate-100">Credentials</h2>
                <div className="space-y-6">
                  {data.certifications.map((cert) => (
                    <div key={cert.id} className="print:break-inside-avoid">
                      <h3 className="text-sm font-black text-slate-900 mb-1 leading-tight">{cert.name}</h3>
                      <p className="text-[10px] font-bold text-indigo-600 mb-1">{cert.issuer}</p>
                      {cert.date && <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{cert.date}</div>}
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section>
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 mb-8 pb-4 border-b border-slate-100">Education</h2>
              <div className="space-y-8">
                {data.education.map((edu) => (
                  <div key={edu.id} className="print:break-inside-avoid">
                    <h3 className="text-sm font-black text-slate-900 mb-1">{edu.degree}</h3>
                    <p className="text-xs font-bold text-indigo-600 mb-2">{edu.institution}</p>
                    <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{edu.endDate}</div>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-auto">
                <div className="p-6 bg-slate-100 rounded-3xl border border-slate-200">
                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 text-center">Status</div>
                    <div className="flex items-center justify-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[11px] font-black uppercase tracking-tighter">Verified Professional</span>
                    </div>
                </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApexTemplate;

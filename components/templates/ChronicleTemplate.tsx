import React from 'react';
import { ResumeData } from '../../types';

const ChronicleTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  return (
    <div className="bg-[#fcfbf9] min-h-screen p-12 font-serif text-slate-900 border-[16px] border-slate-100">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-16 border-b border-slate-200 pb-12">
          <h1 className="text-6xl font-normal lowercase italic tracking-tighter mb-4 serif-display">{data.personalInfo.fullName}</h1>
          <div className="flex justify-center gap-6 text-[11px] font-sans font-black uppercase tracking-[0.3em] text-slate-400">
            <span>{data.personalInfo.email}</span>
            <span>•</span>
            <span>{data.personalInfo.location}</span>
          </div>
        </header>

        <div className="mb-16">
          <div className="grid grid-cols-12 gap-12">
            <div className="col-span-12">
              <p className="text-2xl font-medium leading-relaxed indent-20 first-letter:text-7xl first-letter:float-left first-letter:mr-3 first-letter:font-black first-letter:mt-1">
                {data.summary}
              </p>
            </div>
          </div>
        </div>

        <section className="mb-16">
          <h2 className="text-[10px] font-sans font-black uppercase tracking-[0.5em] text-slate-300 border-b border-slate-100 mb-10 pb-4">Professional Record</h2>
          <div className="space-y-16">
            {data.experience.map((exp) => (
              <div key={exp.id} className="grid grid-cols-12 gap-8 print:break-inside-avoid">
                <div className="col-span-3 text-[11px] font-sans font-black uppercase tracking-widest text-slate-400 pt-1">
                  {exp.startDate} — {exp.endDate}
                </div>
                <div className="col-span-9">
                  <h3 className="text-2xl font-bold mb-2">{exp.position}</h3>
                  <h4 className="text-lg font-medium italic text-slate-500 mb-4">{exp.company}</h4>
                  <p className="text-md leading-relaxed text-slate-700 whitespace-pre-line font-sans font-light">
                    {exp.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-2 gap-16 mb-16">
          <section>
             <h2 className="text-[10px] font-sans font-black uppercase tracking-[0.5em] text-slate-300 border-b border-slate-100 mb-8 pb-4">Education</h2>
             <div className="space-y-8">
               {data.education.map((edu) => (
                 <div key={edu.id} className="print:break-inside-avoid">
                   <h3 className="text-xl font-bold mb-1">{edu.degree}</h3>
                   <p className="text-md font-medium italic text-slate-500">{edu.institution}</p>
                   <span className="text-[10px] font-sans font-black uppercase tracking-widest text-slate-400 mt-2 block">{edu.fieldOfStudy} / {edu.endDate}</span>
                 </div>
               ))}
             </div>
          </section>
          
          <section>
            <h2 className="text-[10px] font-sans font-black uppercase tracking-[0.5em] text-slate-300 border-b border-slate-100 mb-8 pb-4">Expertise</h2>
            <div className="flex flex-wrap gap-x-6 gap-y-3">
              {data.skills.map((skill) => (
                <span key={skill.id} className="text-sm font-sans font-black uppercase tracking-widest text-slate-700 relative after:content-['/'] after:ml-4 after:text-slate-200 last:after:hidden print:break-inside-avoid">
                  {skill.name}
                </span>
              ))}
            </div>
          </section>
        </div>

        {data.projects && data.projects.length > 0 && (
          <section className="mb-16">
            <h2 className="text-[10px] font-sans font-black uppercase tracking-[0.5em] text-slate-300 border-b border-slate-100 mb-10 pb-4">Selected Works</h2>
            <div className="space-y-12">
              {data.projects.map((project) => (
                <div key={project.id} className="grid grid-cols-12 gap-8 print:break-inside-avoid">
                  <div className="col-span-3 text-[11px] font-sans font-black uppercase tracking-widest text-slate-400 pt-1">
                    {project.technologies}
                  </div>
                  <div className="col-span-9">
                    <h3 className="text-2xl font-bold mb-2">{project.name}</h3>
                    <p className="text-md leading-relaxed text-slate-700 font-sans font-light">
                      {project.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.certifications && data.certifications.length > 0 && (
          <section className="mb-16">
            <h2 className="text-[10px] font-sans font-black uppercase tracking-[0.5em] text-slate-300 border-b border-slate-100 mb-10 pb-4">Certifications</h2>
            <div className="grid grid-cols-2 gap-8">
              {data.certifications.map((cert) => (
                <div key={cert.id} className="print:break-inside-avoid">
                  <h3 className="text-xl font-bold mb-1">{cert.name}</h3>
                  <p className="text-md font-medium italic text-slate-500">{cert.issuer}</p>
                  <span className="text-[10px] font-sans font-black uppercase tracking-widest text-slate-400 mt-1 block">{cert.date}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ChronicleTemplate;

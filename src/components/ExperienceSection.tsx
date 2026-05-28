import { useState } from 'react';
import { Briefcase, Calendar, ChevronDown, ChevronUp, MapPin, Milestone } from 'lucide-react';

interface Job {
  id: string;
  title: string;
  company: string;
  period: string;
  description: string;
  bullets: string[];
  shadowColor: string;
  pointColor: string;
}

export default function ExperienceSection() {
  const [expandedJobId, setExpandedJobId] = useState<string | null>('lead');

  const jobs: Job[] = [
    {
      id: 'lead',
      title: 'Lead Systems Architect',
      company: 'NEURAL FLOW SYSTEMS',
      period: '2022 — PRESENT',
      description: 'Leading a team of 12 engineers in building next-gen AI processing pipelines. Reduced infrastructure overhead by 40% using automated resource scaling.',
      shadowColor: 'shadow-[0_0_10px_#BDFF00]',
      pointColor: 'bg-primary-fixed',
      bullets: [
        'Designed high-concurrency stream ingest pipelines sustaining sub-15ms processing targets.',
        'Slashed monthly cloud computing budgets by 40% through automated event-driven auto-scaling modules.',
        'Led standard container security configurations across 14 enterprise-level Kubernetes zones.',
        'Mentored junior developer cohorts in adopting ultra-clean, modular TypeScript implementations.'
      ]
    },
    {
      id: 'senior',
      title: 'Senior Full-Stack Engineer',
      company: 'CYBER-GRID LABS',
      period: '2020 — 2022',
      description: 'Developed the core telemetry engine for real-time monitoring of decentralized networks. Implementation of WebGL-based data visualization.',
      shadowColor: 'shadow-[0_0_10px_#d0bcff]',
      pointColor: 'bg-secondary',
      bullets: [
        'Authored and calibrated canvas rendering utilities representing complex node trees.',
        'Constructed highly secure auth wrappers implementing Oauth2 and stateless JWT strategies.',
        'Integrated multi-thread client listeners, supporting live tracking of 10k connection frames.'
      ]
    }
  ];

  const handleToggle = (id: string) => {
    setExpandedJobId(expandedJobId === id ? null : id);
  };

  return (
    <section className="py-stack-xl bg-[#0E0E0F] relative tracking-tight border-y border-white/5" id="experience">
      {/* Dynamic Background Words Grid */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden select-none">
        <div className="word-cloud-bg opacity-15">LEADERSHIP SYSTEMS SCALE</div>
      </div>

      <div className="max-w-container-max mx-auto px-gutter relative z-10">
        <div className="text-left mb-16">
          <span className="text-xs font-bold text-secondary uppercase mb-4 block tracking-wider">
            Experience Path
          </span>
          <h2 className="font-headline text-4xl md:text-5xl font-extrabold text-white tracking-tighter">
            Building Digital Foundations
          </h2>
        </div>

        {/* Timeline column */}
        <div className="relative max-w-4xl mx-auto">
          {/* Vertical line indicator */}
          <div className="absolute left-4 top-0 w-px h-full bg-gradient-to-b from-primary-fixed via-secondary to-transparent" />

          <div className="space-y-12">
            {jobs.map((job) => {
              const isExpanded = expandedJobId === job.id;
              return (
                <div 
                  key={job.id} 
                  className="relative pl-12 group transition-all"
                >
                  {/* Floating timeline indicator dot */}
                  <div 
                    className={`absolute left-4 top-8 w-2 h-2 rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-all ${job.pointColor} ${job.shadowColor} ${
                      isExpanded ? 'scale-150' : 'group-hover:scale-125'
                    }`}
                  />

                  <div className="bg-[#131314]/40 border border-outline-variant/15 p-6 hover:border-white/10 transition-all rounded-lg select-none">
                    <div 
                      onClick={() => handleToggle(job.id)}
                      className="flex justify-between items-center gap-4 cursor-pointer"
                    >
                      <div className="text-left">
                        <span className="text-xs font-medium text-on-surface-variant font-mono mb-2 block tracking-wide">
                          {job.period}
                        </span>
                        <h4 className="font-headline text-2xl font-extrabold text-[#bdff00] italic tracking-tighter inline-block mr-3">
                          {job.title}
                        </h4>
                        <p className="text-[10px] font-bold text-secondary uppercase tracking-[0.15em] mt-1">
                          {job.company}
                        </p>
                      </div>

                      <button 
                        className="text-on-surface-variant hover:text-white p-1 hover:bg-white/5 rounded transition-all"
                        aria-label={isExpanded ? "Collapse role bullets" : "Expand role bullets"}
                      >
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>
                    </div>

                    <p className="text-sm sm:text-base text-on-surface-variant mt-4 leading-relaxed font-sans text-left">
                      {job.description}
                    </p>

                    {/* Expandable accomplishment bullets */}
                    <div 
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        isExpanded ? 'max-h-[350px] opacity-100 mt-6 pt-6 border-t border-outline-variant/20' : 'max-h-0 opacity-0 mt-0 pt-0'
                      }`}
                    >
                      <h5 className="text-[10px] uppercase font-bold text-white tracking-widest mb-3 text-left">
                        Key Accomplishments
                      </h5>
                      <ul className="space-y-3 font-mono text-xs text-on-surface-variant">
                        {job.bullets.map((bullet, index) => (
                          <li key={index} className="flex gap-2 text-left leading-relaxed">
                            <span className="text-secondary select-none">$&gt;</span>
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

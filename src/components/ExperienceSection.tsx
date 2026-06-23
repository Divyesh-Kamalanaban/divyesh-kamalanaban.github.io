import { useState } from 'react';
import experienceContent from '../data/experience.json';
import ExperienceJobCard from './experience/ExperienceJobCard';

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
  const jobs = experienceContent.jobs as Job[];
  const [expandedJobId, setExpandedJobId] = useState<string | null>(jobs[0]?.id ?? null);

  return (
    <section className="py-stack-xl bg-[#0E0E0F] relative tracking-tight border-y border-white/5" id="experience">
      <div className="max-w-container-max mx-auto px-gutter relative z-10">
        <div className="text-left mb-16">
          <span className="text-xs font-bold text-secondary uppercase mb-4 block tracking-wider">
            {experienceContent.section.eyebrow}
          </span>
          <h2 className="font-headline text-4xl md:text-5xl font-extrabold text-white tracking-tighter">
            {experienceContent.section.title}
          </h2>
        </div>

        {/* Timeline column */}
        <div className="relative max-w-4xl mx-auto">
          {/* Vertical line indicator */}
          <div className="absolute left-4 top-0 w-px h-full bg-linear-to-b from-primary-fixed via-secondary to-transparent" />

          <div className="space-y-12">
            {jobs.map((job) => (
              <ExperienceJobCard
                key={job.id}
                job={job}
                isExpanded={expandedJobId === job.id}
                onToggle={() => setExpandedJobId((current) => (current === job.id ? null : job.id))}
                label={experienceContent.labels.keyAccomplishments}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

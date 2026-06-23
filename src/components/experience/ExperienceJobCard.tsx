import { ChevronDown, ChevronUp } from 'lucide-react';
import ExperienceBullets from './ExperienceBullets';
import ExperienceTimelineDot from './ExperienceTimelineDot';

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

interface ExperienceJobCardProps {
  job: Job;
  isExpanded: boolean;
  onToggle: () => void;
  label: string;
}

export default function ExperienceJobCard({ job, isExpanded, onToggle, label }: ExperienceJobCardProps) {
  const ToggleIcon = isExpanded ? ChevronUp : ChevronDown;

  return (
    <div className="relative pl-12 group transition-all">
      <ExperienceTimelineDot job={job} isExpanded={isExpanded} />

      <div className="bg-surface-dim/40 border border-outline-variant/15 p-6 hover:border-white/10 transition-all rounded-lg select-none">
        <div onClick={onToggle} className="flex justify-between items-center gap-4 cursor-pointer">
          <div className="text-left">
            <span className="text-xs font-medium text-on-surface-variant font-mono mb-2 block tracking-wide">{job.period}</span>
            <h4 className="font-headline text-2xl font-extrabold text-primary-fixed italic tracking-tighter inline-block mr-3">{job.title}</h4>
            <p className="text-[10px] font-bold text-secondary uppercase tracking-[0.15em] mt-1">{job.company}</p>
          </div>

          <button className="text-on-surface-variant hover:text-white p-1 hover:bg-white/5 rounded transition-all" aria-label={isExpanded ? 'Collapse role bullets' : 'Expand role bullets'}>
            <ToggleIcon className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm sm:text-base text-on-surface-variant mt-4 leading-relaxed font-sans text-left">{job.description}</p>

        <ExperienceBullets bullets={job.bullets} isExpanded={isExpanded} label={label} />
      </div>
    </div>
  );
}
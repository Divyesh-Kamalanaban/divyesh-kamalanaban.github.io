import type { ReactNode } from 'react';
import type { Project } from '../../types';
import { Link } from 'react-router-dom';

interface ProjectSummaryCardProps {
  project: Project;
  to: string;
  className: string;
  minHeight: string;
  icon?: ReactNode;
  footer: ReactNode;
}

export default function ProjectSummaryCard({ project, to, className, minHeight, icon, footer }: ProjectSummaryCardProps) {
  return (
    <Link to={to} className={`${className} group gradient-border select-none block`}>
      <div className={`glass-card p-8 h-full flex flex-col justify-between ${minHeight}`}>
        <div>
          {icon && (
            <div className="w-12 h-12 flex items-center justify-center bg-purple-900/40 text-secondary mb-6 rounded-lg border border-purple-500/20 group-hover:bg-primary-fixed group-hover:text-black transition-all">
              {icon}
            </div>
          )}
          <h3 className="font-headline text-2xl font-extrabold text-primary mb-4 tracking-tighter">{project.title}</h3>
          <p className="text-sm text-on-surface-variant tracking-normal leading-relaxed">{project.description}</p>
        </div>

        {footer}
      </div>
    </Link>
  );
}
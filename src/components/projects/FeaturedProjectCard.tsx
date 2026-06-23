import { ArrowRight } from 'lucide-react';
import type { Project } from '../../types';
import { Link } from 'react-router-dom';
import projectsContent from '../../data/projects.json';

interface FeaturedProjectCardProps {
  project: Project;
  to: string;
}

export default function FeaturedProjectCard({ project, to }: FeaturedProjectCardProps) {
  return (
    <Link to={to} className="md:col-span-8 group relative gradient-border select-none block">
      <div className="glass-card p-8 h-full min-h-85 flex flex-col justify-between overflow-hidden relative">
        {project.image && (
          <img
            className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-30 group-hover:scale-[1.03] transition-all duration-700 pointer-events-none"
            alt={project.title}
            src={project.image}
          />
        )}

        <div className="relative z-10 text-left">
          <div className="flex gap-2 mb-6">
            {project.tags.map((tag) => (
              <span key={tag} className="bg-surface-container-highest px-3 py-1 text-[10px] font-bold text-primary tracking-wider uppercase select-none">
                {tag}
              </span>
            ))}
          </div>
          <h3 className="font-headline text-2xl md:text-3xl font-extrabold text-primary mb-4 tracking-tighter hover:text-primary-fixed transition-colors">
            {project.title}
          </h3>
          <p className="text-sm sm:text-base text-on-surface-variant max-w-lg tracking-normal leading-relaxed">{project.description}</p>
        </div>

        <div className="relative z-10 pt-8 flex items-center justify-between border-t border-outline-variant/25">
          <span className="text-xs font-bold text-primary-fixed tracking-wider flex items-center gap-2 group-hover:translate-x-2 transition-transform">
            View Case Study <ArrowRight className="w-3.5 h-3.5" />
          </span>
          {project.version && (
            <span className="text-xs text-outline-variant font-medium tracking-tight font-mono select-none">{project.version}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
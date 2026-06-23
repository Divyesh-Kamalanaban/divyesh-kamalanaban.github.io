import { Link } from 'react-router-dom';
import projectsContent from '../../data/projects.json';
import type { Project } from '../../types';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function ProjectsListRoute() {
  const projects = projectsContent.projects as Project[];

  return (
    <section className="min-h-screen w-full">
      {/* 100vh Hero Header */}
      <div className="h-screen flex flex-col justify-center items-center text-center px-gutter relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary-fixed/5 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary-fixed/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="text-xs font-bold text-primary uppercase tracking-[0.3em] mb-6 block">
            {projectsContent.section.eyebrow}
          </span>
          <h1 className="font-headline text-6xl md:text-8xl lg:text-9xl font-extrabold text-primary tracking-tighter mb-6">
            Projects
          </h1>
          <p className="text-base md:text-lg text-on-surface-variant leading-relaxed max-w-xl mx-auto">
            {projectsContent.section.description}
          </p>
          <div className="mt-10 flex items-center justify-center gap-3 text-white/40 text-xs font-mono tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-primary-fixed animate-pulse" />
            <span>Scroll to explore</span>
            <Sparkles className="w-3.5 h-3.5 text-primary-fixed animate-pulse" />
          </div>
        </div>
      </div>

      {/* Project Grid */}
      <div className="max-w-container-max mx-auto px-gutter pb-24 -mt-32 relative z-20">
        {/* Row 1: Featured (col-span-8) + Standard (col-span-4) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
          {/* Featured: Sororine */}
          <Link key={projects[0].id} to={`/projects/${projects[0].id}`} className="md:col-span-8 group gradient-border block">
            <div className="glass-card p-6 h-full min-h-85 flex flex-col justify-between overflow-hidden relative">
              {projects[0].image && (
                <img src={projects[0].image} alt={projects[0].title} className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-30 group-hover:scale-[1.03] transition-all duration-700 pointer-events-none" />
              )}
              <div className="relative z-10 text-left">
                <div className="flex flex-wrap gap-2 mb-4">
                  {projects[0].tags.map((tag) => (
                    <span key={tag} className="bg-surface-container-highest px-3 py-1 text-[10px] font-bold text-primary tracking-wider uppercase">{tag}</span>
                  ))}
                </div>
                <h2 className="font-headline text-2xl md:text-3xl font-extrabold text-primary tracking-tighter mb-3">{projects[0].title}</h2>
                <p className="text-sm text-on-surface-variant leading-relaxed max-w-lg">{projects[0].description}</p>
              </div>
              <div className="relative z-10 pt-6 border-t border-outline-variant/25 flex items-center justify-between">
                <span className="text-xs font-bold text-primary-fixed tracking-wider uppercase flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                  View Case Study <ArrowRight className="w-3.5 h-3.5" />
                </span>
                {projects[0].version && (
                  <span className="text-xs text-outline-variant font-medium tracking-tight font-mono">{projects[0].version}</span>
                )}
              </div>
            </div>
          </Link>

          {/* Standard: SleeQC */}
          <Link key={projects[1].id} to={`/projects/${projects[1].id}`} className="md:col-span-4 group gradient-border block">
            <div className="glass-card p-8 h-full min-h-85 flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {projects[1].tags.map((tag) => (
                    <span key={tag} className="bg-surface-container-highest px-3 py-1 text-[10px] font-bold text-primary tracking-wider uppercase">{tag}</span>
                  ))}
                </div>
                <h2 className="font-headline text-2xl font-extrabold text-primary tracking-tighter mb-3">{projects[1].title}</h2>
                <p className="text-sm text-on-surface-variant leading-relaxed">{projects[1].description}</p>
              </div>
              <div className="pt-6 border-t border-outline-variant/25 mt-6 flex items-center justify-between">
                <span className="text-xs font-bold text-primary-fixed tracking-wider uppercase flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                  View Case Study <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* Row 2: Remaining projects in 3-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {projects.slice(2).map((project) => (
            <Link key={project.id} to={`/projects/${project.id}`} className="md:col-span-4 group gradient-border block">
              <div className="glass-card p-8 h-full min-h-45 flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="bg-surface-container-highest px-3 py-1 text-[10px] font-bold text-primary tracking-wider uppercase">{tag}</span>
                    ))}
                  </div>
                  <h2 className="font-headline text-2xl font-extrabold text-primary tracking-tighter mb-3">{project.title}</h2>
                  <p className="text-sm text-on-surface-variant leading-relaxed">{project.description}</p>
                </div>
                <div className="pt-4 border-t border-outline-variant/20 mt-4 flex items-center justify-between">
                  <span className="text-xs font-bold text-primary-fixed tracking-wider uppercase flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                    Read more <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
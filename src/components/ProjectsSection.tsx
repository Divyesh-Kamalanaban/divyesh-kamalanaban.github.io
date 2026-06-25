import projectsContent from '../data/projects.json';
import type { Project } from '../types';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function ProjectsSection() {
  const projects = projectsContent.projects as Project[];

  return (
    <section className="py-stack-xl max-w-container-max mx-auto px-gutter relative tracking-tight" id="projects">
      <div className="relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="text-left">
            <span className="text-xs font-bold text-primary uppercase border-l-4 border-primary-fixed pl-4 mb-4 block tracking-wider">
              {projectsContent.section.eyebrow}
            </span>
            <h2 className="font-headline text-4xl md:text-5xl font-extrabold text-primary tracking-tighter">
              {projectsContent.section.title}
            </h2>
          </div>
          <p className="text-base text-on-surface-variant max-w-md tracking-normal text-left sm:text-right">
            {projectsContent.section.description}
          </p>
        </div>

        {/* Row 1: Featured (col-span-8) + Standard (col-span-4) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
          <Link to={`/projects/${projects[0].id}`} className="md:col-span-8 group gradient-border block">
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
                <h3 className="font-headline text-2xl md:text-3xl font-extrabold text-primary tracking-tighter mb-3">{projects[0].title}</h3>
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

          <Link to={`/projects/${projects[1].id}`} className="md:col-span-4 group gradient-border block">
            <div className="glass-card p-8 h-full min-h-85 flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {projects[1].tags.map((tag) => (
                    <span key={tag} className="bg-surface-container-highest px-3 py-1 text-[10px] font-bold text-primary tracking-wider uppercase">{tag}</span>
                  ))}
                </div>
                <h3 className="font-headline text-2xl font-extrabold text-primary tracking-tighter mb-3">{projects[1].title}</h3>
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
          {projects.slice(2, 5).map((project) => (
            <Link key={project.id} to={`/projects/${project.id}`} className="md:col-span-4 group gradient-border block">
              <div className="glass-card p-8 h-full min-h-45 flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="bg-surface-container-highest px-3 py-1 text-[10px] font-bold text-primary tracking-wider uppercase">{tag}</span>
                    ))}
                  </div>
                  <h3 className="font-headline text-2xl font-extrabold text-primary tracking-tighter mb-3">{project.title}</h3>
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

        {/* View All Projects Button */}
        <div className="flex justify-center mt-10">
          <Link
            to="/projects"
            className="group inline-flex items-center gap-2.5 px-6 py-3 border border-white/20 hover:border-primary-fixed/50 text-white/80 hover:text-primary-fixed text-sm font-bold font-mono tracking-wider uppercase rounded-lg transition-all duration-300 hover:bg-white/[0.03]"
          >
            <span>View All Projects</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}

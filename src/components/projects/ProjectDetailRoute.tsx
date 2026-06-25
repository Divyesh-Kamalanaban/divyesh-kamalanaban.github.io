import { useParams, Link } from 'react-router-dom';
import projectsContent from '../../data/projects.json';
import type { Project } from '../../types';

export default function ProjectDetailRoute() {
  const { id } = useParams<{ id: string }>();
  const project = projectsContent.projects.find((p) => p.id === id) as Project | undefined;

  if (!project) {
    return (
      <section className="min-h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-headline text-4xl font-extrabold text-white mb-4">Project Not Found</h1>
          <Link to="/projects" className="text-primary-fixed hover:text-primary transition-colors">← Back to Projects</Link>
        </div>
      </section>
    );
  }

  return (
    <article className="pt-24 pb-16 px-gutter max-w-container-max mx-auto">
      <Link to="/projects" className="text-xs font-bold text-primary-fixed tracking-wider uppercase mb-8 block">
        ← All Projects
      </Link>

      {/* Header */}
      <div className="mb-10">
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.map((tag) => (
            <span key={tag} className="bg-surface-container-highest px-3 py-1 text-[10px] font-bold text-primary tracking-wider uppercase">
              {tag}
            </span>
          ))}
        </div>
        <h1 className="font-headline text-4xl md:text-5xl font-extrabold text-primary tracking-tighter mb-4">
          {project.title}
        </h1>
        <p className="text-base md:text-lg text-on-surface-variant leading-relaxed max-w-3xl">
          {project.description}
        </p>
        {project.version && (
          <span className="inline-block mt-4 px-3 py-1.5 border border-outline-variant/40 text-xs font-mono text-outline-variant">
            {project.version}
          </span>
        )}
      </div>

      {/* Image — full width, no height cap */}
      {project.image && (
        <div className="mb-12">
          <div className="rounded-lg border border-outline-variant/20 overflow-hidden bg-surface-container-low">
            <img
              src={project.image}
              alt={project.title}
              className="w-full object-cover"
              style={{ maxHeight: '65vh', minHeight: '240px' }}
            />
          </div>
        </div>
      )}

      {/* Content grid: Mission + Key Takeaways */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {project.details?.mission && (
          <div className="gradient-border">
            <div className="glass-card p-6 h-full">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-fixed" />
                <h2 className="font-headline text-base font-extrabold text-primary-fixed tracking-tighter uppercase">Mission</h2>
              </div>
              <p className="text-sm text-on-surface-variant leading-relaxed pl-4 border-l-2 border-primary-fixed/20">
                {project.details.mission}
              </p>
            </div>
          </div>
        )}

        {project.details?.keyTakeaways && (
          <div className="gradient-border">
            <div className="glass-card p-6 h-full">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                <h2 className="font-headline text-base font-extrabold text-secondary tracking-tighter uppercase">Key Takeaways</h2>
              </div>
              <div className="pl-4 border-l-2 border-secondary/20">
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  {project.details.keyTakeaways}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Implementation details */}
      {project.details?.implementationDetails && (
        <div className="gradient-border mb-10">
          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <span className="w-2 h-2 rounded-full bg-cyan-400/60" />
                <span className="w-2 h-2 rounded-full bg-cyan-400/30" />
              </div>
              <h2 className="font-headline text-base font-extrabold text-cyan-400 tracking-tighter uppercase">Technical Implementation</h2>
            </div>
            <ul className="space-y-4">
              {project.details.implementationDetails.map((item, idx) => (
                <li key={item} className="flex gap-4 text-sm text-on-surface-variant leading-relaxed">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white/5 text-[10px] font-bold font-mono text-white/40 flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="pt-0.5">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-4">
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 bg-white text-black hover:bg-primary-fixed text-xs uppercase font-extrabold tracking-wider transition-all"
        >
          View Project →
        </a>
        <Link
          to="/projects"
          className="px-6 py-3 border border-outline-variant/40 text-white hover:border-primary-fixed hover:text-primary-fixed text-xs uppercase font-extrabold tracking-wider transition-all"
        >
          ← All Projects
        </Link>
      </div>
    </article>
  );
}
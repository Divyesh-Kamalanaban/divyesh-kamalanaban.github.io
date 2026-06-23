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

      {/* Image */}
      {project.image && (
        <div className="mb-10">
          <img
            src={project.image}
            alt={project.image}
            className="w-full h-auto max-h-[50vh] object-contain rounded-lg border border-outline-variant/20"
          />
        </div>
      )}

      {/* Content grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {project.details?.mission && (
          <div className="gradient-border">
            <div className="glass-card p-6">
              <h2 className="font-headline text-lg font-extrabold text-primary tracking-tighter mb-3">Mission</h2>
              <p className="text-sm text-on-surface-variant leading-relaxed">{project.details.mission}</p>
            </div>
          </div>
        )}

        {project.details?.keyTakeaways && (
          <div className="gradient-border">
            <div className="glass-card p-6">
              <h2 className="font-headline text-lg font-extrabold text-primary tracking-tighter mb-3">Key Takeaways</h2>
              <p className="text-sm text-on-surface-variant leading-relaxed">{project.details.keyTakeaways}</p>
            </div>
          </div>
        )}
      </div>

      {/* Implementation details */}
      {project.details?.implementationDetails && (
        <div className="gradient-border mb-10">
          <div className="glass-card p-6">
            <h2 className="font-headline text-lg font-extrabold text-primary tracking-tighter mb-4">Technical Implementation</h2>
            <ul className="space-y-3">
              {project.details.implementationDetails.map((item) => (
                <li key={item} className="flex gap-3 text-sm text-on-surface-variant leading-relaxed">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary-fixed flex-shrink-0" />
                  <span>{item}</span>
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
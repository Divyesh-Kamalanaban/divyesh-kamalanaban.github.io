import { Star } from 'lucide-react';
import projectsContent from '../../data/projects.json';

interface ProjectOpenSourceCardProps {
  stars: number;
  hasStarred: boolean;
  onStarClick: () => void;
}

export default function ProjectOpenSourceCard({ stars, hasStarred, onStarClick }: ProjectOpenSourceCardProps) {
  return (
    <div className="md:col-span-4 group gradient-border select-none text-left relative">
      <div className="glass-card p-8 h-full bg-linear-to-br from-purple-500/10 to-transparent flex flex-col justify-between min-h-45">
        <div>
          <h3 className="font-headline text-2xl font-extrabold text-primary mb-4 tracking-tighter">{projectsContent.openSource.title}</h3>
          <p className="text-sm text-on-surface-variant mb-6 tracking-normal leading-relaxed">{projectsContent.openSource.description}</p>
        </div>

        <button
          onClick={onStarClick}
          className={`flex items-center justify-between w-full px-4 py-3 border transition-all ${
            hasStarred ? 'bg-primary-fixed text-black border-primary-fixed font-bold' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
          }`}
          title="Star project on GitHub"
        >
          <div className="flex items-center gap-2">
            <Star className={`w-4 h-4 ${hasStarred ? 'fill-black' : 'fill-white/80'}`} />
            <span className="text-xs uppercase tracking-wider font-extrabold font-mono">
              {hasStarred ? 'Starred!' : 'Star on GitHub'}
            </span>
          </div>
          <span className="text-xs font-mono opacity-80">{stars.toLocaleString()} Stars</span>
        </button>
      </div>
    </div>
  );
}
interface ExperienceBulletsProps {
  bullets: string[];
  isExpanded: boolean;
  label: string;
}

export default function ExperienceBullets({ bullets, isExpanded, label }: ExperienceBulletsProps) {
  if (!isExpanded) return null;

  return (
    <div className="overflow-hidden transition-all duration-300 ease-in-out max-h-87.5 opacity-100 mt-6 pt-6 border-t border-outline-variant/20">
      <h5 className="text-[10px] uppercase font-bold text-white tracking-widest mb-3 text-left">{label}</h5>
      <ul className="space-y-3 font-mono text-xs text-on-surface-variant">
        {bullets.map((bullet, index) => (
          <li key={index} className="flex gap-2 text-left leading-relaxed">
            <span className="text-secondary select-none">$&gt;</span>
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
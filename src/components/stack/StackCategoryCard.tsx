import type { SkillCategory, SkillItem } from './stackTypes';
import StackSkillRow from './StackSkillRow';

interface StackCategoryCardProps {
  category: SkillCategory;
  selectedSkillName: string | null;
  onSelect: (skill: SkillItem) => void;
}

export default function StackCategoryCard({ category, selectedSkillName, onSelect }: StackCategoryCardProps) {
  return (
    <div className="group gradient-border text-left h-full">
      <div className="glass-card p-6 h-full flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h5 className="text-xs font-extrabold text-primary uppercase tracking-[0.2em] border-l-2 border-primary-fixed pl-2 select-none">
            {category.title}
          </h5>
          <span className="text-[9px] font-mono text-white/50">{category.subTitle}</span>
        </div>

        <ul className="text-sm text-on-surface-variant space-y-4 font-semibold font-mono">
          {category.skills.map((skill) => (
            <StackSkillRow
              key={skill.name}
              skill={skill}
              isSelected={selectedSkillName === skill.name}
              onSelect={onSelect}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}
import { Check } from 'lucide-react';
import { getBrandSlug } from './brandIcons';
import type { SkillItem } from './stackTypes';
import StackSkillIcon from './StackSkillIcon';

function getRowClasses(isSelected: boolean): string {
  if (isSelected) {
    return 'bg-primary-fixed/10 border-primary-fixed/40 text-white';
  }

  return 'border-transparent hover:border-white/10 hover:bg-white/5';
}

interface StackSkillRowProps {
  skill: SkillItem;
  isSelected: boolean;
  onSelect: (skill: SkillItem) => void;
}

export default function StackSkillRow({ skill, isSelected, onSelect }: StackSkillRowProps) {
  const slug = getBrandSlug(skill.name);
  const iconUrl = `https://cdn.simpleicons.org/${slug}/${isSelected ? 'bdff00' : '8a8e94'}`;

  return (
    <li
      onClick={() => onSelect(skill)}
      className={`flex items-center justify-between p-2.5 rounded border transition-all cursor-pointer ${getRowClasses(isSelected)}`}
    >
      <div className="flex items-center gap-2.5">
        <StackSkillIcon slug={slug} iconUrl={iconUrl} skillName={skill.name} />
        <span className={isSelected ? 'text-primary-fixed' : ''}>{skill.name}</span>
      </div>
      {isSelected && <Check className="w-3.5 h-3.5 text-primary-fixed" />}
    </li>
  );
}
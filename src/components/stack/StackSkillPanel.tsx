import { Sparkles } from 'lucide-react';

interface SelectedSkill {
  name: string;
  desc: string;
}

interface StackSkillPanelProps {
  selectedSkill: SelectedSkill;
  prefix: string;
}

export default function StackSkillPanel({ selectedSkill, prefix }: StackSkillPanelProps) {
  return (
    <div className="max-w-4xl mx-auto bg-surface-dim/90 border border-outline-variant/30 p-6 rounded-lg text-left shadow-xl select-all">
      <div className="flex items-center gap-3 mb-2">
        <Sparkles className="w-4 h-4 text-primary-fixed animate-pulse" />
        <p className="text-[10px] font-mono font-black uppercase text-primary tracking-widest leading-none">
          {prefix} {selectedSkill.name}
        </p>
      </div>
      <p className="text-sm text-on-surface-variant font-mono pl-7">
        {selectedSkill.desc}
      </p>
    </div>
  );
}
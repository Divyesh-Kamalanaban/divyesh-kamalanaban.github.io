import { useState } from 'react';
import stackContent from '../data/stack.json';
import type { SkillCategory, SkillItem } from './stack/stackTypes';
import StackCategoryCard from './stack/StackCategoryCard';
import StackSkillPanel from './stack/StackSkillPanel';

export default function StackSection() {
  const [selectedSkill, setSelectedSkill] = useState<{ name: string; desc: string } | null>({
    name: stackContent.selectedSkill.name,
    desc: stackContent.selectedSkill.description
  });
  const categories = stackContent.categories as SkillCategory[];

  // First category is AI/ML (tall left column), rest are stacked on the right
  const aiMlCategory = categories[0];
  const otherCategories = categories.slice(1);

  return (
    <section className="py-stack-xl relative tracking-tight bg-[#0E0E0F]" id="stack">
      <div className="max-w-container-max mx-auto px-gutter relative z-10">
        <div className="text-left mb-16">
          <span className="text-xs font-bold text-secondary uppercase mb-4 block tracking-wider">
            {stackContent.section.eyebrow}
          </span>
          <h2 className="font-headline text-4xl md:text-5xl font-extrabold text-white tracking-tighter">
            {stackContent.section.title}
          </h2>
        </div>

        {/* Two-column layout: tall AI/ML on left, stacked others on right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 lg:[grid-template-rows:1fr] gap-6 mb-12">
          {/* Left: AI/ML & LLMs */}
          <div className="lg:col-span-5">
            <StackCategoryCard
              category={aiMlCategory}
              selectedSkillName={selectedSkill?.name ?? null}
              onSelect={(skill) => setSelectedSkill({ name: skill.name, desc: skill.description })}
            />
          </div>

          {/* Right: 4 categories in 2-col × 2-row grid with 1fr rows */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 [grid-template-rows:1fr_1fr] gap-6">
            {otherCategories.map((category) => (
              <StackCategoryCard
                key={category.title}
                category={category}
                selectedSkillName={selectedSkill?.name ?? null}
                onSelect={(skill) => setSelectedSkill({ name: skill.name, desc: skill.description })}
              />
            ))}
          </div>
        </div>

        {/* Interactive Specs Shell (Explains selected skills dynamically) */}
        {selectedSkill && <StackSkillPanel selectedSkill={selectedSkill} prefix={stackContent.labels.telemetricSpecsPrefix} />}
      </div>
    </section>
  );
}

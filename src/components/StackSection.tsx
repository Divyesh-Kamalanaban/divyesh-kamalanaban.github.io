import { useState } from 'react';
import { Check, Sparkles } from 'lucide-react';

interface SkillItem {
  name: string;
  description: string;
}

interface SkillCategory {
  title: string;
  subTitle: string;
  borderColor: string;
  skills: SkillItem[];
}

const getBrandSlug = (name: string): string => {
  const map: Record<string, string> = {
    GOLANG: 'go',
    RUST: 'rust',
    KUBERNETES: 'kubernetes',
    TERRAFORM: 'terraform',
    TYPESCRIPT: 'typescript',
    'NEXT.JS': 'nextdotjs',
    TAILWIND: 'tailwindcss',
    'THREE.JS': 'threedotjs',
    POSTGRESQL: 'postgresql',
    REDIS: 'redis',
    PYTORCH: 'pytorch',
    TENSORFLOW: 'tensorflow',
    OAUTH2: 'oauth',
    JWT: 'jsonwebtokens',
    VAULT: 'vault',
    'TLS/SSL': 'letsencrypt'
  };
  return map[name] || '';
};

export default function StackSection() {
  const [selectedSkill, setSelectedSkill] = useState<{ name: string; desc: string } | null>({
    name: 'RUST',
    desc: 'Leveraged to craft low-overhead parallel execution runtimes and sub-10ms secure data brokers.'
  });

  const categories: SkillCategory[] = [
    {
      title: 'Backend / Infra',
      subTitle: 'Scalable Services',
      borderColor: 'group-hover:border-[#bdff00]',
      skills: [
        { name: 'GOLANG', description: 'Used for distributed microservices pipelines and high-throughput TCP network relays.' },
        { name: 'RUST', description: 'Leveraged to craft low-overhead parallel execution runtimes and sub-10ms secure data brokers.' },
        { name: 'KUBERNETES', description: 'Orchestrating isolated cloud infrastructure, enabling automated rolling updates and zero-downtime health probes.' },
        { name: 'TERRAFORM', description: 'Specifying structured Infrastructure-as-Code setups to provision reproducible multi-region AWS templates.' }
      ]
    },
    {
      title: 'Frontend / UX',
      subTitle: 'High Fidelity UI',
      borderColor: 'group-hover:border-secondary',
      skills: [
        { name: 'TYPESCRIPT', description: 'Enforcing robust compilation guidelines and robust semantic models across client codebase.' },
        { name: 'NEXT.JS', description: 'Utilized to static pre-render user screens and establish high speed edge pre-fetching channels.' },
        { name: 'TAILWIND', description: 'Structuring unified spacing rhythms, color palettes, and responsive grid layouts fluently.' },
        { name: 'THREE.JS', description: 'Rendering interactive GL viewports and real-time canvas visualizations beautifully.' }
      ]
    },
    {
      title: 'Data / AI',
      subTitle: 'Intelligence Matrix',
      borderColor: 'group-hover:border-[#acedff]',
      skills: [
        { name: 'POSTGRESQL', description: 'Reliable transactional storage, indexing optimized relational structures with sub-5ms query response.' },
        { name: 'REDIS', description: 'Constructing lighting fast key-value states cache layers and real-time message broadcasting nodes.' },
        { name: 'PYTORCH', description: 'Training feed-forward networks and calibrating local inference layers for quick image evaluations.' },
        { name: 'TENSORFLOW', description: 'Designing modular convolution networks to parse real-time camera feeds or sensory inputs.' }
      ]
    },
    {
      title: 'Security',
      subTitle: 'Hardened Guardrails',
      borderColor: 'group-hover:border-[#434933]',
      skills: [
        { name: 'OAUTH2', description: 'Integrating stateless delegated authorization protocols spanning external verification nodes safely.' },
        { name: 'JWT', description: 'Exchanging cryptographically signed user payloads without introducing heavy session databases queries.' },
        { name: 'VAULT', description: 'Securing sensitive credentials, generating temporary keys dynamically and isolating access pathways.' },
        { name: 'TLS/SSL', description: 'Securing communication channels and certifying public interfaces with active end-to-end cypher protection.' }
      ]
    }
  ];

  const handleSkillSelect = (skill: SkillItem) => {
    setSelectedSkill({ name: skill.name, desc: skill.description });
  };

  return (
    <section className="py-stack-xl relative tracking-tight bg-[#0E0E0F]" id="stack">
      {/* Background Graphic elements */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden select-none">
        <div className="word-cloud-bg opacity-15">AI PYTHON PYTORCH RUST</div>
      </div>

      <div className="max-w-container-max mx-auto px-gutter relative z-10">
        <div className="text-left mb-16">
          <span className="text-xs font-bold text-secondary uppercase mb-4 block tracking-wider">
            Intelligence Core
          </span>
          <h2 className="font-headline text-4xl md:text-5xl font-extrabold text-white tracking-tighter">
            System Stack
          </h2>
        </div>

        {/* 4-column stack Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {categories.map((cat, idx) => (
            <div 
              key={idx} 
              className="group gradient-border text-left"
            >
              <div className="glass-card p-6 h-full flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <h5 className="text-xs font-extrabold text-primary uppercase tracking-[0.2em] border-l-2 border-[#bdff00] pl-2 select-none">
                    {cat.title}
                  </h5>
                  <span className="text-[9px] font-mono text-white/50">{cat.subTitle}</span>
                </div>
                
                <ul className="text-sm text-on-surface-variant space-y-4 font-semibold font-mono">
                  {cat.skills.map((skill) => {
                    const isSelected = selectedSkill?.name === skill.name;
                    const slug = getBrandSlug(skill.name);
                    const iconUrl = slug ? `https://cdn.simpleicons.org/${slug}/${isSelected ? 'bdff00' : '8a8e94'}` : '';
                    return (
                      <li 
                        key={skill.name}
                        onClick={() => handleSkillSelect(skill)}
                        className={`flex items-center justify-between p-2.5 rounded border transition-all cursor-pointer ${
                          isSelected 
                            ? 'bg-[#bdff00]/10 border-[#bdff00]/40 text-white' 
                            : 'border-transparent hover:border-white/10 hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          {slug ? (
                            <img 
                              src={iconUrl} 
                              alt={`${skill.name} logo`} 
                              className="w-4 h-4 object-contain transition-all"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="w-4 h-4 rounded-full bg-white/10" />
                          )}
                          <span className={isSelected ? 'text-[#bdff00]' : ''}>{skill.name}</span>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#bdff00]" />}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Specs Shell (Explains selected skills dynamically) */}
        {selectedSkill && (
          <div className="max-w-4xl mx-auto bg-[#131314]/90 border border-outline-variant/30 p-6 rounded-lg text-left shadow-xl select-all">
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="w-4 h-4 text-[#bdff00] animate-pulse" />
              <p className="text-[10px] font-mono font-black uppercase text-primary tracking-widest leading-none">
                Telemetric Specs // {selectedSkill.name}
              </p>
            </div>
            <p className="text-sm text-on-surface-variant font-mono pl-7">
              {selectedSkill.desc}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

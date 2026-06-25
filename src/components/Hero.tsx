import { Database, FileText, Sparkles, Code, Cpu } from 'lucide-react';
import siteContent from '../data/ui.json';
import heroContent from '../data/hero.json';

interface HeroProps {
  onInitialize: () => void;
}

export default function Hero({ onInitialize }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden tracking-tight bg-[#0E0E0F]">
      {/* Background Interactive Aura */}
      <div className="absolute top-1/3 left-1/4 -translate-y-1/2 neural-glow w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] bg-purple-900/10 rounded-full z-0 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 neural-glow w-[350px] h-[350px] sm:w-[600px] sm:h-[600px] bg-cyan-950/10 rounded-full z-0 pointer-events-none" />
      <div className="absolute top-1/2 right-1/3 neural-glow-fast w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] bg-emerald-950/10 rounded-full z-0 pointer-events-none" />

      <div className="relative z-10 text-center max-w-4xl px-gutter mx-auto">

        {/* Avatar with animated gradient ring */}
        <div className="flex justify-center mb-8">
          <div className="avatar-ring inline-flex">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-surface-container-high overflow-hidden border-2 border-black/30">
              <img
                src={heroContent.avatar.src}
                alt={heroContent.avatar.alt}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = 'none';
                  if (target.parentElement) {
                    target.parentElement.classList.add('flex', 'items-center', 'justify-center');
                    const fallback = document.createElement('span');
                    fallback.className = 'text-3xl font-headline font-black text-white/40';
                    fallback.textContent = heroContent.avatar.initials;
                    target.parentElement.appendChild(fallback);
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Hero Title */}
        <h1 className="font-headline text-4xl sm:text-5xl md:text-7.5xl font-black text-white mb-8 leading-tight tracking-tighter max-w-[95%] mx-auto">
          {siteContent.hero.headlinePrefix} <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary-fixed italic p-0.75 md:p-1 ">{siteContent.hero.headlineHighlight}</span> {siteContent.hero.headlineSuffix}
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto mb-12 tracking-normal leading-relaxed">
          {siteContent.hero.subtitle}
        </p>

        {/* Tech stack mini-badges */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {heroContent.skills.map((tech) => (
            <span
              key={tech}
              className="text-[10px] font-bold font-mono tracking-wider uppercase px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-white/50 hover:text-primary-fixed hover:border-primary-fixed/30 transition-colors duration-200"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Action controls */}
        <div className="flex flex-col sm:flex-row gap-5 justify-center items-center max-w-lg mx-auto">
          <button
            onClick={onInitialize}
            className="w-full sm:w-auto px-10 py-4 bg-primary-fixed text-on-primary-fixed hover:bg-white hover:text-black hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] text-xs uppercase font-black tracking-wider transition-all duration-300 active:scale-95 cursor-pointer relative z-20 flex items-center justify-center gap-2"
          >
            <FileText className="w-4 h-4" />
            <span>{siteContent.hero.initializeButton}</span>
          </button>
        

          <button
            onClick={() => {
              const target = document.getElementById('projects');
              if (target) {
                const navOffset = 64;
                const top = target.getBoundingClientRect().top + window.scrollY - navOffset;
                window.scrollTo({ top, behavior: 'smooth' });
              }
            }}
            className="w-full sm:w-auto px-10 py-4 border border-white/20 text-white hover:border-[#bdff00] hover:text-[#bdff00] text-xs uppercase font-bold tracking-wider hover:bg-white/5 transition-all duration-300 active:scale-95 cursor-pointer relative z-20 flex items-center justify-center gap-2 group"
          >
            <Database className="w-4 h-4 text-white/40 group-hover:text-[#bdff00] transition-colors" />
            <span>{siteContent.hero.deploymentsButton}</span>
          </button>
        </div>

      </div>
    </section>
  );
}
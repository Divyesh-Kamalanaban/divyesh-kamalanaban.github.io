import { useState, useEffect } from 'react';
import { Cpu, Loader2, CheckCircle, Database } from 'lucide-react';

interface HeroProps {
  onInitialize: () => void;
}

export default function Hero({ onInitialize }: HeroProps) {
  const [latency, setLatency] = useState(12);
  const [initStage, setInitStage] = useState<'idle' | 'linking' | 'syncing' | 'completed'>('idle');
  const [percent, setPercent] = useState(0);

  // Fluctuating latency simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setLatency((prev) => {
        const offset = Math.random() > 0.5 ? 1 : -1;
        const next = prev + offset;
        return next < 8 ? 8 : next > 16 ? 16 : next;
      });
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const handleInitClick = () => {
    if (initStage !== 'idle') return;
    setInitStage('linking');
    onInitialize();

    let value = 0;
    const interval = setInterval(() => {
      value += Math.floor(Math.random() * 8) + 5;
      if (value >= 100) {
        value = 100;
        setPercent(100);
        setInitStage('completed');
        clearInterval(interval);
        setTimeout(() => {
          setInitStage('idle');
          setPercent(0);
        }, 1500);
      } else {
        setPercent(value);
      }
    }, 150);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden tracking-tight bg-[#0E0E0F]">
      {/* Background Interactive Aura */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 neural-glow w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] bg-purple-900/10 rounded-full z-0 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 neural-glow w-[350px] h-[350px] sm:w-[600px] sm:h-[600px] bg-cyan-950/10 rounded-full z-0 pointer-events-none" />

      <div className="relative z-10 text-center max-w-4xl px-gutter mx-auto">
        {/* Metric Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-outline-variant/30 bg-[#0E0E0F]/60 backdrop-blur-md mb-8">
          <span className="w-2 h-2 rounded-full bg-[#bdff00] animate-pulse" />
          <span className="text-[10px] text-primary select-none tracking-[0.1em] uppercase font-bold font-mono">
            System Latency: {latency}ms // AI Status: Operational
          </span>
        </div>

        {/* Hero Title */}
        <h1 className="font-headline text-4xl sm:text-5xl md:text-7.5xl font-black text-white mb-8 leading-tight tracking-tighter max-w-[95%] mx-auto">
          Engineering the <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary-fixed italic">Neural Pulse</span> of Digital Systems.
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto mb-12 tracking-normal leading-relaxed">
          Specializing in high-concurrency architectures and machine learning integration. I build systems that don't just process data—they anticipate it.
        </p>

        {/* Action controls */}
        <div className="flex flex-col sm:flex-row gap-5 justify-center items-center max-w-lg mx-auto">
          {initStage === 'idle' ? (
            <button
              onClick={handleInitClick}
              className="w-full sm:w-auto px-10 py-4 bg-primary-fixed text-on-primary-fixed hover:bg-white hover:text-black hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] text-xs uppercase font-black tracking-wider transition-all duration-300 active:scale-95 cursor-pointer relative z-20 flex items-center justify-center gap-2"
            >
              <Cpu className="w-4 h-4" />
              <span>Initialize Project</span>
            </button>
          ) : (
            <div className="w-full sm:w-auto min-w-[210px] bg-surface-container-low border border-primary-fixed/30 px-6 py-3.5 flex items-center gap-3">
              {initStage === 'completed' ? (
                <CheckCircle className="w-4 h-4 text-[#bdff00]" />
              ) : (
                <Loader2 className="w-4 h-4 text-secondary animate-spin" />
              )}
              <div className="text-left font-mono">
                <p className="text-[10px] text-primary-fixed uppercase font-bold">
                  {initStage === 'linking' ? 'Resolving Nodes...' : initStage === 'completed' ? 'Success!' : 'Syncing Neural OS'}
                </p>
                <div className="w-32 bg-white/10 h-1 mt-1 rounded-full overflow-hidden">
                  <div className="bg-[#bdff00] h-full" style={{ width: `${percent}%` }} />
                </div>
              </div>
              <span className="text-[10px] font-mono text-white/50">{percent}%</span>
            </div>
          )}

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
            <span>View Deployments</span>
          </button>
        </div>
      </div>
    </section>
  );
}

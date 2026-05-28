import { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import NeuralCanvas from './components/NeuralCanvas';
import Marquee from './components/Marquee';
import ProjectsSection from './components/ProjectsSection';
import ExperienceSection from './components/ExperienceSection';
import StackSection from './components/StackSection';
import CertificationsSection from './components/CertificationsSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import { Info, X, ShieldAlert, CheckCircle2, Download, Copy, ExternalLink, Github } from 'lucide-react';

export default function App() {
  const [modalType, setModalType] = useState<'idle' | 'resume' | 'source'>('idle');
  const [isCopied, setIsCopied] = useState(false);

  const handleCopySourceProtocol = () => {
    navigator.clipboard.writeText('https://github.com/architect_os/neural_pulse');
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="bg-[#0E0E0F] text-[#e5e2e3] selection:bg-[#bdff00] selection:text-black font-sans leading-relaxed overflow-x-hidden min-h-screen relative">
      
      {/* Absolute floating canvas background */}
      <NeuralCanvas />

      {/* Main navigation header */}
      <Header
        onViewResume={() => setModalType('resume')}
      />

      {/* Hero presentation panel */}
      <Hero
        onInitialize={() => {
          // Extra optional triggered action when initializing
        }}
      />

      {/* Scrolling marquee divider 01 */}
      <Marquee text="PROJECTS • AI • FULL STACK • ARCHITECTURE •" />

      {/* Bento grid showcase */}
      <ProjectsSection />

      {/* Scrolling marquee divider 02 */}
      <Marquee text="SKILLS • DEPLOYMENT • OPTIMIZATION • SCALING •" reverse />

      {/* Classic experience and job history tracker */}
      <ExperienceSection />

      {/* Interactive systems stack section */}
      <StackSection />

      {/* Verified certifications credentials badges */}
      <CertificationsSection />

      {/* Connection pipeline and footer */}
      <ContactSection />

      <Footer
        onViewSource={() => setModalType('source')}
      />

      {/* Custom Global Action Modals (Resume / Source Code overlays) */}
      {modalType !== 'idle' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/85 backdrop-blur-md" 
            onClick={() => setModalType('idle')}
          />
          
          <div className="relative w-full max-w-md bg-[#0E0E0F] border border-[#bdff00]/25 rounded p-6 shadow-2xl z-10 text-left select-none">
            <button
              onClick={() => setModalType('idle')}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-white hover:bg-white/5 p-1 transition-all rounded"
              title="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            {modalType === 'resume' ? (
              <div>
                <div className="flex items-center gap-2 text-primary-fixed mb-4">
                  <CheckCircle2 className="w-5 h-5 text-[#bdff00]" />
                  <span className="font-mono text-xs uppercase font-bold tracking-widest">
                    Credentials Vault Activated
                  </span>
                </div>
                <h3 className="font-headline text-xl font-extrabold text-white mb-2 leading-tight">
                  Systems Architect Profile Secure Key
                </h3>
                <p className="text-xs text-on-surface-variant mb-6 leading-relaxed font-mono">
                  Accessing certified resume package from persistent registry... Local copies are signed using cryptographic RSA handshakes.
                </p>

                <div className="bg-[#131314] p-4 text-[11px] font-mono text-[#bdff00] border border-white/5 mb-6 flex justify-between items-center rounded">
                  <span>RESUME_AUTHENTICATED_LATEST.pdf</span>
                  <span className="text-white/40">242.8 KB</span>
                </div>

                <div className="flex gap-3">
                  <a
                    href="#download"
                    onClick={(e) => {
                      e.preventDefault();
                      alert('Certified resume transmission completed! Local simulated package downloading.');
                      setModalType('idle');
                    }}
                    className="flex-grow bg-[#bdff00] text-black hover:bg-white transition-all text-xs font-black uppercase tracking-wider py-3 flex items-center justify-center gap-2"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download signed copy</span>
                  </a>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 text-secondary mb-4">
                  <Info className="w-5 h-5 text-secondary" />
                  <span className="font-mono text-xs uppercase font-bold tracking-widest text-[#bdff00]">
                    Repository Branch Handshake
                  </span>
                </div>
                <h3 className="font-headline text-xl font-extrabold text-white mb-2">
                  Verify Source Integrity
                </h3>
                <p className="text-xs text-on-surface-variant mb-6 leading-relaxed font-mono text-left">
                  This React Single Page Application is entirely composed of modular components structured safely across isolated directories. It is optimized to static serve cleanly via rapid CDN proxies.
                </p>

                <div className="bg-[#131314] p-3 border border-white/5 mb-6 rounded text-left flex items-center justify-between gap-2 overflow-hidden">
                  <span className="font-mono text-[10px] text-white/70 overflow-hidden text-ellipsis whitespace-nowrap">
                    https://github.com/architect_os/neural_pulse
                  </span>
                  <button
                    onClick={handleCopySourceProtocol}
                    className="p-2 bg-white/5 hover:bg-white/10 text-white rounded active:scale-95 transition-all flex items-center justify-center shrink-0 cursor-pointer"
                    title="Copy Git protocol path"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleCopySourceProtocol}
                    className="flex-grow bg-[#bdff00] text-black hover:brightness-110 font-black text-xs uppercase tracking-wider py-3 rounded-none cursor-pointer"
                  >
                    {isCopied ? 'Pipeline Linked!' : 'Copy Repository Path'}
                  </button>
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 bg-white/5 border border-white/10 text-white hover:bg-white/10 flex items-center justify-center"
                    title="Navigate to external code tree"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

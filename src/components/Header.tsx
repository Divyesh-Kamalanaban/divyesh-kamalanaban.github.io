import { useState, useEffect, MouseEvent } from 'react';
import { FileText } from 'lucide-react';

interface HeaderProps {
  onViewResume: () => void;
}

export default function Header({ onViewResume }: HeaderProps) {
  const [activeTab, setActiveTab] = useState('projects');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sections = ['projects', 'experience', 'stack', 'contact'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom >= 120) {
            setActiveTab(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      const navOffset = 64; // header height
      const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navOffset;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
      setActiveTab(targetId);
    }
  };

  return (
    <nav
      className={`fixed top-0 w-full z-40 transition-all duration-300 border-b ${
        isScrolled
          ? 'bg-[#0E0E0F]/90 backdrop-blur-md border-white/15 py-3 shadow-lg'
          : 'bg-[#0E0E0F]/70 backdrop-blur-sm border-white/5 py-4'
      }`}
    >
      <div className="flex justify-between items-center px-gutter max-w-container-max mx-auto h-12">
        {/* Brand Logo */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="font-headline text-2xl font-black tracking-tighter text-white italic hover:opacity-90 transition-opacity"
        >
          ARCHITECT_OS
        </a>

        {/* Navigation Anchors */}
        <div className="hidden md:flex gap-8 items-center">
          {['projects', 'experience', 'stack', 'contact'].map((section) => (
            <a
              key={section}
              href={`#${section}`}
              onClick={(e) => handleNavClick(e, section)}
              className={`text-xs uppercase font-bold tracking-wider pb-1 transition-all border-b-2 hover:text-white ${
                activeTab === section
                  ? 'text-[#bdff00] border-[#bdff00]'
                  : 'text-on-surface-variant border-transparent hover:border-white/30'
              }`}
            >
              {section}
            </a>
          ))}
        </div>

        {/* Action Widgets */}
        <div className="flex items-center gap-3">
          <button
            onClick={onViewResume}
            className="flex items-center gap-1.5 bg-white text-black hover:bg-[#bdff00] hover:text-black hover:shadow-[0_0_15px_rgba(189,255,0,0.4)] px-5 py-2 text-xs uppercase font-extrabold tracking-wider transition-all duration-300 active:scale-95 cursor-pointer"
            title="Retrieve Credentials PDF"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Resume</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

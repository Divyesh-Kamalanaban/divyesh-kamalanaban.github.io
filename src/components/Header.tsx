import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FolderKanban, Briefcase, Layers, Award, Mail, Menu, X } from 'lucide-react';
import siteContent from '../data/ui.json';
import HeaderActions from './header/HeaderActions';

const NAV_LINKS = [
  { hash: "projects", label: "Projects", icon: FolderKanban },
  { hash: "experience", label: "Experience", icon: Briefcase },
  { hash: "stack", label: "Stack", icon: Layers },
  { hash: "certifications", label: "Certifications", icon: Award },
  { hash: "contact", label: "Contact", icon: Mail },
] as const;

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function scrollToSection(hash: string) {
    setMobileMenuOpen(false);
    const el = document.getElementById(hash);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <nav className="fixed top-0 w-full z-40 transition-all duration-300 border-b bg-[#0E0E0F]/70 backdrop-blur-sm border-white/5 py-4">
      <div className="flex justify-between items-center px-gutter max-w-container-max mx-auto h-12">
        <Link
          to="/"
          className="font-headline text-2xl font-black tracking-tighter text-white italic hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <span className="w-2 h-2 rounded-full bg-primary-fixed inline-block" />
          {siteContent.header.brand}
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex gap-10 items-center">
          {NAV_LINKS.map((link) => (
            <button
              key={link.hash}
              onClick={() => scrollToSection(link.hash)}
              className="group text-sm uppercase font-bold tracking-wider pb-1 transition-all border-b-2 border-transparent hover:text-white hover:border-white/30 text-on-surface-variant inline-flex items-center gap-2 cursor-pointer"
            >
              <link.icon className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              {link.label}
            </button>
          ))}
        </div>

        {/* Desktop actions + Mobile hamburger */}
        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <HeaderActions onViewResume={() => {}} resumeLabel={siteContent.header.resumeButton} />
          </div>
          <button
            className="md:hidden text-white p-2 cursor-pointer"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/5 mt-4 pt-4 pb-6 px-gutter bg-[#0E0E0F]/95 backdrop-blur-sm">
          <div className="flex flex-col gap-2">
            {NAV_LINKS.map((link) => (
              <button
                key={link.hash}
                onClick={() => scrollToSection(link.hash)}
                className="group text-sm uppercase font-bold tracking-wider py-3 px-4 transition-all hover:text-white hover:bg-white/5 text-on-surface-variant inline-flex items-center gap-3 rounded-lg text-left cursor-pointer"
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </button>
            ))}
            <div className="pt-4 px-4">
              <HeaderActions onViewResume={() => {}} resumeLabel={siteContent.header.resumeButton} />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

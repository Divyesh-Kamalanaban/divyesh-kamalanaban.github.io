import { Link } from 'react-router-dom';
import { FolderKanban, Briefcase, Layers, Award, Mail } from 'lucide-react';
import siteContent from '../data/ui.json';
import HeaderActions from './header/HeaderActions';

export default function Header() {
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

        <div className="hidden md:flex gap-10 items-center">
          <Link to="/projects" className="group text-sm uppercase font-bold tracking-wider pb-1 transition-all border-b-2 border-transparent hover:text-white hover:border-white/30 text-on-surface-variant inline-flex items-center gap-2">
            <FolderKanban className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            Projects
          </Link>
          <Link to="/#experience" className="group text-sm uppercase font-bold tracking-wider pb-1 transition-all border-b-2 border-transparent hover:text-white hover:border-white/30 text-on-surface-variant inline-flex items-center gap-2">
            <Briefcase className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            Experience
          </Link>
          <Link to="/#stack" className="group text-sm uppercase font-bold tracking-wider pb-1 transition-all border-b-2 border-transparent hover:text-white hover:border-white/30 text-on-surface-variant inline-flex items-center gap-2">
            <Layers className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            Stack
          </Link>
          <Link to="/#certifications" className="group text-sm uppercase font-bold tracking-wider pb-1 transition-all border-b-2 border-transparent hover:text-white hover:border-white/30 text-on-surface-variant inline-flex items-center gap-2">
            <Award className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            Certifications
          </Link>
          <Link to="/#contact" className="group text-sm uppercase font-bold tracking-wider pb-1 transition-all border-b-2 border-transparent hover:text-white hover:border-white/30 text-on-surface-variant inline-flex items-center gap-2">
            <Mail className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            Contact
          </Link>
        </div>

        <HeaderActions onViewResume={() => {}} resumeLabel={siteContent.header.resumeButton} />
      </div>
    </nav>
  );
}

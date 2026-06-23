import { Link } from 'react-router-dom';
import siteContent from '../data/ui.json';
import HeaderActions from './header/HeaderActions';

export default function Header() {
  return (
    <nav className="fixed top-0 w-full z-40 transition-all duration-300 border-b bg-[#0E0E0F]/70 backdrop-blur-sm border-white/5 py-4">
      <div className="flex justify-between items-center px-gutter max-w-container-max mx-auto h-12">
        <Link
          to="/"
          className="font-headline text-2xl font-black tracking-tighter text-white italic hover:opacity-90 transition-opacity"
        >
          {siteContent.header.brand}
        </Link>

        <div className="hidden md:flex gap-8 items-center">
          <Link to="/projects" className="text-xs uppercase font-bold tracking-wider pb-1 transition-all border-b-2 border-transparent hover:text-white hover:border-white/30 text-on-surface-variant">
            Projects
          </Link>
          <Link to="/#experience" className="text-xs uppercase font-bold tracking-wider pb-1 transition-all border-b-2 border-transparent hover:text-white hover:border-white/30 text-on-surface-variant">
            Experience
          </Link>
          <Link to="/#stack" className="text-xs uppercase font-bold tracking-wider pb-1 transition-all border-b-2 border-transparent hover:text-white hover:border-white/30 text-on-surface-variant">
            Stack
          </Link>
          <Link to="/#certifications" className="text-xs uppercase font-bold tracking-wider pb-1 transition-all border-b-2 border-transparent hover:text-white hover:border-white/30 text-on-surface-variant">
            Certifications
          </Link>
          <Link to="/#contact" className="text-xs uppercase font-bold tracking-wider pb-1 transition-all border-b-2 border-transparent hover:text-white hover:border-white/30 text-on-surface-variant">
            Contact
          </Link>
        </div>

        <HeaderActions onViewResume={() => {}} resumeLabel={siteContent.header.resumeButton} />
      </div>
    </nav>
  );
}
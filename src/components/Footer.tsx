import { Github, Linkedin, Heart } from 'lucide-react';
import siteContent from '../data/ui.json';

const linkIcons: Record<string, React.ReactNode> = {
  'GitHub': <Github className="w-4 h-4" />,
  'LinkedIn': <Linkedin className="w-4 h-4" />,
};

export default function Footer() {
  return (
    <footer className="bg-[#0E0E0F] border-t border-outline-variant/20 py-10 tracking-tight">
      <div className="flex flex-col md:flex-row justify-between items-center px-gutter max-w-container-max mx-auto gap-6 select-none">
        <div className="font-headline text-lg font-extrabold text-[#f4f4f5] italic tracking-tighter flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary-fixed inline-block" />
          {siteContent.footer.brand}
        </div>

        <div className="text-xs font-medium tracking-wide text-on-surface-variant text-center md:text-left flex items-center gap-1.5">
          {siteContent.footer.copyright}
        </div>

        <div className="flex gap-6">
          {siteContent.footer.links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group text-xs font-bold uppercase tracking-wider text-on-surface-variant hover:text-white transition-colors inline-flex items-center gap-2"
            >
              <span className="p-1.5 rounded-full bg-white/5 group-hover:bg-primary-fixed/10 transition-colors">
                {linkIcons[link.label] || null}
              </span>
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

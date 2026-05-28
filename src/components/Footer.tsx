interface FooterProps {
  onViewSource: () => void;
}

export default function Footer({ onViewSource }: FooterProps) {
  return (
    <footer className="bg-[#0E0E0F] border-t border-outline-variant/20 py-10 tracking-tight">
      <div className="flex flex-col md:flex-row justify-between items-center px-gutter max-w-container-max mx-auto gap-6 select-none">
        {/* Brand logo */}
        <div className="font-headline text-lg font-extrabold text-[#f4f4f5] italic tracking-tighter">
          ARCHITECT_OS
        </div>

        {/* Dynamic precision system copyright */}
        <div className="text-xs font-medium tracking-wide text-on-surface-variant text-center md:text-left">
          © 2024 SYSTEM ARCHITECT. BUILT WITH PRECISION.
        </div>

        {/* Footer directories links */}
        <div className="flex gap-8">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold uppercase tracking-wider text-on-surface-variant hover:text-white transition-colors"
          >
            Github
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold uppercase tracking-wider text-on-surface-variant hover:text-white transition-colors"
          >
            LinkedIn
          </a>
          <button
            onClick={onViewSource}
            className="text-xs font-bold uppercase tracking-wider text-on-surface-variant hover:text-white transition-colors cursor-pointer"
          >
            Source
          </button>
        </div>
      </div>
    </footer>
  );
}

import siteContent from '../data/ui.json';

export default function Footer() {
  return (
    <footer className="bg-[#0E0E0F] border-t border-outline-variant/20 py-10 tracking-tight">
      <div className="flex flex-col md:flex-row justify-between items-center px-gutter max-w-container-max mx-auto gap-6 select-none">
        <div className="font-headline text-lg font-extrabold text-[#f4f4f5] italic tracking-tighter">
          {siteContent.footer.brand}
        </div>

        <div className="text-xs font-medium tracking-wide text-on-surface-variant text-center md:text-left">
          {siteContent.footer.copyright}
        </div>

        <div className="flex gap-8">
          {siteContent.footer.links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold uppercase tracking-wider text-on-surface-variant hover:text-white transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
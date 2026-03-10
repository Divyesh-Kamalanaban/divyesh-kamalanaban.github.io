
import React, { useState } from "react";
import { Code, ExternalLink, ChevronRight, Terminal, Layers, Mail, Github, Linkedin, Globe, FileText, User } from "lucide-react";

function CustomCard({ title, subtitle, details, categories, items, fields, link, description, score, contact, certifications }) {
  const [openIndex, setOpenIndex] = useState(0); // For accordion

  // --- Accordion branch: multiple cards in array ---
  if (Array.isArray(title)) {
    const cards = title;

    return (
      <div className="w-full max-w-4xl mx-auto space-y-4">
        {score && (
          <div className="flex justify-end mb-2">
            <span className="text-[10px] uppercase tracking-wider font-mono text-accent opacity-80 bg-(--accent-solid)/5 px-2 py-1 rounded border border-(--glass-border) shadow-sm">
              Confidence: {score}
            </span>
          </div>
        )}

        {cards.map((card, idx) => (
          <div
            key={idx}
            className={`group rounded-xl border transition-all duration-300 overflow-hidden
              ${openIndex === idx
                ? "bg-(--glass-bg) border-(--accent-solid)/30 shadow-lg ring-1 ring-(--accent-solid)/10"
                : "bg-(--glass-bg)/50 border-(--glass-border) hover:border-(--text-secondary)/30 hover:bg-(--glass-bg)"}`}
          >
            <button
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              className="w-full bg-transparent text-left px-6 py-4 flex justify-between items-center cursor-pointer outline-none pl-4"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg transition-colors duration-300 ${openIndex === idx ? "bg-(--accent-solid)/10 text-(--accent-solid)" : "bg-(--bg-secondary) text-(--text-primary) opacity-80 group-hover:opacity-100 group-hover:bg-(--accent-solid)/10 group-hover:text-(--accent-solid)"}`}>
                  <Terminal size={18} />
                </div>
                <span className={`font-semibold text-lg transition-colors ${openIndex === idx ? "text-accent hover:opacity-80" : "text-(--text-secondary) opacity-100 group-hover:opacity-70 group-hover:text-accent font-medium"}`}>
                  {card.title}
                </span>
              </div>

              <ChevronRight
                size={18}
                className={`text-(--text-secondary) transition-transform duration-300 ${openIndex === idx ? "rotate-90 text-(--accent-solid)" : "group-hover:translate-x-1"}`}
              />
            </button>

            <div className={`grid transition-all duration-300 ease-in-out ${openIndex === idx ? "grid-rows-[1fr] opacity-100 pb-6 px-6" : "grid-rows-[0fr] opacity-0 pb-0 px-6"}`}>
              <div className="overflow-hidden">
                <div className="pt-2 pl-2 border-l-2 border-(--glass-border) ml-3 space-y-3">
                  {card.subtitle && (
                    <p className="text-sm italic text-accent opacity-90 font-['IBM_Plex_Serif'] mb-3 pl-2">
                      {card.subtitle}
                    </p>
                  )}

                  {Array.isArray(card.details) ? (
                    <ul className="space-y-2">
                      {card.details.map((d, i) => (
                        <li key={i} className="text-sm text-(--text-secondary) leading-relaxed flex gap-2">
                          <span className="text-accent mt-1.5">•</span>
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    card.details && <p className="text-sm text-(--text-secondary)">{card.details}</p>
                  )}

                  {/* Render Categories (Tech Stack) inside Accordion */}
                  {card.categories && Object.entries(card.categories).map(([catName, cats]) => (
                    <div key={catName} className="mt-4 pt-2">
                      <h5 className="text-xs font-bold text-(--text-primary) uppercase tracking-wider mb-2 flex items-center gap-2">
                        <Layers size={12} className="text-(--accent-solid)" /> {catName}
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {cats.map((c, i) => (
                          <span key={i} className="px-2.5 py-1 rounded-md text-[10px] font-medium bg-(--bg-secondary) border border-(--glass-border) text-(--text-secondary)">
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}

                  {card.link && (
                    <div className="mt-4 pt-2">
                      <a
                        href={card.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-xs font-semibold text-(--text-primary) hover:text-accent transition-colors group/link"
                      >
                        View Project <ExternalLink size={12} className="transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // --- Contact Grid branch ---
  if (contact && Array.isArray(contact)) {
    const iconMap = {
      "Email": <Mail size={20} />,
      "GitHub": <Github size={20} />,
      "LinkedIn": <Linkedin size={20} />,
      "Portfolio": <User size={20} />,
      "Blog": <FileText size={20} />
    };

    return (
      <div className="w-full max-w-4xl mx-auto">
        <h3 className="text-2xl font-bold text-accent hover:opacity-80 transition-opacity mb-6 flex items-center gap-2">
          {title} <span className="text-sm font-normal text-(--text-secondary) ml-auto block md:hidden">Scroll &rarr;</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {contact.map((item, idx) => (
            <a
              key={idx}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card p-4 rounded-xl flex items-center gap-4 hover:border-(--accent-solid)/30 hover:bg-(--glass-bg) group transition-all duration-300"
            >
              <div className="p-3 rounded-lg bg-(--bg-secondary) text-(--text-secondary) group-hover:bg-(--accent-solid)/10 group-hover:text-(--accent-solid) transition-colors">
                {iconMap[item.label] || <Globe size={20} />}
              </div>
              <div className="overflow-hidden">
                <div className="text-xs text-(--text-secondary) font-mono uppercase tracking-wider mb-0.5">
                  {item.label}
                </div>
                <div className="text-sm font-semibold text-(--text-primary) truncate w-full group-hover:text-accent transition-colors">
                  {item.value}
                </div>
              </div>
              <ExternalLink size={14} className="ml-auto opacity-0 group-hover:opacity-50 transition-opacity" />
            </a>
          ))}
        </div>
      </div>
    );
  }

  // --- Certifications Grid branch ---
  // We check for 'certifications' prop which comes from the new parser
  if (certifications && Array.isArray(certifications)) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <h3 className="text-2xl font-bold text-accent hover:opacity-80 transition-opacity mb-6 flex items-center gap-2">
          {title}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {certifications.map((cert, idx) => (
            <div
              key={idx}
              className="glass-card p-5 rounded-xl border border-(--glass-border) hover:border-(--accent-solid)/30 transition-colors group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity text-(--text-primary)">
                <FileText size={48} />
              </div>

              <div className="relative z-10">
                <div className="text-xs font-mono text-accent mb-2 tracking-wider uppercase">
                  {cert.issuer}
                </div>
                <h4 className="text-lg font-bold text-(--text-primary) mb-1 leading-snug group-hover:text-accent transition-colors">
                  {cert.title}
                </h4>
                <div className="text-sm text-(--text-secondary) mb-4">
                  Issued: {cert.date}
                </div>

                {cert.skills && cert.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {cert.skills.slice(0, 3).map((skill, sIdx) => (
                      <span key={sIdx} className="text-[10px] px-2 py-0.5 rounded-full bg-(--bg-secondary) text-(--text-secondary) border border-(--glass-border)">
                        {skill}
                      </span>
                    ))}
                    {cert.skills.length > 3 && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-(--bg-secondary) text-(--text-secondary)">+{cert.skills.length - 3}</span>
                    )}
                  </div>
                )}

                {cert.credentialId && (
                  <div className="flex items-center gap-2 text-xs text-(--text-secondary) font-mono">
                    <span>ID: {cert.credentialId}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // --- Normal single card ---
  return (
    <div className="glass-card w-full max-w-2xl mx-auto rounded-2xl p-6 md:p-8 shadow-xl border border-(--glass-border) bg-(--glass-bg)/80 relative overflow-hidden group hover:border-(--accent-solid)/20 transition-all duration-500">

      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-(--accent-solid)/5 rounded-full blur-3xl -z-10 transform group-hover:scale-150 transition-transform duration-700" />

      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="space-y-1">
          {title && <h3 className="text-2xl md:text-3xl font-bold text-accent hover:opacity-80 transition-opacity tracking-tight">{title}</h3>}
          {subtitle && <p className="text-lg text-accent font-['IBM_Plex_Serif'] italic opacity-90">{subtitle}</p>}
        </div>
        {score && (
          <span className="text-[10px] font-mono text-accent bg-(--accent-solid)/5 border border-(--glass-border) px-2 py-1 rounded shadow-sm whitespace-nowrap">
            {score}
          </span>
        )}
      </div>

      {description && <p className="text-(--text-secondary) text-sm md:text-base mb-6 leading-relaxed border-l-2 border-(--glass-border) pl-4">{description}</p>}

      {/* Details List */}
      {details && Array.isArray(details) && details.length > 0 && (
        <ul className="mb-6 space-y-3">
          {details.map((d, i) => (
            <li key={i} className="flex gap-3 text-sm md:text-base text-(--text-secondary)">
              <span className="text-accent mt-1.5 min-w-1 h-1 rounded-full bg-(--accent) content-[''] block" />
              {d}
            </li>
          ))}
        </ul>
      )}

      {/* Key Stats / Fields */}
      {fields && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          {fields.map((f, i) => (
            <div key={i} className="bg-(--bg-secondary)/50 p-3 rounded-lg border border-(--glass-border)">
              <div className="text-[10px] uppercase tracking-wider text-(--text-secondary) font-semibold">{f.label}</div>
              <div className="text-sm font-medium text-(--text-primary)">{f.value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Items (generic list) */}
      {items && (
        <div className="flex flex-wrap gap-2 mb-6">
          {items.map((item, i) => (
            <span key={i} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-(--bg-secondary) text-(--text-secondary) border border-(--glass-border) shadow-sm">
              {item}
            </span>
          ))}
        </div>
      )}

      {/* Structured Categories (Categories Prop) */}
      {categories && Object.entries(categories).map(([catName, cats], idx) => (
        <div key={idx} className="mb-6 last:mb-0">
          <h4 className="text-xs font-bold text-(--text-primary) uppercase tracking-wider mb-3 flex items-center gap-2">
            <Code size={14} className="text-(--accent-solid)" /> {catName}
          </h4>
          <div className="flex flex-wrap gap-2">
            {cats.map((c, i) => (
              <span
                key={i}
                className="relative inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-(--bg-secondary) border border-(--glass-border) overflow-hidden group/pill transition-all duration-300 hover:border-(--accent-solid)/30 cursor-default"
              >
                <span className="absolute inset-0 bg-(--accent-solid)/5 opacity-0 group-hover/pill:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10 text-(--text-secondary) group-hover/pill:text-(--text-primary) transition-colors">
                  {c}
                </span>
              </span>
            ))}
          </div>
        </div>
      ))}

      {/* Footer Link */}
      {link && (
        <div className="mt-8 pt-4 border-t border-(--glass-border) flex justify-end">
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary flex items-center gap-2 text-xs py-2 px-4 shadow-lg hover:shadow-(--accent-solid)/20"
          >
            View Resource <ExternalLink size={14} />
          </a>
        </div>
      )}
    </div>
  );
}

export default CustomCard;

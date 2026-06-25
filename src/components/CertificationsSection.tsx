import { useState } from 'react';
import certificationsContent from '../data/certifications.json';
import { ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';

interface Certification {
  id: string;
  title: string;
  issuer: string;
  issuerSlug: string;
  issued: string;
  expires: string | null;
  credentialId: string | null;
  url: string;
  skills: string[];
  thumbnail: string | null;
}

const INITIAL_ROWS = 2;
const COLS = 3;
const INITIAL_COUNT = INITIAL_ROWS * COLS;

export default function CertificationsSection() {
  const certifications = certificationsContent.certifications as Certification[];
  const [showAll, setShowAll] = useState(false);
  const visibleCertifications = showAll ? certifications : certifications.slice(0, INITIAL_COUNT);

  return (
    <section className="py-stack-xl bg-[#0E0E0F] relative tracking-tight border-y border-white/5" id="certifications">
      <div className="max-w-container-max mx-auto px-gutter relative z-10">
        <div className="text-left mb-12">
          <span className="text-xs font-bold text-primary uppercase border-l-4 border-primary-fixed pl-4 mb-4 block tracking-wider">
            {certificationsContent.section.eyebrow}
          </span>
          <h2 className="font-headline text-4xl md:text-5xl font-extrabold text-white tracking-tighter">
            {certificationsContent.section.title}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {visibleCertifications.map((cert) => {
            const iconUrl = cert.issuerSlug
              ? `https://cdn.simpleicons.org/${cert.issuerSlug}/ffffff`
              : null;

            const visibleSkills = cert.skills.slice(0, 2);
            const remainingSkills = cert.skills.length - visibleSkills.length;

            return (
              <div
                key={cert.id}
                className="group border border-white/10 hover:border-primary-fixed/40 bg-white/[0.02] hover:bg-white/[0.04] p-5 rounded-lg transition-all duration-300 text-left flex flex-col relative overflow-hidden"
              >
                {/* Header: Logo + Issuer */}
                <div className="flex items-center gap-3 mb-3">
                  {iconUrl ? (
                    <img
                      src={iconUrl}
                      alt={`${cert.issuer} logo`}
                      className="w-8 h-8 object-contain rounded-full bg-white/10 p-1.5"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold text-white/50 uppercase">
                      {cert.issuer.charAt(0)}
                    </div>
                  )}
                  <span className="text-[11px] font-bold font-mono text-white/60 uppercase tracking-wider">
                    {cert.issuer}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-headline text-base sm:text-lg font-bold text-white leading-snug mb-2">
                  {cert.title}
                </h3>

                {/* Dates */}
                <div className="text-[11px] font-mono text-white/50 space-y-0.5 mb-2">
                  <span>{cert.issued}</span>
                  {cert.expires && (
                    <span className="block text-red-400/70">· {cert.expires}</span>
                  )}
                </div>

                {/* Credential ID */}
                {cert.credentialId && (
                  <p className="text-[10px] font-mono text-white/30 mb-3 truncate">
                    Credential ID {cert.credentialId}
                  </p>
                )}

                {/* Skills tags */}
                {cert.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4 mt-auto">
                    <span className="text-[9px] font-bold text-white/40 uppercase tracking-wider mr-0.5 self-center">
                      {certificationsContent.labels.skills}:
                    </span>
                    {visibleSkills.map((skill) => (
                      <span
                        key={skill}
                        className="text-[10px] font-mono border border-white/10 px-2 py-0.5 rounded text-white/60"
                      >
                        {skill}
                      </span>
                    ))}
                    {remainingSkills > 0 && (
                      <span className="text-[10px] font-mono text-white/40">
                        +{remainingSkills} more
                      </span>
                    )}
                  </div>
                )}

                {/* Show credential button */}
                <div className="pt-3 border-t border-white/5 flex items-center justify-between mt-auto">
                  <a
                    href={cert.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-bold font-mono tracking-wider text-primary-fixed hover:text-white transition-colors flex items-center gap-1.5 group/link"
                  >
                    <span>{certificationsContent.labels.showCredential}</span>
                    <ExternalLink className="w-3 h-3 opacity-0 -translate-x-1 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Show More / Show Less Button */}
        {certifications.length > INITIAL_COUNT && (
          <div className="flex justify-center mt-10">
            <button
              onClick={() => setShowAll(!showAll)}
              className="group inline-flex items-center gap-2.5 px-6 py-3 border border-white/20 hover:border-primary-fixed/50 text-white/80 hover:text-primary-fixed text-sm font-bold font-mono tracking-wider uppercase rounded-lg transition-all duration-300 hover:bg-white/[0.03] cursor-pointer"
            >
              <span>{showAll ? 'Show Less' : `Show All (${certifications.length})`}</span>
              {showAll ? (
                <ChevronUp className="w-4 h-4 transition-transform duration-300" />
              ) : (
                <ChevronDown className="w-4 h-4 transition-transform duration-300" />
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
import { useState } from 'react';
import { Award, ShieldAlert, CheckCircle2, RefreshCw, Key } from 'lucide-react';

interface Certification {
  id: string;
  title: string;
  issuer: string;
  badgeId: string;
  colorClass: string;
  textClass: string;
}

export default function CertificationsSection() {
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [verifiedMap, setVerifiedMap] = useState<Record<string, boolean>>({});

  const certifications: Certification[] = [
    {
      id: 'aws',
      title: 'AWS Certified Solutions Architect',
      issuer: 'Amazon Web Services',
      badgeId: 'AWS-CSAA-839210-CERT',
      colorClass: 'bg-white text-black hover:bg-neutral-200',
      textClass: 'text-zinc-600',
    },
    {
      id: 'cka',
      title: 'Certified Kubernetes Administrator',
      issuer: 'Cloud Native Computing Foundation',
      badgeId: 'CKA-90184-CNCF',
      colorClass: 'bg-[#bdff00] text-black hover:bg-[#aaeb02]',
      textClass: 'text-black/70',
    },
    {
      id: 'tensorflow',
      title: 'TensorFlow Developer Certificate',
      issuer: 'Google DeepLearning.AI',
      badgeId: 'TF-DEVELOPER-88210-DEEP',
      colorClass: 'bg-secondary text-on-secondary hover:brightness-110',
      textClass: 'text-on-secondary/80',
    }
  ];

  const handleVerify = (id: string) => {
    setVerifyingId(id);
    setTimeout(() => {
      setVerifiedMap((prev) => ({ ...prev, [id]: true }));
      setVerifyingId(null);
    }, 1200);
  };

  return (
    <section className="py-stack-xl bg-[#0E0E0F] relative tracking-tight border-y border-white/5" id="certifications">
      {/* Background decoration */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden select-none">
        <div className="word-cloud-bg opacity-15">CERTIFIED EXPERT SECURE</div>
      </div>

      <div className="max-w-container-max mx-auto px-gutter relative z-10">
        <div className="text-left mb-12">
          <span className="text-xs font-bold text-primary uppercase border-l-4 border-primary-fixed pl-4 mb-4 block tracking-wider">
            Validation
          </span>
          <h2 className="font-headline text-4xl md:text-5xl font-extrabold text-white tracking-tighter">
            Certifications
          </h2>
        </div>

        {/* 3-column Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {certifications.map((cert) => {
            const isVerifying = verifyingId === cert.id;
            const isVerified = verifiedMap[cert.id];

            return (
              <div 
                key={cert.id} 
                className={`${cert.colorClass} p-8 rounded-lg shadow-lg hover:-translate-y-1.5 transition-all duration-300 text-left flex flex-col justify-between min-h-[220px] relative overflow-hidden group`}
              >
                <div>
                  <h3 className="font-headline text-xl sm:text-2xl font-black mb-2 tracking-tighter leading-tight">
                    {cert.title}
                  </h3>
                  <p className="text-xs font-extrabold opacity-80 uppercase tracking-widest font-mono">
                    {cert.issuer}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-black/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10 select-none">
                  <div className="font-mono text-[9px] uppercase tracking-wider font-extrabold">
                    {cert.badgeId}
                  </div>

                  {isVerified ? (
                    <div className="flex items-center gap-1 text-[10px] font-bold font-mono text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded">
                      <CheckCircle2 className="w-3 h-3 fill-emerald-800 text-white" />
                      <span>VERIFIED</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleVerify(cert.id)}
                      disabled={isVerifying}
                      className="px-3.5 py-1.5 bg-black/10 hover:bg-black/25 active:scale-95 transition-all text-[9px] font-bold font-mono tracking-wider flex items-center justify-center gap-1.5 rounded disabled:opacity-50 uppercase cursor-pointer"
                    >
                      {isVerifying ? (
                        <RefreshCw className="w-3 h-3 animate-spin text-black" />
                      ) : (
                        <Key className="w-3 h-3 text-black" />
                      )}
                      <span>{isVerifying ? 'VERIFYING...' : 'VERIFY LINK'}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

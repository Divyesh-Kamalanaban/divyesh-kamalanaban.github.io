import { useState, useEffect, FormEvent } from 'react';
import { Send, Terminal, Loader2, CheckCircle, ShieldAlert, Wifi, Info } from 'lucide-react';

export default function ContactSection() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'testing' | 'connecting' | 'success' | 'invalid'>('idle');
  const [logs, setLogs] = useState<string[]>([]);
  const [savedRequests, setSavedRequests] = useState<string[]>([]);

  useEffect(() => {
    const list = localStorage.getItem('architect_os_connections');
    if (list) {
      setSavedRequests(JSON.parse(list));
    }
  }, []);

  const addLog = (text: string) => {
    setLogs((prev) => [...prev, text]);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();

    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setStatus('invalid');
      setLogs(['[ERROR] System protocol error: Invalid address configuration.']);
      return;
    }

    setStatus('testing');
    setLogs(['[SYSTEM] Initializing secure connection sequence...', `[IP_RESOLVE] Target: ${cleanEmail}`]);

    setTimeout(() => {
      addLog('[INFO] Port handshake routing... established.');
      setStatus('connecting');
    }, 600);

    setTimeout(() => {
      addLog('[INFO] Exchanging Diffie-Hellman telemetry packets.');
    }, 1200);

    setTimeout(() => {
      addLog(`[SUCCESS] Encryption tunnel authorized! Link queued.`);
      setStatus('success');
      
      const nextList = [...savedRequests, cleanEmail];
      setSavedRequests(nextList);
      localStorage.setItem('architect_os_connections', JSON.stringify(nextList));
      setEmail('');
    }, 2000);
  };

  return (
    <section className="py-stack-xl relative overflow-hidden tracking-tight bg-[#0E0E0F]" id="contact">
      {/* Dynamic background lighting */}
      <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/[0.03] to-transparent pointer-events-none" />

      <div className="max-w-container-max mx-auto px-gutter relative z-10 text-center">
        
        <h2 className="font-headline text-5xl md:text-[68px] font-extrabold text-[#f4f4f5] mb-8 leading-tight tracking-tighter">
          Ready to initiate the <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-[#bdff00] italic">Pulse</span>?
        </h2>

        <p className="text-base sm:text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto mb-12 tracking-normal leading-relaxed text-center">
          I am currently open for high-impact technical consulting and leadership roles. Let's build something that redefines the possible.
        </p>

        {/* Input Wrapper Card */}
        <div className="max-w-xl mx-auto mb-10">
          <form 
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row glass-card p-1 rounded-none border-[#bdff00]/40 focus-within:border-[#bdff00] transition-all overflow-hidden"
          >
            <input 
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status === 'invalid') setStatus('idle');
              }}
              placeholder="ENCRYPTED_EMAIL@HOST.COM" 
              className="bg-transparent border-none focus:outline-none focus:ring-0 px-6 py-4 text-sm font-medium flex-grow text-white placeholder:text-on-surface-variant/40 tracking-wider font-mono text-left"
              disabled={status === 'testing' || status === 'connecting'}
              aria-label="Encrypted email for contact"
            />
            
            <button 
              type="submit"
              disabled={status === 'testing' || status === 'connecting'}
              className="bg-primary-fixed text-on-primary-fixed hover:bg-white hover:text-black hover:shadow-[0_0_15px_rgba(189,255,0,0.5)] px-10 py-4 text-xs uppercase font-black tracking-widest transition-all duration-300 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
            >
              {status === 'testing' || status === 'connecting' ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>RESOLVING...</span>
                </>
              ) : (
                <>
                  <Wifi className="w-3.5 h-3.5" />
                  <span>Connect</span>
                </>
              )}
            </button>
          </form>

          {/* Validation Feedback Logs / Interactive output stream */}
          {logs.length > 0 && (
            <div className="mt-6 bg-[#0B0B0C] border border-outline-variant/30 p-4 rounded text-left font-mono text-[10px] space-y-1.5 shadow-inner select-all">
              <div className="flex items-center gap-1.5 text-white/50 border-b border-white/5 pb-2 mb-2">
                <Terminal className="w-3 h-3 text-[#bdff00]" />
                <span className="uppercase tracking-widest font-black">Connection Diagnostics Panel</span>
              </div>
              {logs.map((log, idx) => {
                let colorClass = 'text-on-surface-variant';
                if (log.startsWith('[ERROR]')) colorClass = 'text-red-400 font-semibold';
                if (log.startsWith('[SYSTEM]')) colorClass = 'text-secondary';
                if (log.startsWith('[SUCCESS]')) colorClass = 'text-[#bdff00] font-semibold';
                return (
                  <div key={idx} className={colorClass}>
                    {log}
                  </div>
                );
              })}
            </div>
          )}

          {/* List of successfully linked channels (shows real local persistence) */}
          {savedRequests.length > 0 && (
            <div className="mt-8 text-left max-w-xl mx-auto p-4 border border-outline-variant/15 bg-white/[0.01]">
              <p className="text-[9px] font-mono uppercase tracking-widest text-white/40 mb-2 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-[#bdff00]" />
                Authorized Sync Pipelines ({savedRequests.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {savedRequests.map((req, i) => (
                  <span key={i} className="bg-white/5 text-on-surface-variant font-mono text-[10px] px-2.5 py-1 border border-white/5 rounded">
                    {req}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

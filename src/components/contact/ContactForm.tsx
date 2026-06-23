import type { FormEvent } from 'react';
import contactContent from '../../data/contact.json';

interface ContactFormProps {
  email: string;
  status: 'idle' | 'success';
  onEmailChange: (value: string) => void;
  onSubmit: (event: FormEvent) => void;
}

export default function ContactForm({ email, status, onEmailChange, onSubmit }: ContactFormProps) {
  const isBusy = status === 'success';

  return (
    <form onSubmit={onSubmit} className="flex flex-col sm:flex-row glass-card p-1 rounded-none border-[#bdff00]/40 focus-within:border-[#bdff00] transition-all overflow-hidden">
      <input
        type="email"
        value={email}
        onChange={(event) => onEmailChange(event.target.value)}
        placeholder={contactContent.emailPlaceholder}
        className="bg-transparent border-none focus:outline-none focus:ring-0 px-6 py-4 text-sm font-medium flex-grow text-white placeholder:text-on-surface-variant/40 tracking-wider font-mono text-left"
        disabled={isBusy}
      />

      <button
        type="submit"
        disabled={isBusy}
        className="bg-primary-fixed text-on-primary-fixed hover:bg-white hover:text-black hover:shadow-[0_0_15px_rgba(189,255,0,0.5)] px-10 py-4 text-xs uppercase font-black tracking-widest transition-all duration-300 active:scale-95 disabled:opacity-50 cursor-pointer whitespace-nowrap"
      >
        {contactContent.connectLabel}
      </button>
    </form>
  );
}
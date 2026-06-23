import { useState, FormEvent } from 'react';
import contactContent from '../data/contact.json';
import ContactForm from './contact/ContactForm';

export default function ContactSection() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success'>('idle');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('success');
    setTimeout(() => {
      setEmail('');
      setStatus('idle');
    }, 2000);
  };

  return (
    <section className="py-stack-xl relative overflow-hidden tracking-tight bg-[#0E0E0F]" id="contact">
      <div className="absolute inset-0 bg-linear-to-t from-emerald-500/3 to-transparent pointer-events-none" />

      <div className="max-w-container-max mx-auto px-gutter relative z-10 text-center">
        <h2 className="font-headline text-5xl md:text-[68px] font-extrabold text-[#f4f4f5] mb-8 leading-tight tracking-tighter">
          {contactContent.section.headlinePrefix} <span className="text-transparent bg-clip-text bg-linear-to-r from-secondary to-primary-fixed italic">{contactContent.section.headlineHighlight}</span>{contactContent.section.headlineSuffix}
        </h2>


        <div className="max-w-xl mx-auto">
          <ContactForm
            email={email}
            status={status}
            onSubmit={handleSubmit}
            onEmailChange={setEmail}
          />
        </div>
      </div>
    </section>
  );
}
import contactContent from '../data/contact.json';
import ContactForm from './contact/ContactForm';

export default function ContactSection() {
  return (
    <section className="py-stack-xl relative overflow-hidden tracking-tight bg-[#0E0E0F]" id="contact">
      <div className="absolute inset-0 bg-linear-to-t from-emerald-500/3 to-transparent pointer-events-none" />

      <div className="max-w-container-max mx-auto px-gutter relative z-10 text-center">
        <h2 className="font-headline text-5xl md:text-[68px] font-extrabold text-[#f4f4f5] mb-8 leading-tight tracking-tighter">
          {contactContent.section.headlinePrefix} <span className="text-transparent bg-clip-text bg-linear-to-r from-secondary to-primary-fixed italic">{contactContent.section.headlineHighlight}</span>{contactContent.section.headlineSuffix}
        </h2>

        <div className="max-w-xl mx-auto">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
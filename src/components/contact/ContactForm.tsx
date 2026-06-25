import contactContent from '../../data/contact.json';

export default function ContactForm() {
  return (
    <a
      href={`mailto:${contactContent.email}`}
      className="inline-flex items-center justify-center gap-2 bg-primary-fixed text-on-primary-fixed hover:bg-white hover:text-black hover:shadow-[0_0_15px_rgba(189,255,0,0.5)] px-10 py-4 text-xs uppercase font-black tracking-widest transition-all duration-300 active:scale-95 cursor-pointer"
    >
      {contactContent.mailtoLabel}
    </a>
  );
}
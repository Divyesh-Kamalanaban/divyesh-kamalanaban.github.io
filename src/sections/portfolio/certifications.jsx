import React, { useEffect, useState, useRef } from "react";
import useScrollAnimation from "../../hooks/useScrollAnimation";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Award } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function Certifications() {
  const sectionRef = useRef(null);
  const [items, setItems] = useState([]);

  // Fetch certifications data
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/about-data.txt");
        if (!res.ok) return;
        const text = await res.text();
        const lines = text.split(/\r?\n/);
        const start = lines.findIndex(l => l.trim() === "[CERTIFICATIONS]");
        if (start === -1) return;
        const certLines = lines.slice(start + 1).filter(line => line.trim() && !line.startsWith('['));
        const certs = [];
        for (let i = 0; i < certLines.length; i += 2) {
          const titleLine = certLines[i];
          const detailsLine = certLines[i + 1] || '';
          // Parse title and company
          const titleCompany = titleLine.split(' — ');
          const title = titleCompany[0]?.trim() || '';
          const company = titleCompany[1]?.trim() || '';
          // Parse details
          let issueDate = '';
          let expiration = '';
          let credentialId = '';
          if (detailsLine) {
            const parts = detailsLine.split(/\s{2,}/); // Split on multiple spaces
            parts.forEach(part => {
              if (part.startsWith('Issued:')) {
                issueDate = part.replace('Issued:', '').trim();
              } else if (part.startsWith('Expires:')) {
                expiration = part.replace('Expires:', '').trim();
              } else if (part.startsWith('Credential ID:')) {
                credentialId = part.replace('Credential ID:', '').trim();
              }
            });
          }
          certs.push({ title, company, issueDate, expiration, credentialId });
        }
        setItems(certs);
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, []);

  // Set up base scroll animations (fade-up for title/description)
  useScrollAnimation(sectionRef);

  // Set up stagger animations when items are loaded
  useGSAP(() => {
    if (!sectionRef.current) return;

    const container = sectionRef.current.querySelector(".animate-stagger-container");
    if (!container) return;

    const staggerItems = container.querySelectorAll(".animate-stagger-item");
    if (staggerItems.length === 0) return;

    // Kill existing animations to prevent duplicates
    staggerItems.forEach(item => {
      gsap.killTweensOf(item);
    });

    // Set up new stagger animation
    gsap.fromTo(
      staggerItems,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "out",
        force3D: true,
        scrollTrigger: {
          trigger: container,
          start: "top 80%",
          toggleActions: "play none none none"
        }
      }
    );
  }, { dependencies: [items] });

  return (
    <section id="certifications" className="section-container" ref={sectionRef}>
      <div className="content-wrapper">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-[var(--text-primary)] tracking-tight animate-fade-up opacity-0">
          Certifications
        </h1>
        <p className="text-base md:text-2xl text-[var(--text-secondary)] mb-8 animate-fade-up opacity-0">
          Formal credentials and certificates I've earned over time.
        </p>

        <div className="w-full animate-stagger-container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item, idx) => (
              <div
                key={idx}
                className="glass-card p-6 rounded-xl animate-stagger-item opacity-0 flex flex-col gap-2 hover:-translate-y-1 transition-transform duration-300"
              >
                <div className="flex items-center gap-2 text-[var(--accent-solid)]">
                  <Award className="w-8 h-8 md:w-10 md:h-10" />
                  <h3 className="font-bold text-lg">{item.title}</h3>
                </div>
                <p className="text-[var(--text-secondary)] text-sm">Issued by: {item.company}</p>
                <p className="text-[var(--text-secondary)] text-sm">Issued: {item.issueDate}</p>
                {item.expiration && <p className="text-[var(--text-secondary)] text-sm">Expires: {item.expiration}</p>}
                {item.credentialId && <p className="text-[var(--text-secondary)] text-sm">Credential ID: {item.credentialId}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

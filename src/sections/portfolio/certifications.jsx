import React, { useEffect, useState, useRef } from "react";
import useScrollAnimation from "../../hooks/useScrollAnimation";
import { Award } from "lucide-react";

export default function Certifications() {
  const sectionRef = useRef(null);
  useScrollAnimation(sectionRef);

  const [items, setItems] = useState([]);

  useEffect(() => {
    // fetch the about-data file and parse certifications
    const load = async () => {
      try {
        const res = await fetch("/about-data.txt");
        if (!res.ok) return;
        const text = await res.text();
        const lines = text.split(/\r?\n/);
        const start = lines.findIndex(l => l.trim() === "[CERTIFICATIONS]");
        if (start === -1) return;
        const certLines = lines.slice(start + 1);
        const certs = [];
        for (const line of certLines) {
          if (line.trim() && !line.startsWith('[')) {
            certs.push(line.trim());
          }
        }
        setItems(certs);
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, []);

  return (
    <section id="certifications" className="section-container" ref={sectionRef}>
      <div className="content-wrapper">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-[var(--text-primary)] tracking-tight animate-fade-up opacity-0">
          Certifications
        </h1>
        <p className="text-base md:text-2xl text-[var(--text-secondary)] mb-8 animate-fade-up opacity-0">
          Formal credentials and certificates I've earned over time.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="glass-card p-6 rounded-xl animate-stagger-item opacity-0 flex flex-col gap-2 hover:-translate-y-1 transition-transform duration-300"
            >
              <div className="flex items-center gap-2 text-[var(--accent-solid)]">
                <Award className="w-8 h-8 md:w-10 md:h-10" />
                <h3 className="font-bold text-lg">Certificate</h3>
              </div>
              <p className="text-[var(--text-secondary)] leading-relaxed text-base">
                {item}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

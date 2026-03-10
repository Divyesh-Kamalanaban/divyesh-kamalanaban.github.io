import { useRef } from "react";
import "./header.css";
import { Download } from "lucide-react";
import useScrollAnimation from "../../hooks/useScrollAnimation";

export default function Header() {
  const headerRef = useRef(null);

  // Initialize scroll animations
  useScrollAnimation(headerRef);

  const handleMouseMove = (e) => {
    if (!headerRef.current) return;
    const { left, top } = headerRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    headerRef.current.style.setProperty("--mouse-x", `${x}px`);
    headerRef.current.style.setProperty("--mouse-y", `${y}px`);
  };

  const handleMouseLeave = () => {
    if (headerRef.current) {
      // Option: Reset to center or just leave it at last position. 
      // Leaving it is usually smoother, or we can fade it out via CSS class.
    }
  };

  return (
    <header
      ref={headerRef}
      className="header-section"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Procedural Tech Gradient Background */}
      <div className="tech-gradient-bg" />

      {/* Background with Grid/Noise */}
      <div className="section-bg" />

      {/* Main Hero Content */}
      <div className="hero">
        <div className="hero-text">
          <h1 className="text-7xl md:text-9xl lg:text-10xl font-bold tracking-tighter drop-shadow-2xl text-accent animate-scale-in opacity-0">
            Divyesh Kamalanaban
          </h1>

          <p className="subtitle animate-fade-up opacity-0">
            Intelligence Engineer by trade,<br className="md:hidden" /> Intelligence Engineer by passion.
          </p>

          <div className="mt-12 flex flex-col md:flex-row gap-6 items-center animate-fade-up opacity-0" style={{ animationDelay: "0.2s" }}>
            <button
              type="button"
              className="btn-primary text-lg"
              onClick={() => window.open("public/assets/resume.pdf", "_blank")}
            >
              Download Resume
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Footer / Scroll Hint can go here */}
    </header>
  );
}



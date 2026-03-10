import React, { useState, useEffect } from "react";
import "@fontsource-variable/manrope";
import "@fontsource-variable/inter";
import '@fontsource/abril-fatface';
import '@fontsource/ibm-plex-serif';
import '@fontsource/ibm-plex-serif/400-italic.css';
import QueryWithRAG from "./sections/rag.jsx";
import Header from "./sections/portfolio/header.jsx";
import About from "./sections/portfolio/about.jsx";
import Projects from "./sections/portfolio/projects.jsx";
import Experience from "./sections/portfolio/experience.jsx";
import Certifications from "./sections/portfolio/certifications.jsx";
import { Sun, Moon } from "lucide-react";
import Footer from "./sections/portfolio/footer.jsx";

//Static Portfolio and RAG Query Switch NavBar
function NavBar({ activeSection, setActiveSection, theme, toggleTheme }) {
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[1000] flex items-center justify-center gap-4">
      <div className="glass-nav rounded-full p-1.5 flex items-center gap-1">
        {["portfolio", "rag-query"].map((section) => (
          <button
            key={section}
            type="button"
            onClick={() => setActiveSection(section)}
            className={`
              relative px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 z-10
              ${activeSection === section ? "text-white" : "text-[#b1b1b1] hover:text-[#f1f1f1]"}
            `}
          >
            {activeSection === section && (
              <span className="absolute inset-0 bg-accent rounded-full -z-10 shadow-sm animate-[fadeIn_0.2s_ease-out]" />
            )}
            {section === "portfolio" ? "Portfolio" : "RAG Mode"}
          </button>
        ))}
      </div>

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="glass-nav p-3 rounded-full hover:scale-105 active:scale-95 transition-all duration-700 ease-in-out text-(--text-primary)"
      >
        {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5 text-white" />}
      </button>
    </div>
  );
}

import Lenis from "lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";

export default function App() {
  const [activeSection, setActiveSection] = useState("portfolio");

  // Initialize theme from localStorage or system preference
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('theme')) {
      return localStorage.getItem('theme');
    }
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Smooth Scroll Setup
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: "vertical",
      gestureDirection: "vertical",
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Integrate with GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // lenis.on("scroll", ScrollTrigger.update); // Optional: usually auto-handled or needs specific sync

    // Sync GSAP ticker to Lenis (optional, but good for complex animations)
    // gsap.ticker.add((time) => {
    //   lenis.raf(time * 1000);
    // });
    // gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
    };
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="relative min-h-screen w-full text-(--text-primary) font-['Manrope_Variable'] tracking-tight selection:bg-(--text-primary) selection:text-(--bg-primary)">
      <div className="global-bg" />
      <NavBar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {activeSection === "portfolio" && (
        <div className="w-full flex flex-col items-center animate-[fadeIn_0.5s_ease-out]">
          <Header />
          <About />
          <Projects />
          <Experience />
          <Certifications />
          <Footer />
        </div>
      )}

      {activeSection === "rag-query" && (
        <div className="w-full flex flex-col items-center animate-[fadeIn_0.5s_ease-out]">
          <QueryWithRAG />
        </div>
      )}
    </div>
  );
}

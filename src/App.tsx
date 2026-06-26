import { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import ProjectsSection from './components/ProjectsSection';
import ExperienceSection from './components/ExperienceSection';
import StackSection from './components/StackSection';
import CertificationsSection from './components/CertificationsSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import ProjectsListRoute from './components/projects/ProjectsListRoute';
import ProjectDetailRoute from './components/projects/ProjectDetailRoute';
import siteContent from './data/ui.json';

function ScrollToHashOnLoad() {
  const location = useLocation();
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        // Small delay to ensure the DOM is fully rendered
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    }
  }, [location.hash]);
  return null;
}

export default function App() {
  return (
    <div className="bg-[#0E0E0F] text-[#e5e2e3] selection:bg-[#bdff00] selection:text-black font-sans leading-relaxed overflow-x-hidden min-h-screen relative">
      <ScrollToHashOnLoad />
      <Header />

      <Routes>
        <Route path="/" element={
          <>
            <Hero onInitialize={() => {}} />
            <Marquee text={siteContent.marquee.primary} />
            <ProjectsSection />
            <Marquee text={siteContent.marquee.secondary} reverse />
            <ExperienceSection />
            <StackSection />
            <CertificationsSection />
            <ContactSection />
            <Footer />
          </>
        } />
        <Route path="/projects" element={<ProjectsListRoute />} />
        <Route path="/projects/:id" element={<ProjectDetailRoute />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Global resume/source modals removed to reduce over-the-top behavior */}
    </div>
  );
}
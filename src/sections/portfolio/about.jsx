import React, { useRef } from "react";
import "./header.css";
import { Cpu, Layers, Activity, FlaskConical, Award } from "lucide-react";
import { useEffect } from "react";
import { useState } from "react";
import useScrollAnimation from "../../hooks/useScrollAnimation";

function GitHubCard() {
  const [followers, setFollowers] = useState(0)
  const [repos, setRepos] = useState(0)
  const [following, setFollowing] = useState(0)
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("https://api.github.com/users/Divyesh-Kamalanaban");
        if (res.ok) {
          const data = await res.json();
          setFollowers(data.followers);
          setFollowing(data.following);
          setRepos(data.public_repos);
        }
      } catch (e) { console.error(e) }
    }

    load();
  }, [])
  const data = {
    username: "Divyesh-Kamalanaban",
    avatar: "https://github.com/Divyesh-Kamalanaban.png",
    banner: "/assets/github-profile-banner.png",
    profile: "https://github.com/Divyesh-Kamalanaban",
    stats: {
      repos: repos,            // replace with real values if you fetch dynamically
      followers: followers,
      following: following
    }
  };

  return (
    <div className="w-full md:w-[420px] rounded-xl overflow-hidden border border-neutral-300 bg-[#171717fb] text-[#e6e4e6] hover:bg-[#e6e4e6] hover:text-[#171717fb] transition-all duration-200 animate-scale-in opacity-0">

      <div className="w-full h-32 overflow-hidden">
        <img
          src={data.banner}
          alt="banner"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-6 flex flex-col items-start">
        <img
          src={data.avatar}
          alt="avatar"
          className="w-20 h-20 rounded-full border-2 border-white -mt-10 mb-4"
        />

        <h2 className="text-3xl font-bold tracking-tight">{data.username}</h2>

        <div className="mt-4 font-['IBM_Plex_Serif'] text-lg space-y-1 italic">
          <p>{data.stats.repos} repositories • {data.stats.followers} followers • {data.stats.following} following</p>
        </div>

        <a
          href={data.profile}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 px-4 py-2 border border-current rounded-full text-sm hover:bg-current hover:text-[#171717fb] transition-all"
        >
          View Profile
        </a>

      </div>
    </div>
  );
}

export default function About() {
  const sectionRef = useRef(null);
  useScrollAnimation(sectionRef);

  return (
    <section id="about" className="section-container" ref={sectionRef}>
      <div className="content-wrapper">
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between w-full gap-8 mb-12">
          <div className="flex-1">
            <h1 className="text-4xl md:text-9xl font-bold mb-6 text-[var(--text-primary)] tracking-tight animate-fade-up opacity-0">About Me</h1>
            <div className="text-base md:text-3xl text-justify text-[var(--text-secondary)] tracking-tight animate-fade-up opacity-0">
              <p className="mb-4">
                Hello! I'm Divyesh Kamalanaban. I try to solve problems people don't talk much about. I build all-rounded solutions to these problems, with my touch. I have worked on projects of all shapes and sizes, from simple timetable dashboards to ML based firmware level resource adaptive systems for next gen cryptography.
              </p>
            </div>
          </div>
          <GitHubCard />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full animate-stagger-container">
          {[
            {
              title: "Core Domains",
              tagline: "What I build repeatedly.",
              icon: Cpu,
              footer: "Domain Overview",
              items: [
                "Designing AI systems that tackle real-world engineering challenges",
                "Building embedded systems that handle complex computations efficiently",
                "Running smart AI models directly on edge devices",
                "Implementing future-proof security on tiny microcontrollers",
              ],
            },
            {
              title: "Technical Stack",
              tagline: "Tools I operate fluently.",
              icon: Layers,
              footer: "Tooling Summary",
              items: [
                "Python, C, C++, and JavaScript are my daily coding languages",
                "PyTorch, TensorFlow, and TFLite Micro for machine learning projects",
                "ESP-IDF and FreeRTOS for embedded system development",
                "React, Node.js, Docker, and Git for full-stack web work",
              ],
            },
            {
              title: "Execution Modalities",
              tagline: "How systems actually run.",
              icon: Activity,
              footer: "System Execution Modes",
              items: [
                "Deploying lightweight AI models that run efficiently",
                "Integrating machine learning directly into firmware",
                "Scaling cryptographic security on the fly",
                "Profiling systems in real-time for optimization",
              ],
            },
            {
              title: "Research Surfaces",
              tagline: "Where my work intersects research.",
              icon: FlaskConical,
              footer: "Research Focus",
              items: [
                "Analyzing faults in smart power grids using machine learning",
                "Classifying species from environmental DNA for biodiversity",
                "Developing lightweight machine learning pipelines",
                "Building resilient cryptography for edge devices",
              ],
            },


          ].map((section, index) => {
            const Icon = section.icon;
            return (
              <div
                key={index}
                className="glass-card p-6 md:p-8 flex flex-col items-start rounded-xl h-full min-h-[300px] animate-stagger-item opacity-0"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Icon className="h-8 w-8 md:h-10 md:w-10 text-(--accent-solid)" strokeWidth={1.3} />
                  <h2 className="font-bold text-2xl md:text-3xl tracking-tight text-[var(--text-primary)]">
                    {section.title}
                  </h2>
                </div>

                <p className="italic text-base md:text-lg mt-1 font-['IBM_Plex_Serif'] text-[var(--text-secondary)]">
                  {section.tagline}
                </p>

                <ul className="text-base md:text-lg font-['IBM_Plex_Serif'] mt-4 space-y-1 flex-grow text-[var(--text-secondary)]">
                  {section.items.map((item, idx) => (
                    <li key={idx}>• {item}</li>
                  ))}
                </ul>

                <div className="mt-6 text-sm text-[var(--text-secondary)] opacity-60 font-['IBM_Plex_Serif']">
                  {section.footer}
                </div>
              </div>
            )

          })}
        </div>
      </div>
    </section>
  );
}

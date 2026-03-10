import React, { useRef } from "react";
import { Briefcase, Terminal, Globe, Code, Cpu, Database, AppWindow, Layers } from "lucide-react";
import useScrollAnimation from "../../hooks/useScrollAnimation";

export default function Experience() {
    const sectionRef = useRef(null);
    useScrollAnimation(sectionRef);

    const experiences = [
        {
            role: "Summer Intern",
            company: "National Institute of Technology (NIT) Trichy",
            duration: "June 2025 - July 2025",
            points: [
                "Developed a custom fault detection engine for CIGRE-MV networks by exploring DLPF solvers, ML frameworks, and power system behavior to localize single bus faults.",
                "Generated 21,000+ power grid scenarios using pandapower, increasing detection accuracy to 95%.",
                "Implemented ensemble methods utilizing multi-tier random forest trees, achieving 92% detection and 100% localization of grid faults.",
                "Optimized solvers using Decoupled Linear Power Flow (DLPF), reducing voltage computation time by 70% compared to Newton–Raphson methods."
            ],
            stack: "Python, TensorFlow, Scikit-learn, pandapower",
        },
        {
            role: "MERN Developer Intern",
            company: "Circle Communications",
            duration: "May 2025",
            points: [
                "Engineered a high-performance full-stack CRM with a Redux-powered frontend (59k+ LOC) and microservice backend, achieving 51ms API latency.",
                "Applied 'Thin Server, Thick Client' architecture to maintain lean business logic while managing 300k+ dependency libraries for enterprise scalability.",
                "Enhanced developer experience (DX) using Vite and Concurrently, reducing full-stack cold startup time to 1.39s.",
                "Built a resilient backend with auto-retry database connections to ensure 99.9% uptime during production simulations."
            ],
            stack: "MongoDB, Express.js, React, Node.js, Redux, Vite",
        },
    ];

    /* Helper to get icon for tech stack */
    const getTechIcon = (tech) => {
        const t = tech.toLowerCase();
        if (t.includes("python")) return <Terminal className="w-3 h-3" />;
        if (t.includes("react") || t.includes("js") || t.includes("node")) return <Globe className="w-3 h-3" />;
        if (t.includes("c++") || t.includes("c/c++")) return <Code className="w-3 h-3" />;
        if (t.includes("tensorflow") || t.includes("scikit") || t.includes("ml")) return <Cpu className="w-3 h-3" />;
        if (t.includes("database") || t.includes("mongo")) return <Database className="w-3 h-3" />;
        if (t.includes("esp") || t.includes("idf")) return <AppWindow className="w-3 h-3" />;
        return <Layers className="w-3 h-3" />;
    };

    return (
        <div id="experience" className="section-container border-t border-(--glass-border)" ref={sectionRef}>
            <div className="content-wrapper">
                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6 text-[var(--text-primary)] animate-fade-up opacity-0">Experience</h1>
                <p className="font-['IBM_Plex_Serif'] text-lg md:text-xl text-center max-w-3xl mb-12 text-(--text-secondary) animate-fade-up opacity-0">
                    Here are some of the notable professional experiences, highlighting contributions in various organizations.
                </p>
                <div className="relative max-w-4xl mx-auto">
                    {/* Timeline Vertical Line Spine */}
                    <div className="absolute left-8 md:left-1/2 top-4 bottom-0 w-px bg-linear-to-b from-(--glass-border) via-(--accent-solid) to-transparent" />

                    <div className="space-y-12 animate-stagger-container">
                        {experiences.map((exp, idx) => (
                            <div
                                key={idx}
                                className={`relative flex flex-col md:flex-row gap-8 ${idx % 2 === 0 ? "md:flex-row-reverse" : ""} animate-stagger-item opacity-0`}
                            >
                                {/* Timeline Dot */}
                                <div className="absolute left-8 md:left-1/2 w-4 h-4 rounded-full bg-(--accent) shadow-[0_0_10px_var(--accent-solid)] transform -translate-x-1/2 mt-1.5 z-10 hidden md:block" />
                                {/* Mobile Dot */}
                                <div className="absolute left-8 w-3 h-3 rounded-full bg-(--accent) shadow-[0_0_10px_var(--accent-solid)] transform -translate-x-1/2 mt-6 z-10 md:hidden" />

                                {/* Empty space for alternating side - Hidden on mobile */}
                                <div className="flex-1 hidden md:block" />

                                {/* Content Card */}
                                <div className="flex-1 pl-16 md:pl-0">
                                    <div className="relative group">
                                        {/* Arrow pointing to center (Desktop only) */}
                                        <div
                                            className={`absolute top-6 w-4 h-4 bg-(--glass-bg) transform hidden md:block z-0 group-hover:border-(--accent-solid)/30 transition-colors duration-300
                                                ${idx % 2 === 0
                                                    ? "-right-2 border-t border-r border-(--glass-border) rotate-45"
                                                    : "-left-2 border-t border-l border-(--glass-border) -rotate-45"}
                                            `}
                                            style={{
                                                clipPath: idx % 2 === 0
                                                    ? "polygon(0 0, 100% 0, 100% 100%)"
                                                    : "polygon(0 0, 100% 0, 0 100%)"
                                            }}
                                        />

                                        <div className="glass-card p-6 md:p-8 rounded-xl relative z-10 hover:-translate-y-1 transition-all duration-300 group-hover:border-(--accent-solid)/30 group-hover:shadow-[0_0_20px_rgba(233,64,87,0.1)]">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
                                                <div>
                                                    <h2 className="text-xl md:text-2xl font-bold text-accent">
                                                        {exp.role}
                                                    </h2>
                                                    <h3 className="text-(--text-secondary) font-medium">
                                                        {exp.company}
                                                    </h3>
                                                </div>
                                                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-(--accent-solid)/5 text-accent border border-(--accent-solid)/20 whitespace-nowrap">
                                                    {exp.duration}
                                                </span>
                                            </div>

                                            <ul className="space-y-2 mb-6 list-disc list-outside ml-4 text-(--text-secondary) font-['IBM_Plex_Serif']">
                                                {exp.points.map((point, i) => (
                                                    <li key={i}>{point}</li>
                                                ))}
                                            </ul>

                                            <div className="flex flex-wrap gap-2">
                                                {exp.stack.split(", ").map((tech, i) => (
                                                    <span
                                                        key={i}
                                                        className="relative inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-(--accent-solid)/5 border border-(--accent-solid)/20 hover:border-(--accent-solid)/50 transition-colors duration-300 group/pill overflow-hidden cursor-default"
                                                    >
                                                        <span className="absolute inset-0 bg-(--accent) opacity-0 group-hover/pill:opacity-100 transition-opacity duration-300" />
                                                        <span className="relative z-10 flex items-center gap-1.5 text-(--text-secondary) group-hover/pill:text-white transition-colors duration-300">
                                                            {getTechIcon(tech)}
                                                            {tech}
                                                        </span>
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
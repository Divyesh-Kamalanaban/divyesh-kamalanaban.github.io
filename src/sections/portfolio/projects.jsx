import React, { useRef } from "react";
import { Github, Code, Terminal, Cpu, Database, AppWindow, Globe, Layers, Shield, Zap, Activity, Brain, Server, Search, Radio, Lock, Target, Gauge } from "lucide-react";
import useScrollAnimation from "../../hooks/useScrollAnimation";

const getFeatureIcon = (text) => {
  const lower = text.toLowerCase();
  if (lower.includes("pqc") || lower.includes("cryptography") || lower.includes("security") || lower.includes("protection") || lower.includes("safe")) return <Shield className="w-4 h-4" />;
  if (lower.includes("ml") || lower.includes("neural") || lower.includes("learning") || lower.includes("ai") || lower.includes("model") || lower.includes("transformer") || lower.includes("prediction")) return <Brain className="w-4 h-4" />;
  if (lower.includes("grid") || lower.includes("power") || lower.includes("voltage") || lower.includes("energy") || lower.includes("electronic")) return <Zap className="w-4 h-4" />;
  if (lower.includes("simulation") || lower.includes("pipeline") || lower.includes("flow") || lower.includes("process") || lower.includes("solver") || lower.includes("real-time") || lower.includes("profiling")) return <Activity className="w-4 h-4" />;
  if (lower.includes("data") || lower.includes("dataset") || lower.includes("pandas") || lower.includes("numpy") || lower.includes("sample")) return <Database className="w-4 h-4" />;
  if (lower.includes("esp32") || lower.includes("microcontroller") || lower.includes("embedded") || lower.includes("hardware") || lower.includes("firmware") || lower.includes("memory") || lower.includes("stack") || lower.includes("quantized") || lower.includes("bit") || lower.includes("esp-idf")) return <Cpu className="w-4 h-4" />;
  if (lower.includes("accuracy") || lower.includes("detection") || lower.includes("localization") || lower.includes("precision")) return <Target className="w-4 h-4" />;
  if (lower.includes("fast") || lower.includes("latency") || lower.includes("speed") || lower.includes("convergence") || lower.includes("reduced")) return <Gauge className="w-4 h-4" />;
  if (lower.includes("api") || lower.includes("server") || lower.includes("backend")) return <Server className="w-4 h-4" />;
  if (lower.includes("dna") || lower.includes("bio") || lower.includes("species") || lower.includes("taxonomy") || lower.includes("genomics")) return <Search className="w-4 h-4" />;
  if (lower.includes("web") || lower.includes("react") || lower.includes("ui") || lower.includes("frontend") || lower.includes("interface")) return <AppWindow className="w-4 h-4" />;
  if (lower.includes("communication") || lower.includes("network")) return <Radio className="w-4 h-4" />;
  return <Code className="w-4 h-4" />;
};

const ProjectSection = ({ project, index }) => {
  const sectionRef = useRef(null);
  useScrollAnimation(sectionRef);

  const isEven = index % 2 === 0;

  return (
    <div
      ref={sectionRef}
      className={`min-h-[80vh] flex flex-col items-center justify-center py-24 px-6 md:px-12 border-t border-[var(--glass-border)] ${isEven ? "bg-[var(--bg-secondary)]/5" : ""
        }`}
    >
      <div className="content-wrapper">
        {/* Top Section: Text Left, Image Right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 items-center">
          {/* Left Column: Text Content */}
          <div className="flex flex-col gap-6 order-2 lg:order-1 animate-fade-up opacity-0">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[var(--text-primary)] mb-2">
                {project.title.split("—")[0].trim()}
              </h2>
              <p className="text-xl md:text-2xl text-accent font-['IBM_Plex_Serif'] italic mb-4">
                {project.title.split("—")[1]?.trim()}
              </p>
              <p className="text-lg text-[var(--text-secondary)] leading-relaxed max-w-xl">
                {project.description}
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {/* Tech Stack Row */}
              <div className="flex flex-wrap gap-2">
                {project.stack.split(", ").map((tech, i) => (
                  <span
                    key={i}
                    className="relative inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[var(--bg-secondary)] border border-[var(--glass-border)] overflow-hidden group transition-all duration-300 hover:border-transparent"
                  >
                    <span className="absolute inset-0 bg-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="relative z-10 flex items-center gap-1.5 text-[var(--text-secondary)] group-hover:text-white transition-colors duration-300">
                      {/* Duplicating icon logic for now since getTechIcon is defined in parent. Ideally pass it down or move to utils. For now, text only or simple render */}
                      {tech}
                    </span>
                  </span>
                ))}
              </div>

              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-fit mt-2"
              >
                View Code
                <Github className="w-5 h-5 ml-2" />
              </a>
            </div>
          </div>

          {/* Right Column: Hero Image */}
          <div className="order-1 lg:order-2 glass-card rounded-2xl overflow-hidden p-2 animate-scale-in opacity-0 ring-1 ring-white/10 shadow-2xl transform transition-transform duration-700 hover:scale-[1.02]">
            <div className="relative aspect-video rounded-xl overflow-hidden bg-black/50">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover opacity-90 transition-opacity duration-500 hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Bottom Section: Features Grid */}
        <div className="w-full animate-stagger-container">
          <h3 className="text-xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2 opacity-0 animate-fade-up">
            <Layers className="w-5 h-5 text-accent" />
            Key Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {project.points.map((point, idx) => (
              <div
                key={idx}
                className="glass-card p-6 rounded-xl animate-stagger-item opacity-0 flex flex-col gap-3 hover:bg-[var(--glass-bg)]/80 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-[var(--accent-solid)]/10 flex items-center justify-center text-[var(--accent-solid)]">
                  {getFeatureIcon(point)}
                </div>
                <p className="text-[var(--text-secondary)] leading-relaxed font-medium text-sm">
                  {point}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Projects() {
  const projects = [
    {
      title: "SleeQC — Resource-Adaptive PQC on ESP32",
      description:
        "A resource-constrained implementation of Post-Quantum Cryptography algorithms optimized for the ESP32 microcontroller, featuring dynamic parameter switching and real-time profiling.",
      points: [
        "Dynamic PQC engine with ML-controlled parameter switching",
        "Quantized TFLite-Micro model for system-load prediction",
        "Full memory and stack instrumentation inside ESP-IDF tasks",
      ],
      stack: "C/C++, ESP-IDF, TensorFlow Lite Micro",
      image: "/assets/sleeqc.png",
      link: "https://github.com/Divyesh-Kamalanaban/sleeqc",
    },
    {
      title: "Gridifix — ML Fault Detection for Smart Grids",
      description:
        "A comprehensive machine learning pipeline for detecting and localizing faults in smart grids, utilizing synthetic data generation and optimized power-flow solvers to ensure grid reliability.",
      points: [
        "21k-sample grid simulation pipeline using pandapower",
        "92–100% detection and localization accuracy",
        "Optimized differential power-flow solver with 70% faster convergence",
      ],
      stack: "Python, Pandapower, PyTorch",
      image: "/assets/gridifix.png",
      link: "https://github.com/Divyesh-Kamalanaban/gridifix",
    },
    {
      title: "Seaquenced — eDNA Taxonomy Engine",
      description:
        "An end-to-end bioinformatics pipeline for environmental DNA (eDNA) taxonomy classification, leveraging transformer models and mutation-based data augmentation for high-accuracy assessment.",
      points: [
        "Dataset expanded to 10k+ samples via mutation-based augmentation",
        "4-bit Nucleotide Transformer with reduced memory footprint",
        "End-to-end classification pipeline for biodiversity assessment",
      ],
      stack: "Python, Transformers, NumPy",
      image: "/assets/seaquenced.png",
      link: "https://github.com/Divyesh-Kamalanaban/seaquenced",
    },
  {
    title: "Sororine — TypeScript Application",
    description: "A modern TypeScript project featuring advanced web development techniques and open-source contributions.",
    points: [
      "Built with TypeScript for enhanced type safety",
      "Implements modern web development practices",
      "Active open-source project with community contributions",
    ],
    stack: "TypeScript",
    image: "/assets/gridifix.png",
    link: "https://github.com/Divyesh-Kamalanaban/sororine",
  },
  {
    title: "EukaryoticDB — Python Database Tool",
    description: "A specialized Python database for managing eukaryotic organism data, supporting research and analysis.",
    points: [
      "Efficient data storage for eukaryotic datasets",
      "Python-based implementation for flexibility",
      "Designed for bioinformatics research applications",
    ],
    stack: "Python",
    image: "/assets/gridifix.png",
    link: "https://github.com/Divyesh-Kamalanaban/eukaryoticdb",
  },
  ];

  return (
    <div id="projects" className="w-full flex flex-col">
      {/* Section Header */}
      <div className="section-container min-h-[40vh] py-20">
        <div className="content-wrapper text-center">
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 text-[var(--text-primary)]">
            Selected Works
          </h1>
          <p className="font-['IBM_Plex_Serif'] text-xl md:text-2xl max-w-2xl mx-auto text-[var(--text-secondary)]">
            A collection of technical projects exploring embedded systems, machine learning, and hardware optimization.
          </p>
        </div>
      </div>

      {/* Project Sections */}
      {projects.map((proj, idx) => (
        <ProjectSection key={idx} project={proj} index={idx} />
      ))}
    </div>
  );
}

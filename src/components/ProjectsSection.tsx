import { useState } from 'react';
import { Project } from '../types';
import { LucideIcon, Star, ArrowRight, X, TrendingUp, Layers, Cpu, Code, Activity, Sparkles, AlertCircle, Info, ExternalLink, Globe, Shield } from 'lucide-react';

interface ProjectDetailsModalProps {
  project: Project | null;
  onClose: () => void;
}

function ProjectDetailsModal({ project, onClose }: ProjectDetailsModalProps) {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      />
      
      {/* Modal Card */}
      <div className="relative w-full md:w-1/2 max-w-2.5xl bg-[#0E0E0F] border border-white/10 rounded-lg p-6 sm:p-8 overflow-y-auto max-h-[90vh] z-10 select-text">
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-1 text-on-surface-variant hover:text-white hover:bg-white/5 transition-all rounded"
          title="Close details"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <div className="flex flex-wrap gap-2 mb-3">
            {project.tags.map((tag) => (
              <span key={tag} className="bg-surface-container-highest px-3 py-1 text-[10px] font-bold text-primary tracking-wider uppercase">
                {tag}
              </span>
            ))}
          </div>
          <h3 className="font-headline text-2xl sm:text-3.5xl font-extrabold text-[#bdff00] leading-tight tracking-tighter">
            {project.title}
          </h3>
          {project.version && (
            <span className="text-xs text-outline-variant font-mono block mt-1">{project.version}</span>
          )}
        </div>

        {/* Dynamic Architectural Metadata Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-y border-outline-variant/30 py-4 mb-6">
          <div>
            <p className="text-[10px] text-white/40 uppercase font-bold tracking-wider mb-0.5">Category</p>
            <p className="text-sm font-semibold text-white">{project.category || 'Systems Architecture'}</p>
          </div>
          <div>
            <p className="text-[10px] text-white/40 uppercase font-bold tracking-wider mb-0.5">Status</p>
            <p className="text-sm font-semibold text-[#bdff00]">▲ Production</p>
          </div>
          <div>
            <p className="text-[10px] text-white/40 uppercase font-bold tracking-wider mb-0.5">Deployment Latency</p>
            <p className="text-sm font-semibold text-secondary">{project.id === 'neurallink' ? 'Sub-50ms Global' : project.id === 'quantcore' ? '12ms Internal' : 'Responsive'}</p>
          </div>
        </div>

        {/* In-depth case study details */}
        <div className="space-y-6">
          <div>
            <h4 className="text-xs uppercase font-extrabold text-white tracking-widest mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#bdff00]" />
              The Mission Goals
            </h4>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              {project.description} Custom engineered to minimize physical payload serialization times. Developed specifically to meet enterprise-grade scalability profiles, sustaining peak computational stress tests.
            </p>
          </div>

          <div>
            <h4 className="text-xs uppercase font-extrabold text-white tracking-widest mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
              Technical Implementation Details
            </h4>
            <ul className="space-y-2 text-sm text-on-surface-variant font-mono">
              <li className="flex items-start gap-2">
                <span className="text-secondary select-none">$&gt;</span>
                <span>Configured active load balancing and multi-node sharding structures.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-secondary select-none">$&gt;</span>
                <span>Integrated specialized gRPC systems to scale down communication bottlenecks.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-secondary select-none">$&gt;</span>
                <span>Established edge telemetry monitoring loops via direct WebSockets connections.</span>
              </li>
            </ul>
          </div>

          {project.id === 'neurallink' && (
            <div className="bg-[#131314] border border-[#bdff00]/10 p-5 rounded-lg">
              <p className="text-xs uppercase font-extrabold text-[#bdff00] select-none tracking-widest mb-2">Architect's Post-Mortem Report</p>
              <p className="text-xs text-on-surface-variant leading-relaxed font-mono">
                "Our edge clusters sustained continuous, unbuffered data ingestion pipelines across 48 worldwide validation nodes. The core sub-cluster maintained 400k predictions per second using PyTorch inference pipelines natively bundled within C++ runtime containers."
              </p>
            </div>
          )}
        </div>

        {/* Foot Buttons */}
        <div className="flex flex-wrap gap-4 mt-8 pt-6 border-t border-outline-variant/30">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 bg-white text-black hover:bg-[#bdff00] hover:text-black hover:shadow-[0_0_15px_rgba(189,255,0,0.3)] text-xs uppercase font-extrabold tracking-wider transition-all"
          >
            Acknowledge Session
          </button>
          
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-2.5 border border-white/20 text-white hover:border-[#bdff00] hover:text-[#bdff00] text-xs uppercase font-bold tracking-wider hover:bg-white/5 transition-all text-center"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Interactive Demo</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default function ProjectsSection() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [stars, setStars] = useState(1243);
  const [hasStarred, setHasStarred] = useState(false);

  const projects: Project[] = [
    {
      id: 'neurallink',
      title: 'NeuralLink: Distributed Inference Engine',
      description: 'An edge-computing framework designed to distribute machine learning workloads across global node clusters with sub-50ms latency.',
      tags: ['KUBERNETES', 'PYTORCH'],
      category: 'ai',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCAKzSYH_Pc3gEvoHyTxqOofiKRcCPrl9PczkZmbhvKf10DOeGFZzM7Iss8nMJyAlJWAFal3CqLL1vI32ntudXAmMtfd_yDqUHxzgvd8EEjxIq71jiolwgkWwPcFueYgMwN6EC2LR0Q71HPAjNfvwxg68W5vStzI-OS6zqVK6ucDKURC2Mz6Zo7wSqFQEdtnqIeKB9u4z1vir6OQqM80e9H3iKjk7O6yJpH-x5WYDO1T48qAGqXCXnPt41ThUu405FogJ8dPYPIEw',
      version: 'v2.4.0_STABLE',
    },
    {
      id: 'quantcore',
      title: 'QuantCore',
      description: 'Real-time financial telemetry platform processing 10M+ events per second with multi-threaded message queues and ultra-low serialization overhead.',
      tags: ['RUST', 'GOLANG'],
      category: 'infra',
      icon: 'analytics',
    },
    {
      id: 'auraui',
      title: 'AuraUI',
      description: 'A glassmorphic design system for AI-centric web applications featuring optimized hardware-accelerated animations and high-fidelity inputs.',
      tags: ['REACT', 'WEBGL'],
      category: 'system',
    },
    {
      id: 'pulsegraph',
      title: 'PulseGraph',
      description: 'GraphQL mesh for federated microservices architectures. Automatically consolidates micro-API schemas with lightning fast request pipelining.',
      tags: ['NODE.JS', 'AWS'],
      category: 'infra',
    },
  ];

  const handleStarClick = () => {
    if (hasStarred) {
      setStars((prev) => prev - 1);
      setHasStarred(false);
    } else {
      setStars((prev) => prev + 1);
      setHasStarred(true);
    }
  };

  return (
    <section className="py-stack-xl max-w-container-max mx-auto px-gutter relative tracking-tight" id="projects">
      {/* Visual background typography */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden select-none">
        <div className="word-cloud-bg opacity-15">KUBERNETES DEPLOY ARCHITECTURE</div>
      </div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="text-left">
            <span className="text-xs font-bold text-primary uppercase border-l-4 border-primary-fixed pl-4 mb-4 block tracking-wider">
              Archive 01 // Solutions
            </span>
            <h2 className="font-headline text-4xl md:text-5xl font-extrabold text-primary tracking-tighter">
              Selected Deployments
            </h2>
          </div>
          <p className="text-base text-on-surface-variant max-w-md tracking-normal text-left sm:text-right">
            A curation of high-impact engineering projects focusing on scalability, distributed intelligence, and seamless user experiences.
          </p>
        </div>

        {/* 12-Column Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Featured Project Card (Spans 8 columns) */}
          <div 
            onClick={() => setSelectedProject(projects[0])}
            className="md:col-span-8 group relative gradient-border cursor-pointer select-none"
          >
            <div className="glass-card p-8 h-full min-h-[340px] flex flex-col justify-between overflow-hidden relative">
              {projects[0].image && (
                <img 
                  className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-30 group-hover:scale-[1.03] transition-all duration-700 pointer-events-none" 
                  alt={projects[0].title}
                  src={projects[0].image}
                />
              )}
              <div className="relative z-10 text-left">
                <div className="flex gap-2 mb-6">
                  {projects[0].tags.map((tag) => (
                    <span key={tag} className="bg-surface-container-highest px-3 py-1 text-[10px] font-bold text-primary tracking-wider uppercase select-none">
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="font-headline text-2xl md:text-3xl font-extrabold text-primary mb-4 tracking-tighter hover:text-[#bdff00] transition-colors">
                  {projects[0].title}
                </h3>
                <p className="text-sm sm:text-base text-on-surface-variant max-w-lg tracking-normal leading-relaxed">
                  {projects[0].description}
                </p>
              </div>

              <div className="relative z-10 pt-8 flex items-center justify-between border-t border-outline-variant/25">
                <span className="text-xs font-bold text-primary-fixed tracking-wider flex items-center gap-2 hover:translate-x-2 transition-transform">
                  VIEW CASE STUDY <ArrowRight className="w-3.5 h-3.5" />
                </span>
                <span className="text-xs text-outline-variant font-medium tracking-tight font-mono select-none">
                  {projects[0].version}
                </span>
              </div>
            </div>
          </div>

          {/* QuantCore Card (Spans 4 columns) */}
          <div 
            onClick={() => setSelectedProject(projects[1])}
            className="md:col-span-4 group gradient-border cursor-pointer select-none text-left"
          >
            <div className="glass-card p-8 h-full flex flex-col justify-between min-h-[340px]">
              <div>
                <div className="w-12 h-12 flex items-center justify-center bg-purple-900/40 text-secondary mb-6 rounded-lg border border-purple-500/20 group-hover:bg-[#bdff00] group-hover:text-black transition-all">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="font-headline text-2xl font-extrabold text-primary mb-4 tracking-tighter">
                  {projects[1].title}
                </h3>
                <p className="text-sm text-on-surface-variant tracking-normal leading-relaxed">
                  {projects[1].description}
                </p>
              </div>
              <div className="pt-6 border-t border-outline-variant/30 mt-6 md:mt-0">
                <span className="text-xs font-bold text-primary-fixed tracking-wider uppercase font-mono">
                  RUST // GOLANG
                </span>
              </div>
            </div>
          </div>

          {/* AuraUI Card (Spans 4 columns) */}
          <div 
            onClick={() => setSelectedProject(projects[2])}
            className="md:col-span-4 group gradient-border cursor-pointer select-none text-left"
          >
            <div className="glass-card p-8 h-full flex flex-col justify-between min-h-[180px]">
              <div>
                <h3 className="font-headline text-2xl font-extrabold text-primary mb-4 tracking-tighter">
                  {projects[2].title}
                </h3>
                <p className="text-sm text-on-surface-variant mb-6 tracking-normal leading-relaxed">
                  {projects[2].description}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 pt-4 border-t border-outline-variant/20">
                <span className="text-[10px] font-bold font-mono border border-outline-variant/40 px-2.5 py-1 tracking-wider uppercase text-white/70">
                  REACT
                </span>
                <span className="text-[10px] font-bold font-mono border border-outline-variant/40 px-2.5 py-1 tracking-wider uppercase text-white/70">
                  WEBGL
                </span>
              </div>
            </div>
          </div>

          {/* PulseGraph Card (Spans 4 columns) */}
          <div 
            onClick={() => setSelectedProject(projects[3])}
            className="md:col-span-4 group gradient-border cursor-pointer select-none text-left"
          >
            <div className="glass-card p-8 h-full flex flex-col justify-between min-h-[180px]">
              <div>
                <h3 className="font-headline text-2xl font-extrabold text-primary mb-4 tracking-tighter">
                  {projects[3].title}
                </h3>
                <p className="text-sm text-on-surface-variant mb-6 tracking-normal leading-relaxed">
                  {projects[3].description}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 pt-4 border-t border-outline-variant/20">
                <span className="text-[10px] font-bold font-mono border border-outline-variant/40 px-2.5 py-1 tracking-wider uppercase text-white/70">
                  NODE.JS
                </span>
                <span className="text-[10px] font-bold font-mono border border-outline-variant/40 px-2.5 py-1 tracking-wider uppercase text-white/70">
                  AWS
                </span>
              </div>
            </div>
          </div>

          {/* Open Source Contribution (Spans 4 columns) */}
          <div className="md:col-span-4 group gradient-border select-none text-left relative">
            <div className="glass-card p-8 h-full bg-gradient-to-br from-purple-500/10 to-transparent flex flex-col justify-between min-h-[180px]">
              <div>
                <h3 className="font-headline text-2xl font-extrabold text-primary mb-4 tracking-tighter">
                  Open Source
                </h3>
                <p className="text-sm text-on-surface-variant mb-6 tracking-normal leading-relaxed">
                  Contributing to the foundation of the modern web stack. Maintainer of several optimized developer kits and CLI environments.
                </p>
              </div>
              
              <button
                onClick={handleStarClick}
                className={`flex items-center justify-between w-full px-4 py-3 border transition-all ${
                  hasStarred 
                    ? 'bg-[#bdff00] text-black border-[#bdff00] font-bold' 
                    : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                }`}
                title="Star project on GitHub"
              >
                <div className="flex items-center gap-2">
                  <Star className={`w-4 h-4 ${hasStarred ? 'fill-black' : 'fill-white/80'}`} />
                  <span className="text-xs uppercase tracking-wider font-extrabold font-mono">
                    {hasStarred ? 'Starred!' : 'Star on GitHub'}
                  </span>
                </div>
                <span className="text-xs font-mono opacity-80">{stars.toLocaleString()} Stars</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      <ProjectDetailsModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}

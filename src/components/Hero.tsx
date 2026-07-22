import React from 'react';
import { ArrowRight, ShieldCheck, Zap, Activity, Globe, Server, CheckCircle2 } from 'lucide-react';

interface HeroProps {
  onOpenDemo: () => void;
  onOpenDashboard: () => void;
  onNavigateSection: (sectionId: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenDemo, onOpenDashboard, onNavigateSection }) => {
  return (
    <section id="hero" className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-[#0F172A] relative overflow-hidden">
      
      {/* Ambient Glowing Orbs - Elegant Dark Theme */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#16A34A] rounded-full blur-[140px] opacity-15 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#4ADE80] rounded-full blur-[140px] opacity-10 pointer-events-none" />

      {/* Decorative Grid Mesh */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-5xl mx-auto text-center relative z-10 pt-8">
        
        {/* Top Enterprise Badge with Ping Dot */}
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#16A34A]/10 border border-[#16A34A]/25 text-[#4ADE80] text-xs font-mono font-bold uppercase tracking-wider mb-8 shadow-inner backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4ADE80] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4ADE80]"></span>
          </span>
          VGE SaaS v4.2 • Enterprise Energy Intelligence #17556598
        </div>

        {/* Main Heading */}
        <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 leading-[1.15]">
          Intelligent Cloud Analytics for <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4ADE80] to-[#22C55E]">
            Renewable Infrastructure
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-slate-400 text-lg sm:text-xl max-w-3xl mx-auto mb-10 font-normal leading-relaxed">
          VGE Technologies OÜ provides secure, B2B Software-as-a-Service (SaaS) solutions for commercial solar developers. Track IoT data, automate ESG reporting, and manage global asset yields from a single enterprise dashboard.
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button
            onClick={onOpenDemo}
            className="w-full sm:w-auto bg-[#16A34A] hover:bg-[#15803D] text-white px-8 py-4 rounded-xl font-heading font-bold text-base transition-all duration-300 shadow-lg hover:shadow-[0_0_30px_rgba(22,163,74,0.35)] flex items-center justify-center gap-3 group cursor-pointer"
          >
            Request Enterprise Demo
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </button>

          <button
            onClick={onOpenDashboard}
            className="w-full sm:w-auto bg-slate-900/60 hover:bg-slate-800 text-white border border-white/10 hover:border-[#4ADE80]/40 px-8 py-4 rounded-xl font-heading font-semibold text-base backdrop-blur-sm transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer"
          >
            <Activity className="w-5 h-5 text-[#4ADE80]" />
            Launch Live Dashboard
          </button>
        </div>

        {/* Key Enterprise Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl bg-slate-900/40 border border-white/5 backdrop-blur-md">
          <div className="p-3 text-center border-r border-white/5 last:border-none">
            <div className="font-heading text-2xl sm:text-3xl font-bold text-white mb-1">1.84 GWp</div>
            <div className="text-[11px] text-slate-400 uppercase font-mono tracking-wider">Monitored Portfolio</div>
          </div>
          <div className="p-3 text-center border-r border-white/5 last:border-none">
            <div className="font-heading text-2xl sm:text-3xl font-bold text-[#4ADE80] mb-1">14,280+</div>
            <div className="text-[11px] text-slate-400 uppercase font-mono tracking-wider">IoT Inverter Nodes</div>
          </div>
          <div className="p-3 text-center border-r border-white/5 last:border-none">
            <div className="font-heading text-2xl sm:text-3xl font-bold text-white mb-1">2.1M t</div>
            <div className="text-[11px] text-slate-400 uppercase font-mono tracking-wider">CO₂ Audited Annual</div>
          </div>
          <div className="p-3 text-center">
            <div className="font-heading text-2xl sm:text-3xl font-bold text-[#4ADE80] mb-1">99.98%</div>
            <div className="text-[11px] text-slate-400 uppercase font-mono tracking-wider">Cloud SLA Uptime</div>
          </div>
        </div>

        {/* Security Compliance Strip */}
        <div className="mt-8 flex flex-wrap justify-center items-center gap-6 text-xs text-slate-400 font-mono">
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-[#4ADE80]" /> EU CSRD Directive Compliant</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-[#4ADE80]" /> Estonian Entity #17556598</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-[#4ADE80]" /> ISO 27001 / NIS2 Standard</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-[#4ADE80]" /> Zero-Trust Hardware Auth</span>
        </div>

      </div>
    </section>
  );
};

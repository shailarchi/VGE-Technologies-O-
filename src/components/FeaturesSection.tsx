import React, { useState } from 'react';
import { Cpu, FileSpreadsheet, TrendingUp, ShieldCheck, Zap, Layers, ArrowUpRight, CheckCircle, ChevronDown } from 'lucide-react';

interface FeaturesSectionProps {
  onNavigateSection: (sectionId: string) => void;
  onOpenDemo: () => void;
}

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({ onNavigateSection, onOpenDemo }) => {
  const [activeTab, setActiveTab] = useState<number>(0);

  const features = [
    {
      id: 'iot',
      icon: Cpu,
      title: 'Real-Time IoT Tracking',
      shortDesc: 'Connect your commercial solar inverters directly to our cloud infrastructure via secure API. Track yield generation and hardware health metrics with 99.9% uptime.',
      badge: 'MQTT & REST Ingress',
      details: [
        'Direct hardware telemetry integration with Huawei, SMA, Sungrow, Fronius & ABB inverters',
        'Sub-second string voltage & temperature anomaly detection',
        'Automated alarm routing to O&M field technician dispatch systems',
        'Edge-to-cloud encrypted telemetry buffering during grid offline events'
      ],
      kpi: 'Sub-second Data Ingestion'
    },
    {
      id: 'esg',
      icon: FileSpreadsheet,
      title: 'Automated ESG Reporting',
      shortDesc: 'Our software compiles your raw energy data into auditable, exportable sustainability reports, making carbon offset tracking seamless for your corporate clients.',
      badge: 'CSRD & GHG Compliant',
      details: [
        'EU Directive (CSRD) & GRI alignment for enterprise sustainability disclosures',
        'Scope 1, Scope 2, and Scope 3 carbon offset verification with cryptographic hashes',
        'Automated PDF, CSV, and XBRL report generation for corporate off-takers',
        'Real-time avoided CO₂ calculations based on localized regional grid emission factors'
      ],
      kpi: '100% Audit Readiness'
    },
    {
      id: 'ppa',
      icon: TrendingUp,
      title: 'B2B Yield Management',
      shortDesc: 'Monitor your entire Commercial & Industrial (C&I) solar portfolio across multiple regions. Generate automated invoicing and digital Power Purchase Agreements (PPAs).',
      badge: 'Digital PPA Contracts',
      details: [
        'Multi-currency PPA revenue reconciliation across Nord Pool, MIBEL, and EEX markets',
        'Automated monthly generation settlement invoicing for industrial off-takers',
        'BESS (Battery Energy Storage) arbitrage optimization & peak shaving controls',
        'Cross-border portfolio aggregation with multi-entity tax and regulatory compliance'
      ],
      kpi: 'Automated PPA Settlement'
    }
  ];

  return (
    <section id="solutions" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0F172A] border-t border-[#1E293B]">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-[#4ADE80] font-mono text-xs font-semibold uppercase tracking-wider mb-2">
            Enterprise SaaS Architecture
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
            Purpose-Built for Commercial & Industrial Solar Portfolios
          </h2>
          <p className="text-[#94A3B8] text-base sm:text-lg">
            VGE Technologies OÜ bridges physical clean energy assets with high-frequency cloud intelligence and European enterprise regulatory standards.
          </p>
        </div>

        {/* 3 Core Cards (Grid Matching Spec) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {features.map((item, idx) => {
            const Icon = item.icon;
            const isSelected = activeTab === idx;

            return (
              <div
                key={item.id}
                onClick={() => setActiveTab(idx)}
                className={`group bg-slate-900/40 p-8 rounded-2xl border transition-all duration-300 cursor-pointer relative overflow-hidden flex flex-col justify-between backdrop-blur-sm ${
                  isSelected 
                    ? 'border-[#4ADE80] shadow-xl shadow-[#16A34A]/10 bg-slate-800/80' 
                    : 'border-white/5 hover:border-[#4ADE80]/40 hover:-translate-y-1'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className={`p-3 rounded-xl ${isSelected ? 'bg-[#16A34A] text-white' : 'bg-slate-800 text-[#4ADE80]'}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-mono font-semibold px-3 py-1 rounded-full bg-[#16A34A]/10 text-[#4ADE80] border border-[#16A34A]/20">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="font-heading text-2xl font-bold text-white mb-3 group-hover:text-[#4ADE80] transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-slate-400 text-sm leading-relaxed mb-6">
                    {item.shortDesc}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-[#4ADE80]" />
                    {item.kpi}
                  </span>
                  <span className="text-xs font-semibold text-[#4ADE80] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    {isSelected ? 'Viewing Details' : 'Explore Feature'}
                    <ArrowUpRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Expandable Feature Detail Drawer */}
        <div className="bg-[#1E293B] border border-[#16A34A]/40 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-white/10">
            <div>
              <span className="text-xs font-mono text-[#4ADE80] uppercase tracking-wider">
                Feature Deep Dive • {features[activeTab].title}
              </span>
              <h3 className="font-heading text-2xl font-bold text-white mt-1">
                {features[activeTab].title} Modules & Capabilities
              </h3>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={onOpenDemo}
                className="bg-[#16A34A] hover:bg-[#4ADE80] text-white hover:text-[#0F172A] px-5 py-2.5 rounded-lg font-heading text-sm font-semibold transition-all shadow-md cursor-pointer"
              >
                Schedule Technical Demo
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
            {features[activeTab].details.map((detail, idx) => (
              <div key={idx} className="flex items-start gap-3 bg-[#0F172A]/60 p-4 rounded-xl border border-white/5">
                <CheckCircle className="w-5 h-5 text-[#4ADE80] shrink-0 mt-0.5" />
                <span className="text-sm text-[#94A3B8] leading-relaxed">
                  {detail}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

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
      id: 'underwriting',
      icon: ShieldCheck,
      moduleNumber: 'Module 1',
      title: 'Digital Underwriting',
      targetAudience: 'For raising capital for new projects',
      shortDesc: 'Automate risk modeling, cashflow verification, and debt origination for Asian C&I solar projects. Connect directly with global institutional capital pools to accelerate project financing.',
      badge: 'Capital Origination',
      details: [
        'Instant algorithmic risk scoring for C&I rooftop and ground-mounted Asian solar assets',
        'Direct automated onboarding for institutional infrastructure financiers',
        'Automated multi-currency PPA cashflow settlement with real-time on-chain auditing',
        'Cross-border SPV legal structure templates bridging Estonia (EU) with APAC jurisdictions'
      ],
      kpi: 'Accelerated Capital Raising'
    },
    {
      id: 'verification',
      icon: Cpu,
      moduleNumber: 'Module 2',
      title: 'Institutional-Grade Asset Verification',
      targetAudience: 'Using IoT/Oracles to track live energy data securely',
      shortDesc: 'Connect major inverters (Growatt, Huawei, Sungrow) via zero-hardware APIs. Cryptographic IoT data oracles give institutional investors real-time, tamper-proof energy telemetry.',
      badge: 'IoT & Cryptographic Oracles',
      details: [
        'Zero-hardware inverter telemetry integration with Growatt, Huawei, Sungrow, Solis & SMA',
        'Cryptographic data oracles feeding immutable generation logs to lenders & investors',
        'AI anomaly detection for string failure, thermal hotspots, and grid curtailment events',
        'Automated dispatch for regional Operations & Maintenance (O&M) field engineering teams'
      ],
      kpi: 'Tamper-Proof Data Oracles'
    },
    {
      id: 'carbon-yield',
      icon: TrendingUp,
      moduleNumber: 'Module 3',
      title: 'Carbon Yield Optimization',
      targetAudience: 'The automated minting and selling of I-RECs',
      shortDesc: 'Automatically convert verified kilowatt-hours into I-RECs and digitized carbon credit origination. Direct on-chain minting and secondary market settlement unlock recurring revenues.',
      badge: 'Automated I-REC Minting',
      details: [
        'Automated digital Monitoring, Reporting & Verification (dMRV) with zero manual paperwork',
        'Direct minting and automated sales of verified I-RECs and high-integrity carbon credits',
        'Instant secondary liquidity settlement connecting EPC assets with corporate ESG buyers',
        'Full alignment with EU CSRD, GHG Protocol & International REC Standard (I-REC)'
      ],
      kpi: 'Automated I-REC Monetization'
    }
  ];

  return (
    <section id="solutions" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0F172A] border-t border-[#1E293B]">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#16A34A]/15 border border-[#16A34A]/30 text-[#4ADE80] font-mono text-xs font-semibold uppercase tracking-wider mb-4">
            <Layers className="w-3.5 h-3.5" />
            Built for Solar EPCs & Developers
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
            3 Distinct Pillars for EPCs
          </h2>
          <p className="text-[#94A3B8] text-base sm:text-lg leading-relaxed">
            Verde Grid Energy empowers EPC contractors and solar developers with three integrated modules to accelerate project financing, ensure tamper-proof data telemetry, and maximize recurring carbon yield revenues.
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
                className={`group bg-slate-900/50 p-8 rounded-2xl border transition-all duration-300 cursor-pointer relative overflow-hidden flex flex-col justify-between backdrop-blur-sm ${
                  isSelected 
                    ? 'border-[#4ADE80] shadow-xl shadow-[#16A34A]/15 bg-slate-800/90' 
                    : 'border-white/10 hover:border-[#4ADE80]/50 hover:-translate-y-1'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold px-3 py-1 rounded-md bg-[#16A34A] text-white">
                      {item.moduleNumber}
                    </span>
                    <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full bg-[#16A34A]/10 text-[#4ADE80] border border-[#16A34A]/30">
                      {item.badge}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-800/80 text-[#4ADE80] inline-block mb-4 border border-white/5">
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="font-heading text-xl font-bold text-white mb-1 group-hover:text-[#4ADE80] transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-[#4ADE80] font-mono text-xs font-semibold mb-4 leading-normal bg-[#16A34A]/10 p-2 rounded-lg border border-[#16A34A]/20">
                    {item.targetAudience}
                  </p>

                  <p className="text-slate-300 text-sm leading-relaxed mb-6">
                    {item.shortDesc}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-[#4ADE80]" />
                    {item.kpi}
                  </span>
                  <span className="text-xs font-semibold text-[#4ADE80] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    {isSelected ? 'Viewing Details' : 'Explore Pillar'}
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

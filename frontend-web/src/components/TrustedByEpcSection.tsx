import React from 'react';
import { Building2, ShieldCheck, Zap, CheckCircle2, Globe, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface EpcCompany {
  id: string;
  name: string;
  tagline: string;
  mwCapacity: string;
  region: string;
  status: string;
  logoSvg: React.ReactNode;
}

export const TrustedByEpcSection: React.FC = () => {
  const { t } = useLanguage();

  const epcCompanies: EpcCompany[] = [
    {
      id: 'tata-power',
      name: 'TATA Power Solar',
      tagline: 'India’s Largest Integrated Solar EPC',
      mwCapacity: '1,250 MWp Integrated',
      region: 'Mumbai / Pan-India',
      status: 'Live API Sync & I-REC',
      logoSvg: (
        <svg className="h-8 w-auto" viewBox="0 0 240 50" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Tata Emblem Motif */}
          <path d="M12 10L28 10L20 38H12L12 10Z" fill="#3B82F6" />
          <path d="M28 10L36 10L28 38H20L28 10Z" fill="#60A5FA" />
          <path d="M4 10H38V16H4V10Z" fill="#2563EB" />
          {/* Typography */}
          <text x="46" y="26" fill="#FFFFFF" fontSize="18" fontWeight="800" fontFamily="sans-serif" letterSpacing="1">
            TATA POWER
          </text>
          <text x="46" y="40" fill="#4ADE80" fontSize="11" fontWeight="700" fontFamily="monospace" letterSpacing="2">
            SOLAR EPC
          </text>
        </svg>
      )
    },
    {
      id: 'adani-green',
      name: 'Adani Green Energy',
      tagline: 'Global Renewable Energy Developer',
      mwCapacity: '980 MWp Connected',
      region: 'Ahmedabad / Gujarat',
      status: 'Underwriting Active',
      logoSvg: (
        <svg className="h-8 w-auto" viewBox="0 0 240 50" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Adani Arc Emblem */}
          <circle cx="20" cy="25" r="16" stroke="#10B981" strokeWidth="4" strokeDasharray="70 30" />
          <circle cx="20" cy="25" r="9" fill="#059669" />
          {/* Typography */}
          <text x="46" y="26" fill="#FFFFFF" fontSize="18" fontWeight="800" fontFamily="sans-serif" letterSpacing="1">
            ADANI
          </text>
          <text x="46" y="40" fill="#10B981" fontSize="11" fontWeight="700" fontFamily="sans-serif" letterSpacing="2">
            GREEN ENERGY
          </text>
        </svg>
      )
    },
    {
      id: 'lt-construction',
      name: 'L&T Construction',
      tagline: 'Larsen & Toubro Solar & Water IC',
      mwCapacity: '850 MWp Verified',
      region: 'Chennai / Pan-India',
      status: 'Oracle Telemetry',
      logoSvg: (
        <svg className="h-8 w-auto" viewBox="0 0 240 50" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* L&T Bold Square Logo */}
          <rect x="4" y="8" width="34" height="34" rx="4" fill="#1E3A8A" stroke="#3B82F6" strokeWidth="2" />
          <text x="10" y="32" fill="#FFFFFF" fontSize="16" fontWeight="900" fontFamily="sans-serif">
            L&T
          </text>
          {/* Typography */}
          <text x="46" y="25" fill="#FFFFFF" fontSize="15" fontWeight="800" fontFamily="sans-serif" letterSpacing="0.5">
            L&T Construction
          </text>
          <text x="46" y="39" fill="#3B82F6" fontSize="10" fontWeight="700" fontFamily="monospace" letterSpacing="1.5">
            RENEWABLE EPC
          </text>
        </svg>
      )
    },
    {
      id: 'sterling-wilson',
      name: 'Sterling & Wilson',
      tagline: 'Leading Global Solar EPC Solutions',
      mwCapacity: '720 MWp Onboarded',
      region: 'Mumbai / Global',
      status: 'I-REC Minting',
      logoSvg: (
        <svg className="h-8 w-auto" viewBox="0 0 240 50" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Sunburst Geometric Icon */}
          <circle cx="20" cy="25" r="14" fill="#F59E0B" />
          <path d="M20 5L20 45M0 25L40 25M6 11L34 39M6 39L34 11" stroke="#FBBF24" strokeWidth="2" />
          {/* Typography */}
          <text x="46" y="25" fill="#FFFFFF" fontSize="15" fontWeight="800" fontFamily="sans-serif">
            STERLING & WILSON
          </text>
          <text x="46" y="39" fill="#F59E0B" fontSize="10" fontWeight="700" fontFamily="monospace" letterSpacing="1">
            RENEWABLE ENERGY
          </text>
        </svg>
      )
    },
    {
      id: 'waaree-energies',
      name: 'Waaree Energies',
      tagline: 'Premier Solar Module & EPC Leader',
      mwCapacity: '540 MWp Active',
      region: 'Mumbai / Gujarat',
      status: 'dMRV Verified',
      logoSvg: (
        <svg className="h-8 w-auto" viewBox="0 0 240 50" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Waaree W Sun Logo */}
          <path d="M6 12L14 38L20 22L26 38L34 12" stroke="#EAB308" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="20" cy="12" r="4" fill="#4ADE80" />
          {/* Typography */}
          <text x="44" y="26" fill="#FFFFFF" fontSize="17" fontWeight="800" fontFamily="sans-serif" letterSpacing="1">
            WAAREE
          </text>
          <text x="44" y="40" fill="#EAB308" fontSize="10" fontWeight="700" fontFamily="sans-serif" letterSpacing="2">
            ENERGIES EPC
          </text>
        </svg>
      )
    },
    {
      id: 'vikram-solar',
      name: 'Vikram Solar',
      tagline: 'High-Efficiency PV & Solar EPC',
      mwCapacity: '410 MWp Connected',
      region: 'Kolkata / West Bengal',
      status: 'Live Asset Pool',
      logoSvg: (
        <svg className="h-8 w-auto" viewBox="0 0 240 50" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* V rays logo */}
          <path d="M6 10L20 40L34 10" stroke="#EC4899" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 10L20 28L28 10" stroke="#F43F5E" strokeWidth="3" />
          {/* Typography */}
          <text x="44" y="26" fill="#FFFFFF" fontSize="17" fontWeight="800" fontFamily="sans-serif" letterSpacing="1">
            VIKRAM
          </text>
          <text x="44" y="40" fill="#EC4899" fontSize="10" fontWeight="700" fontFamily="sans-serif" letterSpacing="2">
            SOLAR EPC
          </text>
        </svg>
      )
    }
  ];

  return (
    <section className="py-16 bg-[#0B132B] border-y border-[#1E293B] relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-7xl h-64 bg-[#16A34A]/5 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Banner Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="flex flex-wrap items-center justify-center gap-2.5 mb-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#16A34A]/15 border border-[#16A34A]/40 text-[#4ADE80] font-mono text-xs font-bold uppercase tracking-wider shadow-sm">
              <Building2 className="w-3.5 h-3.5" />
              Infrastructure Partnerships
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-amber-400/90 font-mono text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              Demo Data / Representative Partners
            </div>
          </div>
          
          <h2 className="font-heading text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
            {t('trustedByEpc', 'Trusted by Leading Solar EPCs.')}
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-body">
            {t('epcTagline', 'Verde Grid Energy partners with India and Asia’s premier clean infrastructure developers to automate digital underwriting, zero-hardware inverter telemetry, and instant I-REC carbon credit minting across')} <span className="text-[#4ADE80] font-semibold font-mono">4,750+ MWp</span> of commercial solar assets.
          </p>
          <p className="mt-2 text-slate-400/80 text-xs font-mono">
            * Demo Data / Representative Partners
          </p>
        </div>

        {/* EPC Companies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {epcCompanies.map((comp) => (
            <div
              key={comp.id}
              className="bg-slate-900/80 border border-white/10 hover:border-[#4ADE80]/50 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#16A34A]/10 group flex flex-col justify-between"
            >
              <div>
                {/* Logo & Status Badge */}
                <div className="flex items-center justify-between gap-2 mb-4 pb-4 border-b border-white/5">
                  <div className="opacity-90 group-hover:opacity-100 transition-opacity">
                    {comp.logoSvg}
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold px-2.5 py-1 rounded-full bg-[#16A34A]/15 text-[#4ADE80] border border-[#16A34A]/30">
                    <CheckCircle2 className="w-3 h-3" />
                    {comp.status}
                  </span>
                </div>

                {/* Info details */}
                <h3 className="font-heading text-lg font-bold text-white group-hover:text-[#4ADE80] transition-colors mb-1">
                  {comp.name}
                </h3>
                <p className="text-slate-400 text-xs mb-4">
                  {comp.tagline}
                </p>
              </div>

              {/* Metrics footer */}
              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                <span className="text-[#4ADE80] font-bold flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5" />
                  {comp.mwCapacity}
                </span>
                <span className="text-slate-400 flex items-center gap-1">
                  <Globe className="w-3 h-3 text-slate-500" />
                  {comp.region}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Trust Stat Bar */}
        <div className="bg-slate-900/60 rounded-xl p-4 border border-white/5 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-slate-400 max-w-5xl mx-auto">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#4ADE80]" />
            <span>Multi-GW Direct Telemetry Oracles</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#4ADE80] animate-ping" />
            <span>Growatt, Huawei, Sungrow Native API Compatibility</span>
          </div>
          <div className="flex items-center gap-2 text-[#4ADE80] font-bold">
            <span>Automated I-REC & Carbon Offset Revenues</span>
          </div>
        </div>

      </div>
    </section>
  );
};

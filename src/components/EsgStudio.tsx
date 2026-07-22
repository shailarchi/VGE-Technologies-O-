import React, { useState } from 'react';
import { FileSpreadsheet, Download, CheckCircle, Shield, Award, Sparkles, FileText, Lock } from 'lucide-react';

export const EsgStudio: React.FC = () => {
  const [framework, setFramework] = useState<string>('CSRD (EU Directive)');
  const [period, setPeriod] = useState<string>('YTD 2026');
  const [isExporting, setIsExporting] = useState(false);
  const [exportedSuccess, setExportedSuccess] = useState(false);

  const handleExport = (format: string) => {
    setIsExporting(true);
    setExportedSuccess(false);

    setTimeout(() => {
      setIsExporting(false);
      setExportedSuccess(true);
      setTimeout(() => setExportedSuccess(false), 4000);
    }, 1200);
  };

  return (
    <section id="esg-studio" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0F172A] border-t border-[#1E293B]">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="text-[#4ADE80] font-mono text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4" />
              Auditable Compliance Studio
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Automated EU ESG & Carbon Audit Generator
            </h2>
          </div>
          <p className="text-[#94A3B8] text-sm max-w-md mt-4 md:mt-0">
            Convert raw solar IoT telemetry into verifiable disclosures aligned with European Corporate Sustainability Reporting Directive (CSRD) and GHG Protocol standards.
          </p>
        </div>

        {/* ESG Generator Card */}
        <div className="bg-[#1E293B] rounded-2xl border border-white/10 p-8 shadow-2xl">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Controls */}
            <div className="lg:col-span-5 space-y-6">
              <h3 className="font-heading text-xl font-bold text-white flex items-center gap-2 pb-3 border-b border-white/10">
                <Award className="w-5 h-5 text-[#4ADE80]" />
                Compliance Settings
              </h3>

              <div>
                <label className="block text-xs font-mono text-[#94A3B8] uppercase mb-2">
                  Reporting Framework Standard
                </label>
                <div className="space-y-2">
                  {[
                    'CSRD (EU Directive 2022/2464)',
                    'GHG Protocol Scope 1-3 Standards',
                    'GRI Sustainability Standards',
                    'EU Taxonomy Regulation'
                  ].map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setFramework(item)}
                      className={`w-full p-3 rounded-xl border text-left text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                        framework === item
                          ? 'bg-[#16A34A] text-white border-[#4ADE80]'
                          : 'bg-[#0F172A] text-[#94A3B8] border-white/5 hover:border-white/20'
                      }`}
                    >
                      <span>{item}</span>
                      {framework === item && <CheckCircle className="w-4 h-4 text-white" />}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-[#94A3B8] uppercase mb-2">
                  Audit Period
                </label>
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="w-full bg-[#0F172A] text-white border border-white/10 rounded-xl p-3 text-xs font-mono cursor-pointer"
                >
                  <option value="YTD 2026">YTD 2026 (Jan 1 - Present)</option>
                  <option value="Q1 2026">Q1 2026 Audit</option>
                  <option value="Full Year 2025">Full Year 2025 Historical</option>
                </select>
              </div>

              <div className="p-4 rounded-xl bg-[#0F172A] border border-white/5 text-xs text-[#94A3B8] font-mono leading-relaxed space-y-1">
                <div className="text-white font-bold flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#4ADE80]" />
                  Cryptographic Verification
                </div>
                <p>Every generated report includes a SHA-256 telemetry hash stored on EU sovereign cloud infrastructure for 3rd-party auditor validation.</p>
              </div>
            </div>

            {/* Right Preview Card */}
            <div className="lg:col-span-7 bg-[#0B1120] p-6 rounded-xl border border-[#16A34A]/40 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#4ADE80]" />
                    <span className="font-heading font-bold text-white text-base">
                      Auditable ESG Certificate Preview
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-[#16A34A]/20 text-[#4ADE80] border border-[#16A34A]/40">
                    STATUS: AUDIT-READY
                  </span>
                </div>

                {/* Simulated Certificate Body */}
                <div className="space-y-4 font-mono text-xs">
                  <div className="p-4 rounded-lg bg-[#1E293B]/60 border border-white/5 space-y-2">
                    <div className="flex justify-between text-[#94A3B8]">
                      <span>Issuer:</span>
                      <strong className="text-white">VGE Technologies OÜ (Estonia)</strong>
                    </div>
                    <div className="flex justify-between text-[#94A3B8]">
                      <span>Framework:</span>
                      <strong className="text-[#4ADE80]">{framework}</strong>
                    </div>
                    <div className="flex justify-between text-[#94A3B8]">
                      <span>Audit Window:</span>
                      <strong className="text-white">{period}</strong>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-[#1E293B]/40 border border-white/5">
                      <div className="text-[11px] text-[#94A3B8]">Clean Energy Generation</div>
                      <div className="text-lg font-bold text-white font-heading mt-0.5">
                        1,716.1 MWh
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-[#1E293B]/40 border border-white/5">
                      <div className="text-[11px] text-[#94A3B8]">Audited CO₂ Avoided</div>
                      <div className="text-lg font-bold text-[#4ADE80] font-heading mt-0.5">
                        1,201.1 t
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-[#1E293B]/40 border border-white/5 text-[10px] text-[#94A3B8] space-y-1">
                    <div>Verification Key: <span className="text-white">vge_audit_csrd_2026_ee_17556598_a91b</span></div>
                    <div>Digital Signature: <span className="text-[#4ADE80]">VALIDATED (RSA-4096)</span></div>
                  </div>
                </div>
              </div>

              {/* Download CTAs */}
              <div className="pt-6 mt-6 border-t border-white/10 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => handleExport('PDF')}
                  disabled={isExporting}
                  className="flex-1 bg-[#16A34A] hover:bg-[#4ADE80] text-white hover:text-[#0F172A] py-3 rounded-xl font-heading text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Download className="w-4 h-4" />
                  {isExporting ? 'Generating Report...' : 'Download Certified PDF Report'}
                </button>

                <button
                  onClick={() => handleExport('XBRL')}
                  disabled={isExporting}
                  className="bg-[#1E293B] hover:bg-[#334155] text-[#4ADE80] border border-[#16A34A] px-5 py-3 rounded-xl font-mono text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  Export XBRL / JSON
                </button>
              </div>

              {exportedSuccess && (
                <div className="mt-3 p-3 rounded-lg bg-[#16A34A]/20 border border-[#4ADE80] text-[#4ADE80] text-xs font-mono flex items-center justify-center gap-2 animate-fade-in">
                  <CheckCircle className="w-4 h-4" />
                  Audit Package generated! File ready for CSRD disclosure filing.
                </div>
              )}

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

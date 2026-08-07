import React from 'react';
import { ShieldCheck, MapPin, Mail, Globe, Building, Lock, Youtube, Instagram, Twitter, Linkedin, ChevronRight } from 'lucide-react';
import { VerdeGridLogo } from './VerdeGridLogo';

interface FooterProps {
  onNavigateSection: (sectionId: string) => void;
  onOpenDemo: () => void;
  onOpenLogin: () => void;
  onOpenPrivacyPolicy?: () => void;
  onOpenCookiePreferences?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigateSection,
  onOpenDemo,
  onOpenLogin,
  onOpenPrivacyPolicy,
  onOpenCookiePreferences,
}) => {
  return (
    <footer className="bg-[#0B1222] border-t border-slate-800/80 pt-16 pb-12 px-4 sm:px-6 lg:px-8 text-white relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#16A34A]/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#0B2265]/20 blur-[140px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Upper Footer Columns - Professional 4 Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 pb-14 border-b border-slate-800/80">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center group cursor-pointer" onClick={() => onNavigateSection('hero')}>
              <VerdeGridLogo size="md" align="left" showTagline={true} darkBg={true} />
            </div>

            <p className="text-slate-400 text-xs leading-relaxed font-body pt-1">
              Verde Grid Energy is the ESG Markets & IoT Operating System bridging Asian commercial solar assets with institutional liquidity, zero-hardware telemetry, and automated I-REC carbon yields.
            </p>

            {/* Certifications & Badges */}
            <div className="pt-2 space-y-2">
              <div className="inline-flex items-center gap-2 text-[11px] font-mono font-semibold text-[#4ADE80] bg-[#16A34A]/10 border border-[#16A34A]/30 px-3 py-1.5 rounded-xl">
                <ShieldCheck className="w-4 h-4 text-[#4ADE80]" /> 
                <span>EE Register Code: <strong className="font-bold text-white">17556598</strong></span>
              </div>

              {/* Verified Entity LEI Badge */}
              <div>
                <a 
                  href="https://search.gleif.org/#/search/fulltext/9845003828CB77B80280" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-3 py-2 rounded-xl bg-gradient-to-r from-[#16A34A]/20 to-slate-900 border border-[#16A34A]/40 text-[#4ADE80] hover:bg-[#16A34A]/30 hover:border-[#4ADE80]/70 transition-all text-xs font-mono font-bold shadow-sm group"
                  title="Verify LEI status on Official GLEIF Global Database"
                >
                  <ShieldCheck className="w-4 h-4 text-[#4ADE80] shrink-0 group-hover:scale-110 transition-transform" />
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 leading-none">
                      <span>Verified Entity LEI</span>
                      <span className="bg-[#4ADE80] text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">Active</span>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* SaaS Solutions */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-4 bg-[#4ADE80] rounded-full"></span>
              <h4 className="font-heading font-bold text-xs uppercase tracking-widest text-white">
                SaaS Platforms & Solutions
              </h4>
            </div>
            <ul className="space-y-3 text-xs text-slate-400 font-medium">
              <li>
                <button 
                  onClick={() => onNavigateSection('solutions')} 
                  className="hover:text-[#4ADE80] hover:translate-x-1.5 transition-all duration-200 cursor-pointer flex items-center gap-2 group text-left"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-[#16A34A] shrink-0 group-hover:translate-x-0.5 transition-transform" />
                  <span>Real-Time IoT Inverter Tracking</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateSection('market-data')} 
                  className="hover:text-[#4ADE80] hover:translate-x-1.5 transition-all duration-200 cursor-pointer flex items-center gap-2 group text-left"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-[#16A34A] shrink-0 group-hover:translate-x-0.5 transition-transform" />
                  <span>I-REC Market Data &amp; Spot Pricing</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateSection('esg-studio')} 
                  className="hover:text-[#4ADE80] hover:translate-x-1.5 transition-all duration-200 cursor-pointer flex items-center gap-2 group text-left"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-[#16A34A] shrink-0 group-hover:translate-x-0.5 transition-transform" />
                  <span>Automated CSRD / ESG Reporting</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateSection('calculator')} 
                  className="hover:text-[#4ADE80] hover:translate-x-1.5 transition-all duration-200 cursor-pointer flex items-center gap-2 group text-left"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-[#16A34A] shrink-0 group-hover:translate-x-0.5 transition-transform" />
                  <span>B2B PPA Yield Calculator</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateSection('solutions')} 
                  className="hover:text-[#4ADE80] hover:translate-x-1.5 transition-all duration-200 cursor-pointer flex items-center gap-2 group text-left"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-[#16A34A] shrink-0 group-hover:translate-x-0.5 transition-transform" />
                  <span>BESS Storage Arbitrage Engine</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Developer & Security */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-4 bg-[#4ADE80] rounded-full"></span>
              <h4 className="font-heading font-bold text-xs uppercase tracking-widest text-white">
                Developer & Security
              </h4>
            </div>
            <ul className="space-y-3 text-xs text-slate-400 font-medium">
              <li>
                <button 
                  onClick={() => onNavigateSection('api-integrations')} 
                  className="hover:text-[#4ADE80] hover:translate-x-1.5 transition-all duration-200 cursor-pointer flex items-center gap-2 group text-left"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-[#16A34A] shrink-0 group-hover:translate-x-0.5 transition-transform" />
                  <span>MQTT Telemetry Stream API</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateSection('security')} 
                  className="hover:text-[#4ADE80] hover:translate-x-1.5 transition-all duration-200 cursor-pointer flex items-center gap-2 group text-left"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-[#16A34A] shrink-0 group-hover:translate-x-0.5 transition-transform" />
                  <span>ISO 27001 & NIS2 Standard</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateSection('security')} 
                  className="hover:text-[#4ADE80] hover:translate-x-1.5 transition-all duration-200 cursor-pointer flex items-center gap-2 group text-left"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-[#16A34A] shrink-0 group-hover:translate-x-0.5 transition-transform" />
                  <span>mTLS 1.3 Hardware Encryption</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenPrivacyPolicy} 
                  className="hover:text-[#4ADE80] hover:translate-x-1.5 transition-all duration-200 cursor-pointer flex items-center gap-2 group text-left"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-[#16A34A] shrink-0 group-hover:translate-x-0.5 transition-transform" />
                  <span className="text-[#4ADE80] font-semibold">GDPR Privacy Policy</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenCookiePreferences} 
                  className="hover:text-[#4ADE80] hover:translate-x-1.5 transition-all duration-200 cursor-pointer flex items-center gap-2 group text-left"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-[#16A34A] shrink-0 group-hover:translate-x-0.5 transition-transform" />
                  <span>Cookie Preferences</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenLogin} 
                  className="hover:text-[#4ADE80] hover:translate-x-1.5 transition-all duration-200 cursor-pointer flex items-center gap-2 group text-left"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-[#16A34A] shrink-0 group-hover:translate-x-0.5 transition-transform" />
                  <span>Client Portal SSO</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Corporate Legal Entity & Contact */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-4 bg-[#4ADE80] rounded-full"></span>
              <h4 className="font-heading font-bold text-xs uppercase tracking-widest text-white">
                Corporate Headquarters
              </h4>
            </div>
            <div className="text-xs text-slate-400 leading-relaxed space-y-2.5 font-mono bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
              <div>
                <p className="text-white font-bold text-sm hover:text-[#4ADE80] transition-colors">VGE Technologies OÜ</p>
                <p className="text-slate-400 text-[11px]">Trading as Verde Grid Energy</p>
              </div>
              <div className="pt-1 border-t border-slate-800/80 space-y-1">
                <p className="flex justify-between"><span>Commercial Register (EE):</span> <strong className="text-[#4ADE80]">17556598</strong></p>
                <p className="flex justify-between"><span>LEI Code:</span> <strong className="text-[#4ADE80]">9845003828CB77B80280</strong></p>
              </div>
              
              <div className="pt-2 border-t border-slate-800/80 space-y-2">
                <div className="flex items-start gap-2 text-slate-300">
                  <MapPin className="w-4 h-4 text-[#4ADE80] shrink-0 mt-0.5" />
                  <span className="text-[11px] leading-snug">Vesivärava tn 50-301, 10152 Tallinn, Harju maakond, Estonia 🇪🇪</span>
                </div>

                <div className="flex items-center gap-2 text-slate-300 pt-0.5">
                  <Mail className="w-4 h-4 text-[#4ADE80] shrink-0" />
                  <a href="mailto:hello@verdegridenergy.com" className="text-[#4ADE80] hover:text-emerald-300 font-semibold transition-colors text-[11px]">
                    hello@verdegridenergy.com
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Legal Footer Section & Social Media */}
        <div className="pt-10 text-center space-y-6">
          {/* Social Media Row in Glassmorphic Container */}
          <div className="inline-flex items-center justify-center gap-3 bg-slate-900/80 border border-slate-800 px-6 py-2.5 rounded-full shadow-lg">
            <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400 mr-2 font-bold hidden sm:inline">Follow VGE Global</span>
            <a 
              href="https://www.youtube.com/@verdegridenergy" 
              target="_blank" 
              rel="noreferrer"
              className="p-2 rounded-full bg-slate-800/80 text-slate-300 hover:text-white hover:bg-red-600 border border-slate-700 hover:border-red-500/50 hover:scale-110 hover:shadow-lg hover:shadow-red-600/30 transition-all duration-200"
              title="YouTube Channel"
            >
              <Youtube className="w-4 h-4" />
            </a>
            <a 
              href="https://www.instagram.com/verdegridenergy" 
              target="_blank" 
              rel="noreferrer"
              className="p-2 rounded-full bg-slate-800/80 text-slate-300 hover:text-white hover:bg-gradient-to-tr hover:from-amber-500 hover:via-pink-500 hover:to-purple-600 border border-slate-700 hover:border-pink-500/50 hover:scale-110 hover:shadow-lg hover:shadow-pink-500/30 transition-all duration-200"
              title="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a 
              href="https://x.com/verdegridenergy" 
              target="_blank" 
              rel="noreferrer"
              className="p-2 rounded-full bg-slate-800/80 text-slate-300 hover:text-white hover:bg-sky-500 border border-slate-700 hover:border-sky-400/50 hover:scale-110 hover:shadow-lg hover:shadow-sky-500/30 transition-all duration-200"
              title="Twitter (X)"
            >
              <Twitter className="w-4 h-4" />
            </a>
            <a 
              href="https://www.linkedin.com/company/verdegridenergy" 
              target="_blank" 
              rel="noreferrer"
              className="p-2 rounded-full bg-slate-800/80 text-slate-300 hover:text-white hover:bg-blue-600 border border-slate-700 hover:border-blue-500/50 hover:scale-110 hover:shadow-lg hover:shadow-blue-600/30 transition-all duration-200"
              title="LinkedIn Enterprise"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          </div>

          <div className="text-slate-400 text-xs max-w-4xl mx-auto leading-relaxed space-y-2 font-body">
            <p className="text-slate-400">
              VGE Technologies OÜ (Trading as Verde Grid Energy) operates in strict accordance with the laws of the Republic of Estonia and European Union directives as a B2B Information Technology and Software Provider.
            </p>
            <p className="text-slate-400 font-mono text-[11px] pt-1">
              Commercial Register of Estonia: <strong className="text-white font-bold">17556598</strong> | LEI: <strong className="text-white font-bold">9845003828CB77B80280</strong> | Contact: <a href="mailto:hello@verdegridenergy.com" className="text-[#4ADE80] hover:text-emerald-300 font-mono transition-colors">hello@verdegridenergy.com</a>
            </p>
          </div>

          {/* Thin, small copyright notice & legal links at the very bottom */}
          <div className="pt-4 border-t border-slate-800/60 mt-4 flex flex-wrap items-center justify-between gap-3 text-slate-400 font-mono text-[11px]">
            <p className="font-light tracking-wide hover:text-slate-200 transition-colors">
              © 2026 VGE Technologies OÜ · All rights reserved · EU Data Residency Guaranteed (Tallinn 🇪🇪)
            </p>

            <div className="flex items-center gap-4">
              <button
                onClick={onOpenPrivacyPolicy}
                className="text-slate-400 hover:text-[#4ADE80] underline transition-colors cursor-pointer"
              >
                GDPR Privacy Policy
              </button>
              <span>·</span>
              <button
                onClick={onOpenCookiePreferences}
                className="text-slate-400 hover:text-[#4ADE80] underline transition-colors cursor-pointer"
              >
                Cookie Settings
              </button>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};



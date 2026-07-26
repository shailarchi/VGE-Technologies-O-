import React from 'react';
import { ShieldCheck, MapPin, Mail, Globe, Building, Lock, Youtube, Instagram, Twitter, Linkedin, ChevronRight } from 'lucide-react';
import { VerdeGridLogo } from './VerdeGridLogo';

interface FooterProps {
  onNavigateSection: (sectionId: string) => void;
  onOpenDemo: () => void;
  onOpenLogin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateSection, onOpenDemo, onOpenLogin }) => {
  return (
    <footer className="bg-[#0F172A] border-t border-[#1E293B] pt-16 pb-12 px-4 sm:px-6 lg:px-8 text-white">
      <div className="max-w-7xl mx-auto">
        
        {/* Upper Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center group cursor-pointer" onClick={() => onNavigateSection('hero')}>
              <VerdeGridLogo size="md" showTagline={true} darkBg={true} />
            </div>

            <p className="text-[#94A3B8] text-xs leading-relaxed font-body pt-1">
              Verde Grid Energy is the Web3 Capital & IoT Operating System bridging Asian commercial solar assets with institutional liquidity, zero-hardware telemetry, and automated I-REC carbon yields.
            </p>

            <div className="flex items-center gap-2 text-[11px] font-mono text-[#4ADE80] bg-[#16A34A]/10 border border-[#16A34A]/20 px-3 py-1.5 rounded-lg w-fit hover:border-[#16A34A]/50 transition-all">
              <ShieldCheck className="w-4 h-4" /> EE Registry Code: 17556598
            </div>
          </div>

          {/* SaaS Solutions */}
          <div>
            <h4 className="font-heading font-bold text-sm text-white uppercase tracking-wider mb-4">
              SaaS Solutions
            </h4>
            <ul className="space-y-3 text-xs text-[#94A3B8] font-medium">
              <li>
                <button 
                  onClick={() => onNavigateSection('solutions')} 
                  className="hover:text-[#4ADE80] hover:translate-x-1.5 transition-all duration-200 cursor-pointer flex items-center gap-1.5 group"
                >
                  <ChevronRight className="w-3 h-3 text-[#16A34A] opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>Real-Time IoT Inverter Tracking</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateSection('esg-studio')} 
                  className="hover:text-[#4ADE80] hover:translate-x-1.5 transition-all duration-200 cursor-pointer flex items-center gap-1.5 group"
                >
                  <ChevronRight className="w-3 h-3 text-[#16A34A] opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>Automated CSRD / ESG Reporting</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateSection('calculator')} 
                  className="hover:text-[#4ADE80] hover:translate-x-1.5 transition-all duration-200 cursor-pointer flex items-center gap-1.5 group"
                >
                  <ChevronRight className="w-3 h-3 text-[#16A34A] opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>B2B PPA Yield Calculator</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateSection('solutions')} 
                  className="hover:text-[#4ADE80] hover:translate-x-1.5 transition-all duration-200 cursor-pointer flex items-center gap-1.5 group"
                >
                  <ChevronRight className="w-3 h-3 text-[#16A34A] opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>BESS Storage Arbitrage Engine</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Developer & APIs */}
          <div>
            <h4 className="font-heading font-bold text-sm text-white uppercase tracking-wider mb-4">
              Developer & Security
            </h4>
            <ul className="space-y-3 text-xs text-[#94A3B8] font-medium">
              <li>
                <button 
                  onClick={() => onNavigateSection('api-integrations')} 
                  className="hover:text-[#4ADE80] hover:translate-x-1.5 transition-all duration-200 cursor-pointer flex items-center gap-1.5 group"
                >
                  <ChevronRight className="w-3 h-3 text-[#16A34A] opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>MQTT Telemetry Stream API</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateSection('security')} 
                  className="hover:text-[#4ADE80] hover:translate-x-1.5 transition-all duration-200 cursor-pointer flex items-center gap-1.5 group"
                >
                  <ChevronRight className="w-3 h-3 text-[#16A34A] opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>ISO 27001 & NIS2 Standard</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateSection('security')} 
                  className="hover:text-[#4ADE80] hover:translate-x-1.5 transition-all duration-200 cursor-pointer flex items-center gap-1.5 group"
                >
                  <ChevronRight className="w-3 h-3 text-[#16A34A] opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>mTLS 1.3 Hardware Encryption</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenLogin} 
                  className="hover:text-[#4ADE80] hover:translate-x-1.5 transition-all duration-200 cursor-pointer flex items-center gap-1.5 group"
                >
                  <ChevronRight className="w-3 h-3 text-[#16A34A] opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>Client Portal SSO</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Corporate Legal Entity & Contact */}
          <div>
            <h4 className="font-heading font-bold text-sm text-white uppercase tracking-wider mb-4">
              Corporate & Contact
            </h4>
            <div className="text-xs text-[#94A3B8] leading-relaxed space-y-2.5 font-mono">
              <p className="text-white font-bold hover:text-[#4ADE80] transition-colors">VGE Technologies OÜ</p>
              <p>Trading as Verde Grid Energy</p>
              <p>Commercial Register (EE): <strong className="text-[#4ADE80]">17556598</strong></p>
              <p>LEI Code: <strong className="text-[#4ADE80]">9845003828CB77B80280</strong></p>
              
              {/* Verified Entity LEI Badge */}
              <div className="pt-0.5 pb-1">
                <a 
                  href="https://search.gleif.org/#/search/fulltext/9845003828CB77B80280" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#16A34A]/15 border border-[#16A34A]/40 text-[#4ADE80] hover:bg-[#16A34A]/25 hover:border-[#4ADE80]/60 transition-all text-[11px] font-mono font-bold shadow-sm group"
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
              
              <div className="pt-1 flex items-start gap-2 text-slate-300 hover:text-white transition-colors">
                <MapPin className="w-4 h-4 text-[#4ADE80] shrink-0 mt-0.5" />
                <span>Harju maakond, Tallinn, Kesklinna linnaosa, Vesivärava tn 50-301, 10152, Estonia 🇪🇪</span>
              </div>

              <div className="flex items-center gap-2 text-slate-300 pt-1">
                <Mail className="w-4 h-4 text-[#4ADE80] shrink-0" />
                <a href="mailto:hello@verdegridenergy.com" className="text-[#4ADE80] hover:text-emerald-300 hover:underline font-semibold transition-colors">
                  hello@verdegridenergy.com
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Legal Footer Section */}
        <div className="pt-8 text-center space-y-4">
          {/* Social Media Row in Bottom Bar */}
          <div className="flex items-center justify-center gap-3">
            <a 
              href="https://www.youtube.com/@verdegridenergy" 
              target="_blank" 
              rel="noreferrer"
              className="p-2.5 rounded-full bg-slate-900 text-slate-300 hover:text-white hover:bg-red-600 border border-white/10 hover:border-red-500/50 hover:scale-110 hover:shadow-lg hover:shadow-red-600/30 transition-all duration-200"
              title="YouTube"
            >
              <Youtube className="w-4 h-4" />
            </a>
            <a 
              href="https://www.instagram.com/verdegridenergy" 
              target="_blank" 
              rel="noreferrer"
              className="p-2.5 rounded-full bg-slate-900 text-slate-300 hover:text-white hover:bg-gradient-to-tr hover:from-amber-500 hover:via-pink-500 hover:to-purple-600 border border-white/10 hover:border-pink-500/50 hover:scale-110 hover:shadow-lg hover:shadow-pink-500/30 transition-all duration-200"
              title="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a 
              href="https://x.com/verdegridenergy" 
              target="_blank" 
              rel="noreferrer"
              className="p-2.5 rounded-full bg-slate-900 text-slate-300 hover:text-white hover:bg-sky-500 border border-white/10 hover:border-sky-400/50 hover:scale-110 hover:shadow-lg hover:shadow-sky-500/30 transition-all duration-200"
              title="Twitter (X)"
            >
              <Twitter className="w-4 h-4" />
            </a>
            <a 
              href="https://www.linkedin.com/company/verdegridenergy" 
              target="_blank" 
              rel="noreferrer"
              className="p-2.5 rounded-full bg-slate-900 text-slate-300 hover:text-white hover:bg-blue-600 border border-white/10 hover:border-blue-500/50 hover:scale-110 hover:shadow-lg hover:shadow-blue-600/30 transition-all duration-200"
              title="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          </div>

          <div className="text-[#94A3B8] text-xs max-w-4xl mx-auto leading-relaxed space-y-2 font-body">
            <p className="text-[#94A3B8]">
              VGE Technologies OÜ (Trading as Verde Grid Energy) operates in strict accordance with the laws of the Republic of Estonia and European Union directives as a B2B Information Technology and Software Provider.
            </p>
            <p className="text-slate-400 font-mono text-[11px] pt-1">
              Address: Harju maakond, Tallinn, Kesklinna linnaosa, Vesivärava tn 50-301, 10152, Estonia.
            </p>
            <p>
              Commercial Register of Estonia: <strong className="text-white font-bold">17556598</strong> | Contact: <a href="mailto:hello@verdegridenergy.com" className="text-[#4ADE80] hover:text-emerald-300 hover:underline font-mono transition-colors">hello@verdegridenergy.com</a>
            </p>
          </div>

          {/* Thin, small copyright notice at the very bottom */}
          <div className="pt-4 border-t border-white/5 mt-4 text-center">
            <p className="text-slate-400 font-light text-[11px] tracking-wide hover:text-slate-200 transition-colors">
              © 2026 VGE Technologies OÜ or Its affiliates | All rights reserved
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
};



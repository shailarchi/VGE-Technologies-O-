import React from 'react';
import { ShieldCheck, MapPin, Mail, Globe, Building, Lock } from 'lucide-react';

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
            <div className="flex items-center gap-3">
              <img 
                src="https://verdegridenergy.com/wp-content/uploads/2024/02/Verde-Grid-Logo-Light.png" 
                alt="Verde Grid Energy Logo" 
                className="h-8 w-auto object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <span className="font-heading font-bold text-lg text-white">
                Verde Grid Energy
              </span>
            </div>

            <p className="text-[#94A3B8] text-xs leading-relaxed">
              VGE Technologies OÜ provides enterprise-grade IoT analytics and automated ESG compliance for commercial solar developers globally.
            </p>

            <div className="flex items-center gap-2 text-[11px] font-mono text-[#4ADE80]">
              <ShieldCheck className="w-4 h-4" /> EE Registry Code: 17556598
            </div>
          </div>

          {/* SaaS Solutions */}
          <div>
            <h4 className="font-heading font-bold text-sm text-white uppercase tracking-wider mb-4">
              SaaS Solutions
            </h4>
            <ul className="space-y-2.5 text-xs text-[#94A3B8] font-medium">
              <li>
                <button onClick={() => onNavigateSection('solutions')} className="hover:text-[#4ADE80] transition-colors cursor-pointer">
                  Real-Time IoT Inverter Tracking
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('esg-studio')} className="hover:text-[#4ADE80] transition-colors cursor-pointer">
                  Automated CSRD / ESG Reporting
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('calculator')} className="hover:text-[#4ADE80] transition-colors cursor-pointer">
                  B2B PPA Yield Calculator
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('solutions')} className="hover:text-[#4ADE80] transition-colors cursor-pointer">
                  BESS Storage Arbitrage Engine
                </button>
              </li>
            </ul>
          </div>

          {/* Developer & APIs */}
          <div>
            <h4 className="font-heading font-bold text-sm text-white uppercase tracking-wider mb-4">
              Developer & Security
            </h4>
            <ul className="space-y-2.5 text-xs text-[#94A3B8] font-medium">
              <li>
                <button onClick={() => onNavigateSection('api-integrations')} className="hover:text-[#4ADE80] transition-colors cursor-pointer">
                  MQTT Telemetry Stream API
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('security')} className="hover:text-[#4ADE80] transition-colors cursor-pointer">
                  ISO 27001 & NIS2 Standard
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('security')} className="hover:text-[#4ADE80] transition-colors cursor-pointer">
                  mTLS 1.3 Hardware Encryption
                </button>
              </li>
              <li>
                <button onClick={onOpenLogin} className="hover:text-[#4ADE80] transition-colors cursor-pointer">
                  Client Portal SSO
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
              <p className="text-white font-bold">VGE Technologies OÜ</p>
              <p>Trading as Verde Grid Energy</p>
              <p>Commercial Register: <strong className="text-[#4ADE80]">17556598</strong></p>
              
              <div className="pt-1 flex items-start gap-2 text-slate-300">
                <MapPin className="w-4 h-4 text-[#4ADE80] shrink-0 mt-0.5" />
                <span>Harju maakond, Tallinn, Kesklinna linnaosa, Vesivärava tn 50-301, 10152, Estonia 🇪🇪</span>
              </div>

              <div className="flex items-center gap-2 text-slate-300 pt-1">
                <Mail className="w-4 h-4 text-[#4ADE80] shrink-0" />
                <a href="mailto:hello@verdegridenergy.com" className="text-[#4ADE80] hover:underline font-semibold">
                  hello@verdegridenergy.com
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Legal Footer Section */}
        <div className="pt-8 text-center">
          <div className="text-[#94A3B8] text-xs max-w-4xl mx-auto leading-relaxed space-y-2 font-body">
            <p>
              <strong className="text-white font-bold">© 2026 VGE Technologies OÜ. All rights reserved.</strong>
            </p>
            <p>
              Commercial Register of Estonia: <strong className="text-white font-bold">17556598</strong> | Contact: <a href="mailto:hello@verdegridenergy.com" className="text-[#4ADE80] hover:underline font-mono">hello@verdegridenergy.com</a>
            </p>
            <p className="text-[#94A3B8]">
              VGE Technologies OÜ (Trading as Verde Grid Energy) operates in strict accordance with the laws of the Republic of Estonia and European Union directives as a B2B Information Technology and Software Provider.
            </p>
            <p className="text-slate-400 font-mono text-[11px] pt-1">
              Address: Harju maakond, Tallinn, Kesklinna linnaosa, Vesivärava tn 50-301, 10152, Estonia.
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
};

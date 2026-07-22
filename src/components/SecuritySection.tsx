import React from 'react';
import { ShieldCheck, Lock, Globe, Server, CheckCircle2, Award, Cpu } from 'lucide-react';

export const SecuritySection: React.FC = () => {
  return (
    <section id="security" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0F172A] border-t border-[#1E293B]">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-[#4ADE80] font-mono text-xs font-semibold uppercase tracking-wider mb-2 flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            European Enterprise Compliance
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
            Built Under Estonian IT & EU NIS2 Frameworks
          </h2>
          <p className="text-[#94A3B8] text-base">
            VGE Technologies OÜ operates in strict compliance with European Union cybersecurity, data residency, and critical infrastructure laws.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="bg-[#1E293B] p-8 rounded-2xl border border-white/5 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#0F172A] text-[#4ADE80] border border-[#16A34A]/30 flex items-center justify-center">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="font-heading text-xl font-bold text-white">Estonian Sovereign Entity</h3>
            <p className="text-[#94A3B8] text-sm leading-relaxed">
              Registered with the Commercial Register of Estonia under Registry Code <strong className="text-white">17556598</strong>. Governed under Estonian corporate law with registered office at <span className="text-slate-300">Harju maakond, Tallinn, Kesklinna linnaosa, Vesivärava tn 50-301, 10152</span>.
            </p>
            <ul className="space-y-2 text-xs text-[#94A3B8] font-mono pt-2">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#4ADE80]" /> 100% EU Data Sovereignty</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#4ADE80]" /> Contact: <a href="mailto:hello@verdegridenergy.com" className="text-[#4ADE80] hover:underline">hello@verdegridenergy.com</a></li>
            </ul>
          </div>

          <div className="bg-[#1E293B] p-8 rounded-2xl border border-white/5 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#0F172A] text-[#4ADE80] border border-[#16A34A]/30 flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="font-heading text-xl font-bold text-white">Zero-Trust Hardware Auth</h3>
            <p className="text-[#94A3B8] text-sm leading-relaxed">
              Every IoT inverter, sensor, and SCADA gateway authenticates via mTLS 1.3 with hardware-bound TPM 2.0 cryptographic certificates, preventing grid spoofing.
            </p>
            <ul className="space-y-2 text-xs text-[#94A3B8] font-mono pt-2">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#4ADE80]" /> Mutual TLS (mTLS 1.3)</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#4ADE80]" /> AES-256 Telemetry Encryption</li>
            </ul>
          </div>

          <div className="bg-[#1E293B] p-8 rounded-2xl border border-white/5 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#0F172A] text-[#4ADE80] border border-[#16A34A]/30 flex items-center justify-center">
              <Server className="w-6 h-6" />
            </div>
            <h3 className="font-heading text-xl font-bold text-white">99.98% High Availability</h3>
            <p className="text-[#94A3B8] text-sm leading-relaxed">
              Multi-region cloud failover across EU-North (Estonia) and EU-Central (Germany) guarantees continuous yield calculation, automated settlement, and O&M dispatches.
            </p>
            <ul className="space-y-2 text-xs text-[#94A3B8] font-mono pt-2">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#4ADE80]" /> 99.98% SLA Guarantee</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#4ADE80]" /> 24/7 Enterprise Support</li>
            </ul>
          </div>

        </div>

      </div>
    </section>
  );
};

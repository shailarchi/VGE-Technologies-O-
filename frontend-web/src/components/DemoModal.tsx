import React, { useState } from 'react';
import { X, CheckCircle2, ArrowRight, ShieldCheck, Building, Mail, User, Globe } from 'lucide-react';
import { VerdeGridLogo } from './VerdeGridLogo';

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DemoModal: React.FC<DemoModalProps> = ({ isOpen, onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    company: '',
    portfolioMWp: '10-50 MWp',
    region: 'Europe / Nordics',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#1E293B] border border-[#16A34A]/50 rounded-2xl max-w-lg w-full p-8 relative shadow-2xl">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#94A3B8] hover:text-white p-2 rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <div>
            <div className="mb-4">
              <VerdeGridLogo size="md" showTagline={true} darkBg={true} />
            </div>

            <h3 className="font-heading text-xl sm:text-2xl font-bold text-white mb-2">
              Schedule Enterprise Demo
            </h3>
            <p className="text-[#94A3B8] text-xs font-mono mb-6">
              Connect with Verde Grid Energy engineers for a custom solar asset SCADA integration review.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-[#94A3B8] mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#94A3B8] absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Erik Tamm"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-[#0F172A] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-[#16A34A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#94A3B8] mb-1">Corporate Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#94A3B8] absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="erik@solardeveloper.eu"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#0F172A] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-[#16A34A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#94A3B8] mb-1">Company / Organization</label>
                <div className="relative">
                  <Building className="w-4 h-4 text-[#94A3B8] absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Baltic Renewable Infrastructure AS"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full bg-[#0F172A] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-[#16A34A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#94A3B8] mb-1">Portfolio Size</label>
                  <select
                    value={formData.portfolioMWp}
                    onChange={(e) => setFormData({ ...formData, portfolioMWp: e.target.value })}
                    className="w-full bg-[#0F172A] border border-white/10 rounded-xl py-2.5 px-3 text-white focus:outline-none focus:border-[#16A34A]"
                  >
                    <option value="<10 MWp">&lt; 10 MWp</option>
                    <option value="10-50 MWp">10 - 50 MWp</option>
                    <option value="50-200 MWp">50 - 200 MWp</option>
                    <option value="200+ MWp">200+ MWp Utility</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#94A3B8] mb-1">Asset Region</label>
                  <select
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    className="w-full bg-[#0F172A] border border-white/10 rounded-xl py-2.5 px-3 text-white focus:outline-none focus:border-[#16A34A]"
                  >
                    <option value="Europe / Nordics">Europe / Nordics</option>
                    <option value="Central Europe">Central Europe</option>
                    <option value="Southern Europe">Southern Europe</option>
                    <option value="Global C&I">Global C&I</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#16A34A] hover:bg-[#4ADE80] text-white hover:text-[#0F172A] py-3.5 rounded-xl font-heading text-sm font-semibold transition-all mt-4 cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-[#16A34A]/25"
              >
                Submit Demo Request
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        ) : (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#16A34A]/20 text-[#4ADE80] flex items-center justify-center mx-auto border border-[#4ADE80]">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="font-heading text-2xl font-bold text-white">
              Demo Request Confirmed!
            </h3>
            <p className="text-[#94A3B8] text-xs font-mono leading-relaxed max-w-sm mx-auto">
              Thank you <strong className="text-white">{formData.fullName}</strong>. A VGE SCADA solutions architect from our Tallinn office has been notified and will email <strong className="text-[#4ADE80]">{formData.email}</strong> within 2 business hours.
            </p>
            <button
              onClick={() => { setSubmitted(false); onClose(); }}
              className="bg-[#0F172A] hover:bg-[#334155] text-white px-6 py-2.5 rounded-xl font-mono text-xs border border-white/10 transition-colors cursor-pointer mt-4"
            >
              Close Window
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

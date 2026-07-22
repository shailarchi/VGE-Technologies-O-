import React, { useState } from 'react';
import { X, Lock, Key, ArrowRight, ShieldCheck, UserCheck, Sparkles } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState('demo.assetmanager@vge-technologies.ee');
  const [password, setPassword] = useState('••••••••••••');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess();
    onClose();
  };

  const handleQuickPreset = (roleEmail: string) => {
    setEmail(roleEmail);
    onLoginSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#1E293B] border border-[#16A34A]/50 rounded-2xl max-w-md w-full p-8 relative shadow-2xl">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#94A3B8] hover:text-white p-2 rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded bg-[#16A34A] text-white font-bold flex items-center justify-center text-xs">
            V
          </div>
          <span className="font-heading font-bold text-white text-lg">
            Client Portal Login
          </span>
        </div>

        <p className="text-[#94A3B8] text-xs font-mono mb-6">
          VGE Technologies OÜ Secure B2B SSO Portal (Estonia EE-17556598)
        </p>

        {/* Quick Demo Login Presets */}
        <div className="mb-6 p-4 rounded-xl bg-[#0F172A] border border-white/10 space-y-2">
          <div className="text-[11px] font-mono text-[#4ADE80] flex items-center gap-1.5 font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Quick Demo Role Logins (1-Click)
          </div>

          <button
            type="button"
            onClick={() => handleQuickPreset('asset.manager@vge.ee')}
            className="w-full text-left p-2.5 rounded-lg bg-[#1E293B] hover:bg-[#16A34A] hover:text-white text-[#94A3B8] text-xs font-mono transition-all flex items-center justify-between cursor-pointer border border-white/5"
          >
            <span>👨‍💼 Solar Asset Operations Manager</span>
            <span className="text-[10px] opacity-75">Demo</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickPreset('esg.auditor@kpmg-audit.eu')}
            className="w-full text-left p-2.5 rounded-lg bg-[#1E293B] hover:bg-[#16A34A] hover:text-white text-[#94A3B8] text-xs font-mono transition-all flex items-center justify-between cursor-pointer border border-white/5"
          >
            <span>🌿 EU CSRD / ESG Auditor</span>
            <span className="text-[10px] opacity-75">Demo</span>
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 text-xs font-mono">
          <div>
            <label className="block text-[#94A3B8] mb-1">Corporate SSO Email</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0F172A] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-[#16A34A]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#94A3B8] mb-1">Password</label>
            <div className="relative">
              <Key className="w-4 h-4 text-[#94A3B8] absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0F172A] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-[#16A34A]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#16A34A] hover:bg-[#4ADE80] text-white hover:text-[#0F172A] py-3 rounded-xl font-heading text-sm font-semibold transition-all mt-2 cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-[#16A34A]/20"
          >
            Authenticate & Open Dashboard
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};

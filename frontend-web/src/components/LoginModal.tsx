import React, { useState, useEffect } from 'react';
import { X, Lock, Key, ArrowRight, ShieldCheck, UserCheck, Sparkles, Smartphone, ShieldAlert, CheckCircle2, RefreshCw, KeyRound, Fingerprint } from 'lucide-react';
import { VerdeGridLogo } from './VerdeGridLogo';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState('demo.assetmanager@vge-technologies.ee');
  const [password, setPassword] = useState('••••••••••••');
  const [step, setStep] = useState<'credentials' | 'mfa'>('credentials');
  const [mfaCode, setMfaCode] = useState<string>('849201');
  const [mfaMethod, setMfaMethod] = useState<'totp' | 'yubikey' | 'backup'>('totp');
  const [timer, setTimer] = useState<number>(30);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'mfa' && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => (prev > 1 ? prev - 1 : 30));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  if (!isOpen) return null;

  const handleProceedToMfa = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setStep('mfa');
  };

  const handleQuickPreset = (roleEmail: string) => {
    setEmail(roleEmail);
    // Auto populate realistic MFA code for 1-click convenience while showing full MFA interface
    setMfaCode('849201');
    setStep('mfa');
  };

  const handleVerifyMfa = (e: React.FormEvent) => {
    e.preventDefault();
    if (mfaCode.length < 6) {
      setErrorMsg('Please enter a valid 6-digit MFA verification code.');
      return;
    }
    setIsVerifying(true);
    setErrorMsg('');
    setTimeout(() => {
      setIsVerifying(false);
      onLoginSuccess();
      onClose();
      // Reset state for next open
      setStep('credentials');
    }, 600);
  };

  const handleBackToCredentials = () => {
    setStep('credentials');
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="bg-[#1E293B] border border-[#16A34A]/50 rounded-2xl max-w-md w-full p-6 sm:p-8 relative shadow-2xl text-white">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#94A3B8] hover:text-white p-2 rounded-lg transition-colors cursor-pointer"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-2">
          <VerdeGridLogo size="md" showTagline={true} darkBg={true} />
        </div>

        <div className="flex items-center gap-2 mb-5">
          <span className="px-2 py-0.5 rounded bg-[#16A34A]/20 border border-[#16A34A]/40 text-[#4ADE80] font-mono text-[10px] font-bold">
            MFA Mandatory · NIS2 &amp; ISO 27001
          </span>
          <span className="text-[#94A3B8] text-xs font-mono">
            Estonia EE-17556598
          </span>
        </div>

        {step === 'credentials' ? (
          <>
            {/* Quick Demo Login Presets */}
            <div className="mb-6 p-4 rounded-xl bg-[#0F172A] border border-white/10 space-y-2">
              <div className="text-[11px] font-mono text-[#4ADE80] flex items-center gap-1.5 font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5" /> Quick Demo Role Logins (Triggers 2FA)
              </div>

              <button
                type="button"
                onClick={() => handleQuickPreset('asset.manager@vge.ee')}
                className="w-full text-left p-2.5 rounded-lg bg-[#1E293B] hover:bg-[#16A34A] hover:text-white text-[#94A3B8] text-xs font-mono transition-all flex items-center justify-between cursor-pointer border border-white/5 group"
              >
                <span>👨‍💼 Solar Asset Operations Manager</span>
                <span className="text-[10px] opacity-75 group-hover:opacity-100 font-bold">2FA Required &rarr;</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickPreset('esg.auditor@kpmg-audit.eu')}
                className="w-full text-left p-2.5 rounded-lg bg-[#1E293B] hover:bg-[#16A34A] hover:text-white text-[#94A3B8] text-xs font-mono transition-all flex items-center justify-between cursor-pointer border border-white/5 group"
              >
                <span>🌿 EU CSRD / ESG Auditor</span>
                <span className="text-[10px] opacity-75 group-hover:opacity-100 font-bold">2FA Required &rarr;</span>
              </button>
            </div>

            <form onSubmit={handleProceedToMfa} className="space-y-4 text-xs font-mono">
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
                Continue to 2FA Verification
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </>
        ) : (
          /* Step 2: Multi-Factor Authentication (MFA / 2FA) Screen */
          <div className="space-y-5 animate-in fade-in duration-200">
            
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-[#16A34A]/40 space-y-1.5">
              <div className="flex items-center gap-2 text-[#4ADE80] font-heading font-bold text-sm">
                <ShieldCheck className="w-4 h-4" />
                Step 2: Multi-Factor Authentication (MFA)
              </div>
              <p className="text-xs text-slate-300 font-body">
                Verifying corporate identity for <strong className="text-white font-mono">{email}</strong>. Mandatory MFA is enforced for all Super Admin &amp; Client Portal users under EU NIS2 directives.
              </p>
            </div>

            {/* MFA Method Switcher */}
            <div className="grid grid-cols-3 gap-2 font-mono text-[11px]">
              <button
                type="button"
                onClick={() => setMfaMethod('totp')}
                className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-colors cursor-pointer ${
                  mfaMethod === 'totp'
                    ? 'bg-[#16A34A]/20 border-[#4ADE80] text-[#4ADE80]'
                    : 'bg-[#0F172A] border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>Authenticator</span>
              </button>

              <button
                type="button"
                onClick={() => setMfaMethod('yubikey')}
                className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-colors cursor-pointer ${
                  mfaMethod === 'yubikey'
                    ? 'bg-[#16A34A]/20 border-[#4ADE80] text-[#4ADE80]'
                    : 'bg-[#0F172A] border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                <Fingerprint className="w-4 h-4" />
                <span>YubiKey FIDO2</span>
              </button>

              <button
                type="button"
                onClick={() => setMfaMethod('backup')}
                className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-colors cursor-pointer ${
                  mfaMethod === 'backup'
                    ? 'bg-[#16A34A]/20 border-[#4ADE80] text-[#4ADE80]'
                    : 'bg-[#0F172A] border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                <KeyRound className="w-4 h-4" />
                <span>Backup Code</span>
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-mono flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleVerifyMfa} className="space-y-4 text-xs font-mono">
              {mfaMethod === 'totp' && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-slate-300">Enter 6-Digit TOTP Passcode</label>
                    <span className="text-[10px] text-[#4ADE80] flex items-center gap-1">
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      Refreshes in {timer}s
                    </span>
                  </div>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={mfaCode}
                    onChange={(e) => setMfaCode(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="849201"
                    className="w-full bg-[#0F172A] border border-white/20 rounded-xl py-3 px-4 text-center font-mono text-xl tracking-[0.4em] text-[#4ADE80] font-bold focus:outline-none focus:border-[#16A34A]"
                  />
                  <p className="text-[10px] text-slate-400 mt-1.5 text-center">
                    Check Google Authenticator, Authy, or Microsoft Authenticator app.
                  </p>
                </div>
              )}

              {mfaMethod === 'yubikey' && (
                <div className="p-4 rounded-xl bg-[#0F172A] border border-slate-700 text-center space-y-3">
                  <Fingerprint className="w-8 h-8 text-[#4ADE80] mx-auto animate-pulse" />
                  <p className="text-xs text-slate-300">
                    Insert your YubiKey hardware security key into USB port or tap via NFC, then touch the gold contact button.
                  </p>
                  <button
                    type="button"
                    onClick={() => setMfaCode('991042')}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 text-[#4ADE80] text-[11px] font-mono hover:bg-slate-700 border border-slate-700 cursor-pointer"
                  >
                    Simulate YubiKey WebAuthn Touch
                  </button>
                </div>
              )}

              {mfaMethod === 'backup' && (
                <div>
                  <label className="block text-slate-300 mb-1.5">Enter Emergency 8-Character Backup Code</label>
                  <input
                    type="text"
                    required
                    value={mfaCode}
                    onChange={(e) => setMfaCode(e.target.value)}
                    placeholder="VGE-8849-2026"
                    className="w-full bg-[#0F172A] border border-white/20 rounded-xl py-3 px-4 text-center font-mono text-base text-[#4ADE80] font-bold focus:outline-none focus:border-[#16A34A]"
                  />
                </div>
              )}

              <div className="space-y-2 pt-2">
                <button
                  type="submit"
                  disabled={isVerifying}
                  className="w-full bg-[#16A34A] hover:bg-[#4ADE80] text-white hover:text-[#0F172A] py-3 rounded-xl font-heading text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-[#16A34A]/20"
                >
                  {isVerifying ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Verifying Cryptographic 2FA...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Verify 2FA &amp; Open Client Portal
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleBackToCredentials}
                  className="w-full text-slate-400 hover:text-white py-2 text-xs transition-colors cursor-pointer"
                >
                  &larr; Back to Email &amp; Password
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};


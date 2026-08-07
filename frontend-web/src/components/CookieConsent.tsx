import React, { useState, useEffect } from 'react';
import { Cookie, ShieldCheck, X, Check, Settings, Lock, FileText, ChevronRight } from 'lucide-react';

interface CookieConsentProps {
  onOpenPrivacyPolicy: () => void;
  forceOpenTrigger?: number; // Used by footer to re-open banner/modal
}

export const CookieConsent: React.FC<CookieConsentProps> = ({ onOpenPrivacyPolicy, forceOpenTrigger }) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [preferences, setPreferences] = useState({
    essential: true, // Always true
    analytics: true,
    functional: true,
  });

  useEffect(() => {
    const savedConsent = localStorage.getItem('vge_cookie_consent');
    if (!savedConsent) {
      // Delay slightly for smooth entrance
      const timer = setTimeout(() => setIsVisible(true), 1200);
      return () => clearTimeout(timer);
    } else {
      try {
        const parsed = JSON.parse(savedConsent);
        setPreferences(parsed.preferences || { essential: true, analytics: true, functional: true });
      } catch {
        // Fallback
      }
    }
  }, []);

  useEffect(() => {
    if (forceOpenTrigger && forceOpenTrigger > 0) {
      setIsVisible(true);
      setShowSettings(true);
    }
  }, [forceOpenTrigger]);

  const handleAcceptAll = () => {
    const allAccepted = { essential: true, analytics: true, functional: true };
    localStorage.setItem(
      'vge_cookie_consent',
      JSON.stringify({ status: 'all', timestamp: new Date().toISOString(), preferences: allAccepted })
    );
    setPreferences(allAccepted);
    setIsVisible(false);
    setShowSettings(false);
  };

  const handleRejectOptional = () => {
    const essentialOnly = { essential: true, analytics: false, functional: false };
    localStorage.setItem(
      'vge_cookie_consent',
      JSON.stringify({ status: 'essential_only', timestamp: new Date().toISOString(), preferences: essentialOnly })
    );
    setPreferences(essentialOnly);
    setIsVisible(false);
    setShowSettings(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem(
      'vge_cookie_consent',
      JSON.stringify({ status: 'custom', timestamp: new Date().toISOString(), preferences })
    );
    setIsVisible(false);
    setShowSettings(false);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Floating Bottom GDPR Cookie Banner */}
      <div className="fixed bottom-4 left-4 right-4 md:left-8 md:right-auto md:max-w-2xl z-50 animate-in fade-in slide-in-from-bottom-8 duration-300">
        <div className="bg-[#0F172A]/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl p-5 shadow-2xl shadow-black/80 text-white relative">
          
          {/* Close X button */}
          <button
            onClick={handleRejectOptional}
            className="absolute top-3.5 right-3.5 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Decline optional cookies"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-[#16A34A]/15 border border-[#16A34A]/30 text-[#4ADE80] shrink-0">
              <Cookie className="w-5 h-5" />
            </div>

            <div className="space-y-2 pr-4">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-heading font-bold text-sm text-white">
                  Cookie & Privacy Preferences
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[#4ADE80] text-[10px] font-mono font-semibold">
                  EU GDPR Compliant
                </span>
              </div>

              <p className="text-slate-300 text-xs leading-relaxed font-body">
                Verde Grid Energy (<strong className="text-white font-medium">VGE Technologies OÜ</strong>) uses essential cookies to guarantee secure authentication, mTLS encryption, and localized services on <span className="text-[#4ADE80] font-mono">www.verdegridenergy.com</span>.
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  onClick={handleAcceptAll}
                  className="px-4 py-2 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold font-mono transition-all duration-200 shadow-md shadow-[#16A34A]/20 flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  Accept All
                </button>

                <button
                  onClick={handleRejectOptional}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium font-mono transition-colors cursor-pointer"
                >
                  Essential Only
                </button>

                <button
                  onClick={() => setShowSettings(true)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-xs font-medium font-mono transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5 text-slate-400" />
                  Customize
                </button>

                <button
                  onClick={onOpenPrivacyPolicy}
                  className="text-xs text-[#4ADE80] hover:underline font-mono ml-auto py-1 flex items-center gap-1"
                >
                  <FileText className="w-3 h-3" />
                  Privacy Policy
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cookie Customization Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#0F172A] border border-slate-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-6 text-white relative">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[#16A34A]/15 border border-[#16A34A]/30 text-[#4ADE80]">
                  <Settings className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-white">
                    Manage Cookie Preferences
                  </h3>
                  <p className="text-slate-400 text-xs font-mono">
                    VGE Technologies OÜ · EU GDPR Directive 2016/679
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSettings(false)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Cookie Types Toggles */}
            <div className="space-y-4">
              
              {/* Essential Cookies */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-[#4ADE80]" />
                    <span className="font-heading font-semibold text-sm text-white">
                      Strictly Necessary &amp; Security Cookies
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 font-bold">
                      Always Active
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Required for core system functions including Client Portal SSO, mTLS hardware security handshake, CSRF protection, and language settings.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={true}
                  disabled
                  className="mt-1 accent-[#16A34A] w-4 h-4 cursor-not-allowed opacity-80"
                />
              </div>

              {/* Performance & Analytics */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span className="font-heading font-semibold text-sm text-white">
                      Performance &amp; Telemetry Analytics
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Helps us measure IoT telemetry latency, API endpoint response times, and aggregated usage stats without storing personal identifiers.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.analytics}
                  onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                  className="mt-1 accent-[#16A34A] w-4 h-4 cursor-pointer"
                />
              </div>

              {/* Functional & Customization */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Cookie className="w-4 h-4 text-amber-400" />
                    <span className="font-heading font-semibold text-sm text-white">
                      Functional &amp; Calculator Preferences
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Remembers your regional capacity inputs in the B2B Yield Calculator and customized dashboard view state across sessions.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.functional}
                  onChange={(e) => setPreferences({ ...preferences, functional: e.target.checked })}
                  className="mt-1 accent-[#16A34A] w-4 h-4 cursor-pointer"
                />
              </div>

            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                onClick={onOpenPrivacyPolicy}
                className="text-xs text-[#4ADE80] hover:underline font-mono flex items-center gap-1"
              >
                Read Full GDPR Policy
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleRejectOptional}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono font-medium transition-colors"
                >
                  Essential Only
                </button>
                <button
                  onClick={handleSavePreferences}
                  className="px-4 py-2 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-mono font-bold transition-colors shadow-md shadow-[#16A34A]/20"
                >
                  Save Preferences
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

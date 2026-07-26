import React, { useState, useRef, useEffect } from 'react';
import { Activity, LayoutDashboard, Shield, Cpu, FileText, ChevronRight, Menu, X, Globe, ChevronDown, Check } from 'lucide-react';
import { useLanguage, LANGUAGES } from '../context/LanguageContext';
import { VerdeGridLogo } from './VerdeGridLogo';

interface NavbarProps {
  onOpenLogin: () => void;
  onOpenDemo: () => void;
  isDashboardOpen: boolean;
  onToggleDashboard: () => void;
  activeSection: string;
  onNavigateSection: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenLogin,
  onOpenDemo,
  isDashboardOpen,
  onToggleDashboard,
  onNavigateSection,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const { currentLanguage, setLanguage, t } = useLanguage();
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close language dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (sectionId: string) => {
    if (isDashboardOpen) {
      onToggleDashboard();
    }
    onNavigateSection(sectionId);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0F172A]/95 backdrop-blur-md border-b border-[#1E293B] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => handleNavClick('hero')} 
          className="flex items-center cursor-pointer group hover:opacity-95 transition-all py-1"
          title="Verde Grid Energy - Home"
        >
          <VerdeGridLogo size="md" align="left" showTagline={true} darkBg={true} />
        </div>

        {/* Navigation Links - Desktop */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-8">
          <button 
            onClick={() => handleNavClick('solutions')} 
            className="text-slate-300 hover:text-[#4ADE80] text-xs xl:text-sm font-semibold tracking-wide transition-all cursor-pointer py-2 relative group"
          >
            <span>{t('solutions', 'Solutions')}</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#4ADE80] rounded-full group-hover:w-full transition-all duration-200"></span>
          </button>
          <button 
            onClick={() => handleNavClick('calculator')} 
            className="text-slate-300 hover:text-[#4ADE80] text-xs xl:text-sm font-semibold tracking-wide transition-all cursor-pointer py-2 relative group"
          >
            <span>{t('calculator', 'Yield Calculator')}</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#4ADE80] rounded-full group-hover:w-full transition-all duration-200"></span>
          </button>
          <button 
            onClick={() => handleNavClick('api-integrations')} 
            className="text-slate-300 hover:text-[#4ADE80] text-xs xl:text-sm font-semibold tracking-wide transition-all cursor-pointer py-2 relative group"
          >
            <span>{t('apiIntegrations', 'API Integrations')}</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#4ADE80] rounded-full group-hover:w-full transition-all duration-200"></span>
          </button>
          <button 
            onClick={() => handleNavClick('esg-studio')} 
            className="text-slate-300 hover:text-[#4ADE80] text-xs xl:text-sm font-semibold tracking-wide transition-all cursor-pointer py-2 relative group"
          >
            <span>{t('esgCompliance', 'ESG Compliance')}</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#4ADE80] rounded-full group-hover:w-full transition-all duration-200"></span>
          </button>
          <button 
            onClick={() => handleNavClick('security')} 
            className="text-slate-300 hover:text-[#4ADE80] text-xs xl:text-sm font-semibold tracking-wide transition-all cursor-pointer py-2 relative group"
          >
            <span>{t('security', 'Enterprise Security')}</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#4ADE80] rounded-full group-hover:w-full transition-all duration-200"></span>
          </button>
        </div>

        {/* Right CTA Actions & Language Selector - Desktop */}
        <div className="hidden md:flex items-center gap-3.5">
          
          {/* Language Selector Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-2 bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 hover:border-[#16A34A]/60 px-3 py-2 rounded-xl text-xs font-mono font-medium transition-all shadow-inner cursor-pointer"
              title="Select Platform Language"
            >
              <Globe className="w-3.5 h-3.5 text-[#4ADE80]" />
              <span className="text-sm leading-none">{currentLanguage.flag}</span>
              <span className="font-bold tracking-wider">{currentLanguage.code.toUpperCase()}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${langDropdownOpen ? 'rotate-180 text-[#4ADE80]' : ''}`} />
            </button>

            {/* Language Menu Overlay */}
            {langDropdownOpen && (
              <div className="absolute right-0 mt-2.5 w-60 bg-[#0B1329] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden z-50 py-1.5 backdrop-blur-2xl animate-in fade-in slide-in-from-top-2 duration-200 ring-1 ring-white/10">
                <div className="px-3.5 py-2 border-b border-slate-800 text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Globe className="w-3 h-3 text-[#4ADE80]" />
                    Global Language
                  </span>
                  <span className="text-[#4ADE80] font-extrabold">{LANGUAGES.length} Available</span>
                </div>
                <div className="max-h-64 overflow-y-auto divide-y divide-slate-800/50">
                  {LANGUAGES.map((lang) => {
                    const isSelected = currentLanguage.code === lang.code;
                    return (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => {
                          setLanguage(lang);
                          setLangDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-2.5 text-xs font-mono flex items-center justify-between transition-all cursor-pointer ${
                          isSelected 
                            ? 'bg-[#16A34A]/20 text-[#4ADE80] font-bold border-l-2 border-[#4ADE80]' 
                            : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-base">{lang.flag}</span>
                          <div>
                            <div className="font-semibold leading-tight">{lang.name}</div>
                            <div className="text-[10px] text-slate-400 font-sans">{lang.nativeName}</div>
                          </div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-[#4ADE80] shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <button 
            onClick={onToggleDashboard}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 border transition-all cursor-pointer shadow-sm ${
              isDashboardOpen 
                ? 'bg-[#16A34A] text-white border-[#4ADE80] shadow-emerald-900/50' 
                : 'bg-slate-900/80 text-[#4ADE80] border-[#16A34A]/60 hover:bg-[#16A34A]/20 hover:border-[#4ADE80] hover:text-white'
            }`}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4ADE80] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4ADE80]"></span>
            </span>
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">{isDashboardOpen ? 'Exit Portal' : t('liveDashboardDemo', 'Live Demo')}</span>
            <span className="xl:hidden">{isDashboardOpen ? 'Exit' : 'Demo'}</span>
          </button>

          <button 
            onClick={onOpenLogin}
            className="bg-gradient-to-r from-[#16A34A] to-[#15803D] hover:from-[#22C55E] hover:to-[#16A34A] text-white border border-[#4ADE80]/40 px-4 py-2 rounded-xl font-heading text-xs xl:text-sm font-bold transition-all shadow-md shadow-emerald-950/50 hover:shadow-emerald-500/20 active:scale-[0.98] cursor-pointer whitespace-nowrap"
          >
            {t('clientPortalLogin', 'Client Portal Login')}
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <button 
            onClick={onToggleDashboard}
            className="bg-[#1E293B] text-[#4ADE80] border border-[#16A34A] p-2 rounded-lg text-xs font-semibold flex items-center gap-1"
          >
            <LayoutDashboard className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-[#94A3B8] hover:text-white p-2"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0F172A] border-b border-[#1E293B] px-4 pt-2 pb-6 space-y-4">
          
          {/* Mobile Language Selector Grid */}
          <div className="bg-[#1E293B]/80 p-3 rounded-xl border border-white/10 space-y-2">
            <div className="text-[11px] font-mono text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1.5 mb-1">
              <Globe className="w-3.5 h-3.5 text-[#4ADE80]" />
              Select Language ({currentLanguage.name})
            </div>
            <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto pr-1">
              {LANGUAGES.map((lang) => {
                const isSelected = currentLanguage.code === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-2 p-1.5 rounded-lg text-xs font-mono transition-colors text-left ${
                      isSelected 
                        ? 'bg-[#16A34A] text-white font-bold' 
                        : 'bg-[#0F172A] text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>{lang.flag}</span>
                    <span className="truncate">{lang.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <button 
            onClick={() => handleNavClick('solutions')} 
            className="block w-full text-left py-2 text-[#94A3B8] hover:text-[#4ADE80] font-medium"
          >
            {t('solutions', 'Solutions')}
          </button>
          <button 
            onClick={() => handleNavClick('calculator')} 
            className="block w-full text-left py-2 text-[#94A3B8] hover:text-[#4ADE80] font-medium"
          >
            {t('calculator', 'Yield Calculator')}
          </button>
          <button 
            onClick={() => handleNavClick('api-integrations')} 
            className="block w-full text-left py-2 text-[#94A3B8] hover:text-[#4ADE80] font-medium"
          >
            {t('apiIntegrations', 'API Integrations')}
          </button>
          <button 
            onClick={() => handleNavClick('esg-studio')} 
            className="block w-full text-left py-2 text-[#94A3B8] hover:text-[#4ADE80] font-medium"
          >
            {t('esgCompliance', 'ESG Compliance')}
          </button>
          <button 
            onClick={() => handleNavClick('security')} 
            className="block w-full text-left py-2 text-[#94A3B8] hover:text-[#4ADE80] font-medium"
          >
            {t('security', 'Enterprise Security')}
          </button>

          <div className="pt-4 border-t border-[#1E293B] flex flex-col gap-3">
            <button 
              onClick={() => { setMobileMenuOpen(false); onOpenLogin(); }}
              className="w-full bg-[#1E293B] text-[#4ADE80] border border-[#16A34A] py-2.5 rounded-lg font-heading text-center font-semibold"
            >
              {t('clientPortalLogin', 'Client Portal Login')}
            </button>
            <button 
              onClick={() => { setMobileMenuOpen(false); onOpenDemo(); }}
              className="w-full bg-[#16A34A] text-white py-2.5 rounded-lg font-heading text-center font-semibold"
            >
              Request Enterprise Demo
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};


import React, { useState } from 'react';
import { Activity, LayoutDashboard, Shield, Cpu, FileText, ChevronRight, Menu, X } from 'lucide-react';

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
          className="flex items-center gap-3 cursor-pointer group"
        >
          {!logoError ? (
            <img 
              src="https://verdegridenergy.com/wp-content/uploads/2024/02/Verde-Grid-Logo-Light.png" 
              alt="Verde Grid Energy Logo" 
              className="h-9 w-auto object-contain transition-transform group-hover:scale-105"
              onError={() => setLogoError(true)}
            />
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#16A34A] to-[#15803D] flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-[#16A34A]/20">
                V
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-bold text-lg text-white tracking-tight leading-none">
                  VERDE GRID
                </span>
                <span className="text-[10px] text-[#94A3B8] tracking-widest font-mono">
                  ENERGY ANALYTICS
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Links - Desktop */}
        <div className="hidden md:flex items-center gap-8">
          <button 
            onClick={() => handleNavClick('solutions')} 
            className="text-[#94A3B8] hover:text-[#4ADE80] text-sm font-medium transition-colors cursor-pointer"
          >
            Solutions
          </button>
          <button 
            onClick={() => handleNavClick('calculator')} 
            className="text-[#94A3B8] hover:text-[#4ADE80] text-sm font-medium transition-colors cursor-pointer"
          >
            Yield Calculator
          </button>
          <button 
            onClick={() => handleNavClick('api-integrations')} 
            className="text-[#94A3B8] hover:text-[#4ADE80] text-sm font-medium transition-colors cursor-pointer"
          >
            API Integrations
          </button>
          <button 
            onClick={() => handleNavClick('esg-studio')} 
            className="text-[#94A3B8] hover:text-[#4ADE80] text-sm font-medium transition-colors cursor-pointer"
          >
            ESG Compliance
          </button>
          <button 
            onClick={() => handleNavClick('security')} 
            className="text-[#94A3B8] hover:text-[#4ADE80] text-sm font-medium transition-colors cursor-pointer"
          >
            Enterprise Security
          </button>
        </div>

        {/* CTA Buttons */}
        <div className="hidden lg:flex items-center gap-4">
          <button 
            onClick={onToggleDashboard}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-semibold flex items-center gap-2 border transition-all cursor-pointer ${
              isDashboardOpen 
                ? 'bg-[#16A34A] text-white border-[#4ADE80]' 
                : 'bg-[#1E293B] text-[#4ADE80] border-[#16A34A] hover:bg-[#16A34A] hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            {isDashboardOpen ? 'Exit Portal' : 'Live Dashboard Demo'}
          </button>

          <button 
            onClick={onOpenLogin}
            className="bg-[#1E293B] text-[#4ADE80] border border-[#16A34A] px-5 py-2.5 rounded-lg font-heading text-sm font-semibold hover:bg-[#16A34A] hover:text-white transition-all shadow-sm cursor-pointer"
          >
            Client Portal Login
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-3">
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
        <div className="md:hidden bg-[#0F172A] border-b border-[#1E293B] px-4 pt-2 pb-6 space-y-3">
          <button 
            onClick={() => handleNavClick('solutions')} 
            className="block w-full text-left py-2 text-[#94A3B8] hover:text-[#4ADE80] font-medium"
          >
            Solutions
          </button>
          <button 
            onClick={() => handleNavClick('calculator')} 
            className="block w-full text-left py-2 text-[#94A3B8] hover:text-[#4ADE80] font-medium"
          >
            Yield Calculator
          </button>
          <button 
            onClick={() => handleNavClick('api-integrations')} 
            className="block w-full text-left py-2 text-[#94A3B8] hover:text-[#4ADE80] font-medium"
          >
            API Integrations
          </button>
          <button 
            onClick={() => handleNavClick('esg-studio')} 
            className="block w-full text-left py-2 text-[#94A3B8] hover:text-[#4ADE80] font-medium"
          >
            ESG Compliance
          </button>
          <button 
            onClick={() => handleNavClick('security')} 
            className="block w-full text-left py-2 text-[#94A3B8] hover:text-[#4ADE80] font-medium"
          >
            Enterprise Security
          </button>

          <div className="pt-4 border-t border-[#1E293B] flex flex-col gap-3">
            <button 
              onClick={() => { setMobileMenuOpen(false); onOpenLogin(); }}
              className="w-full bg-[#1E293B] text-[#4ADE80] border border-[#16A34A] py-2.5 rounded-lg font-heading text-center font-semibold"
            >
              Client Portal Login
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

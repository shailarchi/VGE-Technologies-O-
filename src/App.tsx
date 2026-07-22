import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FeaturesSection } from './components/FeaturesSection';
import { YieldCalculator } from './components/YieldCalculator';
import { ApiPlayground } from './components/ApiPlayground';
import { EsgStudio } from './components/EsgStudio';
import { SecuritySection } from './components/SecuritySection';
import { ClientPortal } from './components/ClientPortal';
import { DemoModal } from './components/DemoModal';
import { LoginModal } from './components/LoginModal';
import { Footer } from './components/Footer';

export default function App() {
  const [isDashboardOpen, setIsDashboardOpen] = useState<boolean>(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  const handleNavigateSection = (sectionId: string) => {
    setIsDashboardOpen(false);
    setTimeout(() => {
      const elem = document.getElementById(sectionId);
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white selection:bg-[#16A34A] selection:text-white font-body">
      
      {/* Top Fixed Header */}
      <Navbar
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onOpenDemo={() => setIsDemoModalOpen(true)}
        isDashboardOpen={isDashboardOpen}
        onToggleDashboard={() => setIsDashboardOpen(!isDashboardOpen)}
        activeSection="home"
        onNavigateSection={handleNavigateSection}
      />

      {/* View Switch: Live Client Portal vs Enterprise Landing Page */}
      {isDashboardOpen ? (
        <ClientPortal onExitPortal={() => setIsDashboardOpen(false)} />
      ) : (
        <main>
          {/* Hero Section */}
          <Hero
            onOpenDemo={() => setIsDemoModalOpen(true)}
            onOpenDashboard={() => setIsDashboardOpen(true)}
            onNavigateSection={handleNavigateSection}
          />

          {/* Features Grid: Real-time IoT, ESG Reporting, B2B Yield */}
          <FeaturesSection
            onNavigateSection={handleNavigateSection}
            onOpenDemo={() => setIsDemoModalOpen(true)}
          />

          {/* Interactive B2B Solar Yield & Revenue Calculator */}
          <YieldCalculator />

          {/* Developer REST & MQTT API Playground */}
          <ApiPlayground />

          {/* Automated ESG & Carbon Audit Studio */}
          <EsgStudio />

          {/* Security & Estonian Compliance Section */}
          <SecuritySection />
        </main>
      )}

      {/* Corporate Legal Footer */}
      <Footer
        onNavigateSection={handleNavigateSection}
        onOpenDemo={() => setIsDemoModalOpen(true)}
        onOpenLogin={() => setIsLoginModalOpen(true)}
      />

      {/* Modals */}
      <DemoModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={() => setIsDashboardOpen(true)}
      />

    </div>
  );
}

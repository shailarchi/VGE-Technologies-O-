import React, { useState } from 'react';
import { X, ShieldCheck, Lock, FileText, Globe, Mail, Building, Printer, CheckCircle, Scale, Download } from 'lucide-react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCookiePreferences?: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({
  isOpen,
  onClose,
  onOpenCookiePreferences
}) => {
  const [activeTab, setActiveTab] = useState<'policy' | 'rights' | 'cookies' | 'contact'>('policy');

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-[#0F172A] border border-slate-700/80 rounded-2xl w-full max-w-4xl shadow-2xl text-white relative my-auto flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-[#16A34A]/15 border border-[#16A34A]/30 text-[#4ADE80]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading font-bold text-lg sm:text-xl text-white tracking-tight">
                  GDPR Privacy Policy &amp; EU Compliance Notice
                </h2>
                <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-[#16A34A]/20 border border-[#16A34A]/40 text-[#4ADE80] font-mono text-[10px] font-bold uppercase">
                  EU Regulation 2016/679
                </span>
              </div>
              <p className="text-slate-400 text-xs font-mono pt-0.5">
                VGE Technologies OÜ · Commercial Register: 17556598 · Tallinn, Estonia 🇪🇪
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors hidden sm:flex items-center gap-1.5 text-xs font-mono"
              title="Print Policy"
            >
              <Printer className="w-4 h-4" />
              <span>Print</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="px-6 bg-slate-900/50 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto shrink-0 font-mono text-xs">
          <button
            onClick={() => setActiveTab('policy')}
            className={`py-3 px-4 border-b-2 font-semibold transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'policy'
                ? 'border-[#4ADE80] text-[#4ADE80]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            1. GDPR Privacy Statement
          </button>

          <button
            onClick={() => setActiveTab('rights')}
            className={`py-3 px-4 border-b-2 font-semibold transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'rights'
                ? 'border-[#4ADE80] text-[#4ADE80]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Scale className="w-4 h-4" />
            2. Your Data Rights (Art. 15-22)
          </button>

          <button
            onClick={() => setActiveTab('cookies')}
            className={`py-3 px-4 border-b-2 font-semibold transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'cookies'
                ? 'border-[#4ADE80] text-[#4ADE80]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Lock className="w-4 h-4" />
            3. Cookies &amp; Telemetry
          </button>

          <button
            onClick={() => setActiveTab('contact')}
            className={`py-3 px-4 border-b-2 font-semibold transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'contact'
                ? 'border-[#4ADE80] text-[#4ADE80]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Mail className="w-4 h-4" />
            4. DPO &amp; Authorities
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-300 text-sm leading-relaxed font-body">
          
          {activeTab === 'policy' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              
              {/* Effective Date Box */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
                <div>
                  <span className="text-slate-400">Effective Date:</span> <strong className="text-white">January 1, 2026</strong>
                </div>
                <div>
                  <span className="text-slate-400">Website:</span> <strong className="text-[#4ADE80]">www.verdegridenergy.com</strong>
                </div>
                <div>
                  <span className="text-slate-400">Data Residency:</span> <strong className="text-emerald-400">European Union (Tallinn 🇪🇪)</strong>
                </div>
              </div>

              {/* Section 1: Data Controller */}
              <div className="space-y-3">
                <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
                  <Building className="w-5 h-5 text-[#4ADE80]" />
                  1. Data Controller Identification
                </h3>
                <p>
                  This Privacy Policy details how <strong className="text-white">VGE Technologies OÜ</strong> (Trading as <span className="text-[#4ADE80]">Verde Grid Energy</span>, "we", "us", or "our") processes personal data and technical telemetry collected through our website (<code className="text-[#4ADE80]">www.verdegridenergy.com</code>), B2B Client Portal, and IoT SCADA telemetry ingestion gateways.
                </p>
                <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-1 font-mono text-xs text-slate-300">
                  <p className="text-white font-bold">VGE Technologies OÜ</p>
                  <p>Commercial Register (Republic of Estonia): 17556598</p>
                  <p>Legal Entity Identifier (LEI): 9845003828CB77B80280</p>
                  <p>Address: Vesivärava tn 50-301, 10152 Tallinn, Harju maakond, Estonia 🇪🇪</p>
                  <p>Data Protection Officer Email: <a href="mailto:dpo@verdegridenergy.com" className="text-[#4ADE80] underline">dpo@verdegridenergy.com</a></p>
                </div>
              </div>

              {/* Section 2: Categories of Data */}
              <div className="space-y-3 pt-2">
                <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
                  <Lock className="w-5 h-5 text-[#4ADE80]" />
                  2. Categories of Data Collected
                </h3>
                <p>
                  We operate as a B2B IoT Operating System and Digital Underwriting infrastructure. We process the following categories of data:
                </p>
                <ul className="space-y-2 text-xs list-disc list-inside bg-slate-900/60 p-4 rounded-xl border border-slate-800 text-slate-300">
                  <li><strong className="text-white">B2B Account Information:</strong> Name, corporate email address, organizational title, company registration, and login credentials for Client Portal SSO.</li>
                  <li><strong className="text-white">IoT Telemetry &amp; Inverter Technical Logs:</strong> Inverter serial numbers, grid voltage, active power outputs, PPA tariff calculations, mTLS certificate hashes, and IP addresses.</li>
                  <li><strong className="text-white">Website Usage &amp; Diagnostic Logs:</strong> Browser user agent, regional IP geolocations, session cookies, and API request performance logs under strictly pseudonymized formats.</li>
                </ul>
              </div>

              {/* Section 3: Legal Basis */}
              <div className="space-y-3 pt-2">
                <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
                  <Scale className="w-5 h-5 text-[#4ADE80]" />
                  3. Legal Basis for Processing under GDPR (Art. 6)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <span className="font-mono text-[#4ADE80] font-bold">Art. 6(1)(b) - Contractual Necessity</span>
                    <p className="text-slate-400">Processing necessary for executing commercial B2B contracts, providing SCADA IoT telemetry streams, and automating I-REC carbon credit minting.</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <span className="font-mono text-[#4ADE80] font-bold">Art. 6(1)(f) - Legitimate Interest</span>
                    <p className="text-slate-400">Maintaining cybersecurity, enforcing mTLS hardware handshakes, preventing unauthorized access, and auditing EU NIS2 compliance.</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <span className="font-mono text-[#4ADE80] font-bold">Art. 6(1)(c) - Statutory Compliance</span>
                    <p className="text-slate-400">Compliance with Estonian commercial law, statutory financial record-keeping, and EU CSRD sustainability reporting standard requirements.</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <span className="font-mono text-[#4ADE80] font-bold">Art. 6(1)(a) - Consent</span>
                    <p className="text-slate-400">Freely given consent for optional website performance cookies, customizable calculator preferences, and direct communications.</p>
                  </div>
                </div>
              </div>

              {/* Section 4: Data Residency & Transfers */}
              <div className="space-y-3 pt-2">
                <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
                  <Globe className="w-5 h-5 text-[#4ADE80]" />
                  4. EU Data Residency &amp; Cross-Border Transfers
                </h3>
                <p>
                  All core database infrastructure, user accounts, and cryptographic key vaults are primary-hosted within the European Union (Tallinn, Estonia &amp; Frankfurt, Germany). Transfers to international enterprise partners (e.g. Asian solar developers) are conducted exclusively under EU Standard Contractual Clauses (SCCs) guaranteeing GDPR-equivalent safeguards.
                </p>
              </div>

              {/* Section 5: Technical Encryption Standards */}
              <div className="space-y-3 pt-2">
                <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
                  <Lock className="w-5 h-5 text-[#4ADE80]" />
                  5. Technical Encryption Standards
                </h3>
                <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
                  <p className="text-slate-200">
                    In compliance with EU NIS2 directives and ISO/IEC 27001 data protection benchmarks, all data managed by Verde Grid Energy adheres to the following cryptographic standards:
                  </p>
                  <ul className="space-y-1.5 list-disc list-inside text-slate-300 font-mono">
                    <li><strong className="text-white">In-Transit Encryption:</strong> All API requests, SCADA telemetry ingresses, and web communications are encrypted using TLS 1.2 or TLS 1.3 protocols with mTLS hardware verification.</li>
                    <li><strong className="text-white">At-Rest Encryption:</strong> All persistent database records, client portal credentials, and historical SCADA telemetry are encrypted at rest using AES-256 hardware-level encryption on our AWS PostgreSQL relational databases.</li>
                  </ul>
                </div>
              </div>

            </div>
          )}

          {activeTab === 'rights' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="p-4 rounded-xl bg-[#16A34A]/10 border border-[#16A34A]/30 text-xs text-[#4ADE80] flex items-start gap-3 font-mono">
                <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-sans text-sm mb-1">Your Rights Under GDPR Chapter III</strong>
                  Under EU Regulation 2016/679, data subjects residing in the European Economic Area (EEA) hold enforceable rights regarding their personal data processed by VGE Technologies OÜ.
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#4ADE80]"></span>
                    <h4 className="font-heading font-bold text-white text-sm">Right of Access (Article 15)</h4>
                  </div>
                  <p className="text-xs text-slate-400">
                    You have the right to request confirmation as to whether your personal data is processed, and obtain a free electronic copy of all processed data records.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#4ADE80]"></span>
                    <h4 className="font-heading font-bold text-white text-sm">Right to Rectification (Article 16)</h4>
                  </div>
                  <p className="text-xs text-slate-400">
                    You may request immediate correction of inaccurate or incomplete personal information stored in your Client Portal account.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#4ADE80]"></span>
                    <h4 className="font-heading font-bold text-white text-sm">Right to Erasure / "Right to be Forgotten" (Art. 17)</h4>
                  </div>
                  <p className="text-xs text-slate-400">
                    You may request deletion of personal data when processing is no longer necessary or consent is withdrawn, subject to statutory retention mandates under Estonian corporate law.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#4ADE80]"></span>
                    <h4 className="font-heading font-bold text-white text-sm">Right to Restriction &amp; Objection (Art. 18 &amp; 21)</h4>
                  </div>
                  <p className="text-xs text-slate-400">
                    You have the right to restrict processing or object to data processing based on legitimate interests at any time.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 md:col-span-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#4ADE80]"></span>
                    <h4 className="font-heading font-bold text-white text-sm">Right to Data Portability (Article 20)</h4>
                  </div>
                  <p className="text-xs text-slate-400">
                    You have the right to receive your personal and project telemetry data in a structured, commonly used, and machine-readable format (JSON/CSV) to transfer to another service provider.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs">
                <h4 className="font-heading font-bold text-white text-sm">How to Exercise Your Rights</h4>
                <p>
                  To submit a GDPR Subject Access Request (SAR) or data erasure inquiry, send an email to our Data Protection Officer at <a href="mailto:dpo@verdegridenergy.com" className="text-[#4ADE80] underline font-mono">dpo@verdegridenergy.com</a>. We respond to all verified requests within 30 calendar days as required under GDPR Article 12(3).
                </p>
              </div>
            </div>
          )}

          {activeTab === 'cookies' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div>
                <h3 className="font-heading text-lg font-bold text-white mb-2">
                  Cookie &amp; Local Storage Policy
                </h3>
                <p className="text-xs text-slate-300">
                  <strong className="text-white">www.verdegridenergy.com</strong> uses cookies and local storage tokens to maintain system integrity, authenticate client portal sessions, and remember user language choices.
                </p>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-white font-bold">
                    <span className="text-[#4ADE80]">vge_auth_token &amp; session_id</span>
                    <span className="text-slate-400 font-normal">Type: Essential (Session)</span>
                  </div>
                  <p className="text-slate-400 font-sans text-xs">
                    Maintains secure encrypted JWT session state for Client Portal access. Cannot be disabled.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-white font-bold">
                    <span className="text-[#4ADE80]">vge_lang_code</span>
                    <span className="text-slate-400 font-normal">Type: Functional (1 Year)</span>
                  </div>
                  <p className="text-slate-400 font-sans text-xs">
                    Remembers chosen interface translation language across session visits (English, Hindi, Japanese, Estonian, German, Vietnamese, Thai, French, Spanish, Chinese).
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-white font-bold">
                    <span className="text-[#4ADE80]">vge_cookie_consent</span>
                    <span className="text-slate-400 font-normal">Type: Essential (1 Year)</span>
                  </div>
                  <p className="text-slate-400 font-sans text-xs">
                    Stores your accepted GDPR cookie choices and customization parameters.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h4 className="font-heading font-bold text-white text-sm">Need to update your cookie choices?</h4>
                  <p className="text-xs text-slate-400">You can customize or revoke your consent anytime.</p>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    if (onOpenCookiePreferences) onOpenCookiePreferences();
                  }}
                  className="px-4 py-2 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-mono font-bold transition-colors cursor-pointer"
                >
                  Manage Cookie Preferences
                </button>
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="space-y-3">
                <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
                  <Mail className="w-5 h-5 text-[#4ADE80]" />
                  Contact Our Data Protection Officer (DPO)
                </h3>
                <p className="text-xs">
                  If you have questions regarding this GDPR Policy, data handling procedures, or wish to submit a formal inquiry:
                </p>

                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 font-mono text-xs">
                  <div className="flex items-center gap-3">
                    <Building className="w-4 h-4 text-[#4ADE80]" />
                    <span><strong className="text-white">Entity:</strong> VGE Technologies OÜ (Trading as Verde Grid Energy)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-[#4ADE80]" />
                    <span><strong className="text-white">DPO Direct Email:</strong> <a href="mailto:dpo@verdegridenergy.com" className="text-[#4ADE80] underline">dpo@verdegridenergy.com</a></span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-[#4ADE80]" />
                    <span><strong className="text-white">General Legal Email:</strong> <a href="mailto:hello@verdegridenergy.com" className="text-[#4ADE80] underline">hello@verdegridenergy.com</a></span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe className="w-4 h-4 text-[#4ADE80]" />
                    <span><strong className="text-white">Official Domain:</strong> www.verdegridenergy.com</span>
                  </div>
                </div>
              </div>

              {/* Supervisory Authority Details */}
              <div className="space-y-3 pt-2">
                <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
                  <Scale className="w-5 h-5 text-[#4ADE80]" />
                  Lead EU Supervisory Authority
                </h3>
                <p className="text-xs">
                  Under GDPR Article 77, you have the right to lodge a complaint with the lead EU supervisory authority in our country of main establishment:
                </p>

                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 font-mono text-xs text-slate-300">
                  <p className="text-white font-bold text-sm">Estonian Data Protection Inspectorate (Andmekaitse Inspektsioon)</p>
                  <p>Address: Tatari 39, 10134 Tallinn, Republic of Estonia 🇪🇪</p>
                  <p>Email: <a href="mailto:info@aki.ee" className="text-[#4ADE80] underline">info@aki.ee</a></p>
                  <p>Phone: +372 627 4135</p>
                  <p>Website: <a href="https://www.aki.ee" target="_blank" rel="noopener noreferrer" className="text-[#4ADE80] underline">www.aki.ee</a></p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-5 bg-slate-900/90 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 shrink-0 font-mono text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#4ADE80] animate-pulse"></span>
            <span>GDPR Compliance Verified · Republic of Estonia</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white font-bold transition-all shadow-lg shadow-[#16A34A]/20 cursor-pointer"
          >
            Acknowledge &amp; Close
          </button>
        </div>

      </div>
    </div>
  );
};

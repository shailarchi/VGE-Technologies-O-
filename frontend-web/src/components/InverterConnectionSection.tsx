import React, { useState } from 'react';
import {
  Zap,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Cpu,
  Lock,
  Radio,
  ShieldCheck,
  Globe,
  HelpCircle,
  RefreshCw,
  Layers,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { InverterConnectModal } from './InverterConnectModal';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const FAQ_LIST: FAQItem[] = [
  {
    category: 'Zero Hardware',
    question: 'Do I need to install any physical hardware or shut down solar operations?',
    answer: 'No. Our zero-hardware integration works 100% cloud-to-cloud via direct OpenAPI integration. There are zero physical dongles, zero hardware costs, and zero site visits required. Your solar generators operate without a single second of downtime.'
  },
  {
    category: 'Inverter Compatibility',
    question: 'Which solar inverter manufacturers are supported out of the box?',
    answer: 'We natively support Growatt (ShineServer/OSS), Huawei FusionSolar (OpenAPI v6), Sungrow (iSolarCloud), SMA (Sunny Portal), SolarEdge Cloud API, and Solis Cloud out of the box. Additionally, standard Modbus RTU/TCP gateways can be integrated in minutes via our universal edge proxy.'
  },
  {
    category: 'SCADA Security',
    question: 'How does the API handle SCADA security and grid data privacy?',
    answer: 'All API communication is encrypted In-Transit using TLS 1.2 or TLS 1.3 transport security with HMAC-SHA256 request signatures. All telemetry data At-Rest is protected with AES-256 encryption on AWS PostgreSQL databases. Verde Grid OS operates under read-only SCADA access scopes and never requests write or control permissions over your inverter settings.'
  },
  {
    category: 'I-REC Carbon Credits',
    question: 'How quickly do I-REC carbon credits mint once connected?',
    answer: 'Telemetry packets are processed in 60-second real-time cycles. Once dMRV verification rules confirm baseline production hash, digital I-REC tokens are minted directly on Polygon EVM and deposited into your organization’s ESG asset wallet within minutes.'
  },
  {
    category: 'Reliability',
    question: 'What happens if a solar site temporarily loses internet connection?',
    answer: 'Our cloud API automatically syncs missing historical telemetry packets from the inverter’s internal memory buffer as soon as connectivity is restored, ensuring 100% data integrity without lost carbon credit yields.'
  }
];

const PROCESS_STEPS = [
  {
    step: '01',
    title: 'Select Inverter Cloud',
    description: 'Choose Growatt, Huawei, Sungrow, SMA, or Solis from our native cloud API integrations catalog.',
    icon: Cpu
  },
  {
    step: '02',
    title: 'Authenticate OpenAPI',
    description: 'Provide your read-only SCADA API key & station code for TLS 1.3 encrypted handshake pairing.',
    icon: Lock
  },
  {
    step: '03',
    title: '60s Telemetry Ingress',
    description: 'Automated 60-second polling ingests active power, frequency, and cumulative MWh generation data.',
    icon: Radio
  },
  {
    step: '04',
    title: 'Instant I-REC Minting',
    description: 'Cryptographically hashed telemetry automatically mints verifiable carbon credits on Polygon EVM.',
    icon: ShieldCheck
  }
];

export const InverterConnectionSection: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [connectedPlantAlert, setConnectedPlantAlert] = useState<{ brand: string; plantName: string } | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div id="zero-hardware-integration" className="space-y-8 my-8">
      
      {/* Zero-Hardware Integration Banner */}
      <div className="bg-gradient-to-r from-[#1E293B] via-[#0F172A] to-[#162132] border border-[#16A34A]/50 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-md group">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#16A34A]/10 rounded-full blur-3xl pointer-events-none group-hover:bg-[#16A34A]/15 transition-all" />
        
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-4xl">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#16A34A]/15 border border-[#16A34A]/40 text-[#4ADE80] text-xs font-mono font-bold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 text-[#4ADE80] animate-pulse" />
              Zero-Hardware Integration
            </div>

            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Connect Solar Inverters via API
            </h2>

            {/* User requested exact copy */}
            <p className="text-slate-200 text-sm sm:text-base leading-relaxed font-body">
              “Connect your existing solar portfolio in 60 seconds. Our API integrates directly with major inverters (Growatt, Huawei) to instantly begin minting I-REC carbon credits without deploying physical hardware or disrupting your current operations.”
            </p>

            <div className="flex flex-wrap items-center gap-2.5 pt-2 text-xs font-mono text-slate-300">
              <span className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-white/10">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#4ADE80]" />
                Growatt &amp; Huawei OpenAPI
              </span>
              <span className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-white/10">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#4ADE80]" />
                Instant I-REC Carbon Credit Minting
              </span>
              <span className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-white/10">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#4ADE80]" />
                60-Second Setup • Zero Downtime
              </span>
            </div>

            {connectedPlantAlert && (
              <div className="mt-3 p-3 rounded-xl bg-[#16A34A]/20 border border-[#16A34A]/40 text-xs font-mono text-[#4ADE80] flex items-center justify-between">
                <span>
                  Connected: <strong>{connectedPlantAlert.plantName}</strong> via {connectedPlantAlert.brand} OpenAPI
                </span>
                <span className="bg-[#16A34A] text-white px-2 py-0.5 rounded text-[10px] uppercase">Active</span>
              </div>
            )}
          </div>

          <div className="shrink-0 w-full lg:w-auto">
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full lg:w-auto bg-[#16A34A] hover:bg-[#15803D] text-white font-heading font-bold text-sm px-6 py-4 rounded-xl transition-all shadow-xl shadow-[#16A34A]/25 flex items-center justify-center gap-2.5 group cursor-pointer"
            >
              <Cpu className="w-4 h-4 text-white" />
              <span>Connect Inverters via API</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>

      {/* Connection Process - 4 Step Flow */}
      <div className="bg-[#1E293B]/70 border border-white/10 rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-mono text-[#4ADE80] uppercase tracking-wider mb-1 font-bold">
              Integration Workflow
            </div>
            <h3 className="font-heading font-bold text-xl text-white">
              The 60-Second API Connection Process
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-white/10">
            TLS 1.3 • HMAC-SHA256 Encrypted
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {PROCESS_STEPS.map((stepItem, idx) => {
            const IconComponent = stepItem.icon;
            return (
              <div
                key={idx}
                className="bg-[#0F172A] border border-white/5 p-5 rounded-xl flex flex-col justify-between hover:border-[#16A34A]/40 transition-colors relative group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-mono font-bold text-[#4ADE80]">
                      {stepItem.step}
                    </span>
                    <div className="p-2 rounded-lg bg-white/5 text-[#4ADE80] group-hover:bg-[#16A34A]/20 transition-colors">
                      <IconComponent className="w-4 h-4" />
                    </div>
                  </div>
                  <h4 className="font-heading font-bold text-white text-sm mb-1.5">
                    {stepItem.title}
                  </h4>
                  <p className="text-[#94A3B8] text-xs font-body leading-relaxed">
                    {stepItem.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive FAQs & Connection Process Section */}
      <div className="bg-[#1E293B]/70 border border-white/10 rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[#4ADE80] uppercase tracking-wider mb-1 font-bold">
              <HelpCircle className="w-3.5 h-3.5" />
              API Knowledge Base
            </div>
            <h3 className="font-heading font-bold text-xl text-white">
              Frequently Asked Questions &amp; Connection Specs
            </h3>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-xs font-mono text-[#4ADE80] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Launch Connection Wizard</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {FAQ_LIST.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className="bg-[#0F172A] border border-white/10 rounded-xl overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full text-left p-4 flex items-center justify-between gap-4 cursor-pointer hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="bg-[#16A34A]/20 text-[#4ADE80] border border-[#16A34A]/30 text-[10px] font-mono px-2 py-0.5 rounded uppercase">
                      {faq.category}
                    </span>
                    <span className="font-heading font-semibold text-white text-sm">
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-[#4ADE80] transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs text-slate-300 font-body leading-relaxed border-t border-white/5 bg-[#0A0F1D]">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Connection Modal */}
      <InverterConnectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={(data) => {
          setConnectedPlantAlert(data);
        }}
      />
    </div>
  );
};

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Zap,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Lock,
  RefreshCw,
  Globe,
  Radio,
  FileCode,
  Check,
  Layers,
  Sparkles,
  HelpCircle
} from 'lucide-react';

interface InverterConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (inverterData: { brand: string; plantName: string; capacity: string }) => void;
}

interface InverterBrand {
  id: string;
  name: string;
  category: string;
  supportedModels: string;
  apiProtocol: string;
  badge?: string;
}

const BRANDS: InverterBrand[] = [
  { id: 'growatt', name: 'Growatt', category: 'ShineServer / OSS API', supportedModels: 'MAX, MAC, MIN, MOD Series', apiProtocol: 'REST & Webhook', badge: 'Direct API' },
  { id: 'huawei', name: 'Huawei FusionSolar', category: 'Northbound OpenAPI v6', supportedModels: 'SUN2000 2KTL - 330KTL', apiProtocol: 'HTTPS / OAuth 2.0', badge: 'Direct API' },
  { id: 'sungrow', name: 'Sungrow iSolarCloud', category: 'Open Cloud API', supportedModels: 'SG series (SG50 - SG350)', apiProtocol: 'REST / MQTT', badge: 'Enterprise' },
  { id: 'sma', name: 'SMA Sunny Portal', category: 'WebConnect API', supportedModels: 'Sunny Tripower Core1/Core2', apiProtocol: 'HTTPS REST', badge: 'Verified' },
  { id: 'solaredge', name: 'SolarEdge Cloud', category: 'Monitoring API v2', supportedModels: 'SE30K - SE120K Commercial', apiProtocol: 'REST API Key', badge: 'Verified' },
  { id: 'solis', name: 'Solis Cloud', category: 'Solis Enterprise API', supportedModels: 'S5 & S6 Commercial Inverters', apiProtocol: 'HMAC API Key', badge: 'Verified' },
  { id: 'modbus_generic', name: 'Modbus / TCP Gateway', category: 'Generic Gateway API', supportedModels: 'Standard Modbus RTU/TCP', apiProtocol: 'Verde Edge Proxy', badge: 'Universal' }
];

export const InverterConnectModal: React.FC<InverterConnectModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedBrand, setSelectedBrand] = useState<InverterBrand>(BRANDS[0]);
  
  // Form State
  const [plantName, setPlantName] = useState<string>('Penang Commercial Solar Park B');
  const [capacityMW, setCapacityMW] = useState<string>('12.5');
  const [apiKey, setApiKey] = useState<string>('vge_live_gw_8f910a3721994b');
  const [apiSecret, setApiSecret] = useState<string>('sec_99a184f8820c4e12');
  const [stationCode, setStationCode] = useState<string>('STN-MY-PEN-09');
  const [region, setRegion] = useState<string>('apac-southeast');

  // Connection Testing State
  const [testProgress, setTestProgress] = useState<number>(0);
  const [testStepMessage, setTestStepMessage] = useState<string>('Initializing TLS 1.3 Secure Handshake...');
  const [testLogs, setTestLogs] = useState<string[]>([]);
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [connectionSuccess, setConnectionSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleStartConnectionTest = () => {
    setStep(3);
    setIsTesting(true);
    setTestProgress(10);
    setTestLogs([`[00:01] Connecting to ${selectedBrand.name} Northbound OpenAPI...`]);

    // Simulated step-by-step API verification progress
    setTimeout(() => {
      setTestProgress(35);
      setTestStepMessage('Verifying HMAC-SHA256 Secret & API Credentials...');
      setTestLogs((prev) => [...prev, `[00:02] HMAC authentication successful (200 OK)`]);
    }, 1200);

    setTimeout(() => {
      setTestProgress(65);
      setTestStepMessage(`Ingesting Telemetry Data for ${plantName}...`);
      setTestLogs((prev) => [
        ...prev,
        `[00:03] Active Power read: ${capacityMW} MWp nominal (98.4% efficiency)`,
        `[00:04] 60-second SCADA stream channel initialized`
      ]);
    }, 2600);

    setTimeout(() => {
      setTestProgress(90);
      setTestStepMessage('Pairing Polygon I-REC Smart Contract...');
      setTestLogs((prev) => [
        ...prev,
        `[00:05] Verde Certificate Contract (0x8F32...91A) synced`,
        `[00:06] dMRV baseline checks passed: 0 double-counting flags`
      ]);
    }, 3800);

    setTimeout(() => {
      setTestProgress(100);
      setIsTesting(false);
      setConnectionSuccess(true);
      setStep(4);
      setTestLogs((prev) => [...prev, `[00:07] SUCCESS: 100% Connected. Ready for live minting!`]);
      if (onSuccess) {
        onSuccess({ brand: selectedBrand.name, plantName, capacity: capacityMW });
      }
    }, 4800);
  };

  const handleReset = () => {
    setStep(1);
    setTestProgress(0);
    setTestLogs([]);
    setConnectionSuccess(false);
    setIsTesting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto font-body">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="bg-[#0F172A] border border-[#16A34A]/50 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden relative my-8"
      >
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-[#1E293B] to-[#0F172A] p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#16A34A]/20 border border-[#16A34A]/40 text-[#4ADE80]">
              <Zap className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-bold text-lg sm:text-xl text-white">
                  Connect Solar Inverters via API
                </h3>
                <span className="bg-[#16A34A]/20 text-[#4ADE80] border border-[#16A34A]/40 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase">
                  60s Setup
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Zero-Hardware Integration • Direct Cloud-to-Cloud SCADA Pairing
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              handleReset();
              onClose();
            }}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Progress Steps Indicator */}
        <div className="bg-[#1E293B]/60 px-6 py-3 border-b border-white/5 flex items-center justify-between font-mono text-xs text-slate-400">
          <div className={`flex items-center gap-2 ${step === 1 ? 'text-[#4ADE80] font-bold' : step > 1 ? 'text-white' : ''}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step >= 1 ? 'bg-[#16A34A] text-white' : 'bg-slate-800'}`}>1</span>
            <span>Select Brand</span>
          </div>
          <div className="h-[1px] w-8 bg-white/10" />
          <div className={`flex items-center gap-2 ${step === 2 ? 'text-[#4ADE80] font-bold' : step > 2 ? 'text-white' : ''}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step >= 2 ? 'bg-[#16A34A] text-white' : 'bg-slate-800'}`}>2</span>
            <span>API Credentials</span>
          </div>
          <div className="h-[1px] w-8 bg-white/10" />
          <div className={`flex items-center gap-2 ${step === 3 ? 'text-[#4ADE80] font-bold' : step > 3 ? 'text-white' : ''}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step >= 3 ? 'bg-[#16A34A] text-white' : 'bg-slate-800'}`}>3</span>
            <span>Test Pairing</span>
          </div>
          <div className="h-[1px] w-8 bg-white/10" />
          <div className={`flex items-center gap-2 ${step === 4 ? 'text-[#4ADE80] font-bold' : ''}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step === 4 ? 'bg-[#16A34A] text-white' : 'bg-slate-800'}`}>4</span>
            <span>Active Sync</span>
          </div>
        </div>

        {/* Modal Body Content */}
        <div className="p-6">
          
          {/* STEP 1: Select Inverter Brand */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="bg-[#16A34A]/10 border border-[#16A34A]/30 p-3.5 rounded-xl text-xs text-slate-300 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#4ADE80] shrink-0 mt-0.5" />
                <p>
                  <strong className="text-white">Zero Hardware Required:</strong> Select your solar inverter manufacturer to pair directly with their official OpenAPI cloud servers.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
                {BRANDS.map((brand) => {
                  const isSelected = selectedBrand.id === brand.id;
                  return (
                    <div
                      key={brand.id}
                      onClick={() => setSelectedBrand(brand)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-[#16A34A]/15 border-[#16A34A] shadow-md shadow-[#16A34A]/10'
                          : 'bg-[#1E293B]/70 border-white/10 hover:border-white/20 hover:bg-[#1E293B]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-heading font-bold text-white text-sm">
                          {brand.name}
                        </span>
                        {brand.badge && (
                          <span className="bg-slate-800 text-[#4ADE80] text-[10px] font-mono px-2 py-0.5 rounded border border-[#16A34A]/30">
                            {brand.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-mono text-[#94A3B8]">{brand.category}</p>
                      <p className="text-[11px] font-mono text-slate-500 mt-2">
                        Models: {brand.supportedModels}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 flex justify-end border-t border-white/10">
                <button
                  onClick={() => setStep(2)}
                  className="bg-[#16A34A] hover:bg-[#15803D] text-white font-heading font-bold text-xs px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <span>Continue with {selectedBrand.name}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Enter API Credentials */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-[#1E293B] p-3 rounded-xl border border-white/10 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-[#4ADE80]" />
                  <span className="text-white font-bold">{selectedBrand.name}</span>
                  <span className="text-slate-400">({selectedBrand.apiProtocol})</span>
                </div>
                <button
                  onClick={() => setStep(1)}
                  className="text-[#4ADE80] hover:underline text-[11px] cursor-pointer"
                >
                  Change Brand
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Solar Plant / Facility Name
                  </label>
                  <input
                    type="text"
                    value={plantName}
                    onChange={(e) => setPlantName(e.target.value)}
                    className="w-full bg-[#1E293B] border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#16A34A]"
                    placeholder="e.g. Penang Solar Park B"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Plant Nameplate Capacity (MWp)
                  </label>
                  <input
                    type="text"
                    value={capacityMW}
                    onChange={(e) => setCapacityMW(e.target.value)}
                    className="w-full bg-[#1E293B] border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#16A34A]"
                    placeholder="e.g. 15.0"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    OpenAPI Client Key / App ID
                  </label>
                  <input
                    type="text"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="w-full bg-[#1E293B] border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#16A34A]"
                    placeholder="vge_live_gw_xxxx"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    HMAC API Secret Key
                  </label>
                  <input
                    type="password"
                    value={apiSecret}
                    onChange={(e) => setApiSecret(e.target.value)}
                    className="w-full bg-[#1E293B] border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#16A34A]"
                    placeholder="••••••••••••••••"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Station Code / SCADA Inverter ID
                  </label>
                  <input
                    type="text"
                    value={stationCode}
                    onChange={(e) => setStationCode(e.target.value)}
                    className="w-full bg-[#1E293B] border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#16A34A]"
                    placeholder="STN-MY-PEN-09"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Telemetry Gateway Region
                  </label>
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full bg-[#1E293B] border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#16A34A]"
                  >
                    <option value="apac-southeast">APAC - Singapore / Malaysia</option>
                    <option value="eu-tallinn">EU - Tallinn Node (CSRD Compliant)</option>
                    <option value="east-asia">East Asia - Tokyo / Kansai</option>
                  </select>
                </div>
              </div>

              <div className="bg-[#1E293B] p-3 rounded-xl border border-white/5 flex items-center justify-between text-xs font-mono text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#4ADE80]" />
                  TLS 1.3 Encrypted Read-Only SCADA Credentials
                </span>
                <span className="text-[#4ADE80] font-bold">Zero Inverter Downtime</span>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-white/10">
                <button
                  onClick={() => setStep(1)}
                  className="text-slate-400 hover:text-white text-xs font-mono cursor-pointer"
                >
                  Back
                </button>
                <button
                  onClick={handleStartConnectionTest}
                  className="bg-[#16A34A] hover:bg-[#15803D] text-white font-heading font-bold text-xs px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <span>Test API Connection</span>
                  <Radio className="w-4 h-4 animate-pulse" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Automated Connection Test Progress */}
          {step === 3 && (
            <div className="space-y-5 py-2">
              <div className="text-center space-y-2">
                <div className="inline-flex p-3 rounded-full bg-[#16A34A]/20 border border-[#16A34A]/40 text-[#4ADE80] mb-1">
                  <RefreshCw className="w-6 h-6 animate-spin" />
                </div>
                <h4 className="font-heading font-bold text-lg text-white">
                  Pinging {selectedBrand.name} OpenAPI Server...
                </h4>
                <p className="text-xs text-[#4ADE80] font-mono">{testStepMessage}</p>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden p-0.5 border border-white/10">
                <div
                  className="bg-gradient-to-r from-[#16A34A] to-[#4ADE80] h-full rounded-full transition-all duration-500"
                  style={{ width: `${testProgress}%` }}
                />
              </div>

              {/* Live Terminal Logs */}
              <div className="bg-[#050B14] border border-white/10 rounded-xl p-4 font-mono text-xs max-h-48 overflow-y-auto space-y-1">
                <div className="text-slate-500 border-b border-white/10 pb-1 flex justify-between">
                  <span>SCADA TELEMETRY INGRESS LOGS</span>
                  <span>STATUS: {testProgress}%</span>
                </div>
                {testLogs.map((log, index) => (
                  <div key={index} className="text-[#4ADE80] flex items-center gap-2">
                    <span className="text-slate-500">&gt;</span>
                    <span>{log}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: Success & Connection Established */}
          {step === 4 && (
            <div className="space-y-5 py-2">
              <div className="text-center space-y-2">
                <div className="inline-flex p-3.5 rounded-full bg-[#16A34A]/20 border border-[#16A34A]/50 text-[#4ADE80] mb-1 shadow-lg shadow-[#16A34A]/20">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-heading font-bold text-xl text-white">
                  Inverter API Connected Successfully!
                </h4>
                <p className="text-xs text-slate-300 font-mono">
                  {plantName} ({capacityMW} MWp) is now streaming 60-second telemetry to Verde Grid OS.
                </p>
              </div>

              {/* Active Connection Metrics Box */}
              <div className="bg-[#1E293B] border border-[#16A34A]/40 rounded-xl p-4 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="text-slate-400">Manufacturer:</span>
                  <span className="text-white font-bold">{selectedBrand.name}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="text-slate-400">Station Code:</span>
                  <span className="text-[#4ADE80]">{stationCode}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="text-slate-400">Telemetry Cycle:</span>
                  <span className="text-white">60-Second Real-Time Poll</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">I-REC Contract Pairing:</span>
                  <span className="text-[#4ADE80] font-bold">Polygon EVM Enabled (0x8F32...)</span>
                </div>
              </div>

              <div className="bg-[#16A34A]/10 border border-[#16A34A]/30 p-3.5 rounded-xl text-xs font-mono text-[#4ADE80] flex items-center gap-2">
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>Zero hardware needed. Your I-REC carbon credits will automatically mint as generation telemetry arrives.</span>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => {
                    handleReset();
                    onClose();
                  }}
                  className="w-full sm:w-auto bg-[#16A34A] hover:bg-[#15803D] text-white font-heading font-bold text-xs px-6 py-3 rounded-xl transition-all cursor-pointer shadow-lg shadow-[#16A34A]/20"
                >
                  Done &amp; Return to Telemetry Portal
                </button>
              </div>
            </div>
          )}

        </div>
      </motion.div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend 
} from 'recharts';
import { 
  Sun, Activity, Cpu, DollarSign, Leaf, RefreshCw, AlertTriangle, ShieldCheck, Zap, Download, Radio, Filter, Building2, SlidersHorizontal, CheckCircle2, ArrowRight
} from 'lucide-react';
import { INITIAL_PLANTS, HOURLY_GENERATION_DATA, SAMPLE_INVERTERS, ACTIVE_PPA_CONTRACTS } from '../data/mockData';
import { SolarPlant, InverterTelemetry } from '../types';
import { VerdeGridLogo } from './VerdeGridLogo';

interface ClientPortalProps {
  onExitPortal: () => void;
}

export const ClientPortal: React.FC<ClientPortalProps> = ({ onExitPortal }) => {
  const [selectedPlantId, setSelectedPlantId] = useState<string>('vge-est-01');
  const [activeTab, setActiveTab] = useState<'overview' | 'inverters' | 'ppa' | 'events'>('overview');
  const [inverterFilter, setInverterFilter] = useState<'all' | 'normal' | 'overheat' | 'offline'>('all');
  const [liveGeneration, setLiveGeneration] = useState<number>(36.2);
  const [lastUpdatedSecs, setLastUpdatedSecs] = useState<number>(0);
  const [isSimulatingStream, setIsSimulatingStream] = useState<boolean>(true);

  const currentPlant = INITIAL_PLANTS.find(p => p.id === selectedPlantId) || INITIAL_PLANTS[0];

  // Live simulation tick
  useEffect(() => {
    let interval: any;
    if (isSimulatingStream) {
      interval = setInterval(() => {
        setLastUpdatedSecs(prev => (prev > 10 ? 0 : prev + 1));
        // Subtle fluctuation in power output
        const delta = (Math.random() - 0.48) * 0.4;
        setLiveGeneration(prev => Math.max(0, Math.min(currentPlant.capacityMWp, +(prev + delta).toFixed(2))));
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isSimulatingStream, currentPlant.capacityMWp]);

  const filteredInverters = SAMPLE_INVERTERS.filter(inv => {
    if (inverterFilter === 'all') return true;
    return inv.status === inverterFilter;
  });

  return (
    <div className="min-h-screen bg-[#0F172A] text-white pt-8 pb-16 px-4 sm:px-6 lg:px-8 font-body">
      
      {/* Top Portal Banner */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-[#1E293B] border border-[#16A34A]/40 rounded-2xl p-6 mb-8 shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          <div className="flex items-center gap-4">
            <VerdeGridLogo size="lg" showTagline={true} darkBg={true} />
            <div className="hidden sm:block h-10 w-[1px] bg-white/10 mx-2" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-heading font-bold text-xl sm:text-2xl text-white">
                  Client Telemetry Portal
                </h1>
                <span className="bg-[#16A34A]/20 text-[#4ADE80] border border-[#16A34A]/40 text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#4ADE80] animate-pulse" />
                  LIVE SCADA SYNC
                </span>
              </div>
              <p className="text-[#94A3B8] text-xs font-mono mt-1">
                Verde Grid Energy Operating System • Node: Tallinn EU / APAC Gateway • Asian Solar Assets
              </p>
            </div>
          </div>

          {/* Plant Selector Dropdown */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 bg-[#0F172A] p-1.5 rounded-xl border border-white/10">
              <Building2 className="w-4 h-4 text-[#4ADE80] ml-2" />
              <select
                value={selectedPlantId}
                onChange={(e) => {
                  setSelectedPlantId(e.target.value);
                  const p = INITIAL_PLANTS.find(x => x.id === e.target.value);
                  if (p) setLiveGeneration(p.currentPowerMW);
                }}
                className="bg-transparent text-white text-xs font-mono font-bold p-2 focus:outline-none cursor-pointer"
              >
                {INITIAL_PLANTS.map(plant => (
                  <option key={plant.id} value={plant.id} className="bg-[#0F172A] text-white">
                    {plant.name} ({plant.country}) — {plant.capacityMWp} MWp
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={onExitPortal}
              className="bg-[#0F172A] hover:bg-[#334155] text-[#94A3B8] hover:text-white px-4 py-2.5 rounded-xl border border-white/10 text-xs font-mono font-semibold transition-all cursor-pointer"
            >
              Exit Demo
            </button>
          </div>

        </div>

        {/* Zero-Hardware Integration Highlight Banner */}
        <div className="bg-gradient-to-r from-[#1E293B] via-[#0F172A] to-[#162132] border border-[#16A34A]/50 rounded-2xl p-6 mb-8 shadow-xl relative overflow-hidden backdrop-blur-md group">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#16A34A]/10 rounded-full blur-3xl pointer-events-none group-hover:bg-[#16A34A]/15 transition-all" />
          
          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-4xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#16A34A]/15 border border-[#16A34A]/30 text-[#4ADE80] text-xs font-mono font-bold uppercase tracking-wider">
                <Zap className="w-3.5 h-3.5 text-[#4ADE80] animate-pulse" />
                Zero-Hardware Integration
              </div>
              
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                Zero-Hardware Integration
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-body">
                “Connect your existing solar portfolio in 60 seconds. Our API integrates directly with major inverters (Growatt, Huawei) to instantly begin minting I-REC carbon credits without deploying physical hardware or disrupting your current operations.”
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-mono text-slate-400">
                <span className="flex items-center gap-1.5 bg-slate-900/60 px-2.5 py-1 rounded-md border border-white/5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#4ADE80]" />
                  Growatt & Huawei Direct API
                </span>
                <span className="flex items-center gap-1.5 bg-slate-900/60 px-2.5 py-1 rounded-md border border-white/5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#4ADE80]" />
                  Instant I-REC Carbon Minting
                </span>
                <span className="flex items-center gap-1.5 bg-slate-900/60 px-2.5 py-1 rounded-md border border-white/5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#4ADE80]" />
                  60-Second Onboarding
                </span>
              </div>
            </div>

            <div className="shrink-0 w-full lg:w-auto">
              <button 
                onClick={() => {
                  const el = document.getElementById('api-playground');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full lg:w-auto bg-[#16A34A] hover:bg-[#15803D] text-white font-heading font-bold text-xs px-5 py-3 rounded-xl transition-all shadow-lg shadow-[#16A34A]/20 flex items-center justify-center gap-2 group cursor-pointer"
              >
                Connect Inverters via API
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>

        {/* Real-time KPI Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          
          <div className="bg-[#1E293B] p-5 rounded-xl border border-white/5">
            <div className="text-xs text-[#94A3B8] font-mono flex items-center justify-between mb-1">
              <span>ACTIVE GENERATION</span>
              <Sun className="w-4 h-4 text-[#4ADE80]" />
            </div>
            <div className="font-heading text-3xl font-bold text-white flex items-baseline gap-2">
              {liveGeneration.toFixed(1)} <span className="text-sm font-mono text-[#4ADE80]">MW</span>
            </div>
            <div className="text-[11px] text-[#94A3B8] font-mono mt-1">
              Capacity: {currentPlant.capacityMWp} MWp ({(liveGeneration / currentPlant.capacityMWp * 100).toFixed(0)}%)
            </div>
          </div>

          <div className="bg-[#1E293B] p-5 rounded-xl border border-white/5">
            <div className="text-xs text-[#94A3B8] font-mono flex items-center justify-between mb-1">
              <span>PERFORMANCE RATIO (PR)</span>
              <Zap className="w-4 h-4 text-[#4ADE80]" />
            </div>
            <div className="font-heading text-3xl font-bold text-[#4ADE80]">
              {currentPlant.performanceRatio}%
            </div>
            <div className="text-[11px] text-[#94A3B8] font-mono mt-1">
              Benchmark Target: 82.0% (+4.2%)
            </div>
          </div>

          <div className="bg-[#1E293B] p-5 rounded-xl border border-white/5">
            <div className="text-xs text-[#94A3B8] font-mono flex items-center justify-between mb-1">
              <span>DAILY YIELD</span>
              <Activity className="w-4 h-4 text-[#4ADE80]" />
            </div>
            <div className="font-heading text-3xl font-bold text-white">
              {currentPlant.dailyYieldMWh} <span className="text-sm font-mono text-[#4ADE80]">MWh</span>
            </div>
            <div className="text-[11px] text-[#94A3B8] font-mono mt-1">
              Revenue Today: €{Math.round(currentPlant.dailyYieldMWh * currentPlant.ppaRateEURMWh).toLocaleString()}
            </div>
          </div>

          <div className="bg-[#1E293B] p-5 rounded-xl border border-white/5">
            <div className="text-xs text-[#94A3B8] font-mono flex items-center justify-between mb-1">
              <span>AVOIDED CO₂ TODAY</span>
              <Leaf className="w-4 h-4 text-[#4ADE80]" />
            </div>
            <div className="font-heading text-3xl font-bold text-[#4ADE80]">
              {currentPlant.co2SavedTodayTonnes} <span className="text-sm font-mono text-white">t</span>
            </div>
            <div className="text-[11px] text-[#94A3B8] font-mono mt-1">
              CSRD Hash: Certified Valid
            </div>
          </div>

        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-[#1E293B] pb-4 mb-8 overflow-x-auto">
          {[
            { id: 'overview', label: 'Generation & Solar Curve', icon: Sun },
            { id: 'inverters', label: `IoT Inverters (${SAMPLE_INVERTERS.length})`, icon: Cpu },
            { id: 'ppa', label: 'B2B PPA & Settlement', icon: DollarSign },
            { id: 'events', label: 'Real-time MQTT Stream', icon: Radio },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-5 py-2.5 rounded-xl font-heading text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                  isActive 
                    ? 'bg-[#16A34A] text-white shadow-lg shadow-[#16A34A]/20' 
                    : 'bg-[#1E293B] text-[#94A3B8] hover:text-white border border-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW & RECHARTS GRAPH */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="bg-[#1E293B] p-6 rounded-2xl border border-white/10 shadow-2xl">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 mb-6 gap-4">
                <div>
                  <h3 className="font-heading text-xl font-bold text-white flex items-center gap-2">
                    <Sun className="w-5 h-5 text-[#4ADE80]" />
                    24-Hour Solar Telemetry & Irradiance Curve
                  </h3>
                  <p className="text-xs text-[#94A3B8] font-mono mt-0.5">
                    {currentPlant.name} • Location: {currentPlant.location}
                  </p>
                </div>

                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className="flex items-center gap-1 text-[#4ADE80]">
                    <span className="w-3 h-3 rounded-full bg-[#4ADE80] inline-block" /> Solar MW
                  </span>
                  <span className="flex items-center gap-1 text-slate-400">
                    <span className="w-3 h-3 rounded-full bg-slate-400 inline-block" /> Irradiance W/m²
                  </span>
                </div>
              </div>

              {/* Chart */}
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={HOURLY_GENERATION_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="solarColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4ADE80" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#16A34A" stopOpacity={0.0}/>
                      </linearGradient>
                      <linearGradient id="irradianceColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#94A3B8" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#94A3B8" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                    <XAxis dataKey="time" stroke="#94A3B8" tick={{ fontSize: 12, fill: '#94A3B8' }} />
                    <YAxis stroke="#94A3B8" tick={{ fontSize: 12, fill: '#94A3B8' }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0F172A', borderColor: '#16A34A', borderRadius: '12px', color: '#fff' }}
                      itemStyle={{ color: '#4ADE80' }}
                    />
                    <Area type="monotone" dataKey="generationMW" name="Generation (MW)" stroke="#4ADE80" strokeWidth={3} fillOpacity={1} fill="url(#solarColor)" />
                    <Area type="monotone" dataKey="irradianceWm2" name="Irradiance (W/m²)" stroke="#94A3B8" strokeWidth={1.5} fillOpacity={0.2} fill="url(#irradianceColor)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

            </div>

            {/* Sub-grid with Offtaker & Health status */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              <div className="bg-[#1E293B] p-6 rounded-2xl border border-white/10">
                <h4 className="font-heading text-lg font-bold text-white mb-4 flex items-center justify-between">
                  <span>PPA Off-taker Summary</span>
                  <span className="text-xs font-mono px-2.5 py-1 rounded bg-[#16A34A]/20 text-[#4ADE80]">Active Contract</span>
                </h4>
                
                <div className="space-y-3 font-mono text-xs">
                  <div className="flex justify-between p-3 rounded-lg bg-[#0F172A]">
                    <span className="text-[#94A3B8]">Offtaker Enterprise:</span>
                    <strong className="text-white">{currentPlant.ppaOfftaker}</strong>
                  </div>
                  <div className="flex justify-between p-3 rounded-lg bg-[#0F172A]">
                    <span className="text-[#94A3B8]">Fixed Tariff Rate:</span>
                    <strong className="text-[#4ADE80]">€{currentPlant.ppaRateEURMWh} / MWh</strong>
                  </div>
                  <div className="flex justify-between p-3 rounded-lg bg-[#0F172A]">
                    <span className="text-[#94A3B8]">Total Facility Inverters:</span>
                    <strong className="text-white">{currentPlant.invertersCount} Smart Units</strong>
                  </div>
                </div>
              </div>

              <div className="bg-[#1E293B] p-6 rounded-2xl border border-white/10">
                <h4 className="font-heading text-lg font-bold text-white mb-4 flex items-center justify-between">
                  <span>Hardware Health Diagnostic</span>
                  <span className="text-xs font-mono text-[#4ADE80] flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4" /> 99.8% Nominal
                  </span>
                </h4>

                <div className="space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-[#0F172A]">
                    <span className="text-[#94A3B8]">Grid Sync Frequency:</span>
                    <strong className="text-white">50.02 Hz (Stable)</strong>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-[#0F172A]">
                    <span className="text-[#94A3B8]">Avg Inverter Temperature:</span>
                    <strong className="text-white">43.8 °C</strong>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-[#0F172A]">
                    <span className="text-[#94A3B8]">Anomalies Detected:</span>
                    <strong className="text-yellow-400">1 Warning (INV-TAL-003)</strong>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: INVERTER TELEMETRY MATRIX */}
        {activeTab === 'inverters' && (
          <div className="space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1E293B] p-4 rounded-xl border border-white/10">
              <div className="flex items-center gap-2 text-xs font-mono text-[#94A3B8]">
                <Filter className="w-4 h-4 text-[#4ADE80]" />
                Filter Hardware Status:
              </div>

              <div className="flex items-center gap-2">
                {[
                  { id: 'all', label: 'All Inverters' },
                  { id: 'normal', label: 'Optimal' },
                  { id: 'overheat', label: 'Overheat Warning' },
                  { id: 'offline', label: 'Offline' },
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setInverterFilter(f.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                      inverterFilter === f.id
                        ? 'bg-[#16A34A] text-white'
                        : 'bg-[#0F172A] text-[#94A3B8] hover:text-white'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredInverters.map(inv => (
                <div
                  key={inv.id}
                  className={`bg-[#1E293B] p-6 rounded-2xl border transition-all ${
                    inv.status === 'normal'
                      ? 'border-white/10 hover:border-[#4ADE80]/50'
                      : inv.status === 'overheat'
                      ? 'border-yellow-500/50 bg-yellow-950/10'
                      : 'border-red-500/50 bg-red-950/10'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                    <div>
                      <div className="font-heading font-bold text-white text-base">{inv.id}</div>
                      <div className="text-[10px] font-mono text-[#94A3B8]">{inv.brand}</div>
                    </div>
                    <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full uppercase ${
                      inv.status === 'normal'
                        ? 'bg-[#16A34A]/20 text-[#4ADE80] border border-[#16A34A]/40'
                        : inv.status === 'overheat'
                        ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40'
                        : 'bg-red-500/20 text-red-400 border border-red-500/40'
                    }`}>
                      {inv.status}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex justify-between text-[#94A3B8]">
                      <span>Model:</span>
                      <span className="text-white font-bold">{inv.model}</span>
                    </div>
                    <div className="flex justify-between text-[#94A3B8]">
                      <span>AC Output:</span>
                      <span className="text-[#4ADE80] font-bold">{inv.acPowerKW} kW / {inv.capacityKW} kW</span>
                    </div>
                    <div className="flex justify-between text-[#94A3B8]">
                      <span>DC String Voltage:</span>
                      <span className="text-white font-bold">{inv.dcVoltageV} V</span>
                    </div>
                    <div className="flex justify-between text-[#94A3B8]">
                      <span>Efficiency Rate:</span>
                      <span className="text-white font-bold">{inv.efficiencyPercent}%</span>
                    </div>
                    <div className="flex justify-between text-[#94A3B8]">
                      <span>Temp / Thermal:</span>
                      <span className={inv.temperatureC > 50 ? 'text-yellow-400 font-bold' : 'text-white'}>
                        {inv.temperatureC} °C
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/10 text-[10px] text-[#94A3B8] font-mono flex items-center justify-between">
                    <span>Ping: {inv.lastPingSecsAgo}s ago</span>
                    <button className="text-[#4ADE80] hover:underline cursor-pointer">View Telemetry Log</button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* TAB 3: B2B PPA & SETTLEMENT */}
        {activeTab === 'ppa' && (
          <div className="space-y-6">
            <div className="bg-[#1E293B] p-6 rounded-2xl border border-white/10">
              <h3 className="font-heading text-xl font-bold text-white mb-4">
                Active Corporate Power Purchase Agreements (PPAs)
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead className="bg-[#0F172A] text-[#94A3B8] uppercase">
                    <tr>
                      <th className="p-4">Contract ID</th>
                      <th className="p-4">Offtaker</th>
                      <th className="p-4">Facility Name</th>
                      <th className="p-4">Capacity</th>
                      <th className="p-4">Tariff (€/MWh)</th>
                      <th className="p-4">Est. Monthly Revenue</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-white">
                    {ACTIVE_PPA_CONTRACTS.map(ppa => (
                      <tr key={ppa.id} className="hover:bg-[#0F172A]/50">
                        <td className="p-4 font-bold text-[#4ADE80]">{ppa.id}</td>
                        <td className="p-4">{ppa.offtaker}</td>
                        <td className="p-4">{ppa.plantName}</td>
                        <td className="p-4">{ppa.capacityMW} MW</td>
                        <td className="p-4 font-bold">€{ppa.tariffEURMWh}</td>
                        <td className="p-4 font-bold text-[#4ADE80]">€{ppa.monthlyRevenueEst.toLocaleString()}</td>
                        <td className="p-4">
                          <span className="px-2.5 py-1 rounded bg-[#16A34A]/20 text-[#4ADE80] border border-[#16A34A]/30">
                            {ppa.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: MQTT STREAM */}
        {activeTab === 'events' && (
          <div className="bg-[#0B1120] p-6 rounded-2xl border border-white/10 font-mono text-xs">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <span className="text-[#4ADE80] font-bold flex items-center gap-2">
                <Radio className="w-4 h-4 animate-pulse" />
                Live Ingress MQTT Telemetry Stream (Tallinn Cloud)
              </span>
              <span className="text-[#94A3B8]">Topic: vge/ee/tallinn/+/inverters</span>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {[
                `[2026-07-22 13:05:01 UTC] [INV-TAL-001] AC_POWER: 312.4 kW | DC_VOLT: 1080.2V | EFF: 98.8% | STATUS: OPTIMAL`,
                `[2026-07-22 13:05:01 UTC] [INV-TAL-002] AC_POWER: 310.1 kW | DC_VOLT: 1075.0V | EFF: 98.7% | STATUS: OPTIMAL`,
                `[2026-07-22 13:05:00 UTC] [INV-TAL-003] WARNING: Temp 58.4C exceeding threshold (55.0C). Thermal throttling initiated.`,
                `[2026-07-22 13:04:58 UTC] [INV-TAL-004] AC_POWER: 338.0 kW | DC_VOLT: 1120.0V | EFF: 99.0% | STATUS: OPTIMAL`,
                `[2026-07-22 13:04:55 UTC] [SCADA-SYNC] Tallinn Park I daily generation passed 218.4 MWh mark.`,
                `[2026-07-22 13:04:50 UTC] [CSRD-HASH] Verified block hash 0x8f7a90b1c2d3e4f5 for 152.8t CO2 offset today.`
              ].map((log, i) => (
                <div key={i} className="p-2.5 rounded bg-[#0F172A] border border-white/5 text-[#4ADE80]">
                  {log}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
};

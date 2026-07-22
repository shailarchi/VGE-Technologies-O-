import React, { useState } from 'react';
import { Calculator, Sun, DollarSign, Leaf, Zap, RefreshCw, ChevronRight } from 'lucide-react';

export const YieldCalculator: React.FC = () => {
  const [capacityMW, setCapacityMW] = useState<number>(25);
  const [region, setRegion] = useState<'nordics' | 'cee' | 'south'>('nordics');
  const [ppaRate, setPpaRate] = useState<number>(75);
  const [hasBess, setHasBess] = useState<boolean>(true);

  // Region yield multipliers (kWh / kWp / year)
  const yieldMultipliers = {
    nordics: 1080, // Estonia, Sweden, Finland
    cee: 1280,     // Germany, Poland
    south: 1720,   // Spain, Italy
  };

  const selectedMultiplier = yieldMultipliers[region];
  const bessBoost = hasBess ? 1.14 : 1.0; // 14% revenue boost from peak shaving & arbitrage

  const annualYieldMWh = Math.round(capacityMW * 1000 * (selectedMultiplier / 1000));
  const annualRevenueEUR = Math.round(annualYieldMWh * ppaRate * bessBoost);
  const annualCo2AvoidedTonnes = Math.round(annualYieldMWh * 0.72); // ~0.72t CO2 per MWh
  const homesPowered = Math.round(annualYieldMWh / 3.8); // avg EU home 3.8 MWh/yr

  return (
    <section id="calculator" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0F172A] border-t border-[#1E293B]">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="text-[#4ADE80] font-mono text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              Interactive Yield Engine
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Solar Portfolio Revenue & Carbon Modeling
            </h2>
          </div>
          <p className="text-[#94A3B8] text-sm max-w-md mt-4 md:mt-0">
            Simulate commercial asset yield returns, corporate PPA revenue streams, and carbon offset projections powered by VGE's regional irradiance database.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls Column */}
          <div className="lg:col-span-6 bg-[#1E293B] p-8 rounded-2xl border border-white/10 space-y-6">
            <h3 className="font-heading text-xl font-bold text-white flex items-center gap-2 pb-4 border-b border-white/10">
              <Sun className="w-5 h-5 text-[#4ADE80]" />
              Asset Parameters
            </h3>

            {/* Capacity Slider */}
            <div>
              <div className="flex justify-between text-sm font-medium mb-2">
                <span className="text-[#94A3B8]">Asset Nameplate Capacity (MWp)</span>
                <span className="text-[#4ADE80] font-mono font-bold text-lg">{capacityMW} MWp</span>
              </div>
              <input
                type="range"
                min="1"
                max="250"
                step="1"
                value={capacityMW}
                onChange={(e) => setCapacityMW(Number(e.target.value))}
                className="w-full accent-[#16A34A] bg-[#0F172A] rounded-lg h-2 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-[#94A3B8] font-mono mt-1">
                <span>1 MWp (C&I Rooftop)</span>
                <span>100 MWp</span>
                <span>250 MWp (Utility Park)</span>
              </div>
            </div>

            {/* Location Selector */}
            <div>
              <label className="block text-sm font-medium text-[#94A3B8] mb-2">
                Irradiance Region / Climate Zone
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'nordics', label: 'Estonia / Nordics', rate: '1,080 kWh/kWp' },
                  { id: 'cee', label: 'Germany / CEE', rate: '1,280 kWh/kWp' },
                  { id: 'south', label: 'Spain / S. Europe', rate: '1,720 kWh/kWp' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setRegion(item.id as any)}
                    className={`p-3 rounded-xl border text-left transition-all text-xs font-medium cursor-pointer ${
                      region === item.id
                        ? 'bg-[#16A34A] text-white border-[#4ADE80]'
                        : 'bg-[#0F172A] text-[#94A3B8] border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="font-bold text-white mb-0.5">{item.label}</div>
                    <div className="text-[10px] opacity-80 font-mono">{item.rate}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* PPA Tariff Rate */}
            <div>
              <div className="flex justify-between text-sm font-medium mb-2">
                <span className="text-[#94A3B8]">PPA Offtake Rate (€ / MWh)</span>
                <span className="text-[#4ADE80] font-mono font-bold text-lg">€{ppaRate} / MWh</span>
              </div>
              <input
                type="range"
                min="40"
                max="160"
                step="1"
                value={ppaRate}
                onChange={(e) => setPpaRate(Number(e.target.value))}
                className="w-full accent-[#16A34A] bg-[#0F172A] rounded-lg h-2 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-[#94A3B8] font-mono mt-1">
                <span>€40 (Merchant Base)</span>
                <span>€100 (Corporate PPA)</span>
                <span>€160 (High Demand)</span>
              </div>
            </div>

            {/* BESS Toggle */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-[#0F172A] border border-white/5">
              <div className="flex items-center gap-3">
                <Zap className={`w-5 h-5 ${hasBess ? 'text-[#4ADE80]' : 'text-[#94A3B8]'}`} />
                <div>
                  <div className="text-sm font-medium text-white">Integrate BESS Battery Storage</div>
                  <div className="text-xs text-[#94A3B8]">Adds +14% revenue via peak arbitrage</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setHasBess(!hasBess)}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                  hasBess ? 'bg-[#16A34A]' : 'bg-[#334155]'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    hasBess ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

          </div>

          {/* Results Output Column */}
          <div className="lg:col-span-6 bg-gradient-to-br from-[#1E293B] to-[#0F172A] p-8 rounded-2xl border border-[#16A34A]/50 shadow-2xl relative overflow-hidden flex flex-col justify-between h-full">
            
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <span className="text-xs font-mono text-[#4ADE80] uppercase tracking-wider">
                  VGE Model Simulation Output
                </span>
                <span className="text-xs font-mono text-[#94A3B8]">
                  Currency: EUR (€)
                </span>
              </div>

              {/* Annual Revenue Big Number */}
              <div className="bg-[#0F172A]/80 p-6 rounded-2xl border border-white/10">
                <div className="text-xs text-[#94A3B8] uppercase font-mono tracking-wider mb-1 flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-[#4ADE80]" />
                  Projected Annual PPA Revenue
                </div>
                <div className="font-heading text-4xl sm:text-5xl font-extrabold text-[#4ADE80]">
                  €{annualRevenueEUR.toLocaleString()}
                </div>
                <div className="text-xs text-[#94A3B8] font-mono mt-2">
                  Monthly average: €{Math.round(annualRevenueEUR / 12).toLocaleString()} / mo
                </div>
              </div>

              {/* Grid Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#0F172A]/60 p-4 rounded-xl border border-white/5">
                  <div className="text-xs text-[#94A3B8] font-mono mb-1">Annual Energy Yield</div>
                  <div className="font-heading text-2xl font-bold text-white">
                    {annualYieldMWh.toLocaleString()} <span className="text-xs text-[#4ADE80]">MWh</span>
                  </div>
                </div>

                <div className="bg-[#0F172A]/60 p-4 rounded-xl border border-white/5">
                  <div className="text-xs text-[#94A3B8] font-mono mb-1 flex items-center gap-1">
                    <Leaf className="w-3.5 h-3.5 text-[#4ADE80]" />
                    Avoided CO₂ Emissions
                  </div>
                  <div className="font-heading text-2xl font-bold text-[#4ADE80]">
                    {annualCo2AvoidedTonnes.toLocaleString()} <span className="text-xs text-white">Tonnes</span>
                  </div>
                </div>
              </div>

              {/* Equivalency note */}
              <div className="p-4 rounded-xl bg-[#16A34A]/10 border border-[#16A34A]/30 text-xs text-[#94A3B8] font-mono leading-relaxed">
                ⚡ This asset footprint provides clean electricity equivalent to powering <strong className="text-white font-bold">{homesPowered.toLocaleString()} European households</strong> annually under EU ETS carbon standards.
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between text-xs text-[#94A3B8] font-mono">
              <span>* Projections based on VGE Estonia cloud telemetry models.</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

import React, { useState } from 'react';
import { Calculator, Sun, DollarSign, Leaf, Zap, RefreshCw, ChevronRight, TrendingUp, Table, ArrowUpRight, ShieldCheck, IndianRupee } from 'lucide-react';

export const YieldCalculator: React.FC = () => {
  const [capacityMW, setCapacityMW] = useState<number>(45);
  const [region, setRegion] = useState<'asia_ci' | 'japan_east' | 'nordics' | 'south'>('asia_ci');
  const [ppaRate, setPpaRate] = useState<number>(78);
  const [hasBess, setHasBess] = useState<boolean>(true);
  const [currency, setCurrency] = useState<'INR' | 'USD'>('USD');
  const [showRoiTable, setShowRoiTable] = useState<boolean>(true);

  // Region yield multipliers (kWh / kWp / year)
  const yieldMultipliers = {
    asia_ci: 1540,    // Vietnam, Thailand, Malaysia, India C&I
    japan_east: 1380, // Japan C&I & East Asia
    nordics: 1080,    // Estonia, Sweden, Finland
    south: 1720,      // Southern Europe
  };

  const selectedMultiplier = yieldMultipliers[region];
  const bessBoost = hasBess ? 1.15 : 1.0; // 15% revenue boost from peak shaving & carbon offset revenue arbitrage

  // Conversion rates baseline from EUR (€)
  // 1 EUR = 1.08 USD, 1 EUR = 97.20 INR (1 USD ≈ 90 INR)
  const eurToUsd = 1.08;
  const eurToInr = 97.20;

  const convertFromEUR = (amountEUR: number): number => {
    if (currency === 'INR') {
      return Math.round(amountEUR * eurToInr);
    }
    return Math.round(amountEUR * eurToUsd);
  };

  const currencySymbol = currency === 'INR' ? '₹' : '$';

  const formatCurrencyVal = (valInEUR: number) => {
    const converted = convertFromEUR(valInEUR);
    if (currency === 'INR') {
      // Format in Indian numbering (Lakhs / Crores if large, or standard formatted string)
      if (converted >= 10000000) {
        return `₹${(converted / 10000000).toFixed(2)} Cr`;
      } else if (converted >= 100000) {
        return `₹${(converted / 100000).toFixed(2)} L`;
      }
      return `₹${converted.toLocaleString('en-IN')}`;
    }
    return `$${converted.toLocaleString('en-US')}`;
  };

  const annualYieldMWh = Math.round(capacityMW * 1000 * (selectedMultiplier / 1000));
  const annualRevenueEUR = Math.round(annualYieldMWh * ppaRate * bessBoost);
  const annualCo2AvoidedTonnes = Math.round(annualYieldMWh * 0.76); // ~0.76t CO2 per MWh in APAC
  const tokenizedCarbonYieldEUR = Math.round(annualCo2AvoidedTonnes * 24); // €24/tonne carbon offset revenue
  const totalCombinedYieldEUR = annualRevenueEUR + tokenizedCarbonYieldEUR;
  const homesPowered = Math.round(annualYieldMWh / 3.8);

  // Multi-year ROI calculations (10-Year projection)
  // Estimated CAPEX: ~$720,000 / MWp + $120,000 / MWp for BESS if enabled
  const capexPerMWpEUR = (700000 + (hasBess ? 120000 : 0)) / eurToUsd;
  const totalCapexEUR = capacityMW * capexPerMWpEUR;

  // Generate 10-Year Projection Data
  const generateRoiProjections = () => {
    const projections = [];
    let cumulativeNetCashflowEUR = -totalCapexEUR;

    const degradationRate = 0.005; // 0.5% per year degradation
    const ppaEscalation = 0.015;   // 1.5% annual tariff escalation
    const opexBaseEUR = totalCapexEUR * 0.015; // 1.5% of Capex for O&M
    const opexInflation = 0.02;     // 2% annual inflation on O&M

    for (let yr = 1; yr <= 10; yr++) {
      const yearDegradationFactor = Math.pow(1 - degradationRate, yr - 1);
      const yearTariffFactor = Math.pow(1 + ppaEscalation, yr - 1);
      const yearOpexFactor = Math.pow(1 + opexInflation, yr - 1);

      const yearYieldMWh = Math.round(annualYieldMWh * yearDegradationFactor);
      const yearPpaRevenueEUR = Math.round(annualRevenueEUR * yearDegradationFactor * yearTariffFactor);
      const yearCarbonYieldEUR = Math.round(tokenizedCarbonYieldEUR * yearDegradationFactor * Math.pow(1.03, yr - 1));
      const yearOpexEUR = Math.round(opexBaseEUR * yearOpexFactor);
      
      const yearNetCashflowEUR = yearPpaRevenueEUR + yearCarbonYieldEUR - yearOpexEUR;
      cumulativeNetCashflowEUR += yearNetCashflowEUR;
      const roiPercent = ((cumulativeNetCashflowEUR / totalCapexEUR) * 100).toFixed(1);

      projections.push({
        year: yr,
        yieldMWh: yearYieldMWh,
        ppaRevenueEUR: yearPpaRevenueEUR,
        carbonYieldEUR: yearCarbonYieldEUR,
        opexEUR: yearOpexEUR,
        netCashflowEUR: yearNetCashflowEUR,
        cumulativeNetCashflowEUR,
        roiPercent,
        isPayback: cumulativeNetCashflowEUR >= 0 && (projections[yr - 2]?.cumulativeNetCashflowEUR < 0 || yr === 1)
      });
    }

    return projections;
  };

  const roiData = generateRoiProjections();
  const paybackYearObj = roiData.find((d) => d.cumulativeNetCashflowEUR >= 0) || roiData[roiData.length - 1];

  return (
    <section id="calculator" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0F172A] border-t border-[#1E293B]">
      <div className="max-w-7xl mx-auto">
        
        {/* Header with Currency Switcher */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="text-[#4ADE80] font-mono text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              Digital Underwriting & Yield Engine
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Asian Solar Portfolio & Carbon Revenue Modeling
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-4 bg-[#1E293B] p-2 rounded-xl border border-white/10 self-start md:self-auto">
            <span className="text-xs font-mono text-slate-400 pl-2">Display Currency:</span>
            <div className="flex items-center gap-1 bg-[#0F172A] p-1 rounded-lg border border-white/5">
              <button
                type="button"
                onClick={() => setCurrency('USD')}
                className={`px-3 py-1.5 rounded-md text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  currency === 'USD'
                    ? 'bg-[#16A34A] text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <DollarSign className="w-3.5 h-3.5" />
                USD ($)
              </button>
              <button
                type="button"
                onClick={() => setCurrency('INR')}
                className={`px-3 py-1.5 rounded-md text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  currency === 'INR'
                    ? 'bg-[#16A34A] text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <IndianRupee className="w-3.5 h-3.5" />
                INR (₹)
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          
          {/* Controls Column */}
          <div className="lg:col-span-6 bg-[#1E293B] p-8 rounded-2xl border border-white/10 space-y-6">
            <h3 className="font-heading text-xl font-bold text-white flex items-center gap-2 pb-4 border-b border-white/10">
              <Sun className="w-5 h-5 text-[#4ADE80]" />
              Solar Asset & Underwriting Parameters
            </h3>

            {/* Capacity Slider */}
            <div>
              <div className="flex justify-between text-sm font-medium mb-2">
                <span className="text-[#94A3B8]">C&I Asset Capacity (MWp)</span>
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
                Target Solar Asset Jurisdiction
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'asia_ci', label: 'SE Asia & India C&I', rate: '1,540 kWh/kWp' },
                  { id: 'japan_east', label: 'Japan / East Asia', rate: '1,380 kWh/kWp' },
                  { id: 'nordics', label: 'Estonia / Nordics', rate: '1,080 kWh/kWp' },
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
                  <div className="text-xs text-[#94A3B8]">Adds +15% revenue via peak arbitrage & carbon offset revenues</div>
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
                  VGE Underwriting Output
                </span>
                <span className="text-xs font-mono text-white bg-[#16A34A]/20 px-2.5 py-1 rounded-md border border-[#16A34A]/40 font-bold">
                  View: {currency === 'INR' ? 'Indian Rupee (₹)' : 'US Dollar ($)'}
                </span>
              </div>

              {/* Annual Revenue Big Number */}
              <div className="bg-[#0F172A]/80 p-6 rounded-2xl border border-white/10">
                <div className="text-xs text-[#94A3B8] uppercase font-mono tracking-wider mb-1 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-[#4ADE80]" />
                  Projected Year-1 Total Income (PPA + Carbon)
                </div>
                <div className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#4ADE80]">
                  {formatCurrencyVal(totalCombinedYieldEUR)}
                </div>
                <div className="text-xs text-[#94A3B8] font-mono mt-2 flex flex-wrap gap-4">
                  <span>PPA Revenue: <strong className="text-white">{formatCurrencyVal(annualRevenueEUR)}</strong></span>
                  <span>Carbon Yield: <strong className="text-[#4ADE80]">{formatCurrencyVal(tokenizedCarbonYieldEUR)}</strong></span>
                </div>
              </div>

              {/* Grid Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#0F172A]/60 p-4 rounded-xl border border-white/5">
                  <div className="text-xs text-[#94A3B8] font-mono mb-1">Estimated Project Capex</div>
                  <div className="font-heading text-xl sm:text-2xl font-bold text-white">
                    {formatCurrencyVal(totalCapexEUR)}
                  </div>
                </div>

                <div className="bg-[#0F172A]/60 p-4 rounded-xl border border-white/5">
                  <div className="text-xs text-[#94A3B8] font-mono mb-1 flex items-center gap-1">
                    <Leaf className="w-3.5 h-3.5 text-[#4ADE80]" />
                    Avoided CO₂ Emissions
                  </div>
                  <div className="font-heading text-xl sm:text-2xl font-bold text-[#4ADE80]">
                    {annualCo2AvoidedTonnes.toLocaleString()} <span className="text-xs text-white">t/yr</span>
                  </div>
                </div>
              </div>

              {/* Equivalency note */}
              <div className="p-4 rounded-xl bg-[#16A34A]/10 border border-[#16A34A]/30 text-xs text-[#94A3B8] font-mono leading-relaxed">
                ⚡ Estimated Payback Period: <strong className="text-[#4ADE80] font-bold">~{paybackYearObj.year} Years</strong> under VGE institutional capital refinancing and I-REC monetization. Provides power for <strong className="text-white font-bold">{homesPowered.toLocaleString()} households</strong>.
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between text-xs text-[#94A3B8] font-mono">
              <span>* Multi-year ROI modeled with 0.5% degradation & 1.5% tariff escalation.</span>
              <button
                type="button"
                onClick={() => setShowRoiTable(!showRoiTable)}
                className="text-[#4ADE80] hover:underline font-bold flex items-center gap-1 cursor-pointer"
              >
                <Table className="w-3.5 h-3.5" />
                {showRoiTable ? 'Hide 10-Yr Table' : 'Show 10-Yr Table'}
              </button>
            </div>

          </div>

        </div>

        {/* Multi-Year ROI Projection Table Section */}
        {showRoiTable && (
          <div className="bg-[#1E293B] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
              <div>
                <div className="text-[#4ADE80] font-mono text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-2">
                  <Table className="w-4 h-4" />
                  10-Year Underwriting Cash Flow & ROI Model
                </div>
                <h3 className="font-heading text-2xl font-bold text-white">
                  Multi-Year ROI Financial Projection ({currency})
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-slate-400">Currency Mode:</span>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0F172A] border border-[#16A34A]/40 text-[#4ADE80] font-mono text-xs font-bold">
                  {currency === 'INR' ? '₹ INR (Indian Rupee)' : '$ USD (US Dollar)'}
                </div>
              </div>
            </div>

            {/* Table Container */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm font-mono border-collapse">
                <thead>
                  <tr className="bg-[#0F172A] text-slate-300 border-b border-white/10">
                    <th className="py-3.5 px-4 font-bold">Year</th>
                    <th className="py-3.5 px-4 font-bold">Generation (MWh)</th>
                    <th className="py-3.5 px-4 font-bold">PPA Income ({currencySymbol})</th>
                    <th className="py-3.5 px-4 font-bold">Carbon Yield ({currencySymbol})</th>
                    <th className="py-3.5 px-4 font-bold">O&M Cost ({currencySymbol})</th>
                    <th className="py-3.5 px-4 font-bold">Net Annual Cashflow</th>
                    <th className="py-3.5 px-4 font-bold">Cumulative Cashflow</th>
                    <th className="py-3.5 px-4 font-bold text-right">Cumulative ROI %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {roiData.map((row) => (
                    <tr
                      key={row.year}
                      className={`hover:bg-slate-800/60 transition-colors ${
                        row.isPayback ? 'bg-[#16A34A]/15 text-white font-bold border-l-4 border-l-[#4ADE80]' : 'text-slate-300'
                      }`}
                    >
                      <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                        Year {row.year}
                        {row.isPayback && (
                          <span className="px-2 py-0.5 rounded text-[10px] bg-[#16A34A] text-white uppercase tracking-wider font-extrabold">
                            Payback Break-Even
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-200">
                        {row.yieldMWh.toLocaleString()} MWh
                      </td>
                      <td className="py-3.5 px-4 text-slate-200">
                        {formatCurrencyVal(row.ppaRevenueEUR)}
                      </td>
                      <td className="py-3.5 px-4 text-[#4ADE80]">
                        {formatCurrencyVal(row.carbonYieldEUR)}
                      </td>
                      <td className="py-3.5 px-4 text-rose-400">
                        -{formatCurrencyVal(row.opexEUR)}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-white">
                        {formatCurrencyVal(row.netCashflowEUR)}
                      </td>
                      <td className={`py-3.5 px-4 font-bold ${row.cumulativeNetCashflowEUR >= 0 ? 'text-[#4ADE80]' : 'text-slate-400'}`}>
                        {formatCurrencyVal(row.cumulativeNetCashflowEUR)}
                      </td>
                      <td className={`py-3.5 px-4 font-extrabold text-right ${Number(row.roiPercent) >= 0 ? 'text-[#4ADE80]' : 'text-rose-400'}`}>
                        {row.roiPercent}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pt-4 border-t border-white/5 flex flex-wrap items-center justify-between text-xs text-slate-400 font-mono gap-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#4ADE80]" />
                <span>Underwritten using VGE’s automated dMRV & Asian C&I solar yield datasets.</span>
              </div>
              <div className="text-slate-400">
                10-Year Cumulative Income: <strong className="text-[#4ADE80] font-bold">{formatCurrencyVal(roiData[9].cumulativeNetCashflowEUR + totalCapexEUR)}</strong>
              </div>
            </div>

          </div>
        )}

      </div>
    </section>
  );
};


import React, { useState, useEffect } from 'react';
import { Activity, Radio, Cpu, DollarSign, Leaf, Zap, ArrowUpRight, Globe, ShieldCheck } from 'lucide-react';

interface LiveNetworkBannerProps {
  compact?: boolean;
}

export const LiveNetworkBanner: React.FC<LiveNetworkBannerProps> = ({ compact = false }) => {
  // Live animated counters
  const [nodesCount, setNodesCount] = useState<number>(14284);
  const [yieldProcessedUSD, setYieldProcessedUSD] = useState<number>(184920450);
  const [co2OffsetTons, setCo2OffsetTons] = useState<number>(2148930.4);
  const [activeTab, setActiveTab] = useState<'nodes' | 'yield' | 'carbon'>('yield');
  const [recentEvent, setRecentEvent] = useState<string>(
    'Node #VNM-320 (Vietnam) verified +427.1t CO2 yield on-chain'
  );

  // Periodic ticker logic for live real-time metrics
  useEffect(() => {
    const eventsList = [
      'Node #VNM-320 (Binh Thuan) verified +427.1t CO2 dMRV yield',
      'Node #THA-450 (Chonburi) settled +$2,480 Web3 capital dividend',
      'Node #JPN-380 (Kansai) ingested 92.0 MW active power telemetry',
      'Node #EST-160 (Tallinn) verified 100% SLA EU CSRD proof',
      'Node #ESP-210 (Valladolid) executed $4,120 PPA automated payout',
      'Web3 Liquidity Vault #0x9a8f added +$500,000 underwriting pool'
    ];

    const interval = setInterval(() => {
      // Small random increments to simulate live network traffic
      setNodesCount((prev) => prev + (Math.random() > 0.6 ? 1 : 0));
      setYieldProcessedUSD((prev) => prev + Math.floor(Math.random() * 45 + 12));
      setCo2OffsetTons((prev) => prev + +(Math.random() * 0.15 + 0.05).toFixed(2));
      
      // Randomly pick an event update
      if (Math.random() > 0.5) {
        const randomEvent = eventsList[Math.floor(Math.random() * eventsList.length)];
        setRecentEvent(randomEvent);
      }
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num: number, decimals = 1) => {
    return new Intl.NumberFormat('en-US', {
      maximumFractionDigits: decimals
    }).format(num);
  };

  return (
    <div className="w-full bg-[#0B132B]/90 border-y border-[#16A34A]/30 backdrop-blur-md relative z-20 overflow-hidden shadow-2xl">
      {/* Background ambient gradient line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#4ADE80] to-transparent opacity-60" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          
          {/* Header Badge */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#16A34A]/15 border border-[#16A34A]/40 text-[#4ADE80] text-xs font-mono font-bold uppercase tracking-wider">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4ADE80] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#4ADE80]"></span>
              </span>
              VGE Live Network
            </div>
            <span className="hidden sm:inline-block text-slate-500 font-mono text-xs">|</span>
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-400 font-mono">
              <Globe className="w-3.5 h-3.5 text-[#4ADE80]" />
              APAC & EU Enterprise Nodes
            </span>
          </div>

          {/* Core Metrics Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:w-auto">
            
            {/* Metric 1: Connected Smart Nodes */}
            <div className="flex items-center gap-3 bg-slate-900/80 px-4 py-2 rounded-xl border border-white/5 hover:border-[#4ADE80]/40 transition-colors">
              <div className="p-2 rounded-lg bg-[#16A34A]/10 text-[#4ADE80] shrink-0">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  Connected Smart Nodes
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] animate-pulse inline-block" />
                </div>
                <div className="font-heading font-bold text-base sm:text-lg text-white font-mono flex items-center gap-1.5">
                  {formatNumber(nodesCount, 0)}
                  <span className="text-[10px] text-[#4ADE80] font-normal px-1.5 py-0.2 rounded bg-[#16A34A]/20">
                    Live API
                  </span>
                </div>
              </div>
            </div>

            {/* Metric 2: Yield Processed */}
            <div className="flex items-center gap-3 bg-slate-900/80 px-4 py-2 rounded-xl border border-white/5 hover:border-[#4ADE80]/40 transition-colors">
              <div className="p-2 rounded-lg bg-[#16A34A]/10 text-[#4ADE80] shrink-0">
                <DollarSign className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                  Yield Processed
                </div>
                <div className="font-heading font-bold text-base sm:text-lg text-[#4ADE80] font-mono">
                  {formatCurrency(yieldProcessedUSD)}
                </div>
              </div>
            </div>

            {/* Metric 3: CO2 Offset */}
            <div className="flex items-center gap-3 bg-slate-900/80 px-4 py-2 rounded-xl border border-white/5 hover:border-[#4ADE80]/40 transition-colors">
              <div className="p-2 rounded-lg bg-[#16A34A]/10 text-[#4ADE80] shrink-0">
                <Leaf className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                  CO₂ Offset Saved
                </div>
                <div className="font-heading font-bold text-base sm:text-lg text-white font-mono flex items-baseline gap-1">
                  {formatNumber(co2OffsetTons, 1)}
                  <span className="text-xs text-slate-400 font-normal">Metric Tons</span>
                </div>
              </div>
            </div>

          </div>

          {/* Live Activity Ticker Stream */}
          <div className="hidden xl:flex items-center gap-2 bg-slate-900/50 px-3.5 py-2 rounded-xl border border-white/5 text-xs text-slate-300 font-mono max-w-xs truncate">
            <Radio className="w-3.5 h-3.5 text-[#4ADE80] shrink-0 animate-pulse" />
            <span className="truncate text-[11px] text-slate-300">
              {recentEvent}
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { 
  TrendingUp, TrendingDown, RefreshCw, Globe, ShieldCheck, Filter, Search, 
  ArrowUpRight, ArrowDownRight, Zap, CheckCircle2, DollarSign, Clock, Lock, 
  ChevronRight, Sparkles, AlertCircle, X, ExternalLink, BarChart3, Layers
} from 'lucide-react';

export interface IrecMarketItem {
  id: string;
  country: string;
  flag: string;
  region: 'European' | 'Asian';
  exchangeRegistry: string;
  vintage: string;
  techType: 'Solar PV' | 'Wind' | 'Hydro' | 'Biomass';
  priceUsd: number;
  priceEur: number;
  change24h: number; // percentage e.g. +2.4 or -1.1
  high24h: number;
  low24h: number;
  volumeMwh: number;
  complianceScope: string;
  lastUpdated: string;
}

const INITIAL_MARKET_DATA: IrecMarketItem[] = [
  {
    id: 'mkt-ee',
    country: 'Estonia & Nordics',
    flag: '🇪🇪',
    region: 'European',
    exchangeRegistry: 'Evident EU / EEX Node',
    vintage: '2026 Spot',
    techType: 'Solar PV',
    priceUsd: 3.10,
    priceEur: 2.85,
    change24h: 3.4,
    high24h: 2.92,
    low24h: 2.71,
    volumeMwh: 124500,
    complianceScope: 'EU RED III / CSRD Scope 2',
    lastUpdated: 'Just now'
  },
  {
    id: 'mkt-my',
    country: 'Malaysia',
    flag: '🇲🇾',
    region: 'Asian',
    exchangeRegistry: 'Evident APAC / Bursa Carbon',
    vintage: '2026 Spot',
    techType: 'Solar PV',
    priceUsd: 1.95,
    priceEur: 1.79,
    change24h: 1.8,
    high24h: 2.02,
    low24h: 1.88,
    volumeMwh: 248000,
    complianceScope: 'RE100 / Scope 2 Verified',
    lastUpdated: 'Just now'
  },
  {
    id: 'mkt-de',
    country: 'Germany',
    flag: '🇩🇪',
    region: 'European',
    exchangeRegistry: 'European Energy Exchange (EEX)',
    vintage: '2026 Spot',
    techType: 'Solar PV',
    priceUsd: 3.42,
    priceEur: 3.15,
    change24h: 2.2,
    high24h: 3.20,
    low24h: 3.05,
    volumeMwh: 195000,
    complianceScope: 'CSRD / Guarantees of Origin (GoO)',
    lastUpdated: 'Just now'
  },
  {
    id: 'mkt-vnm',
    country: 'Vietnam',
    flag: '🇻🇳',
    region: 'Asian',
    exchangeRegistry: 'Evident APAC / VGE Node',
    vintage: '2026 Spot',
    techType: 'Solar PV',
    priceUsd: 1.82,
    priceEur: 1.67,
    change24h: -0.8,
    high24h: 1.89,
    low24h: 1.78,
    volumeMwh: 310000,
    complianceScope: 'RE100 / dMRV Verified',
    lastUpdated: 'Just now'
  },
  {
    id: 'mkt-es',
    country: 'Spain & Iberian Peninsula',
    flag: '🇪🇸',
    region: 'European',
    exchangeRegistry: 'MITECO / Evident EU',
    vintage: '2026 Spot',
    techType: 'Solar PV',
    priceUsd: 2.98,
    priceEur: 2.74,
    change24h: 4.1,
    high24h: 2.80,
    low24h: 2.60,
    volumeMwh: 162000,
    complianceScope: 'EU RED III Compliant',
    lastUpdated: 'Just now'
  },
  {
    id: 'mkt-jp',
    country: 'Japan',
    flag: '🇯🇵',
    region: 'Asian',
    exchangeRegistry: 'J-Credit / Evident Japan',
    vintage: '2026 Spot',
    techType: 'Solar PV',
    priceUsd: 2.45,
    priceEur: 2.25,
    change24h: 1.2,
    high24h: 2.50,
    low24h: 2.38,
    volumeMwh: 98000,
    complianceScope: 'GX League / RE100 Japan',
    lastUpdated: 'Just now'
  },
  {
    id: 'mkt-th',
    country: 'Thailand',
    flag: '🇹🇭',
    region: 'Asian',
    exchangeRegistry: 'T-VER / Evident APAC',
    vintage: '2026 Spot',
    techType: 'Solar PV',
    priceUsd: 1.88,
    priceEur: 1.73,
    change24h: 0.5,
    high24h: 1.92,
    low24h: 1.84,
    volumeMwh: 145000,
    complianceScope: 'RE100 / Scope 2',
    lastUpdated: 'Just now'
  },
  {
    id: 'mkt-in',
    country: 'India',
    flag: '🇮🇳',
    region: 'Asian',
    exchangeRegistry: 'I-REC / CERC India Registry',
    vintage: '2026 Spot',
    techType: 'Solar PV',
    priceUsd: 1.75,
    priceEur: 1.61,
    change24h: -1.2,
    high24h: 1.82,
    low24h: 1.71,
    volumeMwh: 420000,
    complianceScope: 'Green Energy Open Access',
    lastUpdated: 'Just now'
  },
  {
    id: 'mkt-nl',
    country: 'Netherlands',
    flag: '🇳🇱',
    region: 'European',
    exchangeRegistry: 'CertiQ / EEX Node',
    vintage: '2026 Spot',
    techType: 'Wind',
    priceUsd: 3.65,
    priceEur: 3.36,
    change24h: 2.9,
    high24h: 3.42,
    low24h: 3.22,
    volumeMwh: 185000,
    complianceScope: 'EU GoO / CSRD Scope 2',
    lastUpdated: 'Just now'
  },
  {
    id: 'mkt-id',
    country: 'Indonesia',
    flag: '🇮🇩',
    region: 'Asian',
    exchangeRegistry: 'IDX Carbon / Evident APAC',
    vintage: '2026 Spot',
    techType: 'Solar PV',
    priceUsd: 1.92,
    priceEur: 1.77,
    change24h: 1.6,
    high24h: 1.98,
    low24h: 1.86,
    volumeMwh: 112000,
    complianceScope: 'RE100 / Scope 2 Verified',
    lastUpdated: 'Just now'
  }
];

const HISTORICAL_PRICE_TREND = [
  { time: '00:00', europeanEur: 2.72, asianUsd: 1.88, spreadEur: 0.76 },
  { time: '04:00', europeanEur: 2.75, asianUsd: 1.89, spreadEur: 0.77 },
  { time: '08:00', europeanEur: 2.79, asianUsd: 1.91, spreadEur: 0.79 },
  { time: '12:00', europeanEur: 2.83, asianUsd: 1.94, spreadEur: 0.81 },
  { time: '16:00', europeanEur: 2.88, asianUsd: 1.96, spreadEur: 0.83 },
  { time: '20:00', europeanEur: 2.85, asianUsd: 1.95, spreadEur: 0.82 },
];

export const MarketDataSection: React.FC = () => {
  const [marketData, setMarketData] = useState<IrecMarketItem[]>(INITIAL_MARKET_DATA);
  const [regionFilter, setRegionFilter] = useState<'All' | 'European' | 'Asian'>('All');
  const [currency, setCurrency] = useState<'EUR' | 'USD'>('EUR');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLiveStreaming, setIsLiveStreaming] = useState<boolean>(true);
  const [lastTickTime, setLastTickTime] = useState<string>('Live');
  const [updatedRowId, setUpdatedRowId] = useState<string | null>(null);

  // Lock Price Modal State
  const [selectedLockMarket, setSelectedLockMarket] = useState<IrecMarketItem | null>(null);
  const [volumeToLock, setVolumeToLock] = useState<string>('5000');
  const [lockSuccessMessage, setLockSuccessMessage] = useState<string | null>(null);

  // Live auto-refresh tick simulation
  useEffect(() => {
    let interval: any;
    if (isLiveStreaming) {
      interval = setInterval(() => {
        setMarketData((prevData) => {
          const randomIndex = Math.floor(Math.random() * prevData.length);
          const itemToUpdate = prevData[randomIndex];
          
          // Small random delta between -1.5% and +1.5%
          const deltaPct = (Math.random() - 0.48) * 0.8;
          const newEur = +(itemToUpdate.priceEur * (1 + deltaPct / 100)).toFixed(2);
          const newUsd = +(itemToUpdate.priceUsd * (1 + deltaPct / 100)).toFixed(2);
          const newChange = +(itemToUpdate.change24h + deltaPct * 0.2).toFixed(1);

          setUpdatedRowId(itemToUpdate.id);
          setTimeout(() => setUpdatedRowId(null), 1200);

          return prevData.map((item, idx) => {
            if (idx === randomIndex) {
              return {
                ...item,
                priceEur: newEur,
                priceUsd: newUsd,
                change24h: newChange,
                lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
              };
            }
            return item;
          });
        });
        setLastTickTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isLiveStreaming]);

  // Filtered dataset
  const filteredData = marketData.filter((item) => {
    const matchesRegion = regionFilter === 'All' || item.region === regionFilter;
    const matchesSearch = 
      item.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.exchangeRegistry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.complianceScope.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRegion && matchesSearch;
  });

  // Aggregated Indexes
  const avgEuropeanEur = +(
    marketData.filter(m => m.region === 'European').reduce((sum, item) => sum + item.priceEur, 0) /
    marketData.filter(m => m.region === 'European').length
  ).toFixed(2);

  const avgAsianUsd = +(
    marketData.filter(m => m.region === 'Asian').reduce((sum, item) => sum + item.priceUsd, 0) /
    marketData.filter(m => m.region === 'Asian').length
  ).toFixed(2);

  const totalVolumeMwh = marketData.reduce((sum, item) => sum + item.volumeMwh, 0);

  const handleLockPriceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLockMarket) return;
    setLockSuccessMessage(
      `Forward Contract Reserved! ${parseInt(volumeToLock).toLocaleString()} MWh locked for ${selectedLockMarket.country} @ ${currency === 'EUR' ? '€' + selectedLockMarket.priceEur : '$' + selectedLockMarket.priceUsd}/MWh.`
    );
    setTimeout(() => {
      setLockSuccessMessage(null);
      setSelectedLockMarket(null);
    }, 3500);
  };

  return (
    <section id="market-data" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-body">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#16A34A]/15 border border-[#16A34A]/40 text-[#4ADE80] text-xs font-mono font-bold uppercase tracking-wider mb-2">
            <Globe className="w-3.5 h-3.5 text-[#4ADE80]" />
            Real-Time I-REC Certificate Pricing Trends
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white tracking-tight">
            European &amp; Asian Market Data
          </h2>
          <p className="text-slate-300 text-sm sm:text-base font-body mt-1 max-w-3xl">
            Live spot and forward prices for International Renewable Energy Certificates (I-RECs), Guarantees of Origin (GoOs), and dMRV-verified carbon yields across European and Asian registries.
          </p>
        </div>

        {/* Live Stream Status & Currency Toggle */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <div className="bg-[#1E293B] border border-white/10 rounded-xl p-1.5 flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-400 pl-2">Stream:</span>
            <button
              onClick={() => setIsLiveStreaming(!isLiveStreaming)}
              className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                isLiveStreaming
                  ? 'bg-[#16A34A] text-white shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isLiveStreaming ? 'bg-white animate-ping' : 'bg-slate-500'}`} />
              {isLiveStreaming ? 'LIVE SCADA' : 'PAUSED'}
            </button>
            <span className="text-[10px] text-slate-400 pr-1">{lastTickTime}</span>
          </div>

          <div className="bg-[#1E293B] border border-white/10 rounded-xl p-1 flex items-center gap-1 text-xs font-mono">
            <button
              onClick={() => setCurrency('EUR')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                currency === 'EUR' ? 'bg-[#16A34A] text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              € EUR
            </button>
            <button
              onClick={() => setCurrency('USD')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                currency === 'USD' ? 'bg-[#16A34A] text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              $ USD
            </button>
          </div>
        </div>
      </div>

      {/* Top Key Market Indexes Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        
        <div className="bg-[#1E293B]/80 border border-white/10 rounded-2xl p-5 shadow-xl relative overflow-hidden group hover:border-[#16A34A]/40 transition-colors">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span>EU I-REC Benchmark</span>
            <span className="text-[#4ADE80] bg-[#16A34A]/20 px-2 py-0.5 rounded font-bold">+3.4% 24h</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-heading font-bold text-2xl text-white">
              €{avgEuropeanEur}
            </span>
            <span className="text-xs font-mono text-slate-400">/ MWh</span>
          </div>
          <p className="text-[11px] font-mono text-slate-400 mt-2 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#4ADE80]" />
            EEX / Evident EU (CSRD Scope 2)
          </p>
        </div>

        <div className="bg-[#1E293B]/80 border border-white/10 rounded-2xl p-5 shadow-xl relative overflow-hidden group hover:border-[#16A34A]/40 transition-colors">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span>APAC Solar I-REC Index</span>
            <span className="text-[#4ADE80] bg-[#16A34A]/20 px-2 py-0.5 rounded font-bold">+1.8% 24h</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-heading font-bold text-2xl text-white">
              ${avgAsianUsd}
            </span>
            <span className="text-xs font-mono text-slate-400">/ MWh</span>
          </div>
          <p className="text-[11px] font-mono text-slate-400 mt-2 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-[#4ADE80]" />
            Bursa / Evident APAC (RE100)
          </p>
        </div>

        <div className="bg-[#1E293B]/80 border border-white/10 rounded-2xl p-5 shadow-xl relative overflow-hidden group hover:border-[#16A34A]/40 transition-colors">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span>EU-APAC Cross Spread</span>
            <span className="text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded font-bold">+4.1% Spread</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-heading font-bold text-2xl text-white">
              €0.82
            </span>
            <span className="text-xs font-mono text-slate-400">/ MWh</span>
          </div>
          <p className="text-[11px] font-mono text-slate-400 mt-2 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Cross-Border Arbitrage Opportunity
          </p>
        </div>

        <div className="bg-[#1E293B]/80 border border-white/10 rounded-2xl p-5 shadow-xl relative overflow-hidden group hover:border-[#16A34A]/40 transition-colors">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span>24h Verified Volume</span>
            <span className="text-[#4ADE80] font-bold">Live Stream</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-heading font-bold text-2xl text-white">
              {(totalVolumeMwh / 1000).toFixed(1)}k
            </span>
            <span className="text-xs font-mono text-slate-400">MWh Traded</span>
          </div>
          <p className="text-[11px] font-mono text-slate-400 mt-2 flex items-center gap-1">
            <BarChart3 className="w-3.5 h-3.5 text-[#4ADE80]" />
            Polygon DLT Immutable Hash Logs
          </p>
        </div>

      </div>

      {/* Historical Trend Chart */}
      <div className="bg-[#1E293B]/70 border border-white/10 rounded-2xl p-6 mb-8 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="text-xs font-mono text-[#4ADE80] uppercase tracking-wider mb-1 font-bold">
              Market Depth &amp; Historical Trajectory
            </div>
            <h3 className="font-heading font-bold text-xl text-white">
              European vs Asian Spot Price Convergence (24h Window)
            </h3>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#16A34A]" />
              European Spot (€/MWh)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-cyan-500" />
              Asian Spot ($/MWh)
            </span>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={HISTORICAL_PRICE_TREND}>
              <defs>
                <linearGradient id="colorEur" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16A34A" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#16A34A" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorUsd" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis dataKey="time" stroke="#94A3B8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} domain={['auto', 'auto']} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F172A',
                  borderColor: 'rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px',
                  fontFamily: 'monospace'
                }}
              />
              <Area type="monotone" dataKey="europeanEur" name="European Spot (€)" stroke="#16A34A" strokeWidth={2} fillOpacity={1} fill="url(#colorEur)" />
              <Area type="monotone" dataKey="asianUsd" name="Asian Spot ($)" stroke="#06B6D4" strokeWidth={2} fillOpacity={1} fill="url(#colorUsd)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Real-time Pricing Table Controls */}
      <div className="bg-[#1E293B]/90 border border-white/10 rounded-2xl p-6 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          
          {/* Region Tabs */}
          <div className="flex items-center gap-1.5 bg-[#0F172A] p-1.5 rounded-xl border border-white/10">
            <button
              onClick={() => setRegionFilter('All')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                regionFilter === 'All'
                  ? 'bg-[#16A34A] text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Markets ({marketData.length})
            </button>
            <button
              onClick={() => setRegionFilter('European')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                regionFilter === 'European'
                  ? 'bg-[#16A34A] text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>🇪🇺 European Markets</span>
            </button>
            <button
              onClick={() => setRegionFilter('Asian')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                regionFilter === 'Asian'
                  ? 'bg-[#16A34A] text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>🌏 Asian Markets</span>
            </button>
          </div>

          {/* Search Input */}
          <div className="relative max-w-md w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by country, exchange registry or compliance standard..."
              className="w-full bg-[#0F172A] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-[#16A34A]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

        </div>

        {/* Real-time Pricing Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 font-mono text-[11px] text-slate-400 uppercase tracking-wider bg-[#0F172A]/50">
                <th className="py-3 px-4 font-bold">Country / Market</th>
                <th className="py-3 px-4 font-bold">Registry &amp; Exchange</th>
                <th className="py-3 px-4 font-bold">Vintage</th>
                <th className="py-3 px-4 font-bold">Spot Price</th>
                <th className="py-3 px-4 font-bold">24h Shift</th>
                <th className="py-3 px-4 font-bold">24h Range</th>
                <th className="py-3 px-4 font-bold">24h Volume</th>
                <th className="py-3 px-4 font-bold">Compliance Scope</th>
                <th className="py-3 px-4 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono text-xs">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400 font-mono">
                    No markets matched your filter query.
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => {
                  const isUpdated = updatedRowId === item.id;
                  const displayPrice = currency === 'EUR' ? `€${item.priceEur.toFixed(2)}` : `$${item.priceUsd.toFixed(2)}`;
                  const isPositive = item.change24h >= 0;

                  return (
                    <tr
                      key={item.id}
                      className={`transition-colors duration-500 ${
                        isUpdated ? 'bg-[#16A34A]/20' : 'hover:bg-white/5'
                      }`}
                    >
                      {/* Country / Market */}
                      <td className="py-3.5 px-4 font-bold text-white whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{item.flag}</span>
                          <div>
                            <div className="text-white font-heading text-xs sm:text-sm font-semibold">{item.country}</div>
                            <span className={`inline-block px-1.5 py-0.2 rounded text-[9px] uppercase font-bold border ${
                              item.region === 'European'
                                ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30'
                                : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                            }`}>
                              {item.region}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Registry & Exchange */}
                      <td className="py-3.5 px-4 text-slate-300 whitespace-nowrap">
                        {item.exchangeRegistry}
                      </td>

                      {/* Vintage */}
                      <td className="py-3.5 px-4 text-slate-300 whitespace-nowrap">
                        <span className="bg-slate-800 border border-white/10 px-2 py-1 rounded text-[11px] font-bold">
                          {item.vintage}
                        </span>
                      </td>

                      {/* Spot Price */}
                      <td className="py-3.5 px-4 font-bold text-sm text-white whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span>{displayPrice}</span>
                          <span className="text-[10px] text-slate-500">/ MWh</span>
                        </div>
                      </td>

                      {/* 24h Shift */}
                      <td className="py-3.5 px-4 font-bold whitespace-nowrap">
                        <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs ${
                          isPositive
                            ? 'bg-[#16A34A]/20 text-[#4ADE80] border border-[#16A34A]/40'
                            : 'bg-red-500/20 text-red-400 border border-red-500/40'
                        }`}>
                          {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                          <span>{isPositive ? `+${item.change24h}%` : `${item.change24h}%`}</span>
                        </div>
                      </td>

                      {/* 24h Range */}
                      <td className="py-3.5 px-4 text-slate-400 text-[11px] whitespace-nowrap">
                        {currency === 'EUR' ? `€${item.low24h} - €${item.high24h}` : `$${(item.low24h * 1.09).toFixed(2)} - $${(item.high24h * 1.09).toFixed(2)}`}
                      </td>

                      {/* 24h Volume */}
                      <td className="py-3.5 px-4 text-slate-300 whitespace-nowrap">
                        {(item.volumeMwh).toLocaleString()} MWh
                      </td>

                      {/* Compliance Scope */}
                      <td className="py-3.5 px-4 text-slate-400 text-[11px] whitespace-nowrap">
                        <span className="truncate max-w-[160px] inline-block" title={item.complianceScope}>
                          {item.complianceScope}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => setSelectedLockMarket(item)}
                          className="bg-[#16A34A]/20 hover:bg-[#16A34A] text-[#4ADE80] hover:text-white border border-[#16A34A]/40 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ml-auto"
                        >
                          <Lock className="w-3 h-3" />
                          <span>Lock Forward Price</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footnote Metadata */}
        <div className="mt-4 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-slate-400 gap-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#4ADE80]" />
            <span>Prices synchronized via Evident, EEX, &amp; Verde Grid dMRV Oracles</span>
          </div>
          <span className="text-slate-500">
            Updated in 60-second real-time SCADA batches
          </span>
        </div>

      </div>

      {/* Lock Price Modal */}
      {selectedLockMarket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md font-body">
          <div className="bg-[#0F172A] border border-[#16A34A]/50 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">{selectedLockMarket.flag}</span>
                <h3 className="font-heading font-bold text-white text-lg">
                  Lock Forward Price
                </h3>
              </div>
              <button
                onClick={() => setSelectedLockMarket(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {lockSuccessMessage ? (
              <div className="p-4 rounded-xl bg-[#16A34A]/20 border border-[#16A34A]/40 text-xs font-mono text-[#4ADE80] text-center space-y-2 my-4">
                <CheckCircle2 className="w-8 h-8 text-[#4ADE80] mx-auto animate-bounce" />
                <p className="font-bold">{lockSuccessMessage}</p>
              </div>
            ) : (
              <form onSubmit={handleLockPriceSubmit} className="space-y-4 font-mono text-xs">
                
                <div className="bg-[#1E293B] p-3 rounded-xl border border-white/10 space-y-1">
                  <div className="text-slate-400">Target Market:</div>
                  <div className="text-white font-bold">{selectedLockMarket.country} ({selectedLockMarket.exchangeRegistry})</div>
                  <div className="text-[#4ADE80] font-bold pt-1">
                    Spot Price: {currency === 'EUR' ? `€${selectedLockMarket.priceEur}` : `$${selectedLockMarket.priceUsd}`} / MWh
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Volume to Lock (MWh)</label>
                  <input
                    type="number"
                    value={volumeToLock}
                    onChange={(e) => setVolumeToLock(e.target.value)}
                    className="w-full bg-[#1E293B] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#16A34A]"
                    placeholder="e.g. 5000"
                    required
                  />
                </div>

                <div className="bg-[#0F172A] p-3 rounded-xl border border-white/5 space-y-1 text-slate-400">
                  <div className="flex justify-between">
                    <span>Estimated Contract Value:</span>
                    <span className="text-white font-bold">
                      {currency === 'EUR'
                        ? `€${(parseInt(volumeToLock || '0') * selectedLockMarket.priceEur).toLocaleString()}`
                        : `$${(parseInt(volumeToLock || '0') * selectedLockMarket.priceUsd).toLocaleString()}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Smart Contract Settlement:</span>
                    <span className="text-[#4ADE80]">Polygon EVM dMRV</span>
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedLockMarket(null)}
                    className="px-4 py-2 rounded-xl text-slate-400 hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#16A34A] hover:bg-[#15803D] text-white font-bold px-5 py-2.5 rounded-xl transition-all cursor-pointer shadow-md"
                  >
                    Confirm Forward Reservation
                  </button>
                </div>

              </form>
            )}

          </div>
        </div>
      )}

    </section>
  );
};

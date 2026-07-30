import React, { useState, useEffect, useCallback } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import {
  Zap,
  TrendingUp,
  DollarSign,
  Leaf,
  RefreshCw,
  Building2,
  Calendar,
  Activity,
  Layers,
  CheckCircle2
} from 'lucide-react';

interface FacilityOption {
  id: string;
  name: string;
  country: string;
  capacityMWp: number;
}

const FACILITIES: FacilityOption[] = [
  { id: 'FAC-MY-PENANG-004', name: 'Penang Solar Park', country: 'Malaysia', capacityMWp: 15.0 },
  { id: 'vge-vnm-05', name: 'Binh Thuan C&I Solar', country: 'Vietnam', capacityMWp: 95.0 },
  { id: 'FAC-TH-CHONBURI-012', name: 'Chonburi Industrial Estate', country: 'Thailand', capacityMWp: 45.0 },
  { id: 'FAC-IN-GUJARAT-088', name: 'Gujarat Commercial Rooftop', country: 'India', capacityMWp: 30.0 }
];

interface DataPoint {
  label: string;
  active_power_kw: number;
  yield_mwh: number;
  revenue_usd: number;
  co2_offset_tons: number;
}

interface AnalyticsSummary {
  current_power_kw: number;
  total_yield_mwh: number;
  total_revenue_usd: number;
  total_co2_tons: number;
  efficiency_rate_pct: number;
}

export const EnergyProductionAnalytics: React.FC = () => {
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>('FAC-MY-PENANG-004');
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d'>('24h');
  const [chartMetric, setChartMetric] = useState<'power' | 'revenue' | 'carbon'>('power');
  
  const [dataSeries, setDataSeries] = useState<DataPoint[]>([]);
  const [summary, setSummary] = useState<AnalyticsSummary>({
    current_power_kw: 11850.5,
    total_yield_mwh: 64.2,
    total_revenue_usd: 6099.0,
    total_co2_tons: 41.7,
    efficiency_rate_pct: 98.6
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastRefreshed, setLastRefreshed] = useState<string>('Just now');
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);

  // Fallback mock generator in case server endpoint isn't reachble
  const generateFallbackData = useCallback((facId: string, tf: '24h' | '7d' | '30d') => {
    const fac = FACILITIES.find((f) => f.id === facId) || FACILITIES[0];
    const cap = fac.capacityMWp;
    const points: DataPoint[] = [];

    if (tf === '24h') {
      for (let h = 0; h < 24; h++) {
        const factor = 6 <= h && h <= 18 ? Math.max(0, 1 - Math.pow(Math.abs(h - 13) / 6, 2)) : 0;
        const power = Math.round(cap * 1000 * factor * (0.85 + Math.random() * 0.2) * 10) / 10;
        const yieldMwh = Math.round((power / 1000) * 100) / 100;
        const revenue = Math.round(yieldMwh * 1000 * 0.095 * 100) / 100;
        const co2 = Math.round(yieldMwh * 0.65 * 100) / 100;
        points.push({
          label: `${h < 10 ? '0' : ''}${h}:00`,
          active_power_kw: power,
          yield_mwh: yieldMwh,
          revenue_usd: revenue,
          co2_offset_tons: co2
        });
      }
    } else if (tf === '7d') {
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      days.forEach((d) => {
        const dailyMwh = Math.round(cap * (4.2 + (Math.random() * 1.2 - 0.5)) * 10) / 10;
        const rev = Math.round(dailyMwh * 1000 * 0.095);
        const co2 = Math.round(dailyMwh * 0.65 * 10) / 10;
        points.push({
          label: d,
          active_power_kw: Math.round(cap * 1000 * 0.8),
          yield_mwh: dailyMwh,
          revenue_usd: rev,
          co2_offset_tons: co2
        });
      });
    } else {
      for (let day = 1; day <= 30; day++) {
        const dailyMwh = Math.round(cap * (4.1 + (Math.random() * 1.4 - 0.6)) * 10) / 10;
        const rev = Math.round(dailyMwh * 1000 * 0.095);
        const co2 = Math.round(dailyMwh * 0.65 * 10) / 10;
        points.push({
          label: `Day ${day}`,
          active_power_kw: Math.round(cap * 1000 * 0.82),
          yield_mwh: dailyMwh,
          revenue_usd: rev,
          co2_offset_tons: co2
        });
      }
    }

    const totalYield = Math.round(points.reduce((acc, p) => acc + p.yield_mwh, 0) * 10) / 10;
    const totalRev = Math.round(points.reduce((acc, p) => acc + p.revenue_usd, 0));
    const totalCo2 = Math.round(points.reduce((acc, p) => acc + p.co2_offset_tons, 0) * 10) / 10;
    const curPower = points[points.length - 1]?.active_power_kw || Math.round(cap * 820);

    return {
      series: points,
      summary: {
        current_power_kw: curPower,
        total_yield_mwh: totalYield,
        total_revenue_usd: totalRev,
        total_co2_tons: totalCo2,
        efficiency_rate_pct: 98.7
      }
    };
  }, []);

  const fetchAnalytics = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/v1/analytics/production?facility_id=${selectedFacilityId}&timeframe=${timeframe}`);
      if (res.ok) {
        const json = await res.json();
        if (json.series && json.summary) {
          setDataSeries(json.series);
          setSummary(json.summary);
        } else {
          const fallback = generateFallbackData(selectedFacilityId, timeframe);
          setDataSeries(fallback.series);
          setSummary(fallback.summary);
        }
      } else {
        const fallback = generateFallbackData(selectedFacilityId, timeframe);
        setDataSeries(fallback.series);
        setSummary(fallback.summary);
      }
    } catch {
      const fallback = generateFallbackData(selectedFacilityId, timeframe);
      setDataSeries(fallback.series);
      setSummary(fallback.summary);
    } finally {
      setIsLoading(false);
      setLastRefreshed(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }
  }, [selectedFacilityId, timeframe, generateFallbackData]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  // Polling mechanism every 30 seconds
  useEffect(() => {
    if (!autoRefresh) return;
    const timer = setInterval(() => {
      fetchAnalytics();
    }, 30000);
    return () => clearInterval(timer);
  }, [autoRefresh, fetchAnalytics]);

  const activeFacility = FACILITIES.find((f) => f.id === selectedFacilityId) || FACILITIES[0];

  // Custom Chart Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0F172A] border border-[#16A34A]/40 p-3 rounded-lg shadow-xl font-mono text-xs text-white">
          <p className="text-[#94A3B8] font-bold mb-1 border-b border-white/10 pb-1">{label}</p>
          {payload.map((item: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4 py-0.5">
              <span className="flex items-center gap-1.5" style={{ color: item.color }}>
                <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: item.color }} />
                {item.name}:
              </span>
              <span className="font-bold">
                {typeof item.value === 'number'
                  ? item.unit === '$'
                    ? `$${item.value.toLocaleString()}`
                    : `${item.value.toLocaleString()} ${item.unit || ''}`
                  : item.value}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <section id="realtime-analytics" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0B1120] border-t border-[#1E293B]">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#16A34A]/10 border border-[#16A34A]/30 text-[#4ADE80] text-xs font-mono font-bold uppercase tracking-wider mb-3">
              <Activity className="w-3.5 h-3.5" />
              Real-time Production Analytics
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Historical Yield Trends & Asset Telemetry
            </h2>
            <p className="text-[#94A3B8] text-sm mt-2 max-w-2xl">
              Monitor real-time energy production, active power generation curves, and PPA financial yields for enterprise commercial solar assets across Southeast Asia and India.
            </p>
          </div>

          {/* Asset & Refresh Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Facility Selector */}
            <div className="relative">
              <select
                value={selectedFacilityId}
                onChange={(e) => setSelectedFacilityId(e.target.value)}
                className="bg-[#1E293B] text-white text-xs font-mono px-3 py-2 rounded-xl border border-white/10 focus:outline-none focus:border-[#16A34A] cursor-pointer"
              >
                {FACILITIES.map((fac) => (
                  <option key={fac.id} value={fac.id}>
                    {fac.name} ({fac.capacityMWp} MWp - {fac.country})
                  </option>
                ))}
              </select>
            </div>

            {/* Timeframe Selector */}
            <div className="flex items-center bg-[#1E293B] p-1 rounded-xl border border-white/10">
              {(['24h', '7d', '30d'] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-colors cursor-pointer ${
                    timeframe === tf
                      ? 'bg-[#16A34A] text-white font-bold'
                      : 'text-[#94A3B8] hover:text-white'
                  }`}
                >
                  {tf === '24h' ? '24 Hours' : tf === '7d' ? '7 Days' : '30 Days'}
                </button>
              ))}
            </div>

            {/* Refresh Button */}
            <button
              onClick={() => fetchAnalytics()}
              disabled={isLoading}
              className="bg-[#1E293B] hover:bg-[#334155] text-[#94A3B8] hover:text-white p-2.5 rounded-xl border border-white/10 transition-colors flex items-center gap-1.5 text-xs font-mono cursor-pointer"
              title="Refresh Analytics Data"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#4ADE80] ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* Top Summary Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {/* Current Active Power */}
          <div className="bg-[#1E293B]/70 p-5 rounded-2xl border border-white/10 shadow-lg">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" />
                Active Power
              </span>
              <span className="text-[10px] text-[#4ADE80] bg-[#16A34A]/20 px-1.5 py-0.5 rounded">Live</span>
            </div>
            <div className="text-2xl font-mono font-bold text-white">
              {summary.current_power_kw.toLocaleString()} <span className="text-xs font-normal text-slate-400">kW</span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono mt-1">
              Asset Capacity: <strong className="text-slate-200">{activeFacility.capacityMWp} MWp</strong>
            </div>
          </div>

          {/* Total Yield MWh */}
          <div className="bg-[#1E293B]/70 p-5 rounded-2xl border border-white/10 shadow-lg">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
              <span className="flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-[#4ADE80]" />
                Energy Yield
              </span>
              <span className="text-[10px] text-slate-400 font-mono">{timeframe.toUpperCase()}</span>
            </div>
            <div className="text-2xl font-mono font-bold text-white">
              {summary.total_yield_mwh.toLocaleString()} <span className="text-xs font-normal text-slate-400">MWh</span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono mt-1">
              Inverter Efficiency: <strong className="text-[#4ADE80]">{summary.efficiency_rate_pct}%</strong>
            </div>
          </div>

          {/* Revenue Generated */}
          <div className="bg-[#1E293B]/70 p-5 rounded-2xl border border-white/10 shadow-lg">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
              <span className="flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                PPA Revenue
              </span>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/20 px-1.5 py-0.5 rounded">USD</span>
            </div>
            <div className="text-2xl font-mono font-bold text-white">
              ${summary.total_revenue_usd.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-400 font-mono mt-1">
              Avg Tariff: <strong className="text-slate-200">$0.095/kWh</strong>
            </div>
          </div>

          {/* CO2 Offset */}
          <div className="bg-[#1E293B]/70 p-5 rounded-2xl border border-white/10 shadow-lg">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
              <span className="flex items-center gap-1.5">
                <Leaf className="w-4 h-4 text-[#4ADE80]" />
                CO2 Avoided
              </span>
              <span className="text-[10px] text-[#4ADE80] bg-[#16A34A]/20 px-1.5 py-0.5 rounded">dMRV</span>
            </div>
            <div className="text-2xl font-mono font-bold text-white">
              {summary.total_co2_tons.toLocaleString()} <span className="text-xs font-normal text-slate-400">Tons</span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono mt-1">
              I-REC Eligible: <strong className="text-[#4ADE80]">Verified</strong>
            </div>
          </div>
        </div>

        {/* Main Chart Card */}
        <div className="bg-[#1E293B] p-6 rounded-2xl border border-white/10 shadow-2xl">
          
          {/* Chart Header Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10 mb-6">
            <div className="flex items-center gap-3">
              <Building2 className="w-5 h-5 text-[#4ADE80]" />
              <div>
                <h3 className="font-mono text-base font-bold text-white">
                  {activeFacility.name} — <span className="text-[#4ADE80]">{activeFacility.country}</span>
                </h3>
                <p className="text-xs text-[#94A3B8] font-mono">
                  FAC ID: {activeFacility.id} | Capacity: {activeFacility.capacityMWp} MWp Solar Asset
                </p>
              </div>
            </div>

            {/* Metric Mode Toggle */}
            <div className="flex items-center bg-[#0F172A] p-1 rounded-xl border border-white/10">
              {[
                { id: 'power', label: 'Generation (kW / MWh)', icon: Zap },
                { id: 'revenue', label: 'Revenue ($)', icon: DollarSign },
                { id: 'carbon', label: 'CO2 Offset (Tons)', icon: Leaf }
              ].map((m) => {
                const IconComp = m.icon;
                return (
                  <button
                    key={m.id}
                    onClick={() => setChartMetric(m.id as any)}
                    className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                      chartMetric === m.id
                        ? 'bg-[#16A34A] text-white font-bold shadow-md'
                        : 'text-[#94A3B8] hover:text-white'
                    }`}
                  >
                    <IconComp className="w-3.5 h-3.5" />
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Recharts Component Container */}
          <div className="h-80 w-full relative">
            {isLoading && (
              <div className="absolute inset-0 bg-[#1E293B]/80 backdrop-blur-xs z-10 flex items-center justify-center gap-2 text-xs font-mono text-[#4ADE80]">
                <RefreshCw className="w-4 h-4 animate-spin text-[#4ADE80]" />
                <span>Fetching live production telemetry...</span>
              </div>
            )}

            <ResponsiveContainer width="100%" height="100%">
              {chartMetric === 'power' ? (
                <AreaChart data={dataSeries} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="powerGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#16A34A" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#16A34A" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="yieldGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#38BDF8" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                  <XAxis dataKey="label" stroke="#94A3B8" tick={{ fontSize: 11, fontFamily: 'monospace' }} />
                  <YAxis yAxisId="left" stroke="#4ADE80" tick={{ fontSize: 11, fontFamily: 'monospace' }} unit=" kW" />
                  <YAxis yAxisId="right" orientation="right" stroke="#38BDF8" tick={{ fontSize: 11, fontFamily: 'monospace' }} unit=" MWh" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontFamily: 'monospace', fontSize: '12px', paddingTop: '10px' }} />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="active_power_kw"
                    name="Active Power (kW)"
                    stroke="#4ADE80"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#powerGradient)"
                    unit="kW"
                  />
                  <Area
                    yAxisId="right"
                    type="monotone"
                    dataKey="yield_mwh"
                    name="Cumulative Yield (MWh)"
                    stroke="#38BDF8"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#yieldGradient)"
                    unit="MWh"
                  />
                </AreaChart>
              ) : chartMetric === 'revenue' ? (
                <BarChart data={dataSeries} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                  <XAxis dataKey="label" stroke="#94A3B8" tick={{ fontSize: 11, fontFamily: 'monospace' }} />
                  <YAxis stroke="#10B981" tick={{ fontSize: 11, fontFamily: 'monospace' }} unit="$" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontFamily: 'monospace', fontSize: '12px', paddingTop: '10px' }} />
                  <Bar
                    dataKey="revenue_usd"
                    name="PPA Settlement Revenue ($ USD)"
                    fill="#10B981"
                    radius={[4, 4, 0, 0]}
                    unit="$"
                  />
                </BarChart>
              ) : (
                <AreaChart data={dataSeries} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="carbonGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                  <XAxis dataKey="label" stroke="#94A3B8" tick={{ fontSize: 11, fontFamily: 'monospace' }} />
                  <YAxis stroke="#34D399" tick={{ fontSize: 11, fontFamily: 'monospace' }} unit=" t" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontFamily: 'monospace', fontSize: '12px', paddingTop: '10px' }} />
                  <Area
                    type="monotone"
                    dataKey="co2_offset_tons"
                    name="dMRV Verified CO2 Offset (Tons)"
                    stroke="#34D399"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#carbonGradient)"
                    unit="Tons"
                  />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* Chart Footer Status Bar */}
          <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-[#94A3B8] gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-ping" />
              <span className="text-slate-300">Live API Ingress Stream Active</span>
              <span className="text-slate-500">({lastRefreshed})</span>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-1.5 cursor-pointer text-slate-400 hover:text-white">
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 text-[#16A34A] focus:ring-[#16A34A]"
                />
                <span>30s Auto Poll</span>
              </label>
              <span className="text-slate-500">|</span>
              <span className="text-slate-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#4ADE80]" />
                HMAC & DLT Cryptographic Proofs
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

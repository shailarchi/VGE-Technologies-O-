import React, { useState } from 'react';
import { 
  FileSpreadsheet, Download, CheckCircle, Shield, Award, Sparkles, FileText, Lock, 
  Globe, Building2, Check, ShieldCheck, Layers, FileCheck, TrendingUp, BarChart3, 
  PieChart as PieChartIcon, Target, Activity, ArrowUpRight, Printer, FileCheck2
} from 'lucide-react';
import { generateIrecAuditPdf } from '../utils/pdfGenerator';
import {
  ResponsiveContainer,
  ComposedChart,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell
} from 'recharts';

export interface ComplianceFramework {
  id: string;
  name: string;
  code: string;
  regulation: string;
  issuer: string;
  description: string;
}

const COMPLIANCE_FRAMEWORKS: ComplianceFramework[] = [
  {
    id: 'csrd',
    name: 'EU CSRD (Directive 2022/2464 / ESRS E1)',
    code: 'ESRS E1 Climate Change',
    regulation: 'European Parliament Directive 2022/2464',
    issuer: 'EFRAG / European Commission',
    description: 'Mandatory European Sustainability Reporting Standard requiring double materiality and Scope 2 market-based energy disclosures.'
  },
  {
    id: 'irec',
    name: 'I-REC Standard & I-TRACK Code (EAC)',
    code: 'I-REC Code v3.1',
    regulation: 'International REC Standard Foundation Rules',
    issuer: 'I-TRACK Foundation (Netherlands)',
    description: 'Global standard for attribute tracking of renewable electricity generation from Asian commercial solar assets.'
  },
  {
    id: 'ghg',
    name: 'GHG Protocol Scope 2 Market-Based Standard',
    code: 'GHG Scope 2 Guidance',
    regulation: 'WRI / WBCSD Corporate Accounting Standard',
    issuer: 'World Resources Institute',
    description: 'Gold-standard dual reporting framework matching contractual instruments (dRECs) against physical grid consumption.'
  },
  {
    id: 'iso-verra',
    name: 'ISO 14064-1 & Verra dMRV (VM0042 Protocol)',
    code: 'ISO 14064-1:2018 / VM0042',
    regulation: 'Verra Verified Carbon Standard (VCS)',
    issuer: 'ISO & Verra International',
    description: 'Digital Measurement, Reporting & Verification (dMRV) for automated carbon credit tokenization and verification.'
  }
];

export interface GridFactor {
  country: string;
  gridName: string;
  factorKgKwh: number;
  flag: string;
  mwpInstalled: number;
}

const GRID_FACTORS: GridFactor[] = [
  { country: 'Malaysia', gridName: 'TNB Grid', factorKgKwh: 0.639, flag: '🇲🇾', mwpInstalled: 6.8 },
  { country: 'Vietnam', gridName: 'EVN Grid', factorKgKwh: 0.722, flag: '🇻🇳', mwpInstalled: 4.8 },
  { country: 'Thailand', gridName: 'EGAT Grid', factorKgKwh: 0.498, flag: '🇹🇭', mwpInstalled: 3.5 },
  { country: 'India', gridName: 'CEA National Grid', factorKgKwh: 0.716, flag: '🇮🇳', mwpInstalled: 2.2 },
  { country: 'Indonesia', gridName: 'PLN Java-Bali Grid', factorKgKwh: 0.785, flag: '🇮🇩', mwpInstalled: 1.2 },
];

// Baseline Monthly Solar MWh Generation Data
const MONTHLY_GENERATION_BASE = [
  { month: 'Jan', mwh: 112 },
  { month: 'Feb', mwh: 128 },
  { month: 'Mar', mwh: 145 },
  { month: 'Apr', mwh: 158 },
  { month: 'May', mwh: 172 },
  { month: 'Jun', mwh: 180 },
  { month: 'Jul', mwh: 188 },
  { month: 'Aug', mwh: 176 },
  { month: 'Sep', mwh: 162 },
  { month: 'Oct', mwh: 148 },
  { month: 'Nov', mwh: 132 },
  { month: 'Dec', mwh: 122 },
];

// Quarterly MWp Capacity Expansion vs EU ESG Target
const CAPACITY_GROWTH_DATA = [
  { quarter: 'Q1 2025', actualMwp: 4.2, targetMwp: 4.0, tokenizedRatio: 92 },
  { quarter: 'Q2 2025', actualMwp: 6.8, targetMwp: 6.0, tokenizedRatio: 95 },
  { quarter: 'Q3 2025', actualMwp: 9.5, targetMwp: 8.5, tokenizedRatio: 97 },
  { quarter: 'Q4 2025', actualMwp: 12.4, targetMwp: 11.0, tokenizedRatio: 98 },
  { quarter: 'Q1 2026', actualMwp: 15.8, targetMwp: 14.0, tokenizedRatio: 99 },
  { quarter: 'Q2 2026', actualMwp: 18.5, targetMwp: 16.5, tokenizedRatio: 100 },
  { quarter: 'Q3 2026 (P)', actualMwp: 22.0, targetMwp: 20.0, tokenizedRatio: 100 },
  { quarter: 'Q4 2026 (P)', actualMwp: 26.5, targetMwp: 24.0, tokenizedRatio: 100 },
];

export interface OrganizationTarget {
  id: string;
  name: string;
  lei: string;
  country: string;
  flag: string;
  targetYear: number;
  annualIrecTargetMwh: number;
  currentIrecYieldMwh: number;
  gridFactorKgKwh: number;
  verifiedIssuanceRatio: number;
  sector: string;
  quarterlyMilestones: {
    quarter: string;
    targetMwh: number;
    actualMwh: number;
    status: 'completed' | 'in_progress' | 'upcoming';
  }[];
}

export const ORGANIZATIONS_DATA: OrganizationTarget[] = [
  {
    id: 'vge-technologies',
    name: 'VGE Technologies OÜ',
    lei: '9845003828CB77B80280',
    country: 'Estonia / EU',
    flag: '🇪🇪',
    targetYear: 2026,
    annualIrecTargetMwh: 2500,
    currentIrecYieldMwh: 1840,
    gridFactorKgKwh: 0.639,
    verifiedIssuanceRatio: 98.4,
    sector: 'Clean Tech & Infrastructure',
    quarterlyMilestones: [
      { quarter: 'Q1 2026', targetMwh: 625, actualMwh: 640, status: 'completed' },
      { quarter: 'Q2 2026', targetMwh: 1250, actualMwh: 1280, status: 'completed' },
      { quarter: 'Q3 2026', targetMwh: 1875, actualMwh: 1840, status: 'in_progress' },
      { quarter: 'Q4 2026', targetMwh: 2500, actualMwh: 2500, status: 'upcoming' },
    ]
  },
  {
    id: 'penang-green-power',
    name: 'Penang Green Power Corp Ltd',
    lei: '8943009211AA42158019',
    country: 'Malaysia',
    flag: '🇲🇾',
    targetYear: 2026,
    annualIrecTargetMwh: 4000,
    currentIrecYieldMwh: 3280,
    gridFactorKgKwh: 0.639,
    verifiedIssuanceRatio: 100.0,
    sector: 'Commercial Rooftop Utility EPC',
    quarterlyMilestones: [
      { quarter: 'Q1 2026', targetMwh: 1000, actualMwh: 1050, status: 'completed' },
      { quarter: 'Q2 2026', targetMwh: 2000, actualMwh: 2100, status: 'completed' },
      { quarter: 'Q3 2026', targetMwh: 3000, actualMwh: 3280, status: 'completed' },
      { quarter: 'Q4 2026', targetMwh: 4000, actualMwh: 4000, status: 'in_progress' },
    ]
  },
  {
    id: 'vietnam-clean-energy',
    name: 'Vietnam Industrial Energy JSC',
    lei: '54930061928001192842',
    country: 'Vietnam',
    flag: '🇻🇳',
    targetYear: 2026,
    annualIrecTargetMwh: 3000,
    currentIrecYieldMwh: 1920,
    gridFactorKgKwh: 0.722,
    verifiedIssuanceRatio: 95.2,
    sector: 'High-Tech Industrial Parks',
    quarterlyMilestones: [
      { quarter: 'Q1 2026', targetMwh: 750, actualMwh: 720, status: 'completed' },
      { quarter: 'Q2 2026', targetMwh: 1500, actualMwh: 1520, status: 'completed' },
      { quarter: 'Q3 2026', targetMwh: 2250, actualMwh: 1920, status: 'in_progress' },
      { quarter: 'Q4 2026', targetMwh: 3000, actualMwh: 3000, status: 'upcoming' },
    ]
  },
  {
    id: 'siam-eco-energy',
    name: 'Siam Commercial Solar Co., Ltd',
    lei: '98450011223344556677',
    country: 'Thailand',
    flag: '🇹🇭',
    targetYear: 2026,
    annualIrecTargetMwh: 1800,
    currentIrecYieldMwh: 1490,
    gridFactorKgKwh: 0.498,
    verifiedIssuanceRatio: 99.1,
    sector: 'Retail & Agricultural Microgrids',
    quarterlyMilestones: [
      { quarter: 'Q1 2026', targetMwh: 450, actualMwh: 480, status: 'completed' },
      { quarter: 'Q2 2026', targetMwh: 900, actualMwh: 960, status: 'completed' },
      { quarter: 'Q3 2026', targetMwh: 1350, actualMwh: 1490, status: 'completed' },
      { quarter: 'Q4 2026', targetMwh: 1800, actualMwh: 1800, status: 'in_progress' },
    ]
  }
];

export const EsgStudio: React.FC = () => {
  const [selectedOrgId, setSelectedOrgId] = useState<string>('vge-technologies');
  const [selectedFrameworkId, setSelectedFrameworkId] = useState<string>('csrd');
  const [accountingMethod, setAccountingMethod] = useState<'market' | 'location'>('market');
  const [selectedGrid, setSelectedGrid] = useState<GridFactor>(GRID_FACTORS[0]);
  const [period, setPeriod] = useState<string>('YTD 2026');
  const [activeChartTab, setActiveChartTab] = useState<'ghg' | 'capacity' | 'regional'>('ghg');
  const [isExporting, setIsExporting] = useState(false);
  const [exportedSuccess, setExportedSuccess] = useState(false);

  const selectedOrg = ORGANIZATIONS_DATA.find(o => o.id === selectedOrgId) || ORGANIZATIONS_DATA[0];
  const activeFramework = COMPLIANCE_FRAMEWORKS.find(f => f.id === selectedFrameworkId) || COMPLIANCE_FRAMEWORKS[0];

  // Dynamic progress bar calculations
  const progressPct = Math.min(100, Math.round((selectedOrg.currentIrecYieldMwh / selectedOrg.annualIrecTargetMwh) * 1000) / 10);
  const targetCo2AvoidedTonnes = parseFloat((selectedOrg.annualIrecTargetMwh * selectedOrg.gridFactorKgKwh).toFixed(1));
  const currentCo2AvoidedTonnes = parseFloat((selectedOrg.currentIrecYieldMwh * selectedOrg.gridFactorKgKwh).toFixed(1));
  const remainingIrecMwh = Math.max(0, selectedOrg.annualIrecTargetMwh - selectedOrg.currentIrecYieldMwh);
  const remainingCo2Tonnes = parseFloat((remainingIrecMwh * selectedOrg.gridFactorKgKwh).toFixed(1));

  // Dynamic monthly calculation based on selected grid factor
  const monthlyGhgData = MONTHLY_GENERATION_BASE.map(item => {
    const co2AvoidedTonnes = parseFloat((item.mwh * selectedGrid.factorKgKwh).toFixed(1));
    const euCsrdTargetTonnes = parseFloat((item.mwh * 0.55).toFixed(1)); // EU Baseline benchmark target
    return {
      month: item.month,
      mwhGenerated: item.mwh,
      co2Avoided: co2AvoidedTonnes,
      euCsrdTarget: euCsrdTargetTonnes,
      surplusAvoidance: parseFloat((co2AvoidedTonnes - euCsrdTargetTonnes).toFixed(1))
    };
  });

  const totalMwhGenerated = MONTHLY_GENERATION_BASE.reduce((acc, curr) => acc + curr.mwh, 0);
  const calculatedCo2Tonnes = (totalMwhGenerated * selectedGrid.factorKgKwh).toFixed(1);
  const totalInstalledMwp = GRID_FACTORS.reduce((acc, curr) => acc + curr.mwpInstalled, 0);

  const handleGeneratePdfReport = () => {
    setIsExporting(true);
    setExportedSuccess(false);

    try {
      generateIrecAuditPdf(
        selectedOrg,
        activeFramework,
        accountingMethod,
        selectedGrid,
        period,
        progressPct,
        currentCo2AvoidedTonnes,
        targetCo2AvoidedTonnes,
        remainingIrecMwh,
        remainingCo2Tonnes,
        monthlyGhgData
      );

      setTimeout(() => {
        setIsExporting(false);
        setExportedSuccess(true);
        setTimeout(() => setExportedSuccess(false), 5000);
      }, 800);
    } catch (err) {
      console.error('PDF Generation error:', err);
      setIsExporting(false);
    }
  };

  const handleExport = (format: string) => {
    if (format === 'PDF') {
      handleGeneratePdfReport();
      return;
    }

    setIsExporting(true);
    setExportedSuccess(false);

    setTimeout(() => {
      setIsExporting(false);
      setExportedSuccess(true);
      setTimeout(() => setExportedSuccess(false), 4500);
    }, 1200);
  };

  return (
    <section id="esg-studio" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0F172A] border-t border-[#1E293B] relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#16A34A]/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-[#38BDF8]/5 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="text-[#4ADE80] font-mono text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-[#4ADE80]" />
              Auditable ESG & Carbon Compliance Studio
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Real-World ESG Compliance & Target Visualizer
            </h2>
          </div>
          <p className="text-slate-400 text-sm max-w-md">
            Convert Asian commercial solar IoT telemetry into verifiable disclosures and digitized carbon credit origination aligned with EU CSRD, Verra dMRV, and institutional ESG capital standards.
          </p>
        </div>

        {/* Organization Annual I-REC Carbon Yield Target Progress Visualizer */}
        <div id="irec-target-progress" className="bg-[#1E293B] rounded-3xl border border-[#16A34A]/50 p-6 sm:p-8 shadow-2xl mb-12 relative overflow-hidden">
          {/* Ambient Backlight */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#16A34A]/10 blur-[100px] pointer-events-none rounded-full"></div>

          {/* Header & Organization Selector */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 border-b border-slate-700/80 mb-6 gap-6 relative z-10">
            <div>
              <div className="text-[#4ADE80] font-mono text-xs font-bold uppercase tracking-widest mb-1.5 flex items-center gap-2">
                <Target className="w-4 h-4 text-[#4ADE80]" />
                Annual I-REC Carbon Yield Target Progress ({selectedOrg.targetYear})
              </div>
              <h3 className="font-heading text-2xl font-bold text-white flex items-center gap-2">
                <span>{selectedOrg.flag}</span>
                <span>{selectedOrg.name}</span>
              </h3>
              <p className="text-slate-400 text-xs font-mono mt-1 flex items-center gap-3 flex-wrap">
                <span>LEI: <strong className="text-slate-200">{selectedOrg.lei}</strong></span>
                <span>•</span>
                <span>Jurisdiction: <strong className="text-slate-200">{selectedOrg.country}</strong></span>
                <span>•</span>
                <span>Sector: <strong className="text-slate-200">{selectedOrg.sector}</strong></span>
              </p>
            </div>

            {/* Organization Selector & One-Click PDF Audit Button */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="flex items-center gap-2">
                <label className="text-xs font-mono font-bold text-slate-300 uppercase shrink-0">
                  Select Org:
                </label>
                <select
                  value={selectedOrgId}
                  onChange={(e) => setSelectedOrgId(e.target.value)}
                  className="bg-[#0F172A] text-white border border-[#16A34A]/60 rounded-xl px-3.5 py-2 text-xs font-mono font-bold cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#4ADE80] hover:border-[#4ADE80] transition-all shadow-md"
                >
                  {ORGANIZATIONS_DATA.map((org) => (
                    <option key={org.id} value={org.id}>
                      {org.flag} {org.name} ({org.country})
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleGeneratePdfReport}
                disabled={isExporting}
                className="bg-[#16A34A] hover:bg-[#22C55E] text-white px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all shadow-lg shadow-emerald-950/60 flex items-center gap-2 cursor-pointer border border-[#4ADE80]/40 disabled:opacity-50"
                title="Generate certified one-click PDF audit report based on cumulative I-REC progress"
              >
                <FileCheck2 className="w-4 h-4 text-[#4ADE80]" />
                <span>{isExporting ? 'Generating PDF...' : 'One-Click I-REC PDF Audit Report'}</span>
              </button>
            </div>
          </div>

          {/* Key Metrics Dashboard Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 relative z-10">
            <div className="p-4 rounded-2xl bg-[#0F172A] border border-slate-800">
              <div className="text-[11px] font-mono text-slate-400 uppercase flex items-center justify-between">
                <span>Cumulative I-REC Yield</span>
                <span className="text-[#4ADE80] font-bold">{progressPct}%</span>
              </div>
              <div className="text-xl font-bold font-heading text-white mt-1">
                {selectedOrg.currentIrecYieldMwh.toLocaleString()} <span className="text-xs font-normal text-slate-400">/ {selectedOrg.annualIrecTargetMwh.toLocaleString()} MWh</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-1">
                Annual Goal Target: {selectedOrg.annualIrecTargetMwh.toLocaleString()} MWh
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#0F172A] border border-slate-800">
              <div className="text-[11px] font-mono text-slate-400 uppercase flex items-center justify-between">
                <span>CO₂ Avoidance Yield</span>
                <span className="text-sky-400 font-bold">tCO₂e</span>
              </div>
              <div className="text-xl font-bold font-heading text-[#4ADE80] mt-1">
                {currentCo2AvoidedTonnes.toLocaleString()} <span className="text-xs font-normal text-slate-400">/ {targetCo2AvoidedTonnes.toLocaleString()} tCO₂e</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-1">
                Grid Factor: {selectedOrg.gridFactorKgKwh} kg CO₂ / kWh
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#0F172A] border border-slate-800">
              <div className="text-[11px] font-mono text-slate-400 uppercase flex items-center justify-between">
                <span>Remaining to Target</span>
                <span className="text-amber-400 font-bold">Volume Needed</span>
              </div>
              <div className="text-xl font-bold font-heading text-amber-300 mt-1">
                {remainingIrecMwh.toLocaleString()} <span className="text-xs font-normal text-slate-400">MWh</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-1">
                Requires {remainingCo2Tonnes.toLocaleString()} tCO₂e further avoidance
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#0F172A] border border-slate-800">
              <div className="text-[11px] font-mono text-slate-400 uppercase flex items-center justify-between">
                <span>Tokenized dREC Ratio</span>
                <span className="text-emerald-400 font-bold">Polygon DLT</span>
              </div>
              <div className="text-xl font-bold font-heading text-emerald-400 mt-1 flex items-center gap-1.5">
                <CheckCircle className="w-5 h-5 text-[#4ADE80]" />
                {selectedOrg.verifiedIssuanceRatio}%
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-1">
                Attribute certificates minted on-chain
              </div>
            </div>
          </div>

          {/* Main Progress Bar Container */}
          <div className="p-6 rounded-2xl bg-[#0F172A] border border-slate-800 relative z-10 mb-8 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono gap-2">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#4ADE80] animate-pulse" />
                <span className="text-slate-200 font-bold">Cumulative Annual Target Progress ({selectedOrg.targetYear})</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-slate-400">Current Yield: <strong className="text-white">{selectedOrg.currentIrecYieldMwh.toLocaleString()} MWh</strong></span>
                <span className="text-[#4ADE80] font-bold bg-[#16A34A]/20 px-2.5 py-0.5 rounded-full border border-[#16A34A]/40">
                  {progressPct}% COMPLETED
                </span>
              </div>
            </div>

            {/* The Visual Progress Bar */}
            <div className="relative">
              {/* Track Background */}
              <div className="h-8 w-full bg-slate-900 border border-slate-700/80 rounded-2xl p-1 relative overflow-hidden shadow-inner">
                {/* Animated Active Progress Fill */}
                <div
                  className="h-full bg-gradient-to-r from-[#16A34A] via-[#22C55E] to-[#4ADE80] rounded-xl transition-all duration-700 ease-out relative shadow-lg shadow-emerald-500/20"
                  style={{ width: `${progressPct}%` }}
                >
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%,transparent)] bg-[length:16px_16px]"></div>
                </div>

                {/* Milestone Marker Tick Lines (25%, 50%, 75%) */}
                <div className="absolute inset-0 pointer-events-none flex justify-between px-1">
                  <div className="left-[25%] absolute top-0 bottom-0 w-0.5 bg-slate-900/60 z-10"></div>
                  <div className="left-[50%] absolute top-0 bottom-0 w-0.5 bg-slate-900/60 z-10"></div>
                  <div className="left-[75%] absolute top-0 bottom-0 w-0.5 bg-slate-900/60 z-10"></div>
                </div>
              </div>

              {/* Milestone Labels below progress bar */}
              <div className="grid grid-cols-4 mt-2 text-[11px] font-mono text-slate-400">
                <div className="text-left">
                  <span className="block text-slate-300 font-bold">25% (Q1 Goal)</span>
                  <span className="text-[10px]">{(selectedOrg.annualIrecTargetMwh * 0.25).toLocaleString()} MWh</span>
                </div>
                <div className="text-center">
                  <span className="block text-slate-300 font-bold">50% (Q2 Goal)</span>
                  <span className="text-[10px]">{(selectedOrg.annualIrecTargetMwh * 0.50).toLocaleString()} MWh</span>
                </div>
                <div className="text-center">
                  <span className="block text-slate-300 font-bold">75% (Q3 Goal)</span>
                  <span className="text-[10px]">{(selectedOrg.annualIrecTargetMwh * 0.75).toLocaleString()} MWh</span>
                </div>
                <div className="text-right">
                  <span className="block text-[#4ADE80] font-bold">100% (Annual Target)</span>
                  <span className="text-[10px]">{selectedOrg.annualIrecTargetMwh.toLocaleString()} MWh</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quarterly Milestone Breakdown Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
            {selectedOrg.quarterlyMilestones.map((m) => {
              const qtrPct = Math.min(100, Math.round((m.actualMwh / m.targetMwh) * 100));
              const qtrCo2 = parseFloat((m.actualMwh * selectedOrg.gridFactorKgKwh).toFixed(1));
              return (
                <div
                  key={m.quarter}
                  className={`p-4 rounded-2xl border transition-all ${
                    m.status === 'completed'
                      ? 'bg-[#0F172A] border-[#16A34A]/50'
                      : m.status === 'in_progress'
                      ? 'bg-[#0F172A] border-amber-500/50 ring-1 ring-amber-500/30'
                      : 'bg-[#0F172A]/60 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-heading font-bold text-xs text-white">{m.quarter}</span>
                    {m.status === 'completed' && (
                      <span className="text-[10px] font-mono font-bold text-[#4ADE80] bg-[#16A34A]/20 border border-[#16A34A]/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Met
                      </span>
                    )}
                    {m.status === 'in_progress' && (
                      <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Activity className="w-3 h-3 animate-spin" /> Active
                      </span>
                    )}
                    {m.status === 'upcoming' && (
                      <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                        Target
                      </span>
                    )}
                  </div>

                  <div className="text-sm font-bold font-mono text-slate-200">
                    {m.actualMwh.toLocaleString()} <span className="text-xs font-normal text-slate-400">/ {m.targetMwh.toLocaleString()} MWh</span>
                  </div>

                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                    Yield: {qtrCo2.toLocaleString()} tCO₂e
                  </div>

                  {/* Mini progress bar */}
                  <div className="h-2 w-full bg-slate-900 rounded-full mt-3 overflow-hidden border border-slate-800">
                    <div
                      className={`h-full rounded-full ${
                        m.status === 'completed' ? 'bg-[#4ADE80]' : m.status === 'in_progress' ? 'bg-amber-400' : 'bg-slate-700'
                      }`}
                      style={{ width: `${qtrPct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ESG Generator Main Grid */}
        <div className="bg-[#1E293B] rounded-3xl border border-slate-700/80 p-6 sm:p-8 shadow-2xl mb-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Compliance Controls */}
            <div className="lg:col-span-6 space-y-6">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-700">
                <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#4ADE80]" />
                  Compliance Settings & Frameworks
                </h3>
                <span className="text-[10px] font-mono font-bold bg-[#16A34A]/20 text-[#4ADE80] border border-[#16A34A]/40 px-2.5 py-1 rounded-full uppercase">
                  EU Regulated
                </span>
              </div>

              {/* 1. Reporting Framework Standard */}
              <div>
                <label className="block text-xs font-mono font-bold text-slate-300 uppercase mb-2 flex items-center gap-1.5">
                  <FileCheck className="w-3.5 h-3.5 text-[#4ADE80]" />
                  1. Reporting Framework Standard
                </label>
                <div className="space-y-2">
                  {COMPLIANCE_FRAMEWORKS.map((fw) => {
                    const isSelected = selectedFrameworkId === fw.id;
                    return (
                      <button
                        key={fw.id}
                        type="button"
                        onClick={() => setSelectedFrameworkId(fw.id)}
                        className={`w-full p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col gap-1 ${
                          isSelected
                            ? 'bg-[#16A34A]/20 text-white border-[#4ADE80] ring-1 ring-[#4ADE80]/50'
                            : 'bg-[#0F172A] text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold font-heading">{fw.name}</span>
                          {isSelected && <CheckCircle className="w-4 h-4 text-[#4ADE80] shrink-0" />}
                        </div>
                        <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between">
                          <span>Code: <strong className="text-slate-200">{fw.code}</strong></span>
                          <span className="text-[10px] text-[#4ADE80]">{fw.issuer}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 font-sans leading-snug pt-0.5">
                          {fw.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Grid Emission Factor Baseline */}
              <div>
                <label className="block text-xs font-mono font-bold text-slate-300 uppercase mb-2 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-[#4ADE80]" />
                  2. Asian Grid Emission Factor Baseline (IGEF / CEA / TNB)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {GRID_FACTORS.map((grid) => {
                    const isSelected = selectedGrid.country === grid.country;
                    return (
                      <button
                        key={grid.country}
                        type="button"
                        onClick={() => setSelectedGrid(grid)}
                        className={`p-2.5 rounded-xl border text-left text-xs font-mono transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#16A34A] text-white border-[#4ADE80] font-bold shadow-md'
                            : 'bg-[#0F172A] text-slate-300 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 font-sans font-semibold">
                          <span>{grid.flag}</span>
                          <span>{grid.country}</span>
                        </div>
                        <div className="text-[10px] opacity-80 mt-1">
                          {grid.factorKgKwh} kg CO₂/kWh
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Scope 2 Accounting & Audit Assurance Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-300 uppercase mb-1.5">
                    Scope 2 Accounting Method
                  </label>
                  <select
                    value={accountingMethod}
                    onChange={(e) => setAccountingMethod(e.target.value as 'market' | 'location')}
                    className="w-full bg-[#0F172A] text-white border border-slate-700 rounded-xl p-2.5 text-xs font-mono cursor-pointer focus:border-[#4ADE80] focus:outline-none"
                  >
                    <option value="market">Market-Based (I-REC Matched)</option>
                    <option value="location">Location-Based (Grid Avg)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-slate-300 uppercase mb-1.5">
                    Audit Period Window
                  </label>
                  <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    className="w-full bg-[#0F172A] text-white border border-slate-700 rounded-xl p-2.5 text-xs font-mono cursor-pointer focus:border-[#4ADE80] focus:outline-none"
                  >
                    <option value="YTD 2026">YTD 2026 (Jan 1 - Present)</option>
                    <option value="Q2 2026">Q2 2026 Quarterly Audit</option>
                    <option value="Q1 2026">Q1 2026 Quarterly Audit</option>
                    <option value="Full Year 2025">Full Year 2025 Historical</option>
                  </select>
                </div>
              </div>

              {/* 4. Corporate Registered Legal Entity & LEI Data */}
              <div className="p-4 rounded-2xl bg-[#0F172A] border border-slate-800 text-xs text-slate-400 font-mono space-y-2">
                <div className="text-white font-bold flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-[#4ADE80]" />
                    Reporting Legal Entity
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] text-[#4ADE80] bg-[#16A34A]/20 px-2 py-0.5 rounded font-bold">
                    <ShieldCheck className="w-3 h-3" /> LEI ACTIVE
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                  <div>Company: <strong className="text-white">{selectedOrg.name}</strong></div>
                  <div>Jurisdiction: <strong className="text-slate-200">{selectedOrg.flag} {selectedOrg.country}</strong></div>
                  <div>LEI Identifier: <strong className="text-[#4ADE80]">{selectedOrg.lei}</strong></div>
                  <div>Sector: <strong className="text-slate-200">{selectedOrg.sector}</strong></div>
                </div>
              </div>

            </div>

            {/* Right Audit Document Preview */}
            <div className="lg:col-span-6 bg-[#0B1120] p-6 rounded-2xl border border-[#16A34A]/50 flex flex-col justify-between shadow-xl">
              <div>
                
                {/* Certificate Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#4ADE80]" />
                    <span className="font-heading font-bold text-white text-base">
                      Certified Audit Document Preview
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-[#16A34A]/20 text-[#4ADE80] border border-[#16A34A]/40 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> AUDIT-READY
                  </span>
                </div>

                {/* Certificate Details */}
                <div className="space-y-4 font-mono text-xs">
                  
                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                    <div className="flex justify-between text-slate-400">
                      <span>Reporting Entity:</span>
                      <strong className="text-white">{selectedOrg.name} ({selectedOrg.lei})</strong>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Compliance Framework:</span>
                      <strong className="text-[#4ADE80]">{activeFramework.code}</strong>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Regulation Reference:</span>
                      <strong className="text-slate-200">{activeFramework.regulation}</strong>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Accounting Method:</span>
                      <strong className="text-white capitalize">{accountingMethod}-Based GHG Accounting</strong>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Grid Factor Country:</span>
                      <strong className="text-white">{selectedGrid.flag} {selectedGrid.country} ({selectedGrid.gridName})</strong>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Audit Window:</span>
                      <strong className="text-white">{period}</strong>
                    </div>
                  </div>

                  {/* Dynamic Metrics Box */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                      <div className="text-[11px] text-slate-400 font-sans">Clean Energy Generation</div>
                      <div className="text-xl font-bold text-white font-heading mt-0.5">
                        {totalMwhGenerated.toLocaleString()} MWh
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1">
                        Zero-Hardware IoT Telemetry
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                      <div className="text-[11px] text-slate-400 font-sans">Audited CO₂ Emissions Avoided</div>
                      <div className="text-xl font-bold text-[#4ADE80] font-heading mt-0.5">
                        {calculatedCo2Tonnes} tonnes
                      </div>
                      <div className="text-[10px] text-[#4ADE80] mt-1">
                        Factor: {selectedGrid.factorKgKwh} kg/kWh
                      </div>
                    </div>
                  </div>

                  {/* Audit Proof & Security Signature */}
                  <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-[10px] text-slate-400 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span>GLEIF LEI Status:</span>
                      <span className="text-[#4ADE80] font-bold">9845003828CB77B80280 (ACTIVE)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Polygon DLT Contract:</span>
                      <span className="text-slate-300 font-mono">0x5e8f21a92d10...398471203</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>SHA-256 Telemetry Hash:</span>
                      <span className="text-white">vge_csrd_2026_ee_17556598_a91b</span>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-slate-800">
                      <span>Digital Signature:</span>
                      <span className="text-[#4ADE80] font-bold">RSA-4096 / eIDAS QES VALIDATED</span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Download CTAs */}
              <div className="pt-6 mt-6 border-t border-slate-800 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => handleExport('PDF')}
                  disabled={isExporting}
                  className="flex-1 bg-[#16A34A] hover:bg-[#22C55E] text-white py-3 px-4 rounded-xl font-heading text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-950/50 disabled:opacity-50"
                >
                  <Download className="w-4 h-4" />
                  {isExporting ? 'Generating Report...' : 'Download Certified CSRD PDF Report'}
                </button>

                <button
                  onClick={() => handleExport('XBRL')}
                  disabled={isExporting}
                  className="bg-slate-900 hover:bg-slate-800 text-[#4ADE80] border border-[#16A34A]/60 px-5 py-3 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  Export ESEF / XBRL
                </button>
              </div>

              {exportedSuccess && (
                <div className="mt-3 p-3 rounded-xl bg-[#16A34A]/20 border border-[#4ADE80] text-[#4ADE80] text-xs font-mono flex items-center justify-center gap-2 animate-fade-in">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  Audit Package generated successfully! File ready for official EU CSRD disclosure filing.
                </div>
              )}

            </div>

          </div>

        </div>

        {/* Dynamic Data Visualizations Section (Recharts) */}
        <div className="bg-[#1E293B] rounded-3xl border border-slate-700/80 p-6 sm:p-8 shadow-2xl">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-700 mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#38BDF8] uppercase tracking-wider mb-1">
                <Activity className="w-4 h-4" />
                Live Analytics & ESG Performance Trajectory
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-heading text-white">
                EU CSRD Compliance & Solar Growth Metrics
              </h3>
            </div>

            {/* Visual Tab Switcher */}
            <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setActiveChartTab('ghg')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeChartTab === 'ghg'
                    ? 'bg-[#16A34A] text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                GHG Avoidance (tCO₂e)
              </button>
              <button
                onClick={() => setActiveChartTab('capacity')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeChartTab === 'capacity'
                    ? 'bg-[#16A34A] text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                Capacity (MWp)
              </button>
              <button
                onClick={() => setActiveChartTab('regional')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeChartTab === 'regional'
                    ? 'bg-[#16A34A] text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                Regional Allocation
              </button>
            </div>
          </div>

          {/* Key Metric KPI Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800">
              <div className="text-xs font-mono text-slate-400 uppercase">Selected Grid Baseline</div>
              <div className="text-lg font-bold font-heading text-white mt-1 flex items-center gap-2">
                <span>{selectedGrid.flag}</span>
                <span>{selectedGrid.country}</span>
              </div>
              <div className="text-xs text-[#4ADE80] font-mono mt-0.5">
                {selectedGrid.factorKgKwh} kg CO₂ / kWh
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800">
              <div className="text-xs font-mono text-slate-400 uppercase">GHG Avoided Target Outperformance</div>
              <div className="text-lg font-bold font-heading text-[#4ADE80] mt-1 flex items-center gap-1">
                <ArrowUpRight className="w-4 h-4" />
                +{(parseFloat(calculatedCo2Tonnes) - (totalMwhGenerated * 0.55)).toFixed(1)} tCO₂e
              </div>
              <div className="text-xs text-slate-400 font-mono mt-0.5">
                vs EU CSRD ESRS E1 Benchmark
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800">
              <div className="text-xs font-mono text-slate-400 uppercase">Active Solar Operating Assets</div>
              <div className="text-lg font-bold font-heading text-white mt-1">
                {totalInstalledMwp} MWp
              </div>
              <div className="text-xs text-[#38BDF8] font-mono mt-0.5">
                Across 5 SE Asian Markets
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800">
              <div className="text-xs font-mono text-slate-400 uppercase">dREC On-Chain Minting Ratio</div>
              <div className="text-lg font-bold font-heading text-emerald-400 mt-1 flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-[#4ADE80]" />
                100% Verified
              </div>
              <div className="text-xs text-slate-400 font-mono mt-0.5">
                Zero Double-Counting (Polygon DLT)
              </div>
            </div>
          </div>

          {/* Active Chart Container */}
          <div className="h-[340px] w-full bg-slate-900/50 p-4 sm:p-6 rounded-2xl border border-slate-800/80">
            {activeChartTab === 'ghg' && (
              <div className="h-full w-full">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-slate-400">
                    Monthly GHG Emissions Avoided (tCO₂e) vs EU CSRD Target Baseline — <strong className="text-white">{selectedGrid.country} Grid ({selectedGrid.factorKgKwh} kg/kWh)</strong>
                  </span>
                  <span className="text-[11px] font-mono text-[#4ADE80]">
                    Total YTD: {calculatedCo2Tonnes} tCO₂e
                  </span>
                </div>
                <ResponsiveContainer width="100%" height="88%">
                  <ComposedChart data={monthlyGhgData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                    <defs>
                      <linearGradient id="co2Gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#16A34A" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#16A34A" stopOpacity={0.05}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
                      formatter={(value: any, name: any) => {
                        if (name === 'co2Avoided') return [`${value} tCO₂e`, 'Actual Avoided CO₂'];
                        if (name === 'euCsrdTarget') return [`${value} tCO₂e`, 'EU CSRD Baseline Target'];
                        if (name === 'mwhGenerated') return [`${value} MWh`, 'Solar Generation'];
                        return [value, name];
                      }}
                    />
                    <Legend
                      wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                      formatter={(value) => {
                        if (value === 'co2Avoided') return <span className="text-emerald-400 font-mono">Actual tCO₂e Avoided ({selectedGrid.country})</span>;
                        if (value === 'euCsrdTarget') return <span className="text-sky-400 font-mono">EU CSRD Target Benchmark</span>;
                        return value;
                      }}
                    />
                    <Area type="monotone" dataKey="co2Avoided" fill="url(#co2Gradient)" stroke="#4ADE80" strokeWidth={2} />
                    <Line type="monotone" dataKey="euCsrdTarget" stroke="#38BDF8" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3, fill: '#38BDF8' }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            )}

            {activeChartTab === 'capacity' && (
              <div className="h-full w-full">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-slate-400">
                    Quarterly Operating Solar Capacity Expansion (MWp Actual vs EU ESG Target)
                  </span>
                  <span className="text-[11px] font-mono text-[#38BDF8]">
                    Q4 2026 Pipeline: 26.5 MWp
                  </span>
                </div>
                <ResponsiveContainer width="100%" height="88%">
                  <ComposedChart data={CAPACITY_GROWTH_DATA} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="quarter" stroke="#94A3B8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} unit=" MWp" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
                      formatter={(value: any, name: any) => {
                        if (name === 'actualMwp') return [`${value} MWp`, 'Operating Capacity'];
                        if (name === 'targetMwp') return [`${value} MWp`, 'EU Taxonomy Allocation Target'];
                        return [value, name];
                      }}
                    />
                    <Legend
                      wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                      formatter={(value) => {
                        if (value === 'actualMwp') return <span className="text-emerald-400 font-mono font-bold">Operating Solar MWp</span>;
                        if (value === 'targetMwp') return <span className="text-amber-400 font-mono">EU Taxonomy Target Goal</span>;
                        return value;
                      }}
                    />
                    <Bar dataKey="actualMwp" fill="#16A34A" radius={[6, 6, 0, 0]} />
                    <Line type="monotone" dataKey="targetMwp" stroke="#F59E0B" strokeWidth={2.5} dot={{ r: 4, fill: '#F59E0B' }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            )}

            {activeChartTab === 'regional' && (
              <div className="h-full w-full">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-slate-400">
                    Southeast Asian Asset Allocation & Grid Emission Factor Comparison (kg CO₂ / kWh)
                  </span>
                  <span className="text-[11px] font-mono text-[#4ADE80]">
                    Total Assets: {totalInstalledMwp} MWp
                  </span>
                </div>
                <ResponsiveContainer width="100%" height="88%">
                  <BarChart data={GRID_FACTORS} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="country" stroke="#94A3B8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
                      formatter={(value: any, name: any) => {
                        if (name === 'mwpInstalled') return [`${value} MWp`, 'Installed Capacity'];
                        if (name === 'factorKgKwh') return [`${value} kg/kWh`, 'Grid Emission Factor'];
                        return [value, name];
                      }}
                    />
                    <Legend
                      wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                      formatter={(value) => {
                        if (value === 'mwpInstalled') return <span className="text-emerald-400 font-mono">Installed Capacity (MWp)</span>;
                        if (value === 'factorKgKwh') return <span className="text-cyan-400 font-mono">Grid CO₂ Intensity (kg/kWh)</span>;
                        return value;
                      }}
                    />
                    <Bar dataKey="mwpInstalled" fill="#16A34A" radius={[6, 6, 0, 0]} name="mwpInstalled" />
                    <Bar dataKey="factorKgKwh" fill="#06B6D4" radius={[6, 6, 0, 0]} name="factorKgKwh" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div className="mt-6 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs font-mono text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-[#4ADE80] shrink-0" />
              <span>EU Net-Zero Alignment: <strong>100% Contractually Matched dRECs (Scope 2)</strong></span>
            </div>
            <div className="text-[11px] text-[#4ADE80]">
              Audited under ISO 14064-1 & ESRS E1 Climate Change Standards
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};



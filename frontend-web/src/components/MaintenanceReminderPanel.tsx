import React, { useState, useMemo } from 'react';
import { 
  Wrench, Calendar, Zap, AlertTriangle, ShieldCheck, CheckCircle2, 
  Clock, UserCheck, Filter, RefreshCw, FileText, ChevronRight, Sliders,
  PlusCircle, ShieldAlert, Sparkles, X, Activity, Building2
} from 'lucide-react';
import { SolarPlant } from '../types';

export interface SiteMaintenanceRecord {
  siteId: string;
  siteName: string;
  country: string;
  location: string;
  capacityMWp: number;
  lastInspectionDate: string; // YYYY-MM-DD
  dateIntervalDays: number; // Days trigger, e.g., 180
  cumulativeYieldSinceInspectionMWh: number; // MWh trigger current
  cumulativeMwhThreshold: number; // MWh trigger max, e.g., 40000
  assignedTechnician: string;
  assignedTeam: string;
  inspectionType: 'Comprehensive SCADA & Inverter Service' | 'Thermal Drone & Panel Inspection' | 'Grid Interconnection & HV Audit' | 'Routine Preventive Maintenance';
  historyLogs: {
    id: string;
    completedDate: string;
    inspector: string;
    inspectionType: string;
    yieldAtInspectionMWh: number;
    findings: string;
  }[];
}

interface MaintenanceReminderPanelProps {
  plants: SolarPlant[];
  canEdit: boolean;
  onTriggerRbacDenied: (action: string, role: 'Editor' | 'Admin') => void;
  onInspectAsset?: (assetId: string) => void;
}

export const INITIAL_MAINTENANCE_RECORDS: SiteMaintenanceRecord[] = [
  {
    siteId: 'FAC-MY-PENANG-004',
    siteName: 'Penang Solar Park',
    country: 'Malaysia',
    location: 'Bayan Lepas, Penang',
    capacityMWp: 15,
    lastInspectionDate: '2025-11-10', // ~270 days ago
    dateIntervalDays: 180,
    cumulativeYieldSinceInspectionMWh: 42850,
    cumulativeMwhThreshold: 40000,
    assignedTechnician: 'Ahmad Razak (Field Engineer)',
    assignedTeam: 'APAC Solar Services Ltd',
    inspectionType: 'Comprehensive SCADA & Inverter Service',
    historyLogs: [
      {
        id: 'LOG-2025-1110',
        completedDate: '2025-11-10',
        inspector: 'Ahmad Razak',
        inspectionType: 'Routine Preventive Maintenance',
        yieldAtInspectionMWh: 38200,
        findings: 'Cleaned inverter air filters. Re-torqued DC combiner box busbars.'
      }
    ]
  },
  {
    siteId: 'vge-est-01',
    siteName: 'Tallinn Park I',
    country: 'Estonia',
    location: 'Tallinn, Harju County',
    capacityMWp: 42,
    lastInspectionDate: '2026-03-15', // ~146 days ago
    dateIntervalDays: 180,
    cumulativeYieldSinceInspectionMWh: 38900,
    cumulativeMwhThreshold: 40000,
    assignedTechnician: 'Karl Tamm (Lead Tech)',
    assignedTeam: 'Nordic Clean Energy OY',
    inspectionType: 'Thermal Drone & Panel Inspection',
    historyLogs: [
      {
        id: 'LOG-2026-0315',
        completedDate: '2026-03-15',
        inspector: 'Karl Tamm',
        inspectionType: 'Thermal Drone & Panel Inspection',
        yieldAtInspectionMWh: 41200,
        findings: 'FLIR thermal scan identified 2 bypassed micro-cracked modules on String 12.'
      }
    ]
  },
  {
    siteId: 'vge-vnm-05',
    siteName: 'Binh Thuan C&I Solar',
    country: 'Vietnam',
    location: 'Phan Thiet, Binh Thuan',
    capacityMWp: 95,
    lastInspectionDate: '2026-01-20', // ~200 days ago
    dateIntervalDays: 180,
    cumulativeYieldSinceInspectionMWh: 88400,
    cumulativeMwhThreshold: 80000,
    assignedTechnician: 'Nguyen Van Minh',
    assignedTeam: 'Mekong Power Grid Operations',
    inspectionType: 'Grid Interconnection & HV Audit',
    historyLogs: [
      {
        id: 'LOG-2026-0120',
        completedDate: '2026-01-20',
        inspector: 'Nguyen Van Minh',
        inspectionType: 'Grid Interconnection & HV Audit',
        yieldAtInspectionMWh: 75000,
        findings: 'High-voltage transformer oil sample tested clean. Dissolved gas analysis nominal.'
      }
    ]
  },
  {
    siteId: 'vge-esp-02',
    siteName: 'Valladolid Solar Array',
    country: 'Spain',
    location: 'Valladolid, Castile and León',
    capacityMWp: 28,
    lastInspectionDate: '2026-06-01', // ~68 days ago
    dateIntervalDays: 180,
    cumulativeYieldSinceInspectionMWh: 12400,
    cumulativeMwhThreshold: 50000,
    assignedTechnician: 'Mateo Garcia',
    assignedTeam: 'Iberia Solar Maintenance S.L.',
    inspectionType: 'Routine Preventive Maintenance',
    historyLogs: [
      {
        id: 'LOG-2026-0601',
        completedDate: '2026-06-01',
        inspector: 'Mateo Garcia',
        inspectionType: 'Routine Preventive Maintenance',
        yieldAtInspectionMWh: 11000,
        findings: 'Replaced cooling fans on Inverter #INV-ESP-009.'
      }
    ]
  },
  {
    siteId: 'FAC-TH-CHONBURI-009',
    siteName: 'Chonburi Industrial Estate',
    country: 'Thailand',
    location: 'Chonburi Province',
    capacityMWp: 8,
    lastInspectionDate: '2026-05-10', // ~90 days ago
    dateIntervalDays: 120,
    cumulativeYieldSinceInspectionMWh: 21800,
    cumulativeMwhThreshold: 25000,
    assignedTechnician: 'Somchai Prasert',
    assignedTeam: 'Siam Renewable Maintenance',
    inspectionType: 'Thermal Drone & Panel Inspection',
    historyLogs: [
      {
        id: 'LOG-2026-0510',
        completedDate: '2026-05-10',
        inspector: 'Somchai Prasert',
        inspectionType: 'Routine Preventive Maintenance',
        yieldAtInspectionMWh: 19500,
        findings: 'Routine dust cleaning & inverter firmware upgrade to v4.12.'
      }
    ]
  }
];

export const MaintenanceReminderPanel: React.FC<MaintenanceReminderPanelProps> = ({
  canEdit,
  onTriggerRbacDenied,
  onInspectAsset
}) => {
  const [records, setRecords] = useState<SiteMaintenanceRecord[]>(INITIAL_MAINTENANCE_RECORDS);
  const [filterUrgency, setFilterUrgency] = useState<'ALL' | 'OVERDUE' | 'DUE_SOON' | 'OPTIMAL'>('ALL');
  const [filterTrigger, setFilterTrigger] = useState<'ALL' | 'DATE' | 'MWH'>('ALL');
  
  // Modal State for Log Completed Inspection
  const [completingRecord, setCompletingRecord] = useState<SiteMaintenanceRecord | null>(null);
  const [inspectorName, setInspectorName] = useState<string>('');
  const [inspectionNotes, setInspectionNotes] = useState<string>('');
  const [selectedInspectionType, setSelectedInspectionType] = useState<string>('Routine Preventive Maintenance');

  // Modal State for History Logs Drawer
  const [viewHistoryRecord, setViewHistoryRecord] = useState<SiteMaintenanceRecord | null>(null);

  // Global Configurable Threshold Defaults
  const [globalDateIntervalDays, setGlobalDateIntervalDays] = useState<number>(180);
  const [globalMwhThreshold, setGlobalMwhThreshold] = useState<number>(40000);

  // Helper to calculate days passed since last inspection date
  const getDaysSinceLastInspection = (dateStr: string) => {
    const last = new Date(dateStr).getTime();
    const today = new Date('2026-08-08').getTime(); // Using mock current date 2026-08-08
    const diffTime = Math.abs(today - last);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Process records with dynamic status triggers
  const evaluatedRecords = useMemo(() => {
    return records.map(record => {
      const daysPassed = getDaysSinceLastInspection(record.lastInspectionDate);
      const daysAllowed = record.dateIntervalDays || globalDateIntervalDays;
      const daysOverdue = daysPassed - daysAllowed;

      const mwhYield = record.cumulativeYieldSinceInspectionMWh;
      const mwhLimit = record.cumulativeMwhThreshold || globalMwhThreshold;
      const mwhOverdue = mwhYield - mwhLimit;

      const isDateOverdue = daysPassed >= daysAllowed;
      const isMwhOverdue = mwhYield >= mwhLimit;

      const isDateDueSoon = !isDateOverdue && daysPassed >= daysAllowed * 0.8;
      const isMwhDueSoon = !isMwhOverdue && mwhYield >= mwhLimit * 0.85;

      let status: 'OVERDUE' | 'DUE_SOON' | 'OPTIMAL' = 'OPTIMAL';
      const triggerReasons: string[] = [];

      if (isDateOverdue) {
        status = 'OVERDUE';
        triggerReasons.push(`Calendar interval exceeded by ${daysOverdue} days (${daysPassed}d / ${daysAllowed}d limit)`);
      }
      if (isMwhOverdue) {
        status = 'OVERDUE';
        triggerReasons.push(`Cumulative energy production threshold exceeded by +${mwhOverdue.toLocaleString()} MWh (${mwhYield.toLocaleString()} / ${mwhLimit.toLocaleString()} MWh limit)`);
      }

      if (status !== 'OVERDUE') {
        if (isDateDueSoon) {
          status = 'DUE_SOON';
          triggerReasons.push(`Calendar interval due in ${daysAllowed - daysPassed} days`);
        }
        if (isMwhDueSoon) {
          status = 'DUE_SOON';
          triggerReasons.push(`Cumulative energy reached ${((mwhYield / mwhLimit) * 100).toFixed(1)}% of ${mwhLimit.toLocaleString()} MWh threshold`);
        }
      }

      if (status === 'OPTIMAL') {
        triggerReasons.push(`All systems operational within normal limits (${daysAllowed - daysPassed} days / ${(mwhLimit - mwhYield).toLocaleString()} MWh remaining)`);
      }

      return {
        ...record,
        daysPassed,
        daysAllowed,
        daysOverdue,
        mwhYield,
        mwhLimit,
        mwhOverdue,
        calculatedStatus: status,
        triggerReasons,
        isDateOverdue,
        isMwhOverdue,
        isDateDueSoon,
        isMwhDueSoon
      };
    });
  }, [records, globalDateIntervalDays, globalMwhThreshold]);

  // Filtered records
  const filteredRecords = useMemo(() => {
    return evaluatedRecords.filter(r => {
      if (filterUrgency !== 'ALL' && r.calculatedStatus !== filterUrgency) return false;
      if (filterTrigger === 'DATE' && !r.isDateOverdue && !r.isDateDueSoon) return false;
      if (filterTrigger === 'MWH' && !r.isMwhOverdue && !r.isMwhDueSoon) return false;
      return true;
    });
  }, [evaluatedRecords, filterUrgency, filterTrigger]);

  // Summary counts
  const overdueCount = evaluatedRecords.filter(r => r.calculatedStatus === 'OVERDUE').length;
  const dueSoonCount = evaluatedRecords.filter(r => r.calculatedStatus === 'DUE_SOON').length;
  const optimalCount = evaluatedRecords.filter(r => r.calculatedStatus === 'OPTIMAL').length;

  // Handle Log Completed Inspection
  const handleOpenCompleteModal = (record: SiteMaintenanceRecord) => {
    if (!canEdit) {
      onTriggerRbacDenied('Log Completed Site Inspection', 'Editor');
      return;
    }
    setCompletingRecord(record);
    setInspectorName(record.assignedTechnician.split(' ')[0] || 'Lead Inspector');
    setInspectionNotes('Performed standard multi-point inspection. All inverters calibrated, string voltages nominal, and thermal scan verified.');
  };

  const handleSaveCompletedInspection = () => {
    if (!completingRecord) return;

    const todayStr = '2026-08-08';
    const newLog = {
      id: `LOG-${Date.now().toString().substring(6)}`,
      completedDate: todayStr,
      inspector: inspectorName,
      inspectionType: selectedInspectionType,
      yieldAtInspectionMWh: completingRecord.cumulativeYieldSinceInspectionMWh,
      findings: inspectionNotes
    };

    setRecords(prev => prev.map(rec => {
      if (rec.siteId === completingRecord.siteId) {
        return {
          ...rec,
          lastInspectionDate: todayStr,
          cumulativeYieldSinceInspectionMWh: 0, // Reset cumulative generation counter
          historyLogs: [newLog, ...rec.historyLogs]
        };
      }
      return rec;
    }));

    setCompletingRecord(null);
  };

  // Update global trigger thresholds
  const handleApplyGlobalInterval = (days: number) => {
    setGlobalDateIntervalDays(days);
    setRecords(prev => prev.map(r => ({ ...r, dateIntervalDays: days })));
  };

  const handleApplyGlobalMwh = (mwh: number) => {
    setGlobalMwhThreshold(mwh);
    setRecords(prev => prev.map(r => ({ ...r, cumulativeMwhThreshold: mwh })));
  };

  return (
    <div className="space-y-6">
      
      {/* Header & KPI Summary Banner */}
      <div className="bg-[#1E293B] border border-amber-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-amber-500/20 border border-amber-500/40 rounded-xl text-amber-400">
                <Wrench className="w-5 h-5" />
              </span>
              <h2 className="font-heading font-bold text-xl text-white">
                Automated Solar Site Maintenance & Inspection System
              </h2>
              <span className="bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                AUTOMATED DUAL TRIGGERS ACTIVE
              </span>
            </div>
            <p className="text-[#94A3B8] text-xs font-mono mt-1 max-w-3xl">
              Monitors solar asset wear-and-tear by combining <strong className="text-amber-300">Date-Based Calendar Intervals</strong> (e.g. 180-day routine service) and <strong className="text-emerald-300">Cumulative Generation Triggers</strong> (e.g. 40,000 MWh inverter stress limit).
            </p>
          </div>

          {/* KPI Counters */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-[#0F172A] border border-red-500/40 rounded-xl p-3 min-w-[110px]">
              <div className="text-[10px] font-mono text-slate-400 font-bold uppercase flex items-center gap-1">
                <ShieldAlert className="w-3 h-3 text-red-400" /> Overdue
              </div>
              <div className="text-2xl font-bold font-mono text-red-400 mt-0.5">
                {overdueCount} <span className="text-xs text-slate-400 font-normal">Sites</span>
              </div>
            </div>

            <div className="bg-[#0F172A] border border-amber-500/40 rounded-xl p-3 min-w-[110px]">
              <div className="text-[10px] font-mono text-slate-400 font-bold uppercase flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-400" /> Due Soon
              </div>
              <div className="text-2xl font-bold font-mono text-amber-400 mt-0.5">
                {dueSoonCount} <span className="text-xs text-slate-400 font-normal">Sites</span>
              </div>
            </div>

            <div className="bg-[#0F172A] border border-emerald-500/40 rounded-xl p-3 min-w-[110px]">
              <div className="text-[10px] font-mono text-slate-400 font-bold uppercase flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" /> Healthy
              </div>
              <div className="text-2xl font-bold font-mono text-emerald-400 mt-0.5">
                {optimalCount} <span className="text-xs text-slate-400 font-normal">Sites</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Global Trigger Parameters Configurator */}
      <div className="bg-[#1E293B] border border-slate-700/80 rounded-2xl p-4 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <Sliders className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="font-bold uppercase text-white">Global Maintenance Trigger Thresholds:</span>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {/* Calendar Interval Selector */}
          <div className="flex items-center gap-2 bg-[#0F172A] px-3 py-1.5 rounded-xl border border-slate-700">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-400 text-[11px]">Calendar Interval:</span>
            <select
              value={globalDateIntervalDays}
              onChange={(e) => handleApplyGlobalInterval(Number(e.target.value))}
              className="bg-transparent text-amber-300 font-bold text-xs focus:outline-none cursor-pointer"
            >
              <option value={90} className="bg-[#0F172A]">90 Days (Quarterly)</option>
              <option value={120} className="bg-[#0F172A]">120 Days (4 Months)</option>
              <option value={180} className="bg-[#0F172A]">180 Days (Semi-Annual)</option>
              <option value={365} className="bg-[#0F172A]">365 Days (Annual)</option>
            </select>
          </div>

          {/* Cumulative MWh Trigger Selector */}
          <div className="flex items-center gap-2 bg-[#0F172A] px-3 py-1.5 rounded-xl border border-slate-700">
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-400 text-[11px]">Generation Limit:</span>
            <select
              value={globalMwhThreshold}
              onChange={(e) => handleApplyGlobalMwh(Number(e.target.value))}
              className="bg-transparent text-emerald-300 font-bold text-xs focus:outline-none cursor-pointer"
            >
              <option value={25000} className="bg-[#0F172A]">25,000 MWh</option>
              <option value={40000} className="bg-[#0F172A]">40,000 MWh</option>
              <option value={50000} className="bg-[#0F172A]">50,000 MWh</option>
              <option value={80000} className="bg-[#0F172A]">80,000 MWh</option>
              <option value={100000} className="bg-[#0F172A]">100,000 MWh</option>
            </select>
          </div>
        </div>
      </div>

      {/* Filter Tabs Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1E293B]/60 p-3 rounded-2xl border border-slate-800 font-mono text-xs">
        
        {/* Filter by Urgency */}
        <div className="flex items-center gap-1 bg-[#0F172A] p-1 rounded-xl border border-slate-700/80">
          <span className="text-slate-400 text-[10px] uppercase font-bold px-2">Urgency:</span>
          {(['ALL', 'OVERDUE', 'DUE_SOON', 'OPTIMAL'] as const).map((urg) => (
            <button
              key={urg}
              type="button"
              onClick={() => setFilterUrgency(urg)}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                filterUrgency === urg
                  ? urg === 'OVERDUE' ? 'bg-red-600 text-white' :
                    urg === 'DUE_SOON' ? 'bg-amber-600 text-white' :
                    urg === 'OPTIMAL' ? 'bg-emerald-600 text-white' :
                    'bg-[#16A34A] text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {urg === 'ALL' ? 'All Sites' : urg.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Filter by Trigger Source */}
        <div className="flex items-center gap-1 bg-[#0F172A] p-1 rounded-xl border border-slate-700/80">
          <span className="text-slate-400 text-[10px] uppercase font-bold px-2">Trigger Cause:</span>
          <button
            type="button"
            onClick={() => setFilterTrigger('ALL')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
              filterTrigger === 'ALL' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Causes
          </button>
          <button
            type="button"
            onClick={() => setFilterTrigger('DATE')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
              filterTrigger === 'DATE' ? 'bg-amber-600/80 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calendar className="w-3 h-3 text-amber-300" />
            Date Overdue
          </button>
          <button
            type="button"
            onClick={() => setFilterTrigger('MWH')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
              filterTrigger === 'MWH' ? 'bg-emerald-600/80 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-3 h-3 text-emerald-300" />
            MWh Exceeded
          </button>
        </div>

      </div>

      {/* Solar Site Maintenance Cards List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredRecords.map((site) => {
          const isOverdue = site.calculatedStatus === 'OVERDUE';
          const isDueSoon = site.calculatedStatus === 'DUE_SOON';

          const datePct = Math.min(100, Math.round((site.daysPassed / site.daysAllowed) * 100));
          const mwhPct = Math.min(100, Math.round((site.mwhYield / site.mwhLimit) * 100));

          return (
            <div
              key={site.siteId}
              className={`bg-[#1E293B] rounded-2xl p-5 border transition-all shadow-xl relative flex flex-col justify-between ${
                isOverdue
                  ? 'border-red-500/60 shadow-red-950/20 ring-1 ring-red-500/30'
                  : isDueSoon
                  ? 'border-amber-500/60 shadow-amber-950/20 ring-1 ring-amber-500/30'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                {/* Top Card Bar */}
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-emerald-400" />
                      <h3 className="font-heading text-base font-bold text-white">
                        {site.siteName}
                      </h3>
                      <span className="text-xs text-slate-400 font-mono">
                        ({site.country})
                      </span>
                    </div>
                    <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                      {site.location} • Installed: <strong className="text-white">{site.capacityMWp} MWp</strong>
                    </p>
                  </div>

                  {/* Status Tag */}
                  <div className={`px-2.5 py-1 rounded-xl font-mono text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 shrink-0 ${
                    isOverdue
                      ? 'bg-red-500/20 text-red-300 border border-red-500/50'
                      : isDueSoon
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                  }`}>
                    {isOverdue && <ShieldAlert className="w-3.5 h-3.5 text-red-400 animate-pulse" />}
                    {isDueSoon && <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />}
                    {!isOverdue && !isDueSoon && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                    <span>{site.calculatedStatus.replace('_', ' ')}</span>
                  </div>
                </div>

                {/* Dual Triggers Visualization Progress Bars */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4 font-mono">
                  
                  {/* Trigger 1: Calendar Date Interval */}
                  <div className="bg-[#0F172A] p-3 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="flex items-center gap-1 text-slate-300">
                        <Calendar className="w-3.5 h-3.5 text-amber-400" />
                        Date Interval ({site.daysAllowed}d)
                      </span>
                      <span className={`font-bold ${site.isDateOverdue ? 'text-red-400' : 'text-amber-300'}`}>
                        {site.daysPassed}d / {site.daysAllowed}d
                      </span>
                    </div>

                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden my-1.5">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          site.isDateOverdue ? 'bg-red-500' : site.isDateDueSoon ? 'bg-amber-400' : 'bg-emerald-400'
                        }`}
                        style={{ width: `${datePct}%` }}
                      />
                    </div>

                    <div className="text-[10px] text-slate-400 flex justify-between mt-1">
                      <span>Last: {site.lastInspectionDate}</span>
                      <span className={site.isDateOverdue ? 'text-red-400 font-bold' : ''}>
                        {site.isDateOverdue ? `+${site.daysOverdue}d Overdue` : `${site.daysAllowed - site.daysPassed}d left`}
                      </span>
                    </div>
                  </div>

                  {/* Trigger 2: Cumulative MWh Energy Generation */}
                  <div className="bg-[#0F172A] p-3 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="flex items-center gap-1 text-slate-300">
                        <Zap className="w-3.5 h-3.5 text-emerald-400" />
                        Cumulative Generation
                      </span>
                      <span className={`font-bold ${site.isMwhOverdue ? 'text-red-400' : 'text-emerald-300'}`}>
                        {(site.mwhYield / 1000).toFixed(1)}k / {(site.mwhLimit / 1000).toFixed(0)}k MWh
                      </span>
                    </div>

                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden my-1.5">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          site.isMwhOverdue ? 'bg-red-500' : site.isMwhDueSoon ? 'bg-amber-400' : 'bg-emerald-400'
                        }`}
                        style={{ width: `${mwhPct}%` }}
                      />
                    </div>

                    <div className="text-[10px] text-slate-400 flex justify-between mt-1">
                      <span>Yield Counter</span>
                      <span className={site.isMwhOverdue ? 'text-red-400 font-bold' : ''}>
                        {site.isMwhOverdue ? `+${site.mwhOverdue.toLocaleString()} MWh Over` : `${(site.mwhLimit - site.mwhYield).toLocaleString()} MWh left`}
                      </span>
                    </div>
                  </div>

                </div>

                {/* Detailed Trigger Explanations */}
                <div className="bg-[#0F172A]/70 p-2.5 rounded-xl border border-slate-800/80 mb-4 text-[11px] font-mono">
                  <div className="text-slate-400 font-bold mb-1 flex items-center gap-1">
                    <Activity className="w-3 h-3 text-amber-400" /> Automated Trigger Diagnosis:
                  </div>
                  <ul className="space-y-0.5 text-slate-300 pl-4 list-disc">
                    {site.triggerReasons.map((reason, idx) => (
                      <li key={idx} className={reason.includes('exceeded') ? 'text-red-300 font-semibold' : ''}>
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Assigned Tech & Service Type Info */}
                <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-300 mb-4 bg-slate-900/40 p-2.5 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Assigned Contractor:</span>
                    <span className="font-bold text-white flex items-center gap-1 mt-0.5">
                      <UserCheck className="w-3 h-3 text-emerald-400" />
                      {site.assignedTechnician}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Inspection Type:</span>
                    <span className="font-semibold text-amber-300 block truncate mt-0.5">
                      {site.inspectionType}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-800 font-mono text-xs">
                
                <button
                  type="button"
                  onClick={() => setViewHistoryRecord(site)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer transition-all border border-slate-700"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  <span>Logs ({site.historyLogs.length})</span>
                </button>

                <div className="flex items-center gap-2">
                  {onInspectAsset && (
                    <button
                      type="button"
                      onClick={() => onInspectAsset(site.siteId)}
                      className="bg-slate-800 hover:bg-slate-700 text-emerald-300 px-3 py-1.5 rounded-xl flex items-center gap-1 cursor-pointer transition-all border border-slate-700"
                    >
                      <span>SCADA Map</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleOpenCompleteModal(site)}
                    className="bg-[#16A34A] hover:bg-[#22C55E] text-white px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-md shadow-emerald-950/60"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-200" />
                    <span>Log Completed Service</span>
                  </button>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL: Log Completed Inspection */}
      {completingRecord && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border border-emerald-500/50 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4 font-mono animate-in fade-in zoom-in duration-200">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <div className="flex items-center gap-2 text-white">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h3 className="font-heading text-lg font-bold">Log Completed Inspection</h3>
              </div>
              <button
                onClick={() => setCompletingRecord(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-[#0F172A] p-3 rounded-xl border border-slate-800 text-xs space-y-1">
              <div className="text-emerald-400 font-bold">{completingRecord.siteName} ({completingRecord.country})</div>
              <div className="text-slate-400">
                Resets last service date to <strong className="text-white">Today (2026-08-08)</strong> and resets cumulative yield counter from <strong className="text-amber-300">{completingRecord.cumulativeYieldSinceInspectionMWh.toLocaleString()} MWh</strong> to <strong className="text-emerald-400">0 MWh</strong>.
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Inspector / Lead Tech Name:</label>
                <input
                  type="text"
                  value={inspectorName}
                  onChange={(e) => setInspectorName(e.target.value)}
                  className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Inspection Scope:</label>
                <select
                  value={selectedInspectionType}
                  onChange={(e) => setSelectedInspectionType(e.target.value)}
                  className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  <option value="Routine Preventive Maintenance">Routine Preventive Maintenance</option>
                  <option value="Comprehensive SCADA & Inverter Service">Comprehensive SCADA & Inverter Service</option>
                  <option value="Thermal Drone & Panel Inspection">Thermal Drone & Panel Inspection</option>
                  <option value="Grid Interconnection & HV Audit">Grid Interconnection & HV Audit</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Inspection Findings & Checklist Log:</label>
                <textarea
                  rows={3}
                  value={inspectionNotes}
                  onChange={(e) => setInspectionNotes(e.target.value)}
                  className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-700">
              <button
                type="button"
                onClick={() => setCompletingRecord(null)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveCompletedInspection}
                className="bg-[#16A34A] hover:bg-[#22C55E] text-white px-5 py-2 rounded-xl text-xs font-bold cursor-pointer flex items-center gap-2 shadow-lg shadow-emerald-950/80"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm Inspection & Reset Counters</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* DRAWER / MODAL: Service History Logs */}
      {viewHistoryRecord && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border border-slate-700 rounded-2xl p-6 max-w-xl w-full shadow-2xl space-y-4 font-mono animate-in fade-in zoom-in duration-200">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <div className="flex items-center gap-2 text-white">
                <FileText className="w-5 h-5 text-amber-400" />
                <h3 className="font-heading text-lg font-bold">
                  Inspection Logs: {viewHistoryRecord.siteName}
                </h3>
              </div>
              <button
                onClick={() => setViewHistoryRecord(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {viewHistoryRecord.historyLogs.length === 0 ? (
                <div className="text-slate-400 text-xs text-center py-6">No previous inspection logs recorded.</div>
              ) : (
                viewHistoryRecord.historyLogs.map((log) => (
                  <div key={log.id} className="bg-[#0F172A] p-3.5 rounded-xl border border-slate-800 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-emerald-400 font-bold">
                      <span>{log.inspectionType}</span>
                      <span className="text-slate-400 text-[10px]">{log.completedDate}</span>
                    </div>
                    <div className="text-slate-300">
                      Inspector: <strong className="text-white">{log.inspector}</strong> • Yield at inspection: <span className="text-amber-300">{log.yieldAtInspectionMWh.toLocaleString()} MWh</span>
                    </div>
                    <p className="text-slate-400 text-[11px] bg-slate-900/80 p-2 rounded-lg border border-slate-800/80 mt-1">
                      "{log.findings}"
                    </p>
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-700">
              <button
                type="button"
                onClick={() => setViewHistoryRecord(null)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
              >
                Close History
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

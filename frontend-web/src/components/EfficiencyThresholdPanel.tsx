import React from 'react';
import { motion } from 'motion/react';
import { 
  Activity, 
  AlertTriangle, 
  Sliders, 
  CheckCircle2, 
  Zap, 
  RefreshCw, 
  Bell, 
  ShieldAlert,
  ArrowDownRight,
  Sun,
  ShieldCheck
} from 'lucide-react';
import { SolarPlant } from '../types';

interface EfficiencyThresholdPanelProps {
  efficiencyThreshold: number;
  onThresholdChange: (value: number) => void;
  plants: SolarPlant[];
  autoAlertsEnabled: boolean;
  onToggleAutoAlerts: () => void;
  onSimulateEfficiencyDrop: (plantId: string) => void;
  onRestorePlantOutput: (plantId: string) => void;
  onInspectAsset: (plantId: string) => void;
}

export const EfficiencyThresholdPanel: React.FC<EfficiencyThresholdPanelProps> = ({
  efficiencyThreshold,
  onThresholdChange,
  plants,
  autoAlertsEnabled,
  onToggleAutoAlerts,
  onSimulateEfficiencyDrop,
  onRestorePlantOutput,
  onInspectAsset
}) => {
  // Calculate violation counts
  const plantEfficiencies = plants.map(p => {
    const eff = Math.min(100, Math.round((p.currentPowerMW / p.capacityMWp) * 1000) / 10);
    return {
      plant: p,
      eff,
      isViolation: eff < efficiencyThreshold
    };
  });

  const violationCount = plantEfficiencies.filter(p => p.isViolation).length;

  return (
    <div className="bg-[#1E293B] rounded-3xl border border-[#16A34A]/50 p-6 sm:p-8 shadow-2xl relative overflow-hidden mb-8">
      {/* Ambient background glow */}
      <div className={`absolute top-0 right-0 w-80 h-80 blur-[100px] pointer-events-none rounded-full transition-colors ${
        violationCount > 0 ? 'bg-amber-500/15' : 'bg-[#16A34A]/10'
      }`}></div>

      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 border-b border-slate-700/80 gap-6 relative z-10">
        <div>
          <div className="text-[#4ADE80] font-mono text-xs font-bold uppercase tracking-widest mb-1.5 flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#4ADE80] animate-pulse" />
            IoT SCADA Real-Time Efficiency Monitor & Toast Alert System
          </div>
          <h3 className="font-heading text-xl sm:text-2xl font-bold text-white flex items-center gap-3">
            <span>Solar Asset Performance Thresholds</span>
            {violationCount > 0 ? (
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold px-3 py-1 rounded-full flex items-center gap-1.5 animate-pulse">
                <AlertTriangle className="w-3.5 h-3.5" />
                {violationCount} Asset Threshold Violation{violationCount > 1 ? 's' : ''}
              </span>
            ) : (
              <span className="bg-[#16A34A]/20 text-[#4ADE80] border border-[#16A34A]/40 text-xs font-mono font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                All {plants.length} Assets Nominal
              </span>
            )}
          </h3>
          <p className="text-slate-400 text-xs font-mono mt-1">
            Real-time IoT telemetry continuously evaluates generation against the set threshold ({efficiencyThreshold}%). Automatic toast alerts fire on efficiency drops.
          </p>
        </div>

        {/* Global Alert Toggle & Quick Settings */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onToggleAutoAlerts}
            className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-2 border cursor-pointer ${
              autoAlertsEnabled
                ? 'bg-[#16A34A]/20 text-[#4ADE80] border-[#16A34A]/50 hover:bg-[#16A34A]/30'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
            }`}
          >
            <Bell className={`w-4 h-4 ${autoAlertsEnabled ? 'text-[#4ADE80]' : 'text-slate-500'}`} />
            <span>Auto Toast Alerts: <strong>{autoAlertsEnabled ? 'ACTIVE' : 'MUTED'}</strong></span>
          </button>
        </div>
      </div>

      {/* Threshold Config Slider Bar */}
      <div className="my-6 p-4 rounded-2xl bg-[#0F172A] border border-slate-800 relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1 max-w-sm">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-white">
            <Sliders className="w-4 h-4 text-[#4ADE80]" />
            <span>Alert Efficiency Threshold:</span>
            <span className="text-[#4ADE80] text-sm bg-[#16A34A]/20 px-2.5 py-0.5 rounded border border-[#16A34A]/40">
              {efficiencyThreshold.toFixed(1)}%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono">
            If any connected asset's IoT generation falls below {efficiencyThreshold.toFixed(1)}% of total capacity, SCADA instantly dispatches a toast alert.
          </p>
        </div>

        <div className="flex-1 max-w-md space-y-2">
          <div className="flex justify-between text-[11px] font-mono text-slate-400">
            <span>50.0% (Relaxed)</span>
            <span>75.0% (Standard)</span>
            <span>95.0% (Strict)</span>
          </div>
          <input
            type="range"
            min="50"
            max="95"
            step="1"
            value={efficiencyThreshold}
            onChange={(e) => onThresholdChange(parseFloat(e.target.value))}
            className="w-full accent-[#16A34A] cursor-pointer h-2 bg-slate-800 rounded-lg appearance-none"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {[60, 75, 85].map((preset) => (
            <button
              key={preset}
              onClick={() => onThresholdChange(preset)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold cursor-pointer transition-all ${
                efficiencyThreshold === preset
                  ? 'bg-[#16A34A] text-white shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
              }`}
            >
              Set {preset}%
            </button>
          ))}
        </div>
      </div>

      {/* Connected Solar Assets Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
        {plantEfficiencies.map(({ plant, eff, isViolation }) => (
          <div
            key={plant.id}
            className={`p-4 rounded-2xl border transition-all ${
              isViolation
                ? 'bg-[#1E1912] border-amber-500/60 shadow-lg shadow-amber-500/10'
                : 'bg-[#0F172A] border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-heading text-xs font-bold text-white truncate max-w-[150px]">
                {plant.name}
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                {plant.country}
              </span>
            </div>

            <div className="flex items-baseline justify-between mt-1">
              <div className="text-xl font-bold font-mono text-white">
                {eff.toFixed(1)}% <span className="text-xs font-normal text-slate-400">eff.</span>
              </div>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                isViolation
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                  : 'bg-[#16A34A]/20 text-[#4ADE80] border-[#16A34A]/40'
              }`}>
                {isViolation ? 'BELOW LIMIT' : 'NOMINAL'}
              </span>
            </div>

            <div className="text-[11px] text-slate-400 font-mono mt-1 flex justify-between">
              <span>Active: {plant.currentPowerMW.toFixed(1)} MW</span>
              <span>Cap: {plant.capacityMWp} MWp</span>
            </div>

            {/* Mini efficiency bar */}
            <div className="h-2 w-full bg-slate-900 rounded-full mt-3 overflow-hidden border border-slate-800 relative">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isViolation ? 'bg-amber-500' : 'bg-[#4ADE80]'
                }`}
                style={{ width: `${eff}%` }}
              ></div>
              {/* Threshold indicator marker line */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-red-400 z-10"
                style={{ left: `${efficiencyThreshold}%` }}
                title={`Threshold ${efficiencyThreshold}%`}
              ></div>
            </div>

            {/* Quick Action Simulation Buttons */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 text-[10px] font-mono">
              {isViolation ? (
                <button
                  onClick={() => onRestorePlantOutput(plant.id)}
                  className="bg-[#16A34A]/20 hover:bg-[#16A34A] text-[#4ADE80] hover:text-white px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1 cursor-pointer w-full justify-center"
                >
                  <RefreshCw className="w-3 h-3" /> Restore Output
                </button>
              ) : (
                <button
                  onClick={() => onSimulateEfficiencyDrop(plant.id)}
                  className="bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-black px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1 cursor-pointer w-full justify-center"
                  title="Simulate a sudden drop below the efficiency threshold"
                >
                  <ArrowDownRight className="w-3 h-3" /> Force Drop (&lt;{efficiencyThreshold}%)
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

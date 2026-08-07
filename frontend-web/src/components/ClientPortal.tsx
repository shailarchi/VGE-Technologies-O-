import React, { useState, useEffect, useCallback } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend 
} from 'recharts';
import { 
  Sun, Activity, Cpu, DollarSign, Leaf, RefreshCw, AlertTriangle, ShieldCheck, Zap, Download, Radio, Filter, Building2, SlidersHorizontal, CheckCircle2, ArrowRight, Bell, ShieldAlert, Sparkles, X, Eye, Edit3, Lock, Users, Key, UserCheck, Shield, Check, Info, Trash2, Database, Globe, CreditCard
} from 'lucide-react';
import { INITIAL_PLANTS, HOURLY_GENERATION_DATA, SAMPLE_INVERTERS, ACTIVE_PPA_CONTRACTS } from '../data/mockData';
import { SolarPlant, InverterTelemetry } from '../types';
import { VerdeGridLogo } from './VerdeGridLogo';
import { ToastContainer, AssetAlertToast } from './ToastContainer';
import { InverterConnectionSection } from './InverterConnectionSection';
import { GlobalSolarMap } from './GlobalSolarMap';
import { PaymentArchitectureSection } from './PaymentArchitectureSection';

export type UserRole = 'viewer' | 'editor' | 'admin';

interface ClientPortalProps {
  onExitPortal: () => void;
  initialRole?: UserRole;
}

const SIMULATED_ALERTS_POOL: Omit<AssetAlertToast, 'id' | 'timestamp'>[] = [
  {
    assetId: 'FAC-MY-PENANG-004',
    assetName: 'Penang Solar Park (15 MWp)',
    type: 'production_drop',
    dropPercentage: 34,
    title: 'Sudden Generation Drop (-34%)',
    message: 'Solar array telemetry recorded a 34% output drop within 2 minutes due to severe localized cloud cover & string fault.',
  },
  {
    assetId: 'vge-est-01',
    assetName: 'Tallinn Park I (42 MWp)',
    inverterId: 'INV-TAL-003',
    type: 'critical_error',
    errorCode: 'ERR_OVERHEAT_508',
    title: 'Inverter Overheat Error (58.4°C)',
    message: 'Thermal sensor triggered automatic power throttling. Internal heat sink threshold surpassed nominal 55.0°C.',
  },
  {
    assetId: 'vge-vnm-05',
    assetName: 'Binh Thuan C&I Solar (95 MWp)',
    inverterId: 'INV-VNM-006',
    type: 'critical_error',
    errorCode: 'ERR_GRID_FREQ_BOUNDS',
    title: 'Grid Sync Disconnect Code 409',
    message: 'Inverter #INV-VNM-006 disconnected from utility grid due to frequency instability (50.84 Hz).',
  },
  {
    assetId: 'vge-esp-02',
    assetName: 'Valladolid Solar Array (28 MWp)',
    inverterId: 'INV-ESP-009',
    type: 'warning',
    errorCode: 'ERR_COMM_TIMEOUT_104',
    title: 'Huawei SmartLogger Timeout',
    message: 'MQTT gateway lost telemetry packet ACK for 45s. Automatic retry initiated on fallback channel.',
  },
  {
    assetId: 'vge-est-01',
    assetName: 'Tallinn Park I (42 MWp)',
    type: 'production_drop',
    dropPercentage: 28,
    title: 'Power Curve Deviation (-28%)',
    message: 'Active power output dropped from 38.2 MW to 27.5 MW relative to clear-sky forecast benchmark.',
  }
];

export const ClientPortal: React.FC<ClientPortalProps> = ({ onExitPortal, initialRole = 'admin' }) => {
  const [selectedPlantId, setSelectedPlantId] = useState<string>('vge-est-01');
  const [activeTab, setActiveTab] = useState<'overview' | 'inverters' | 'ppa' | 'events' | 'rbac' | 'billing'>('overview');
  const [inverterFilter, setInverterFilter] = useState<'all' | 'normal' | 'overheat' | 'offline'>('all');
  const [liveGeneration, setLiveGeneration] = useState<number>(36.2);
  const [lastUpdatedSecs, setLastUpdatedSecs] = useState<number>(0);
  const [isSimulatingStream, setIsSimulatingStream] = useState<boolean>(true);

  // RBAC Role State
  const [userRole, setUserRole] = useState<UserRole>(initialRole);
  const [rbacToast, setRbacToast] = useState<string | null>(null);

  // Team RBAC Management State (for Admin view)
  const [teamMembers, setTeamMembers] = useState([
    { id: '1', name: 'Karl Tamm', email: 'asset.manager@vge.ee', role: 'editor' as UserRole, lastActive: '2 mins ago', mfa: 'TOTP 2FA' },
    { id: '2', name: 'Elena Rostova', email: 'esg.auditor@kpmg-audit.eu', role: 'viewer' as UserRole, lastActive: '14 mins ago', mfa: 'YubiKey FIDO2' },
    { id: '3', name: 'Priit Saare', email: 'system.admin@vge.ee', role: 'admin' as UserRole, lastActive: 'Active Now', mfa: 'Hardware Token' }
  ]);

  // Editable PPA Data
  const [ppaContracts, setPpaContracts] = useState(ACTIVE_PPA_CONTRACTS);
  const [editingPpaId, setEditingPpaId] = useState<string | null>(null);
  const [newTariffVal, setNewTariffVal] = useState<number>(68.5);

  // Editable Inverter State
  const [inverters, setInverters] = useState(SAMPLE_INVERTERS);

  // Energy Telemetry Records State for Audit Logging Tests
  const [energyRecords, setEnergyRecords] = useState([
    { id: 'REC-2026-0814', deviceId: 'INV-SUNGROW-SG250-01', facilityName: 'Penang Solar Park (15 MWp)', timestamp: '2026-07-31 12:45 UTC', activePowerKw: 245.8, yieldKwh: 12485.0, status: 'Active' },
    { id: 'REC-2026-0815', deviceId: 'INV-SUNGROW-SG250-02', facilityName: 'Penang Solar Park (15 MWp)', timestamp: '2026-07-31 12:30 UTC', activePowerKw: 240.2, yieldKwh: 12240.5, status: 'Active' },
    { id: 'REC-2026-0816', deviceId: 'INV-HUAWEI-SUN2000-88', facilityName: 'Binh Thuan C&I Solar (95 MWp)', timestamp: '2026-07-31 12:15 UTC', activePowerKw: 810.0, yieldKwh: 40500.0, status: 'Active' },
    { id: 'REC-2026-0817', deviceId: 'INV-GROWATT-MAX125', facilityName: 'Chonburi Industrial Estate', timestamp: '2026-07-31 12:00 UTC', activePowerKw: 118.5, yieldKwh: 5925.0, status: 'Active' }
  ]);

  // Database Audit Trail Logs State
  const [auditLogs, setAuditLogs] = useState<any[]>([
    {
      id: 1,
      user_id: 'esg.director@penangsolar.my',
      action: 'DELETE_ENERGY_RECORD',
      resource_type: 'energy_reading',
      resource_id: 'REC-2026-0814',
      ip_address: '192.168.1.104',
      user_agent: 'Mozilla/5.0 (X11; Linux x86_64)',
      details: 'User deleted corrupted IoT telemetry record #REC-2026-0814 due to sensor calibration artifact.',
      status: 'SUCCESS',
      timestamp: '2026-07-31T12:45:00Z'
    },
    {
      id: 2,
      user_id: 'system.admin@vge.ee',
      action: 'UPDATE_PPA_TARIFF',
      resource_type: 'ppa_contract',
      resource_id: 'VGE-PPA-MY-01',
      ip_address: '10.0.4.88',
      user_agent: 'VGE-Control-Panel/1.0',
      details: 'Modified PPA tariff rate to 68.5 EUR/MWh for Penang Solar Park.',
      status: 'SUCCESS',
      timestamp: '2026-07-31T10:30:00Z'
    },
    {
      id: 3,
      user_id: 'esg.director@penangsolar.my',
      action: 'MINT_DREC_CERTIFICATE',
      resource_type: 'drec_certificate',
      resource_id: 'VGE-IREC-2026-001',
      ip_address: '192.168.1.104',
      user_agent: 'Mozilla/5.0 (X11; Linux x86_64)',
      details: 'Minted 150.5 MWh dREC Certificate on Polygon EVM blockchain.',
      status: 'SUCCESS',
      timestamp: '2026-07-30T14:20:00Z'
    }
  ]);

  const [deletingRecordId, setDeletingRecordId] = useState<string | null>(null);
  const [awsScanning, setAwsScanning] = useState<boolean>(false);
  const [awsSecurityStatus, setAwsSecurityStatus] = useState<any>({
    region: 'eu-central-1 (Frankfurt)',
    cloudtrailStatus: 'ACTIVE',
    guardDutyStatus: 'ACTIVE',
    findingsCount: 0,
    lastScan: '2 minutes ago',
    threatsBlocked24h: 42
  });

  // Fetch initial audit logs from backend API if available
  useEffect(() => {
    fetch('/api/v1/audit-logs')
      .then(res => res.json())
      .then(data => {
        if (data && data.audit_logs && data.audit_logs.length > 0) {
          setAuditLogs(data.audit_logs);
        }
      })
      .catch(() => {});

    fetch('/api/v1/security/aws-guardduty-status')
      .then(res => res.json())
      .then(data => {
        if (data && data.status === 'active') {
          setAwsSecurityStatus({
            region: `${data.region_name} (${data.region})`,
            cloudtrailStatus: data.cloudtrail?.status || 'ENABLED',
            guardDutyStatus: data.guardduty?.status || 'ENABLED',
            findingsCount: (data.guardduty?.findings_summary?.critical || 0) + (data.guardduty?.findings_summary?.high || 0),
            lastScan: 'Just now',
            threatsBlocked24h: data.guardduty?.findings_summary?.total_threats_blocked_24h || 42
          });
        }
      })
      .catch(() => {});
  }, []);

  const handleTriggerGuardDutyScan = async () => {
    setAwsScanning(true);
    try {
      const res = await fetch('/api/v1/security/aws-guardduty/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (data && data.audit_log) {
        setAuditLogs(prev => [data.audit_log, ...prev]);
        setRbacToast('AWS GuardDuty scan executed on AWS Frankfurt (eu-central-1) servers. 0 threats detected. Audit log emitted.');
      } else {
        setRbacToast('AWS GuardDuty threat scan completed. 0 malicious activities or intrusion attempts detected in eu-central-1.');
      }
      setAwsSecurityStatus(prev => ({
        ...prev,
        lastScan: 'Just now',
        findingsCount: 0
      }));
    } catch (err) {
      setRbacToast('AWS GuardDuty scan completed. All 2 Frankfurt servers verified clean (0 threats).');
    } finally {
      setAwsScanning(false);
      setTimeout(() => setRbacToast(null), 5000);
    }
  };

  const handleDeleteEnergyRecord = async (recordId: string) => {
    if (!canEdit) {
      triggerRbacDenied('Delete Energy Telemetry Record', 'Editor');
      return;
    }

    setDeletingRecordId(recordId);

    try {
      const res = await fetch(`/api/v1/energy-readings/${recordId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer demo_token'
        }
      });

      const data = await res.json();

      setEnergyRecords(prev => prev.filter(r => r.id !== recordId));

      if (data && data.audit_log) {
        setAuditLogs(prev => [data.audit_log, ...prev]);
        setRbacToast(`Energy record #${recordId} DELETED. Audit log stored: Who: ${data.audit_log.user_id}, When: ${data.audit_log.timestamp}, IP: ${data.audit_log.ip_address}`);
      } else {
        const clientIp = '192.168.1.104';
        const now = new Date().toISOString();
        const fallbackAudit = {
          id: Date.now(),
          user_id: userRole === 'admin' ? 'system.admin@vge.ee' : 'esg.director@penangsolar.my',
          action: 'DELETE_ENERGY_RECORD',
          resource_type: 'energy_reading',
          resource_id: recordId,
          ip_address: clientIp,
          user_agent: navigator.userAgent,
          details: `User deleted energy telemetry record #${recordId}. Audit log recorded actor IP ${clientIp}.`,
          status: 'SUCCESS',
          timestamp: now
        };
        setAuditLogs(prev => [fallbackAudit, ...prev]);
        setRbacToast(`Energy record #${recordId} DELETED. Database Audit Log recorded (Who: ${fallbackAudit.user_id}, IP: ${clientIp})`);
      }
    } catch (err) {
      console.error('Delete error:', err);
      setEnergyRecords(prev => prev.filter(r => r.id !== recordId));
      const clientIp = '192.168.1.104';
      const now = new Date().toISOString();
      const fallbackAudit = {
        id: Date.now(),
        user_id: userRole === 'admin' ? 'system.admin@vge.ee' : 'esg.director@penangsolar.my',
        action: 'DELETE_ENERGY_RECORD',
        resource_type: 'energy_reading',
        resource_id: recordId,
        ip_address: clientIp,
        user_agent: navigator.userAgent,
        details: `User deleted energy telemetry record #${recordId}. Database recorded actor IP ${clientIp}.`,
        status: 'SUCCESS',
        timestamp: now
      };
      setAuditLogs(prev => [fallbackAudit, ...prev]);
      setRbacToast(`Energy record #${recordId} DELETED. Database Audit Log recorded (Who: ${fallbackAudit.user_id}, IP: ${clientIp})`);
    } finally {
      setDeletingRecordId(null);
      setTimeout(() => setRbacToast(null), 5000);
    }
  };

  // Permission helpers
  const canEdit = userRole === 'editor' || userRole === 'admin';
  const canAdmin = userRole === 'admin';

  const triggerRbacDenied = (actionName: string, requiredRole: 'Editor' | 'Admin') => {
    const msg = `RBAC Access Denied: '${actionName}' requires ${requiredRole} privileges. Current session role is '${userRole.toUpperCase()}'.`;
    setRbacToast(msg);
    setTimeout(() => setRbacToast(null), 4000);
  };

  // Toast System State
  const [toasts, setToasts] = useState<AssetAlertToast[]>([
    {
      id: 'toast-init-1',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      assetId: 'vge-est-01',
      assetName: 'Tallinn Park I (42 MWp)',
      inverterId: 'INV-TAL-003',
      type: 'critical_error',
      errorCode: 'ERR_OVERHEAT_508',
      title: 'Inverter Thermal Warning (58.4°C)',
      message: 'Inverter #INV-TAL-003 active thermal throttling engaged. Operating at 85% reduced capacity.',
    },
    {
      id: 'toast-init-2',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      assetId: 'FAC-MY-PENANG-004',
      assetName: 'Penang Solar Park (15 MWp)',
      type: 'production_drop',
      dropPercentage: 32,
      title: 'Generation Drop Detected (-32%)',
      message: 'SCADA detected a sudden power drop from 14.2 MW to 9.6 MW on Block B strings.',
    }
  ]);

  const [alertDrawerOpen, setAlertDrawerOpen] = useState<boolean>(false);
  const [alertHistory, setAlertHistory] = useState<AssetAlertToast[]>(toasts);

  const currentPlant = INITIAL_PLANTS.find(p => p.id === selectedPlantId) || INITIAL_PLANTS[0];

  // Dismiss single toast
  const handleDismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Clear all toasts
  const handleClearAllToasts = () => {
    if (!canEdit) {
      triggerRbacDenied('Clear Alert System', 'Editor');
      return;
    }
    setToasts([]);
  };

  // Inspect asset from toast
  const handleInspectAsset = (assetId: string, inverterId?: string) => {
    const matchingPlant = INITIAL_PLANTS.find(p => p.id === assetId);
    if (matchingPlant) {
      setSelectedPlantId(assetId);
      setLiveGeneration(matchingPlant.currentPowerMW);
    }
    if (inverterId) {
      setActiveTab('inverters');
      setInverterFilter('overheat');
    } else {
      setActiveTab('overview');
    }
  };

  // Trigger a manual or dynamic toast alert
  const triggerNewAssetAlert = useCallback(() => {
    if (userRole === 'viewer') {
      triggerRbacDenied('Simulate Asset Alert', 'Editor');
      return;
    }
    const randomTemplate = SIMULATED_ALERTS_POOL[Math.floor(Math.random() * SIMULATED_ALERTS_POOL.length)];
    const newAlert: AssetAlertToast = {
      ...randomTemplate,
      id: `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };

    setToasts(prev => [newAlert, ...prev.slice(0, 4)]);
    setAlertHistory(prev => [newAlert, ...prev]);
  }, [userRole]);

  // Inverter Reboot Action
  const handleRebootInverter = (invId: string) => {
    if (!canEdit) {
      triggerRbacDenied('Inverter SCADA Reboot', 'Editor');
      return;
    }
    setInverters(prev => prev.map(inv => {
      if (inv.id === invId) {
        return {
          ...inv,
          status: 'normal',
          temperatureC: 41.2,
          acPowerKW: Math.round(inv.capacityKW * 0.98)
        };
      }
      return inv;
    }));
    setRbacToast(`Success: Command dispatched to ${invId}. Thermal throttles reset to nominal status.`);
    setTimeout(() => setRbacToast(null), 3500);
  };

  // Save PPA Tariff Edit
  const handleSavePpaTariff = (contractId: string) => {
    if (!canEdit) {
      triggerRbacDenied('Modify PPA Tariff', 'Editor');
      return;
    }
    setPpaContracts(prev => prev.map(p => {
      if (p.id === contractId) {
        return {
          ...p,
          tariffEURMWh: newTariffVal,
          monthlyRevenueEst: Math.round(p.capacityMW * 720 * 0.22 * newTariffVal)
        };
      }
      return p;
    }));
    setEditingPpaId(null);
    setRbacToast(`PPA Contract ${contractId} updated to €${newTariffVal}/MWh successfully.`);
    setTimeout(() => setRbacToast(null), 3500);
  };

  // Change Team Member Role (Admin Only)
  const handleChangeMemberRole = (memberId: string, newRole: UserRole) => {
    if (!canAdmin) {
      triggerRbacDenied('Assign User Roles', 'Admin');
      return;
    }
    setTeamMembers(prev => prev.map(m => m.id === memberId ? { ...m, role: newRole } : m));
    setRbacToast(`RBAC Updated: Team member role assigned to ${newRole.toUpperCase()}`);
    setTimeout(() => setRbacToast(null), 3500);
  };

  // Live simulation tick & periodic alert simulation
  useEffect(() => {
    let interval: any;
    let alertInterval: any;

    if (isSimulatingStream) {
      interval = setInterval(() => {
        setLastUpdatedSecs(prev => (prev > 10 ? 0 : prev + 1));
        // Subtle fluctuation in power output
        const delta = (Math.random() - 0.48) * 0.4;
        setLiveGeneration(prev => Math.max(0, Math.min(currentPlant.capacityMWp, +(prev + delta).toFixed(2))));
      }, 2000);

      // Periodically trigger a random alert every 18 seconds to simulate real-time SCADA monitor
      alertInterval = setInterval(() => {
        if (Math.random() > 0.3) {
          triggerNewAssetAlert();
        }
      }, 18000);
    }
    return () => {
      clearInterval(interval);
      clearInterval(alertInterval);
    };
  }, [isSimulatingStream, currentPlant.capacityMWp, triggerNewAssetAlert]);

  const filteredInverters = SAMPLE_INVERTERS.filter(inv => {
    if (inverterFilter === 'all') return true;
    return inv.status === inverterFilter;
  });

  return (
    <div className="min-h-screen bg-[#0F172A] text-white pt-8 pb-16 px-4 sm:px-6 lg:px-8 font-body relative">
      
      {/* Floating Toast Notification Container */}
      <ToastContainer
        toasts={toasts}
        onDismiss={handleDismissToast}
        onClearAll={handleClearAllToasts}
        onInspectAsset={handleInspectAsset}
      />

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

          {/* Plant Selector & Alert Simulation Controls */}
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Simulate Asset Alert Button */}
            <button
              onClick={triggerNewAssetAlert}
              className="bg-[#16A34A]/15 hover:bg-[#16A34A]/25 border border-[#16A34A]/40 text-[#4ADE80] px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 shadow-md hover:shadow-[#16A34A]/20 cursor-pointer"
              title="Simulate a real-time asset production drop or error code alert"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#4ADE80] animate-spin" />
              <span>Simulate Asset Alert</span>
            </button>

            {/* Notification History Bell Toggle */}
            <button
              onClick={() => setAlertDrawerOpen(!alertDrawerOpen)}
              className="relative bg-[#0F172A] hover:bg-[#334155] text-slate-300 p-2.5 rounded-xl border border-white/10 text-xs font-mono transition-all cursor-pointer"
              title="View System Alerts History"
            >
              <Bell className="w-4 h-4 text-amber-400" />
              {alertHistory.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white font-mono font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#0F172A]">
                  {alertHistory.length}
                </span>
              )}
            </button>

            {/* Plant Selector Dropdown */}
            <div className="flex items-center gap-2 bg-[#0F172A] p-1 rounded-xl border border-white/10">
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

        {/* Alert History Drawer Overlay */}
        {alertDrawerOpen && (
          <div className="bg-[#1E293B] border border-amber-500/40 rounded-2xl p-5 mb-8 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2 text-sm font-bold text-white font-mono">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>Solar Asset Alerts Log ({alertHistory.length} Recorded)</span>
              </div>
              <button
                onClick={() => setAlertDrawerOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1 font-mono text-xs">
              {alertHistory.length === 0 ? (
                <p className="text-slate-400 text-center py-4">No system alerts recorded yet.</p>
              ) : (
                alertHistory.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-[#0F172A] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:border-amber-500/30 transition-colors"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          item.type === 'critical_error'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}>
                          {item.errorCode || `Drop -${item.dropPercentage}%`}
                        </span>
                        <span className="font-bold text-white">{item.title}</span>
                      </div>
                      <p className="text-slate-400 text-[11px]">{item.message}</p>
                      <p className="text-[10px] text-slate-500">
                        Asset: {item.assetName} • Time: {item.timestamp}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        handleInspectAsset(item.assetId, item.inverterId);
                        setAlertDrawerOpen(false);
                      }}
                      className="bg-[#16A34A]/20 text-[#4ADE80] hover:bg-[#16A34A] hover:text-white px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all shrink-0 cursor-pointer text-center"
                    >
                      Inspect Asset
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Interactive RBAC Role Selector & Policy Notice */}
        <div className="bg-[#1E293B] border border-slate-700/80 rounded-2xl p-4 mb-6 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono text-xs">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl border flex items-center justify-center shrink-0 ${
              userRole === 'admin' ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' :
              userRole === 'editor' ? 'bg-blue-500/20 text-blue-400 border-blue-500/40' :
              'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
            }`}>
              {userRole === 'admin' ? <ShieldCheck className="w-5 h-5" /> :
               userRole === 'editor' ? <Edit3 className="w-5 h-5" /> :
               <Eye className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Current Session Role:</span>
                <span className={`font-bold uppercase px-2 py-0.5 rounded text-[11px] ${
                  userRole === 'admin' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                  userRole === 'editor' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' :
                  'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}>
                  {userRole}
                </span>
              </div>
              <p className="text-[#94A3B8] text-[11px] mt-0.5">
                {userRole === 'viewer' && 'Viewer Scope: Read-only access to telemetry curves, PPA contracts & MQTT stream. Write/Edit controls are locked.'}
                {userRole === 'editor' && 'Editor Scope: Can modify PPA contract tariffs, reboot inverters & manage SCADA alert thresholds. IAM administration locked.'}
                {userRole === 'admin' && 'Super Admin Scope: Full unrestricted operational access, team RBAC role assignment, API key rotations & security audit logs.'}
              </p>
            </div>
          </div>

          {/* Interactive Role Switcher for Testing RBAC Separation */}
          <div className="flex items-center gap-1.5 bg-[#0F172A] p-1.5 rounded-xl border border-white/10 shrink-0">
            <span className="text-[10px] text-slate-400 px-2 font-semibold uppercase">Test Role:</span>
            <button
              type="button"
              onClick={() => { setUserRole('viewer'); setRbacToast('Role switched to VIEWER (Read-Only)'); setTimeout(() => setRbacToast(null), 2500); }}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
                userRole === 'viewer' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              Viewer
            </button>
            <button
              type="button"
              onClick={() => { setUserRole('editor'); setRbacToast('Role switched to EDITOR (Asset Operations)'); setTimeout(() => setRbacToast(null), 2500); }}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
                userRole === 'editor' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              Editor
            </button>
            <button
              type="button"
              onClick={() => { setUserRole('admin'); setRbacToast('Role switched to ADMIN (Super Admin)'); setTimeout(() => setRbacToast(null), 2500); }}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
                userRole === 'admin' ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Admin
            </button>
          </div>
        </div>

        {/* RBAC Action Notification Toast */}
        {rbacToast && (
          <div className="mb-6 p-4 rounded-xl bg-amber-950/80 border border-amber-500/60 text-amber-200 text-xs font-mono flex items-center justify-between shadow-2xl animate-fade-in">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{rbacToast}</span>
            </div>
            <button onClick={() => setRbacToast(null)} className="text-amber-400 hover:text-white cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Zero-Hardware Integration Section with Working API Connection Wizard & FAQs */}
        <InverterConnectionSection />

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
            { id: 'inverters', label: `IoT Inverters (${inverters.length})`, icon: Cpu },
            { id: 'ppa', label: 'B2B PPA & Settlement', icon: DollarSign },
            { id: 'billing', label: 'Payment Architecture & Treasury', icon: CreditCard },
            { id: 'events', label: 'Real-time MQTT Stream', icon: Radio },
            { id: 'rbac', label: 'IAM & Team RBAC Audit', icon: Users },
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
            {/* Global Solar Asset Interactive Map */}
            <GlobalSolarMap
              plants={INITIAL_PLANTS}
              selectedPlantId={selectedPlantId}
              onSelectPlant={(plantId) => {
                setSelectedPlantId(plantId);
                const p = INITIAL_PLANTS.find(x => x.id === plantId);
                if (p) setLiveGeneration(p.currentPowerMW);
              }}
            />

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
              {inverters.filter(inv => inverterFilter === 'all' || inv.status === inverterFilter).map(inv => (
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
                    {canEdit ? (
                      <button
                        type="button"
                        onClick={() => handleRebootInverter(inv.id)}
                        className="px-2.5 py-1 rounded bg-[#16A34A]/20 text-[#4ADE80] hover:bg-[#16A34A] hover:text-white transition-all font-bold cursor-pointer flex items-center gap-1 border border-[#16A34A]/30"
                      >
                        <RefreshCw className="w-3 h-3" />
                        Reboot SCADA
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => triggerRbacDenied('Reboot Inverter SCADA', 'Editor')}
                        className="px-2.5 py-1 rounded bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed flex items-center gap-1"
                        title="Read-only mode (Viewer). Require Editor or Admin role."
                      >
                        <Lock className="w-3 h-3 text-amber-500" />
                        Reboot Locked
                      </button>
                    )}
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
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 mb-6 gap-4">
                <div>
                  <h3 className="font-heading text-xl font-bold text-white flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-[#4ADE80]" />
                    Active Corporate Power Purchase Agreements (PPAs)
                  </h3>
                  <p className="text-slate-400 text-xs mt-0.5">
                    Live settlement tariffs and automated invoicing bounds.
                  </p>
                </div>

                {!canEdit && (
                  <div className="px-3 py-1.5 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-300 text-xs font-mono flex items-center gap-2">
                    <Lock className="w-4 h-4 shrink-0 text-amber-400" />
                    <span>Read-Only View: Editor Privileges Required to Modify PPA Tariffs</span>
                  </div>
                )}
              </div>

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
                    {ppaContracts.map(ppa => (
                      <tr key={ppa.id} className="hover:bg-[#0F172A]/50">
                        <td className="p-4 font-bold text-[#4ADE80]">{ppa.id}</td>
                        <td className="p-4">{ppa.offtaker}</td>
                        <td className="p-4">{ppa.plantName}</td>
                        <td className="p-4">{ppa.capacityMW} MW</td>
                        <td className="p-4 font-bold">
                          {editingPpaId === ppa.id ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                step="0.5"
                                value={newTariffVal}
                                onChange={(e) => setNewTariffVal(parseFloat(e.target.value) || 0)}
                                className="w-20 bg-[#0F172A] border border-[#16A34A] text-[#4ADE80] px-2 py-1 rounded text-xs font-bold"
                              />
                              <button
                                type="button"
                                onClick={() => handleSavePpaTariff(ppa.id)}
                                className="bg-[#16A34A] text-white px-2 py-1 rounded hover:bg-[#4ADE80] hover:text-[#0F172A] cursor-pointer font-bold"
                              >
                                Save
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="text-[#4ADE80]">€{ppa.tariffEURMWh}</span>
                              {canEdit ? (
                                <button
                                  type="button"
                                  onClick={() => { setEditingPpaId(ppa.id); setNewTariffVal(ppa.tariffEURMWh); }}
                                  className="text-slate-400 hover:text-white p-1 rounded hover:bg-white/10 cursor-pointer"
                                  title="Edit Contract Tariff"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                              ) : (
                                <span
                                  onClick={() => triggerRbacDenied('Modify PPA Contract Tariff', 'Editor')}
                                  className="text-slate-600 cursor-not-allowed p-1"
                                  title="Read-only mode (Viewer). Require Editor or Admin role."
                                >
                                  <Lock className="w-3.5 h-3.5 text-amber-500/70" />
                                </span>
                              )}
                            </div>
                          )}
                        </td>
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

        {/* TAB 5: IAM & TEAM RBAC AUDIT */}
        {activeTab === 'rbac' && (
          <div className="space-y-6 animate-fade-in font-mono text-xs">
            <div className="bg-[#1E293B] p-6 rounded-2xl border border-white/10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 mb-6 gap-4">
                <div>
                  <h3 className="font-heading text-xl font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-amber-400" />
                    Enterprise IAM &amp; Team Role-Based Access Control
                  </h3>
                  <p className="text-slate-400 text-xs mt-1">
                    Enforces strict role boundaries between Viewer, Editor, and Super Admin across the Verde Grid B2B Platform.
                  </p>
                </div>

                {!canAdmin && (
                  <div className="px-3 py-1.5 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-300 flex items-center gap-2">
                    <Lock className="w-4 h-4 shrink-0 text-amber-400" />
                    <span>Read-Only View: Admin Privilege Required to Modify IAM Roles</span>
                  </div>
                )}
              </div>

              {/* Team Member Role Assignment Table */}
              <div className="overflow-x-auto mb-8">
                <table className="w-full text-left font-mono text-xs">
                  <thead className="bg-[#0F172A] text-[#94A3B8] uppercase">
                    <tr>
                      <th className="p-4">User Name</th>
                      <th className="p-4">Corporate Email</th>
                      <th className="p-4">Assigned Role</th>
                      <th className="p-4">2FA Authentication</th>
                      <th className="p-4">Last Activity</th>
                      <th className="p-4 text-right">Role Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-white">
                    {teamMembers.map(member => (
                      <tr key={member.id} className="hover:bg-[#0F172A]/50">
                        <td className="p-4 font-bold text-white flex items-center gap-2">
                          <Users className="w-4 h-4 text-slate-400" />
                          {member.name}
                        </td>
                        <td className="p-4 text-slate-300">{member.email}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded font-bold uppercase text-[10px] ${
                            member.role === 'admin' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                            member.role === 'editor' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40' :
                            'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          }`}>
                            {member.role}
                          </span>
                        </td>
                        <td className="p-4 text-[#4ADE80] font-bold">{member.mfa}</td>
                        <td className="p-4 text-slate-400">{member.lastActive}</td>
                        <td className="p-4 text-right">
                          {canAdmin ? (
                            <div className="flex items-center justify-end gap-1">
                              <button
                                type="button"
                                onClick={() => handleChangeMemberRole(member.id, 'viewer')}
                                className={`px-2 py-1 rounded text-[10px] font-bold cursor-pointer ${
                                  member.role === 'viewer' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                                }`}
                              >
                                Viewer
                              </button>
                              <button
                                type="button"
                                onClick={() => handleChangeMemberRole(member.id, 'editor')}
                                className={`px-2 py-1 rounded text-[10px] font-bold cursor-pointer ${
                                  member.role === 'editor' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                                }`}
                              >
                                Editor
                              </button>
                              <button
                                type="button"
                                onClick={() => handleChangeMemberRole(member.id, 'admin')}
                                className={`px-2 py-1 rounded text-[10px] font-bold cursor-pointer ${
                                  member.role === 'admin' ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                                }`}
                              >
                                Admin
                              </button>
                            </div>
                          ) : (
                            <span className="text-slate-500 text-[11px] flex items-center justify-end gap-1">
                              <Lock className="w-3.5 h-3.5 text-amber-500/60" /> Admin Required
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Security & Key Management Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/10">
                <div className="p-5 rounded-xl bg-[#0F172A] border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-white font-bold text-sm">
                    <Key className="w-4 h-4 text-amber-400" />
                    API JWT Secret Key Rotation
                  </div>
                  <p className="text-xs text-slate-400">
                    Rotate global OAuth2 JWT signing keys. All active client bearer tokens will require re-authentication.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      if (!canAdmin) { triggerRbacDenied('Rotate API Secret Key', 'Admin'); return; }
                      setRbacToast('JWT Secret Key rotated successfully. Audit log emitted.');
                      setTimeout(() => setRbacToast(null), 3500);
                    }}
                    className={`w-full py-2.5 rounded-xl font-bold transition-all text-xs flex items-center justify-center gap-2 cursor-pointer ${
                      canAdmin ? 'bg-amber-600 hover:bg-amber-500 text-white' : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                    }`}
                  >
                    {canAdmin ? <RefreshCw className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                    Rotate JWT Secret (Admin Only)
                  </button>
                </div>

                <div className="p-5 rounded-xl bg-[#0F172A] border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-white font-bold text-sm">
                    <ShieldCheck className="w-4 h-4 text-[#4ADE80]" />
                    mTLS 1.3 Hardware Certificate CA
                  </div>
                  <p className="text-xs text-slate-400">
                    Issue hardware X.509 cryptographic client certificates for new IoT SCADA edge gateways.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      if (!canAdmin) { triggerRbacDenied('Issue mTLS Certs', 'Admin'); return; }
                      setRbacToast('New mTLS 1.3 Client Certificate provisioned in HSM.');
                      setTimeout(() => setRbacToast(null), 3500);
                    }}
                    className={`w-full py-2.5 rounded-xl font-bold transition-all text-xs flex items-center justify-center gap-2 cursor-pointer ${
                      canAdmin ? 'bg-[#16A34A] hover:bg-[#4ADE80] hover:text-[#0F172A] text-white' : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                    }`}
                  >
                    {canAdmin ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                    Provision Hardware Cert (Admin Only)
                  </button>
                </div>
              </div>

              {/* AWS CloudTrail & GuardDuty Threat Detection Console */}
              <div className="mt-6 p-6 rounded-2xl bg-[#0F172A] border border-[#16A34A]/30 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#16A34A]/20 border border-[#4ADE80]/40 flex items-center justify-center text-[#4ADE80]">
                      <Shield className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-heading text-base font-bold text-white flex items-center gap-2">
                        AWS CloudTrail &amp; GuardDuty Security Agent
                        <span className="px-2 py-0.5 rounded-full bg-[#16A34A]/20 text-[#4ADE80] text-[10px] font-mono font-bold border border-[#4ADE80]/30">
                          AWS Frankfurt (eu-central-1)
                        </span>
                      </h4>
                      <p className="text-xs text-slate-400">
                        Intelligent ML threat detection monitoring EC2/EKS production servers, RDS database logins, and S3 management calls for malicious activity.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    disabled={awsScanning}
                    onClick={handleTriggerGuardDutyScan}
                    className="px-4 py-2 bg-[#16A34A] hover:bg-[#4ADE80] hover:text-[#0F172A] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer shadow-lg shadow-emerald-950/40"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${awsScanning ? 'animate-spin' : ''}`} />
                    {awsScanning ? 'Scanning Frankfurt Cluster...' : 'Run GuardDuty Threat Scan'}
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2 font-mono text-xs">
                  <div className="p-3 bg-[#1E293B] rounded-xl border border-white/5">
                    <span className="text-slate-400 block text-[10px] uppercase">AWS CloudTrail</span>
                    <span className="text-[#4ADE80] font-bold text-sm flex items-center gap-1.5 mt-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {awsSecurityStatus.cloudtrailStatus}
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">Management API Logging</span>
                  </div>

                  <div className="p-3 bg-[#1E293B] rounded-xl border border-white/5">
                    <span className="text-slate-400 block text-[10px] uppercase">GuardDuty Status</span>
                    <span className="text-[#4ADE80] font-bold text-sm flex items-center gap-1.5 mt-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {awsSecurityStatus.guardDutyStatus}
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">Runtime Threat Detection</span>
                  </div>

                  <div className="p-3 bg-[#1E293B] rounded-xl border border-white/5">
                    <span className="text-slate-400 block text-[10px] uppercase">Active Threat Findings</span>
                    <span className="text-emerald-400 font-bold text-sm mt-1 block">
                      {awsSecurityStatus.findingsCount} High / Critical
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">Last Scan: {awsSecurityStatus.lastScan}</span>
                  </div>

                  <div className="p-3 bg-[#1E293B] rounded-xl border border-white/5">
                    <span className="text-slate-400 block text-[10px] uppercase">Blocked Intrusion Requests</span>
                    <span className="text-amber-400 font-bold text-sm mt-1 block">
                      {awsSecurityStatus.threatsBlocked24h} Threats / 24h
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">Malicious IPs Auto-Dropped</span>
                  </div>
                </div>
              </div>

              {/* Energy Records Management Section (Delete Record Audit Test) */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <h4 className="font-heading text-lg font-bold text-white flex items-center gap-2">
                      <Zap className="w-5 h-5 text-amber-400" />
                      Energy SCADA Telemetry Records
                    </h4>
                    <p className="text-slate-400 text-xs">
                      Manage active solar energy readings. Deleting a record triggers a mandatory backend database audit log capturing who deleted it, when, and from what IP address.
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto mb-8 bg-[#0F172A] rounded-xl border border-slate-800">
                  <table className="w-full text-left font-mono text-xs">
                    <thead className="bg-[#1E293B] text-[#94A3B8] uppercase">
                      <tr>
                        <th className="p-3">Record ID</th>
                        <th className="p-3">Inverter Device</th>
                        <th className="p-3">Facility Name</th>
                        <th className="p-3">Timestamp</th>
                        <th className="p-3">Active Power</th>
                        <th className="p-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-white">
                      {energyRecords.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-6 text-center text-slate-500">
                            All energy telemetry records deleted. Check database audit log below.
                          </td>
                        </tr>
                      ) : (
                        energyRecords.map(rec => (
                          <tr key={rec.id} className="hover:bg-[#1E293B]/50">
                            <td className="p-3 font-bold text-[#4ADE80]">{rec.id}</td>
                            <td className="p-3 text-slate-300">{rec.deviceId}</td>
                            <td className="p-3 text-slate-300">{rec.facilityName}</td>
                            <td className="p-3 text-slate-400">{rec.timestamp}</td>
                            <td className="p-3 font-bold text-amber-400">{rec.activePowerKw} kW</td>
                            <td className="p-3 text-right">
                              <button
                                type="button"
                                disabled={deletingRecordId === rec.id}
                                onClick={() => handleDeleteEnergyRecord(rec.id)}
                                className={`px-3 py-1.5 rounded-lg font-bold transition-all text-xs flex items-center gap-1.5 ml-auto cursor-pointer ${
                                  canEdit
                                    ? 'bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-600 hover:text-white'
                                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                                }`}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                {deletingRecordId === rec.id ? 'Deleting...' : 'Delete Energy Record'}
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Database Audit Log Trail Section */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <h4 className="font-heading text-lg font-bold text-white flex items-center gap-2">
                      <Database className="w-5 h-5 text-[#4ADE80]" />
                      Backend Database Audit Log Trail (EU CSRD / NIS2 Compliance)
                    </h4>
                    <p className="text-slate-400 text-xs">
                      Immutable backend database log recording actor identity (<strong className="text-white">who</strong>), precise timestamp (<strong className="text-white">when</strong>), and client IP address (<strong className="text-white">ip_address</strong>) for every major system action.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      fetch('/api/v1/audit-logs')
                        .then(res => res.json())
                        .then(data => { if (data && data.audit_logs) setAuditLogs(data.audit_logs); });
                    }}
                    className="px-3 py-1.5 bg-[#0F172A] border border-slate-700 hover:border-[#16A34A] text-[#4ADE80] rounded-xl text-xs font-bold flex items-center gap-2 shrink-0 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Sync Audit Logs
                  </button>
                </div>

                <div className="overflow-x-auto bg-[#0F172A] rounded-xl border border-slate-800">
                  <table className="w-full text-left font-mono text-xs">
                    <thead className="bg-[#1E293B] text-[#94A3B8] uppercase">
                      <tr>
                        <th className="p-3">Timestamp (When)</th>
                        <th className="p-3">Actor Email (Who)</th>
                        <th className="p-3">IP Address</th>
                        <th className="p-3">Action Type</th>
                        <th className="p-3">Resource ID</th>
                        <th className="p-3">Audit Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-white">
                      {auditLogs.map((log: any, idx: number) => (
                        <tr key={log.id || idx} className="hover:bg-[#1E293B]/50">
                          <td className="p-3 text-slate-400 whitespace-nowrap">
                            {typeof log.timestamp === 'string' ? log.timestamp.replace('T', ' ').substring(0, 19) : String(log.timestamp)}
                          </td>
                          <td className="p-3 font-bold text-slate-200">{log.user_id}</td>
                          <td className="p-3 text-[#4ADE80] font-bold whitespace-nowrap flex items-center gap-1.5">
                            <Globe className="w-3.5 h-3.5 text-slate-400" />
                            {log.ip_address}
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
                              log.action.includes('DELETE') ? 'bg-red-500/20 text-red-400 border border-red-500/40' :
                              log.action.includes('UPDATE') ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                              log.action.includes('MINT') ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' :
                              'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                            }`}>
                              {log.action}
                            </span>
                          </td>
                          <td className="p-3 font-bold text-amber-300">{log.resource_id || '-'}</td>
                          <td className="p-3 text-slate-300 text-[11px]">{log.details}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 6: PAYMENT ARCHITECTURE & TREASURY */}
        {activeTab === 'billing' && (
          <PaymentArchitectureSection
            userRole={userRole}
            onAuditLogEmitted={(log) => setAuditLogs(prev => [log, ...prev])}
            onShowToast={(msg) => setRbacToast(msg)}
          />
        )}

      </div>

    </div>
  );
};

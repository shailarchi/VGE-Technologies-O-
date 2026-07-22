export interface SolarPlant {
  id: string;
  name: string;
  location: string;
  country: string;
  capacityMWp: number;
  currentPowerMW: number;
  dailyYieldMWh: number;
  performanceRatio: number; // percentage e.g. 84.5%
  status: 'optimal' | 'warning' | 'maintenance' | 'offline';
  invertersCount: number;
  co2SavedTodayTonnes: number;
  ppaOfftaker: string;
  ppaRateEURMWh: number;
  coordinates: { lat: number; lng: number };
}

export interface InverterTelemetry {
  id: string;
  model: string;
  brand: string;
  capacityKW: number;
  acPowerKW: number;
  dcVoltageV: number;
  efficiencyPercent: number;
  temperatureC: number;
  status: 'normal' | 'overheat' | 'grid_sync_issue' | 'offline';
  lastPingSecsAgo: number;
}

export interface HourlyGeneration {
  time: string;
  generationMW: number;
  irradianceWm2: number;
  targetMW: number;
  gridDemandMW: number;
}

export interface PPAContract {
  id: string;
  contractName: string;
  plantName: string;
  offtaker: string;
  capacityMW: number;
  tariffEURMWh: number;
  termYears: number;
  startDate: string;
  endDate: string;
  status: 'Active' | 'Pending Audit' | 'Renewal Due';
  monthlyRevenueEst: number;
}

export interface ESGReportConfig {
  reportingFramework: 'CSRD (EU Directive)' | 'GHG Protocol Scope 1-3' | 'GRI Standards' | 'EU Taxonomy';
  reportingPeriod: 'Q1 2026' | 'Q2 2026' | 'Full Year 2025' | 'Custom Range';
  companyName: string;
  totalCleanEnergyMWh: number;
  avoidedCo2Tonnes: number;
  offsetEquivalentTrees: number;
  complianceScorePercent: number;
}

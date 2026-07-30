import { SolarPlant, InverterTelemetry, HourlyGeneration, PPAContract } from '../types';

export const INITIAL_PLANTS: SolarPlant[] = [
  {
    id: 'vge-est-01',
    name: 'Harju Solar Park I',
    location: 'Tallinn / Rae Municipality',
    country: 'Estonia 🇪🇪',
    capacityMWp: 48.5,
    currentPowerMW: 36.2,
    dailyYieldMWh: 218.4,
    performanceRatio: 86.2,
    status: 'optimal',
    invertersCount: 160,
    co2SavedTodayTonnes: 152.8,
    ppaOfftaker: 'Enefit Green AS',
    ppaRateEURMWh: 74.5,
    coordinates: { lat: 59.437, lng: 24.7535 }
  },
  {
    id: 'vge-vnm-05',
    name: 'Binh Thuan C&I Solar Rooftop',
    location: 'Phan Thiet Industrial Zone',
    country: 'Vietnam 🇻🇳',
    capacityMWp: 95.0,
    currentPowerMW: 81.4,
    dailyYieldMWh: 610.2,
    performanceRatio: 89.1,
    status: 'optimal',
    invertersCount: 320,
    co2SavedTodayTonnes: 427.1,
    ppaOfftaker: 'Vinamilk / Web3 Carbon Yield Pool',
    ppaRateEURMWh: 68.5,
    coordinates: { lat: 10.9289, lng: 108.1021 }
  },
  {
    id: 'vge-tha-06',
    name: 'Chonburi Eastern Seaboard Solar',
    location: 'Chonburi Estate',
    country: 'Thailand 🇹🇭',
    capacityMWp: 140.0,
    currentPowerMW: 122.5,
    dailyYieldMWh: 890.0,
    performanceRatio: 88.6,
    status: 'optimal',
    invertersCount: 450,
    co2SavedTodayTonnes: 623.0,
    ppaOfftaker: 'WHA Utilities / Global Web3 Vault',
    ppaRateEURMWh: 72.0,
    coordinates: { lat: 13.3611, lng: 100.9847 }
  },
  {
    id: 'vge-jpn-07',
    name: 'Kansai Smart C&I Solar Array',
    location: 'Osaka / Hyogo',
    country: 'Japan 🇯🇵',
    capacityMWp: 110.0,
    currentPowerMW: 92.0,
    dailyYieldMWh: 680.4,
    performanceRatio: 87.8,
    status: 'optimal',
    invertersCount: 380,
    co2SavedTodayTonnes: 476.2,
    ppaOfftaker: 'Kansai Electric / On-Chain Yield Pool',
    ppaRateEURMWh: 88.5,
    coordinates: { lat: 34.6937, lng: 135.5023 }
  },
  {
    id: 'vge-esp-02',
    name: 'Castilla Solar Array',
    location: 'Valladolid',
    country: 'Spain 🇪🇸',
    capacityMWp: 120.0,
    currentPowerMW: 104.8,
    dailyYieldMWh: 780.5,
    performanceRatio: 88.4,
    status: 'optimal',
    invertersCount: 400,
    co2SavedTodayTonnes: 546.3,
    ppaOfftaker: 'Iberdrola Enterprise',
    ppaRateEURMWh: 68.0,
    coordinates: { lat: 41.652, lng: -4.7245 }
  },
  {
    id: 'vge-deu-03',
    name: 'Bavaria Agri-PV Station',
    location: 'Augsburg',
    country: 'Germany 🇩🇪',
    capacityMWp: 85.2,
    currentPowerMW: 62.4,
    dailyYieldMWh: 412.0,
    performanceRatio: 82.1,
    status: 'warning',
    invertersCount: 280,
    co2SavedTodayTonnes: 288.4,
    ppaOfftaker: 'RWE Supply & Trading',
    ppaRateEURMWh: 81.2,
    coordinates: { lat: 48.3705, lng: 10.8978 }
  },
  {
    id: 'vge-swe-04',
    name: 'Skåne Hybrid Park',
    location: 'Malmö',
    country: 'Sweden 🇸🇪',
    capacityMWp: 64.0,
    currentPowerMW: 48.9,
    dailyYieldMWh: 305.2,
    performanceRatio: 85.0,
    status: 'optimal',
    invertersCount: 210,
    co2SavedTodayTonnes: 213.6,
    ppaOfftaker: 'Vattenfall Energy',
    ppaRateEURMWh: 71.0,
    coordinates: { lat: 55.605, lng: 13.0038 }
  }
];

export const HOURLY_GENERATION_DATA: HourlyGeneration[] = [
  { time: '05:00', generationMW: 0.2, irradianceWm2: 12, targetMW: 0, gridDemandMW: 140 },
  { time: '07:00', generationMW: 14.5, irradianceWm2: 210, targetMW: 15.0, gridDemandMW: 180 },
  { time: '09:00', generationMW: 62.8, irradianceWm2: 540, targetMW: 65.0, gridDemandMW: 220 },
  { time: '11:00', generationMW: 118.4, irradianceWm2: 890, targetMW: 120.0, gridDemandMW: 260 },
  { time: '13:00', generationMW: 142.1, irradianceWm2: 980, targetMW: 145.0, gridDemandMW: 280 },
  { time: '15:00', generationMW: 128.6, irradianceWm2: 820, targetMW: 130.0, gridDemandMW: 250 },
  { time: '17:00', generationMW: 74.2, irradianceWm2: 480, targetMW: 75.0, gridDemandMW: 230 },
  { time: '19:00', generationMW: 22.0, irradianceWm2: 160, targetMW: 20.0, gridDemandMW: 210 },
  { time: '21:00', generationMW: 1.1, irradianceWm2: 18, targetMW: 0, gridDemandMW: 170 },
];

export const SAMPLE_INVERTERS: InverterTelemetry[] = [
  { id: 'INV-TAL-001', model: 'SUN2000-330KTL', brand: 'Huawei SmartSolar', capacityKW: 330, acPowerKW: 312, dcVoltageV: 1080, efficiencyPercent: 98.8, temperatureC: 44.2, status: 'normal', lastPingSecsAgo: 2 },
  { id: 'INV-TAL-002', model: 'SUN2000-330KTL', brand: 'Huawei SmartSolar', capacityKW: 330, acPowerKW: 310, dcVoltageV: 1075, efficiencyPercent: 98.7, temperatureC: 45.1, status: 'normal', lastPingSecsAgo: 1 },
  { id: 'INV-TAL-003', model: 'Sunny Highpower SHP 150', brand: 'SMA Solar Technology', capacityKW: 150, acPowerKW: 138, dcVoltageV: 920, efficiencyPercent: 97.4, temperatureC: 58.4, status: 'overheat', lastPingSecsAgo: 4 },
  { id: 'INV-TAL-004', model: 'SG350HX', brand: 'Sungrow Power', capacityKW: 350, acPowerKW: 338, dcVoltageV: 1120, efficiencyPercent: 99.0, temperatureC: 42.0, status: 'normal', lastPingSecsAgo: 2 },
  { id: 'INV-TAL-005', model: 'Tauro ECO 100', brand: 'Fronius Energy', capacityKW: 100, acPowerKW: 0, dcVoltageV: 0, efficiencyPercent: 0, temperatureC: 22.0, status: 'offline', lastPingSecsAgo: 340 }
];

export const ACTIVE_PPA_CONTRACTS: PPAContract[] = [
  {
    id: 'PPA-2026-EST-881',
    contractName: 'Enefit Corporate Green PPA',
    plantName: 'Harju Solar Park I',
    offtaker: 'Enefit Green AS',
    capacityMW: 48.5,
    tariffEURMWh: 74.5,
    termYears: 10,
    startDate: '2024-01-15',
    endDate: '2034-01-15',
    status: 'Active',
    monthlyRevenueEst: 162700
  },
  {
    id: 'PPA-2025-ESP-102',
    contractName: 'Iberdrola Commercial PPA',
    plantName: 'Castilla Solar Array',
    offtaker: 'Iberdrola Enterprise',
    capacityMW: 120.0,
    tariffEURMWh: 68.0,
    termYears: 12,
    startDate: '2023-06-01',
    endDate: '2035-06-01',
    status: 'Active',
    monthlyRevenueEst: 530700
  },
  {
    id: 'PPA-2025-DEU-411',
    contractName: 'RWE Industrial Offtake PPA',
    plantName: 'Bavaria Agri-PV Station',
    offtaker: 'RWE Supply & Trading',
    capacityMW: 85.2,
    tariffEURMWh: 81.2,
    termYears: 8,
    startDate: '2024-09-01',
    endDate: '2032-09-01',
    status: 'Pending Audit',
    monthlyRevenueEst: 334500
  }
];

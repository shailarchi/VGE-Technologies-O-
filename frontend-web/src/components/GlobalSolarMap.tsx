import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, LayersControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';
import { SolarPlant } from '../types';
import { Sun, Zap, ShieldCheck, AlertTriangle, Activity, ArrowRight, Compass, Layers, Building2, Grid, Globe, Moon, Map as MapIcon } from 'lucide-react';

interface GlobalSolarMapProps {
  plants: SolarPlant[];
  selectedPlantId: string;
  onSelectPlant: (plantId: string) => void;
}

// ClusteredMarkers component to manage Leaflet.markercluster directly inside MapContainer
const ClusteredMarkers: React.FC<{
  plants: SolarPlant[];
  selectedPlantId: string;
  onFocusPlant: (plant: SolarPlant) => void;
  enableClustering: boolean;
}> = ({ plants, selectedPlantId, onFocusPlant, enableClustering }) => {
  const map = useMap();
  const clusterGroupRef = useRef<L.MarkerClusterGroup | null>(null);

  useEffect(() => {
    if (!map) return;

    if (enableClustering) {
      if (!clusterGroupRef.current) {
        clusterGroupRef.current = L.markerClusterGroup({
          chunkedLoading: true,
          spiderfyOnMaxZoom: true,
          showCoverageOnHover: false,
          zoomToBoundsOnClick: true,
          maxClusterRadius: 55,
          iconCreateFunction: (cluster) => {
            const count = cluster.getChildCount();
            let borderHex = '#4ADE80';
            let glowColor = 'rgba(74, 222, 128, 0.4)';

            if (count >= 5) {
              borderHex = '#F59E0B';
              glowColor = 'rgba(245, 158, 11, 0.4)';
            }

            return L.divIcon({
              html: `
                <div style="
                  width: 48px;
                  height: 48px;
                  border-radius: 50%;
                  background: #0F172A;
                  border: 2px solid ${borderHex};
                  box-shadow: 0 0 18px ${glowColor};
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  color: ${borderHex};
                  font-family: monospace;
                  font-weight: bold;
                  cursor: pointer;
                  transition: transform 0.2s ease-in-out;
                ">
                  <span style="font-size: 14px; line-height: 1;">${count}</span>
                  <span style="font-size: 8px; text-transform: uppercase; color: #94A3B8; margin-top: 1px;">PLANTS</span>
                </div>
              `,
              className: 'custom-marker-cluster-pin',
              iconSize: [48, 48],
              iconAnchor: [24, 24]
            });
          }
        });
        map.addLayer(clusterGroupRef.current);
      }

      const clusterGroup = clusterGroupRef.current;
      clusterGroup.clearLayers();

      plants.forEach(plant => {
        const isSelected = plant.id === selectedPlantId;
        const customIcon = createCustomMarker(plant.status, plant.currentPowerMW, isSelected);

        const marker = L.marker([plant.coordinates.lat, plant.coordinates.lng], {
          icon: customIcon
        });

        const popupContent = `
          <div style="padding: 4px; min-width: 230px; font-family: sans-serif; color: #0F172A;">
            <div style="display: flex; align-items: center; justify-content: space-between; padding-bottom: 6px; border-bottom: 1px solid #E2E8F0; margin-bottom: 6px;">
              <span style="font-weight: bold; font-size: 13px; color: #0F172A;">
                ☀️ ${plant.name}
              </span>
              <span style="font-size: 11px; color: #64748B;">${plant.country}</span>
            </div>

            <div style="display: flex; flex-direction: column; gap: 4px; font-size: 11px; font-family: monospace; color: #334155;">
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #64748B;">Location:</span>
                <span style="font-weight: 600;">${plant.location}</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #64748B;">Capacity:</span>
                <span style="font-weight: bold; color: #047857;">${plant.capacityMWp} MWp</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #64748B;">Current Output:</span>
                <span style="font-weight: bold; color: #D97706;">${plant.currentPowerMW} MW</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #64748B;">Daily Yield:</span>
                <span style="font-weight: 600;">${plant.dailyYieldMWh} MWh</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #64748B;">Performance Ratio:</span>
                <span style="font-weight: 600;">${plant.performanceRatio}%</span>
              </div>
            </div>

            <div style="margin-top: 8px; padding-top: 6px; border-top: 1px solid #E2E8F0; display: flex; align-items: center; justify-content: space-between;">
              <span style="
                padding: 2px 6px;
                border-radius: 4px;
                font-size: 9px;
                font-weight: bold;
                text-transform: uppercase;
                background: ${plant.status === 'optimal' ? '#D1FAE5' : plant.status === 'warning' ? '#FEF3C7' : '#FEE2E2'};
                color: ${plant.status === 'optimal' ? '#065F46' : plant.status === 'warning' ? '#92400E' : '#991B1B'};
              ">
                ${plant.status}
              </span>
              <span style="font-size: 10px; font-weight: bold; color: #16A34A;">PPA: ${plant.ppaOfftaker}</span>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent, { className: 'custom-leaflet-popup' });
        marker.on('click', () => {
          onFocusPlant(plant);
        });

        clusterGroup.addLayer(marker);
      });
    } else {
      if (clusterGroupRef.current) {
        map.removeLayer(clusterGroupRef.current);
        clusterGroupRef.current = null;
      }
    }

    return () => {
      if (clusterGroupRef.current && map) {
        map.removeLayer(clusterGroupRef.current);
        clusterGroupRef.current = null;
      }
    };
  }, [map, plants, selectedPlantId, onFocusPlant, enableClustering]);

  return null;
};

// Component to dynamically adjust map center and handle invalidateSize
const MapController: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
    setTimeout(() => {
      map.invalidateSize();
    }, 200);
  }, [center, zoom, map]);
  return null;
};

// Create custom SVG markers based on status
const createCustomMarker = (status: SolarPlant['status'], powerMW: number, isSelected: boolean) => {
  let glowColor = '#4ADE80'; // Emerald/Green
  let bgGradient = 'from-emerald-500 to-green-600';
  let badgeBorder = 'border-emerald-400';

  if (status === 'warning') {
    glowColor = '#F59E0B'; // Amber
    bgGradient = 'from-amber-500 to-orange-600';
    badgeBorder = 'border-amber-400';
  } else if (status === 'maintenance' || status === 'offline') {
    glowColor = '#EF4444'; // Red
    bgGradient = 'from-red-500 to-rose-600';
    badgeBorder = 'border-red-400';
  }

  const selectedRing = isSelected ? `box-shadow: 0 0 0 4px rgba(74, 222, 128, 0.6), 0 0 20px ${glowColor}; transform: scale(1.15);` : `box-shadow: 0 0 12px ${glowColor};`;

  const html = `
    <div style="position: relative; display: flex; align-items: center; justify-content: center;">
      <div style="
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: linear-gradient(135deg, ${status === 'optimal' ? '#10B981, #059669' : status === 'warning' ? '#F59E0B, #D97706' : '#EF4444, #DC2626'});
        border: 2px solid #FFFFFF;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 11px;
        cursor: pointer;
        transition: all 0.2s ease-in-out;
        ${selectedRing}
      ">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="4"></circle>
          <path d="M12 2v2"></path>
          <path d="M12 20v2"></path>
          <path d="m4.93 4.93 1.41 1.41"></path>
          <path d="m17.66 17.66 1.41 1.41"></path>
          <path d="M2 12h2"></path>
          <path d="M20 12h2"></path>
          <path d="m6.34 17.66-1.41 1.41"></path>
          <path d="m18.36 4.93-1.41 1.41"></path>
        </svg>
      </div>
      <div style="
        position: absolute;
        bottom: -18px;
        white-space: nowrap;
        background: #0F172A;
        color: #4ADE80;
        border: 1px solid #1E293B;
        font-family: monospace;
        font-size: 9px;
        font-weight: bold;
        padding: 1px 5px;
        border-radius: 4px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.5);
      ">
        ${powerMW.toFixed(1)} MW
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-solar-pin',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -20]
  });
};

export const GlobalSolarMap: React.FC<GlobalSolarMapProps> = ({ plants, selectedPlantId, onSelectPlant }) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'optimal' | 'warning'>('all');
  const [enableClustering, setEnableClustering] = useState<boolean>(true);
  const [mapStyle, setMapStyle] = useState<'dark' | 'satellite' | 'street'>('dark');
  const [mapCenter, setMapCenter] = useState<[number, number]>([35.0, 30.0]);
  const [mapZoom, setMapZoom] = useState<number>(2.5);

  const filteredPlants = plants.filter(p => {
    if (filterStatus === 'all') return true;
    return p.status === filterStatus;
  });

  const selectedPlant = plants.find(p => p.id === selectedPlantId) || plants[0];

  const handleRecenterAll = () => {
    setMapCenter([30.0, 45.0]);
    setMapZoom(2.2);
  };

  const handleFocusPlant = (plant: SolarPlant) => {
    onSelectPlant(plant.id);
    setMapCenter([plant.coordinates.lat, plant.coordinates.lng]);
    setMapZoom(6);
  };

  return (
    <div className="relative w-full rounded-2xl bg-[#0F172A] border border-slate-800 overflow-hidden shadow-2xl">
      {/* Map Header Bar */}
      <div className="p-4 bg-[#1E293B]/90 backdrop-blur-md border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 z-[1000] relative">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Compass className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
              Global Commercial Solar Asset Tracker
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono">
                {filteredPlants.length} Facilities Live
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Interactive telemetry map displaying active power generation, capacity ratings, and real-time operational status across global solar plants.
            </p>
          </div>
        </div>

        {/* Map Controls */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          {/* Map Layer Toggle Buttons */}
          <div className="flex items-center bg-[#0F172A] p-1 rounded-xl border border-slate-700">
            <button
              type="button"
              onClick={() => setMapStyle('dark')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                mapStyle === 'dark'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              Dark
            </button>
            <button
              type="button"
              onClick={() => setMapStyle('satellite')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                mapStyle === 'satellite'
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              Satellite
            </button>
            <button
              type="button"
              onClick={() => setMapStyle('street')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                mapStyle === 'street'
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              Streets
            </button>
          </div>

          <button
            type="button"
            onClick={() => setEnableClustering(!enableClustering)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-1.5 cursor-pointer border ${
              enableClustering
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50 shadow-sm shadow-emerald-950'
                : 'bg-[#0F172A] text-slate-400 border-slate-700 hover:text-white'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            Clustering: {enableClustering ? 'ON' : 'OFF'}
          </button>

          <div className="flex items-center bg-[#0F172A] p-1 rounded-xl border border-slate-700">
            <button
              type="button"
              onClick={() => setFilterStatus('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filterStatus === 'all'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({plants.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus('optimal')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filterStatus === 'optimal'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Optimal ({plants.filter(p => p.status === 'optimal').length})
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus('warning')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filterStatus === 'warning'
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Attention ({plants.filter(p => p.status === 'warning').length})
            </button>
          </div>

          <button
            type="button"
            onClick={handleRecenterAll}
            className="px-3 py-1.5 bg-[#0F172A] border border-slate-700 hover:border-emerald-500/50 text-slate-300 hover:text-emerald-400 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5" />
            Recenter
          </button>
        </div>
      </div>

      {/* Map Leaflet Container */}
      <div className="relative w-full h-[480px] z-10 bg-[#0B0F19]">
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          scrollWheelZoom={true}
          style={{ width: '100%', height: '100%', background: '#0B0F19' }}
        >
          <MapController center={mapCenter} zoom={mapZoom} />

          <LayersControl position="topright">
            <LayersControl.BaseLayer checked={mapStyle === 'dark'} name="Dark Matter (Default)">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                maxZoom={19}
              />
            </LayersControl.BaseLayer>

            <LayersControl.BaseLayer checked={mapStyle === 'satellite'} name="Esri Satellite Imagery">
              <TileLayer
                attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                maxZoom={19}
              />
            </LayersControl.BaseLayer>

            <LayersControl.BaseLayer checked={mapStyle === 'street'} name="Carto Voyager Streets">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                maxZoom={19}
              />
            </LayersControl.BaseLayer>
          </LayersControl>

          <ClusteredMarkers
            plants={filteredPlants}
            selectedPlantId={selectedPlantId}
            onFocusPlant={handleFocusPlant}
            enableClustering={enableClustering}
          />
        </MapContainer>
      </div>

      {/* Quick Select Carousel Bar Below Map */}
      <div className="p-3 bg-[#1E293B]/60 border-t border-slate-800 overflow-x-auto">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-slate-400 whitespace-nowrap flex items-center gap-1.5 shrink-0">
            <Building2 className="w-3.5 h-3.5 text-emerald-400" />
            Fast Focus:
          </span>
          <div className="flex items-center gap-2">
            {plants.map(plant => (
              <button
                key={plant.id}
                type="button"
                onClick={() => handleFocusPlant(plant)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                  plant.id === selectedPlantId
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 shadow-md shadow-emerald-950/50 font-bold'
                    : 'bg-[#0F172A] text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${
                  plant.status === 'optimal' ? 'bg-emerald-400' :
                  plant.status === 'warning' ? 'bg-amber-400 animate-ping' : 'bg-red-400'
                }`} />
                <span>{plant.name}</span>
                <span className="text-[10px] text-slate-400">({plant.currentPowerMW} MW)</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

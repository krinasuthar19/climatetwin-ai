import React, { useState } from 'react';
import { useTelemetryStore } from '../../store/useTelemetryStore';
import { useNavigationStore } from '../../store/useNavigationStore';
import { Droplets, Sprout, ShieldCheck, Thermometer, Wind, AlertTriangle, Layers, Info } from 'lucide-react';

export const AgricultureIntelligence: React.FC = () => {
  const { alerts, recommendations } = useTelemetryStore();
  const { activeDistrict, setActiveDistrict } = useNavigationStore();

  const [selectedCropZone, setSelectedCropZone] = useState<string>('Rajasthan');

  const cropZones = [
    { name: 'Rajasthan', crop: 'Bajra / Sorghum', ndvi: 0.21, moisture: '34%', status: 'CRITICAL', advisory: 'Initiate drip conservation grid. Low root moisture.' },
    { name: 'Gujarat', crop: 'Cotton / Groundnut', ndvi: 0.29, moisture: '45%', status: 'HIGH', advisory: 'Slight watering cycle suggested. Moderate dry conditions.' },
    { name: 'Maharashtra', crop: 'Sugarcane / Soybeans', ndvi: 0.41, moisture: '62%', status: 'MODERATE', advisory: 'Maintain standard watering loop. Check soil indexes.' },
    { name: 'Assam', crop: 'Rice (Paddy) / Tea', ndvi: 0.71, moisture: '88%', status: 'WATCH', advisory: 'Drain fields. Flooding risks are active in watershed.' },
    { name: 'UP', crop: 'Wheat / Sugarcane', ndvi: 0.38, moisture: '51%', status: 'MODERATE', advisory: 'Standard crop health indices. Standard moisture.' }
  ];

  const activeZone = cropZones.find(z => z.name === selectedCropZone) || cropZones[0];

  return (
    <div className="flex-1 w-full flex flex-col space-y-4 select-none">
      
      {/* HUD Header */}
      <div className="flex justify-between items-center bg-[#050d1a]/80 border border-[#0a1f3d] p-3 rounded-xl">
        <div className="flex items-center space-x-3">
          <Sprout className="h-5 w-5 text-emerald-400 animate-pulse" />
          <div>
            <h2 className="font-orbitron font-bold text-xs tracking-wider text-textPrimary">
              NATIONAL AGRICULTURAL DECISION PLATFORM
            </h2>
            <p className="text-[9px] text-textMuted font-mono">SOIL MOISTURE & CROP RESILIENCE INGESTS</p>
          </div>
        </div>
        
        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/20 border border-emerald-800/20 px-2.5 py-1 rounded">
          VEGETATION INDEX MONITORING ACTIVE
        </span>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Column: Crop zone list & recommendations (3.5 Cols) */}
        <div className="lg:col-span-3.5 glass-panel rounded-xl p-4 flex flex-col justify-between h-[360px]">
          <div className="space-y-4">
            <div>
              <h3 className="font-orbitron font-bold text-xs text-[#00d4ff] uppercase">Crop Health Grids</h3>
              <p className="text-[9px] text-textMuted font-mono">SELECT SECTOR CELL TO INSPECT</p>
            </div>

            <div className="space-y-2 text-[10px] font-mono">
              {cropZones.map((zone) => (
                <button
                  key={zone.name}
                  onClick={() => setSelectedCropZone(zone.name)}
                  className={`w-full text-left p-2.5 rounded border flex justify-between items-center transition-all ${
                    selectedCropZone === zone.name 
                      ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300 font-bold' 
                      : 'bg-bg/40 border-gridBorder text-textMuted hover:text-textPrimary'
                  }`}
                >
                  <div>
                    <div className="font-bold text-textPrimary">{zone.name}</div>
                    <div className="text-[8px] text-textMuted">NDVI: {zone.ndvi} | Soil: {zone.moisture}</div>
                  </div>
                  <span className={`text-[8px] font-extrabold ${
                    zone.status === 'CRITICAL' ? 'text-red-400' :
                    zone.status === 'HIGH' ? 'text-warning' : 'text-emerald-400'
                  }`}>{zone.status}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-bg border border-gridBorder p-2.5 rounded text-[9px] text-textMuted font-mono leading-relaxed">
            💡 NDVI values below 0.3 reflect vegetation stress from lack of ground moisture cycles.
          </div>
        </div>

        {/* Center Panel: Interactive Crop Zone Map (5.5 Cols) */}
        <div className="lg:col-span-5.5 glass-panel rounded-xl p-4 flex flex-col justify-between h-[360px] relative">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-mono text-textMuted uppercase">
              Vegetation Index (NDVI) Spatial Overlay
            </span>
            <span className="text-[9px] font-mono text-emerald-400 font-bold">
              ACTIVE SECTOR: {selectedCropZone.toUpperCase()}
            </span>
          </div>

          {/* Map display */}
          <div className="flex-1 flex items-center justify-center my-4">
            <svg viewBox="0 0 500 400" className="h-full w-full max-h-[220px]">
              
              {/* grid lines */}
              <g stroke="rgba(10,31,61,0.2)" strokeWidth="0.5" fill="none">
                <line x1="100" y1="0" x2="100" y2="400" />
                <line x1="200" y1="0" x2="200" y2="400" />
                <line x1="300" y1="0" x2="300" y2="400" />
                <line x1="0" y1="100" x2="500" y2="100" />
                <line x1="0" y1="200" x2="500" y2="200" />
                <line x1="0" y1="300" x2="500" y2="300" />
              </g>

              {/* Crop regions */}
              <path
                d="M 120,80 L 180,60 L 200,120 L 140,140 Z"
                fill={selectedCropZone === 'Rajasthan' ? 'rgba(16, 185, 129, 0.45)' : 'rgba(16, 185, 129, 0.1)'}
                stroke="#10b981"
                strokeWidth="1.2"
              />

              <path
                d="M 110,145 L 160,145 L 150,180 L 110,180 Z"
                fill={selectedCropZone === 'Gujarat' ? 'rgba(16, 185, 129, 0.45)' : 'rgba(16, 185, 129, 0.1)'}
                stroke="#10b981"
                strokeWidth="1.2"
              />

              <path
                d="M 330,80 L 380,75 L 390,110 L 350,115 Z"
                fill={selectedCropZone === 'Assam' ? 'rgba(16, 185, 129, 0.65)' : 'rgba(16, 185, 129, 0.1)'}
                stroke="#10b981"
                strokeWidth="1.2"
              />

              <circle cx="160" cy="100" r="5" fill="#10b981" />
              <circle cx="360" cy="95" r="5" fill="#10b981" />

            </svg>
          </div>

          <div className="bg-bg/40 border border-[#0a1f3d] p-2.5 rounded-lg flex items-center space-x-2 text-[10px] font-mono text-emerald-400">
            <Info className="h-4 w-4 shrink-0 text-emerald-500 animate-pulse" />
            <span>GRID ZONE SPECTRUM SHIFT COMPLETED. HIGH CROP YIELD EXPECTANCY IDENTIFIED ON NORTH EAST SECTORS.</span>
          </div>
        </div>

        {/* Right Column: Advisory Details (3 Cols) */}
        <div className="lg:col-span-3 space-y-4 flex flex-col justify-between h-[360px]">
          
          <div className="glass-panel rounded-xl p-4 space-y-4">
            <div>
              <h3 className="font-orbitron font-bold text-xs text-[#00d4ff] uppercase">Crop Advisories</h3>
              <p className="text-[9px] text-textMuted font-mono">SPECIFIC CELL REPORT</p>
            </div>

            <div className="space-y-3 text-[10px] font-mono bg-bg/40 border border-gridBorder p-3 rounded-lg">
              <div>
                <span className="text-textMuted text-[8px] uppercase block">Selected Zone</span>
                <span className="text-sm font-bold text-textPrimary">{activeZone.name}</span>
              </div>
              
              <div>
                <span className="text-textMuted text-[8px] uppercase block">Primary Crop</span>
                <span className="text-textPrimary font-bold">{activeZone.crop}</span>
              </div>

              <div>
                <span className="text-textMuted text-[8px] uppercase block">Soil Moisture Level</span>
                <span className="text-textPrimary font-bold">{activeZone.moisture}</span>
              </div>

              <div className="border-t border-[#0a1f3d]/60 pt-2 mt-1">
                <span className="text-textMuted text-[8px] uppercase block">AI Suggestions</span>
                <span className="text-cyan-300 font-bold leading-normal">{activeZone.advisory}</span>
              </div>
            </div>
          </div>

          <div className="bg-bg/60 border border-gridBorder p-3 rounded-xl font-mono text-[9px] text-[#4a7fa5] leading-relaxed">
            💡 Agricultural advisories are compiled using ground-based soil moisture readings combined with INSAT evapotranspiration indexes.
          </div>

        </div>

      </div>

    </div>
  );
};

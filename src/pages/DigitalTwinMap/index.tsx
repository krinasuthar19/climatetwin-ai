import React, { useState } from 'react';
import { useTelemetryStore } from '../../store/useTelemetryStore';
import { useNavigationStore } from '../../store/useNavigationStore';
import { Layers, Sliders, ShieldAlert, Thermometer, Wind, Droplets, HelpCircle, Activity } from 'lucide-react';

import { indiaPaths } from '../../data/indiaPaths';

export const DigitalTwinMap: React.FC = () => {
  const { theme, syncStatus, alerts } = useTelemetryStore();
  const { activeDistrict, setActiveDistrict } = useNavigationStore();

  const [activeLayer, setActiveLayer] = useState<'temp' | 'rain' | 'flood' | 'ndvi' | 'aqi' | 'drought' | 'wind'>('temp');
  const [timeYear, setTimeYear] = useState<number>(2025);

  const statesData = [
    { name: 'Rajasthan', temp: 44.2, rain: '3.1mm', risk: '85%', ndvi: '0.21', aqi: 180, water: '34%', status: 'CRITICAL' },
    { name: 'Gujarat', temp: 41.8, rain: '12.4mm', risk: '72%', ndvi: '0.29', aqi: 210, water: '45%', status: 'HIGH' },
    { name: 'Maharashtra', temp: 38.6, rain: '45.2mm', risk: '58%', ndvi: '0.41', aqi: 140, water: '62%', status: 'MODERATE' },
    { name: 'Assam', temp: 32.1, rain: '287.4mm', risk: '79%', ndvi: '0.71', aqi: 65, water: '88%', status: 'HIGH' },
    { name: 'Delhi', temp: 43.1, rain: '2.1mm', risk: '68%', ndvi: '0.18', aqi: 340, water: '28%', status: 'CRITICAL' },
    { name: 'UP', temp: 41.2, rain: '18.7mm', risk: '61%', ndvi: '0.38', aqi: 240, water: '51%', status: 'MODERATE' },
    { name: 'Kerala', temp: 31.4, rain: '312.8mm', risk: '44%', ndvi: '0.82', aqi: 45, water: '92%', status: 'LOW' },
    { name: 'Tamil Nadu', temp: 36.2, rain: '28.4mm', risk: '52%', ndvi: '0.49', aqi: 95, water: '58%', status: 'MODERATE' }
  ];

  let activeStateInfo = statesData.find(s => s.name === activeDistrict);
  if (!activeStateInfo) {
    const defaultName = activeDistrict || 'Rajasthan';
    const charSum = defaultName.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const tempVal = 30 + (charSum % 15);
    const rainVal = charSum % 100;
    const riskVal = 30 + (charSum % 60);
    const ndviVal = 0.2 + (charSum % 5) * 0.15;
    const aqiVal = 50 + (charSum % 250);
    const waterVal = 30 + (charSum % 60);
    activeStateInfo = {
      name: defaultName,
      temp: tempVal,
      rain: `${rainVal}mm`,
      risk: `${riskVal}%`,
      ndvi: ndviVal.toFixed(2),
      aqi: aqiVal,
      water: `${waterVal}%`,
      status: riskVal > 75 ? 'CRITICAL' : riskVal > 50 ? 'HIGH' : 'MODERATE'
    };
  }

  const getMapColor = (stateName: string) => {
    let s = statesData.find(st => st.name === stateName);
    if (!s) {
      const charSum = stateName.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
      s = {
        name: stateName,
        temp: 30 + (charSum % 15),
        rain: `${charSum % 100}mm`,
        risk: `${30 + (charSum % 60)}%`,
        ndvi: (0.2 + (charSum % 5) * 0.15).toFixed(2),
        aqi: 50 + (charSum % 250),
        water: `${30 + (charSum % 60)}%`,
        status: 'MODERATE'
      };
    }
    
    // Scale shift for Time Machine slider
    const delta = (timeYear - 2025) * 0.05;

    if (activeLayer === 'temp') {
      const v = s.temp + (delta * 3);
      if (v > 43) return 'rgba(239, 68, 68, 0.7)';
      if (v > 39) return 'rgba(245, 158, 11, 0.6)';
      return 'rgba(6, 182, 212, 0.4)';
    } else if (activeLayer === 'rain') {
      const v = parseFloat(s.rain) + (delta * 30);
      if (v > 150) return 'rgba(6, 182, 212, 0.7)';
      if (v > 30) return 'rgba(16, 185, 129, 0.6)';
      return 'rgba(245, 158, 11, 0.5)';
    } else if (activeLayer === 'flood') {
      const v = parseFloat(s.risk) + (delta * 15);
      if (v > 75) return 'rgba(239, 68, 68, 0.7)';
      if (v > 50) return 'rgba(245, 158, 11, 0.6)';
      return 'rgba(16, 185, 129, 0.4)';
    } else if (activeLayer === 'ndvi') {
      const v = parseFloat(s.ndvi) - (delta * 0.08);
      if (v > 0.6) return 'rgba(16, 185, 129, 0.7)';
      if (v > 0.3) return 'rgba(16, 185, 129, 0.4)';
      return 'rgba(245, 158, 11, 0.6)';
    } else if (activeLayer === 'aqi') {
      const v = s.aqi + (delta * 30);
      if (v > 250) return 'rgba(239, 68, 68, 0.7)';
      if (v > 100) return 'rgba(245, 158, 11, 0.6)';
      return 'rgba(16, 185, 129, 0.4)';
    } else if (activeLayer === 'drought') {
      const v = 100 - parseFloat(s.water) + (delta * 12);
      if (v > 65) return 'rgba(239, 68, 68, 0.7)';
      if (v > 45) return 'rgba(245, 158, 11, 0.6)';
      return 'rgba(16, 185, 129, 0.4)';
    } else { // wind
      return 'rgba(6, 182, 212, 0.45)';
    }
  };

  return (
    <div className="flex-1 w-full flex flex-col justify-between space-y-4 h-full relative min-h-0 select-none max-w-[1440px] mx-auto p-2">
      
      {/* Top HUD sync widget overlay */}
      <div className="w-full flex justify-between items-center bg-[#050d1a]/80 border border-[#0a1f3d] p-3 rounded-xl backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <Activity className="h-5 w-5 text-cyan-400 animate-pulse" />
          <div>
            <h2 className="font-sans font-bold text-xs tracking-wider text-textPrimary">
              DIGITAL TWIN MESH CONTROL HUD
            </h2>
            <p className="text-[9px] text-textMuted font-mono">INSAT-3D TELEMETRY SYNC LOOP</p>
          </div>
        </div>

        <div className="flex space-x-6 text-[11px] font-mono">
          <div className="text-right">
            <span className="text-textMuted">SYNC LEVEL:</span>
            <span className="text-[#00d4ff] font-bold ml-2">{syncStatus.syncPercentage}%</span>
          </div>
          <div className="text-right">
            <span className="text-textMuted">LATENCY:</span>
            <span className="text-[#00d4ff] font-bold ml-2">{syncStatus.dataLatencyMs}ms</span>
          </div>
          <div className="text-right">
            <span className="text-textMuted">ACCURACY:</span>
            <span className="text-[#00d4ff] font-bold ml-2">{syncStatus.twinAccuracyPercentage}%</span>
          </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
        
        {/* Left Control Panel (2 Cols) */}
        <div className="lg:col-span-2 glass-panel rounded-xl p-4 flex flex-col justify-between h-[450px]">
          <div className="space-y-4">
            <div>
              <h3 className="font-sans font-bold text-xs tracking-wider text-[#00d4ff] uppercase mb-1">
                Layer Overlays
              </h3>
              <p className="text-[10px] text-textMuted font-mono">TOGGLE GEO SPATIAL FILTERS</p>
            </div>

            <div className="space-y-2">
              {[
                { id: 'temp' as const, label: 'Temperature Grid', icon: Thermometer, color: 'text-red-400' },
                { id: 'rain' as const, label: 'Precipitation Radar', icon: Droplets, color: 'text-cyan-400' },
                { id: 'flood' as const, label: 'Flood Risk Mesh', icon: ShieldAlert, color: 'text-orange-400' },
                { id: 'ndvi' as const, label: 'NDVI Vegetation', icon: Layers, color: 'text-emerald-400' },
                { id: 'aqi' as const, label: 'AQI Carbon Index', icon: Wind, color: 'text-amber-400' },
                { id: 'drought' as const, label: 'Drought Dryness', icon: Sliders, color: 'text-orange-500' },
                { id: 'wind' as const, label: 'Wind Vector Paths', icon: Wind, color: 'text-sky-400' },
              ].map((layer) => {
                const Icon = layer.icon;
                const active = activeLayer === layer.id;
                return (
                  <button
                    key={layer.id}
                    onClick={() => setActiveLayer(layer.id)}
                    className={`w-full flex items-center justify-between p-2 rounded border text-[10px] font-mono transition-all duration-200 ${
                      active 
                        ? 'bg-cyan-950/20 border-[#00d4ff]/40 text-[#00d4ff] font-bold' 
                        : 'bg-bg/40 border-gridBorder text-textMuted hover:text-textPrimary'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Icon className={`h-3.5 w-3.5 ${layer.color}`} />
                      <span>{layer.label}</span>
                    </div>
                    {active && <span className="h-1 w-1 rounded-full bg-[#00d4ff]"></span>}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-t border-[#0a1f3d] pt-3 text-[10px] font-mono text-textMuted space-y-1">
            <div className="flex justify-between">
              <span>Ground Stations:</span>
              <span className="text-[#00d4ff] font-bold">4,892 active</span>
            </div>
            <div className="flex justify-between">
              <span>Grid Resolution:</span>
              <span className="text-[#00d4ff] font-bold">0.05° x 0.05°</span>
            </div>
          </div>
        </div>

        {/* Center Canvas (8 Cols - Visual Centerpiece ~67% width) */}
        <div className="lg:col-span-8 glass-panel rounded-xl p-4 flex flex-col justify-between relative overflow-hidden h-[450px]">
          
          <div className="absolute top-4 left-4 bg-bg/70 border border-[#0a1f3d] px-3 py-1.5 rounded text-[10px] font-mono">
            BOUNDARIES: STATE LEVEL (SURFACE SURVEY)
          </div>

          {/* Large interactive SVG map of India */}
          <div className="flex-1 flex items-center justify-center my-4">
            <svg viewBox="0 0 612 696" className="h-full w-full max-h-[350px]">
              
              {/* Sea Background lines */}
              <g stroke="rgba(10,31,61,0.2)" strokeWidth="0.5" fill="none">
                <line x1="60" y1="0" x2="60" y2="696" />
                <line x1="180" y1="0" x2="180" y2="696" />
                <line x1="300" y1="0" x2="300" y2="696" />
                <line x1="420" y1="0" x2="420" y2="696" />
                <line x1="540" y1="0" x2="540" y2="696" />
                <line x1="0" y1="150" x2="612" y2="150" />
                <line x1="0" y1="300" x2="612" y2="300" />
                <line x1="0" y1="450" x2="612" y2="450" />
              </g>

              {/* State boundaries */}
              <g stroke="#0a1f3d" strokeWidth="0.8" className="cursor-pointer">
                {indiaPaths.map((state) => {
                  const isSelected = activeDistrict === state.name;
                  return (
                    <path
                      key={state.id}
                      d={state.path}
                      fill={getMapColor(state.name)}
                      className={`transition-all duration-300 ${
                        isSelected ? 'stroke-[#00d4ff] stroke-2 filter brightness-110' : 'hover:stroke-[#00d4ff]/60'
                      }`}
                      onClick={() => setActiveDistrict(state.name)}
                    >
                      <title>{state.name}</title>
                    </path>
                  );
                })}
              </g>

              {/* Hazard Pulsing Circles */}
              <g pointerEvents="none">
                {/* Rajasthan Barmer Hazard */}
                <circle cx="150" cy="210" r="6" fill="#ff3d5a" />
                <circle cx="150" cy="210" r="14" fill="none" stroke="#ff3d5a" strokeWidth="1" className="animate-ping" />
                
                {/* Assam Zone Flood hazard */}
                <circle cx="510" cy="270" r="6" fill="#ff3d5a" />
                <circle cx="510" cy="270" r="14" fill="none" stroke="#ff3d5a" strokeWidth="1" className="animate-ping" />
              </g>

              {/* Map coordinate overlays */}
              <text x="155" y="200" fill="#e2f4ff" fontSize="9" fontFamily="monospace" opacity="0.75" fontWeight="bold">Barmer [44.2°C]</text>
              <text x="460" y="295" fill="#e2f4ff" fontSize="9" fontFamily="monospace" opacity="0.75" fontWeight="bold">Assam [+187mm]</text>

            </svg>
          </div>

          {/* Time Machine Slider */}
          <div className="bg-bg/60 border border-[#0a1f3d] p-3 rounded-lg flex items-center justify-between">
            <span className="text-[10px] font-mono text-textMuted uppercase shrink-0">
              🛰 CLIMATE TIME MACHINE CONTROLLER:
            </span>
            <input
              type="range"
              min="2025"
              max="2050"
              value={timeYear}
              onChange={(e) => setTimeYear(parseInt(e.target.value))}
              className="w-full mx-6 h-1.5 bg-[#0a1f3d] rounded-lg appearance-none cursor-pointer accent-[#00d4ff]"
            />
            <span className="text-xs font-mono text-[#00d4ff] font-extrabold px-3 py-1 bg-surface rounded border border-[#00d4ff]/20">
              {timeYear} AD
            </span>
          </div>

        </div>

        {/* Right Info Sidebar (2 Cols) */}
        <div className="lg:col-span-2 glass-panel rounded-xl p-4 flex flex-col justify-between h-[450px]">
          <div className="space-y-4">
            <div>
              <h3 className="font-sans font-bold text-xs tracking-wider text-[#00d4ff] uppercase mb-1">
                Regional Telemetry
              </h3>
              <p className="text-[10px] text-textMuted font-mono">SELECTED BOUNDARY READOUTS</p>
            </div>

            <div className="bg-bg/40 border border-gridBorder p-3 rounded-lg space-y-3">
              <div>
                <span className="text-[9px] text-textMuted font-mono uppercase block">Active Boundary</span>
                <span className="text-xs font-bold text-textPrimary font-sans">
                  {activeStateInfo.name.toUpperCase()} STATE
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div>
                  <span className="text-[9px] text-textMuted block">Temperature</span>
                  <span className="font-bold text-textPrimary">{activeStateInfo.temp}°C</span>
                </div>
                <div>
                  <span className="text-[9px] text-textMuted block">Rainfall</span>
                  <span className="font-bold text-textPrimary">{activeStateInfo.rain}</span>
                </div>
                <div>
                  <span className="text-[9px] text-textMuted block">NDVI Veg</span>
                  <span className="font-bold text-textPrimary">{activeStateInfo.ndvi}</span>
                </div>
                <div>
                  <span className="text-[9px] text-textMuted block">AQI Level</span>
                  <span className="font-bold text-textPrimary">{activeStateInfo.aqi}</span>
                </div>
              </div>

              <div className="border-t border-[#0a1f3d] pt-2 mt-2">
                <span className="text-[9px] text-textMuted font-mono block">Water Availability</span>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="flex-1 bg-bg h-2 rounded overflow-hidden">
                    <div className="bg-[#00d4ff] h-full" style={{ width: activeStateInfo.water }}></div>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-[#00d4ff] shrink-0">{activeStateInfo.water}</span>
                </div>
              </div>
            </div>

            {/* Local hazards status */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-textMuted uppercase block">Active Area Warnings</span>
              {alerts.filter(a => a.region.includes(activeStateInfo.name)).length > 0 ? (
                alerts.filter(a => a.region.includes(activeStateInfo.name)).map((a) => (
                  <div key={a.id} className="p-2 bg-red-950/20 border border-red-500/20 text-red-400 rounded text-[10px] font-mono flex items-center space-x-1.5">
                    <ShieldAlert className="h-3.5 w-3.5 shrink-0 text-red-500" />
                    <span>{a.type} WARNING (CRITICAL)</span>
                  </div>
                ))
              ) : (
                <div className="p-2 bg-[#0a1f3d]/20 border border-[#00d4ff]/10 text-emerald-400 rounded text-[10px] font-mono flex items-center space-x-1.5">
                  <span className="h-1 w-1 rounded-full bg-emerald-500"></span>
                  <span>NO ACTIVE THREATS</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-bg p-3 rounded-lg border border-gridBorder">
            <span className="text-[9px] font-mono text-textMuted block uppercase">AI Model Assessment</span>
            <p className="text-[9px] leading-relaxed text-textPrimary font-sans mt-1">
              {activeStateInfo.name === 'Rajasthan' 
                ? 'TFT and XGBoost models indicate a 94% probability of heatwave conditions persisting for 72 hours. Regional soil wetness index requires micro-hydration release.'
                : activeStateInfo.name === 'Assam'
                ? 'XGBoost hydrological runoff indices predict river basin level to exceed danger height by +1.4m. Early warnings active for river flood areas.'
                : 'No anomalous climate parameters detected in this grid cell. General monitoring cycles active.'}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};

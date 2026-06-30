import React, { useState, useEffect } from 'react';
import { useTelemetryStore } from '../../store/useTelemetryStore';
import { useNavigationStore } from '../../store/useNavigationStore';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as ChartTooltip,
  BarChart,
  Bar,
  AreaChart,
  Area,
  CartesianGrid,
  Legend
} from 'recharts';
import {
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Check,
  Pause,
  AlertTriangle,
  Zap,
  Info,
  Maximize2,
  TrendingUp,
  Globe,
  Droplets,
  ShieldCheck
} from 'lucide-react';

import { indiaPaths } from '../../data/indiaPaths';

export const MissionDashboard: React.FC = () => {
  const {
    theme,
    syncStatus,
    metrics,
    events,
    recommendations,
    climateHealth,
    alerts,
    approveRecommendation,
    deferRecommendation,
    addEvent
  } = useTelemetryStore();

  const { activeDistrict, setActiveDistrict } = useNavigationStore();

  // District detail modal logic
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<'overview' | 'forecast' | 'satellite' | 'agriculture'>('overview');

  // Interactive Globe Zoom states
  // zoomLevel: 'earth' | 'india' | 'states' | 'districts'
  const [zoomLevel, setZoomLevel] = useState<'earth' | 'india' | 'states' | 'districts'>('earth');
  const [selectedGlobeState, setSelectedGlobeState] = useState<string | null>(null);
  
  // Globe Overlays
  const [globeClouds, setGlobeClouds] = useState(true);
  const [globeHeat, setGlobeHeat] = useState(true);
  const [globeWeather, setGlobeWeather] = useState(false);

  // India Map Layers
  // activeLayer: 'temp' | 'rain' | 'flood' | 'ndvi' | 'aqi'
  const [activeLayer, setActiveLayer] = useState<'temp' | 'rain' | 'flood' | 'ndvi' | 'aqi'>('temp');
  const [timeMachineYear, setTimeMachineYear] = useState<number>(2025);
  
  // District ranking tab
  const [rankingTab, setRankingTab] = useState<'heat' | 'flood' | 'aqi' | 'crop'>('heat');

  // Mock forecast data for charts
  const trendData = [
    { name: 'D1', Rajasthan: 43.1, Assam: 31.5, Gujarat: 40.2, UP: 39.8, Delhi: 42.1 },
    { name: 'D2', Rajasthan: 43.8, Assam: 31.8, Gujarat: 40.5, UP: 40.1, Delhi: 42.5 },
    { name: 'D3', Rajasthan: 44.2, Assam: 32.1, Gujarat: 41.2, UP: 40.6, Delhi: 43.1 },
    { name: 'D4', Rajasthan: 44.8, Assam: 32.5, Gujarat: 41.8, UP: 41.2, Delhi: 43.5 },
    { name: 'D5', Rajasthan: 45.1, Assam: 32.0, Gujarat: 41.5, UP: 40.9, Delhi: 43.0 },
    { name: 'D6', Rajasthan: 44.6, Assam: 31.7, Gujarat: 41.0, UP: 40.5, Delhi: 42.6 },
    { name: 'D7', Rajasthan: 43.9, Assam: 31.2, Gujarat: 40.6, UP: 40.1, Delhi: 42.2 },
  ];

  const rainData = [
    { name: 'Jan', '2024': 12, '2025': 15 },
    { name: 'Feb', '2024': 18, '2025': 22 },
    { name: 'Mar', '2024': 25, '2025': 30 },
    { name: 'Apr', '2024': 45, '2025': 42 },
    { name: 'May', '2024': 80, '2025': 95 },
    { name: 'Jun', '2024': 150, '2025': 187 },
    { name: 'Jul', '2024': 210, '2025': 240 },
  ];

  const disasterData = [
    { name: 'Heatwave', Probability: 81, status: 'CRITICAL', fill: '#ff3d5a' },
    { name: 'Flood', Probability: 73, status: 'HIGH', fill: '#f59e0b' },
    { name: 'Drought', Probability: 45, status: 'MODERATE', fill: '#f59e0b' },
    { name: 'Cyclone', Probability: 28, status: 'LOW', fill: '#10b981' },
    { name: 'Forest Fire', Probability: 19, status: 'LOW', fill: '#10b981' },
  ];

  const ndviData = [
    { name: 'W1', NDVI: 0.42 },
    { name: 'W2', NDVI: 0.45 },
    { name: 'W3', NDVI: 0.49 },
    { name: 'W4', NDVI: 0.52 },
    { name: 'W5', NDVI: 0.54 },
    { name: 'W6', NDVI: 0.58 },
    { name: 'W7', NDVI: 0.56 },
  ];

  const statesData = [
    { name: 'Rajasthan', temp: 44.2, rain: 3.1, risk: 85, ndvi: 0.21, aqi: 180 },
    { name: 'Gujarat', temp: 41.8, rain: 12.4, risk: 72, ndvi: 0.29, aqi: 210 },
    { name: 'Maharashtra', temp: 38.6, rain: 45.2, risk: 58, ndvi: 0.41, aqi: 140 },
    { name: 'Assam', temp: 32.1, rain: 287.4, risk: 79, ndvi: 0.71, aqi: 65 },
    { name: 'Delhi', temp: 43.1, rain: 2.1, risk: 68, ndvi: 0.18, aqi: 340 },
    { name: 'UP', temp: 41.2, rain: 18.7, risk: 61, ndvi: 0.38, aqi: 240 },
    { name: 'Kerala', temp: 31.4, rain: 312.8, risk: 44, ndvi: 0.82, aqi: 45 },
    { name: 'Tamil Nadu', temp: 36.2, rain: 28.4, risk: 52, ndvi: 0.49, aqi: 95 }
  ];

  // Helper: map states data to map color fills
  const getMapColor = (stateName: string) => {
    let s = statesData.find(st => st.name === stateName);
    if (!s) {
      // Generate a deterministic mock telemetry state for missing states so they are active and colored!
      const charSum = stateName.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
      s = {
        name: stateName,
        temp: 30 + (charSum % 15),
        rain: (charSum % 100),
        risk: 30 + (charSum % 60),
        ndvi: 0.2 + (charSum % 5) * 0.15,
        aqi: 50 + (charSum % 250)
      };
    }
    
    // Subtle modifications based on "Time Machine"
    const yearShift = (timeMachineYear - 2025) * 0.05;
    
    if (activeLayer === 'temp') {
      const tempVal = s.temp + (yearShift * 2);
      if (tempVal > 43) return 'rgba(255, 61, 90, 0.8)';
      if (tempVal > 40) return 'rgba(245, 158, 11, 0.7)';
      if (tempVal > 35) return 'rgba(0, 212, 255, 0.5)';
      return 'rgba(10, 31, 61, 0.8)';
    } else if (activeLayer === 'rain') {
      const rainVal = s.rain + (yearShift * 10);
      if (rainVal > 200) return 'rgba(0, 212, 255, 0.8)';
      if (rainVal > 40) return 'rgba(16, 185, 129, 0.6)';
      return 'rgba(245, 158, 11, 0.5)';
    } else if (activeLayer === 'flood') {
      const riskVal = s.risk + (yearShift * 10);
      if (riskVal > 80) return 'rgba(255, 61, 90, 0.8)';
      if (riskVal > 60) return 'rgba(245, 158, 11, 0.7)';
      return 'rgba(16, 185, 129, 0.4)';
    } else if (activeLayer === 'ndvi') {
      const ndviVal = s.ndvi - (yearShift * 0.1);
      if (ndviVal > 0.6) return 'rgba(16, 185, 129, 0.8)';
      if (ndviVal > 0.3) return 'rgba(16, 185, 129, 0.4)';
      return 'rgba(245, 158, 11, 0.7)';
    } else { // aqi
      const aqiVal = s.aqi + (yearShift * 20);
      if (aqiVal > 300) return 'rgba(255, 61, 90, 0.8)';
      if (aqiVal > 150) return 'rgba(245, 158, 11, 0.7)';
      return 'rgba(16, 185, 129, 0.5)';
    }
  };

  // Open modal if district/state is set in global store
  useEffect(() => {
    if (activeDistrict) {
      setModalOpen(true);
    }
  }, [activeDistrict]);

  const handleStateClick = (stateName: string) => {
    setActiveDistrict(stateName);
    setModalOpen(true);
    // Sync Earth Zoom
    setSelectedGlobeState(stateName);
    setZoomLevel('states');
  };

  return (
    <div className="flex-1 w-full max-w-[1440px] mx-auto space-y-6 p-2 select-none">
      
      {/* ROW 1: 4 SIMPLE KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* KPI 1: National Climate Health Index */}
        <div className="glass-panel rounded-xl p-4 flex justify-between items-center relative overflow-hidden">
          <div className="space-y-1">
            <span className="text-[10px] font-sans font-semibold text-textMuted uppercase tracking-wider block">
              National Climate Health
            </span>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-3xl font-mono font-extrabold text-warning">
                {climateHealth.score}
              </span>
              <span className="text-[10px] text-textMuted font-mono">/100</span>
            </div>
            <span className="inline-block text-[9px] font-bold uppercase tracking-wider text-warning mt-1">
              {climateHealth.status}
            </span>
          </div>
          <div className="h-10 w-10 rounded-full border border-warning/20 bg-warning/5 flex items-center justify-center shrink-0">
            <Info className="h-5 w-5 text-warning" />
          </div>
        </div>

        {/* KPI 2: Flood Risk Index */}
        <div className="glass-panel rounded-xl p-4 flex justify-between items-center relative overflow-hidden">
          <div className="space-y-1">
            <span className="text-[10px] font-sans font-semibold text-textMuted uppercase tracking-wider block">
              Flood Risk Index
            </span>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-3xl font-mono font-extrabold text-cyan-400">
                {metrics.floodRiskIndex}
              </span>
              <span className="text-[10px] text-textMuted font-mono">/100</span>
            </div>
            <span className="inline-block text-[9px] font-bold uppercase tracking-wider text-cyan-400 mt-1">
              12 HIGH-RISK ZONES
            </span>
          </div>
          <div className="h-10 w-10 rounded-full border border-cyan-500/20 bg-cyan-950/20 flex items-center justify-center shrink-0">
            <Droplets className="h-5 w-5 text-cyan-400" />
          </div>
        </div>

        {/* KPI 3: Drought Risk Index */}
        <div className="glass-panel rounded-xl p-4 flex justify-between items-center relative overflow-hidden">
          <div className="space-y-1">
            <span className="text-[10px] font-sans font-semibold text-textMuted uppercase tracking-wider block">
              Drought Risk Index
            </span>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-3xl font-mono font-extrabold text-red-400">
                45
              </span>
              <span className="text-[10px] text-textMuted font-mono">/100</span>
            </div>
            <span className="inline-block text-[9px] font-bold uppercase tracking-wider text-red-400 mt-1">
              AGRI STRESS DETECTED
            </span>
          </div>
          <div className="h-10 w-10 rounded-full border border-red-500/20 bg-red-950/20 flex items-center justify-center shrink-0">
            <AlertTriangle className="h-5 w-5 text-red-400" />
          </div>
        </div>

        {/* KPI 4: Rainfall Status */}
        <div className="glass-panel rounded-xl p-4 flex justify-between items-center relative overflow-hidden">
          <div className="space-y-1">
            <span className="text-[10px] font-sans font-semibold text-textMuted uppercase tracking-wider block">
              Rainfall Status
            </span>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-3xl font-mono font-extrabold text-emerald-400">
                +{metrics.rainAnomaly}mm
              </span>
            </div>
            <span className="inline-block text-[9px] font-bold uppercase tracking-wider text-emerald-400 mt-1">
              ASSAM ZONE ELEVATED
            </span>
          </div>
          <div className="h-10 w-10 rounded-full border border-emerald-500/20 bg-emerald-950/20 flex items-center justify-center shrink-0">
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
          </div>
        </div>

      </div>

      {/* ROW 2: INDIA MAP HERO (70%) & ALERTS/DECISIONS SIDEBAR (30%) */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
        
        {/* COL 1: INDIA DIGITAL TWIN MAP (70% WIDTH) */}
        <div className="lg:col-span-7 glass-panel rounded-xl p-6 flex flex-col justify-between h-[450px] relative">
          
          <div className="flex justify-between items-start z-10">
            <div>
              <h2 className="font-sans font-bold text-sm tracking-wide text-textPrimary flex items-center space-x-2">
                <Layers className="h-4 w-4 text-[#00d4ff]" />
                <span>INDIA DIGITAL TWIN MESH</span>
              </h2>
              <div className="text-[10px] text-textMuted font-mono flex items-center space-x-1.5 mt-1">
                <span>ACTIVE SPECTRAL LAYER:</span>
                <span className="text-[#00d4ff] font-bold uppercase">{activeLayer}</span>
              </div>
            </div>

            {/* Layer switcher pills */}
            <div className="flex flex-wrap gap-1 justify-end max-w-[280px]">
              {(['temp', 'rain', 'flood', 'ndvi', 'aqi'] as const).map((layer) => (
                <button
                  key={layer}
                  onClick={() => setActiveLayer(layer)}
                  className={`px-2 py-1 rounded text-[9px] font-mono uppercase border ${
                    activeLayer === layer 
                      ? 'bg-cyan-950/40 border-[#00d4ff]/40 text-[#00d4ff] font-bold' 
                      : 'bg-bg/60 border-gridBorder text-textMuted hover:text-textPrimary'
                  }`}
                >
                  {layer}
                </button>
              ))}
            </div>
          </div>

          {/* SVG Map of India Centerpiece */}
          <div className="flex-1 flex items-center justify-center my-4 overflow-hidden relative">
            <svg 
              viewBox="0 0 612 696" 
              className="h-full w-full max-h-[300px] transition-transform duration-500 hover:scale-[1.03]"
            >
              <g stroke="#050d1a" strokeWidth="0.8" fill="#020610">
                {indiaPaths.map((state) => {
                  const isSelected = activeDistrict === state.name;
                  return (
                    <path
                      key={state.id}
                      d={state.path}
                      fill={getMapColor(state.name)}
                      className={`cursor-pointer transition-all duration-300 hover:stroke-[#00d4ff] ${
                        isSelected ? 'stroke-[#00d4ff] stroke-2 fill-cyan-950/30' : 'stroke-[#0a1f3d]'
                      }`}
                      onClick={() => handleStateClick(state.name)}
                    >
                      <title>{state.name}</title>
                    </path>
                  );
                })}
              </g>
            </svg>
          </div>

          {/* Time Machine Slider */}
          <div className="bg-bg/40 border border-gridBorder/60 p-3 rounded-lg flex items-center justify-between z-10 space-x-4">
            <div className="flex items-center space-x-2 shrink-0">
              <span className="text-[10px] font-sans font-bold text-textMuted uppercase">TIME MACHINE:</span>
              <span className="text-xs font-mono text-cyan-400 font-bold bg-[#0a1f3d] px-2 py-0.5 rounded">{timeMachineYear}</span>
            </div>
            
            <input
              type="range"
              min="2025"
              max="2050"
              value={timeMachineYear}
              onChange={(e) => setTimeMachineYear(parseInt(e.target.value))}
              className="flex-1 accent-[#00d4ff] h-1 bg-bg border border-[#0a1f3d] rounded-lg appearance-none cursor-pointer"
            />
          </div>

        </div>

        {/* COL 2: ALERTS & RECOMMENDATIONS SIDEBAR (30% WIDTH) */}
        <div className="lg:col-span-3 flex flex-col space-y-6 h-[450px]">
          
          {/* Active Alerts Panel */}
          <div className="flex-1 glass-panel rounded-xl p-4 flex flex-col justify-between overflow-hidden">
            <div>
              <span className="text-[10px] font-sans font-bold text-textPrimary tracking-wider uppercase block border-b border-[#0a1f3d]/60 pb-1.5 mb-2.5">
                🚨 Active Alerts
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[160px]">
              {alerts.slice(0, 3).map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3 rounded border text-[10px] leading-relaxed ${
                    alert.severity === 'CRITICAL' ? 'bg-red-950/20 border-red-500/30 text-red-200' :
                    alert.severity === 'HIGH' ? 'bg-amber-950/20 border-amber-500/30 text-amber-200' :
                    'bg-slate-900/40 border-[#0a1f3d] text-textPrimary'
                  }`}
                >
                  <div className="flex justify-between items-center mb-0.5 font-mono text-[9px]">
                    <span className={`font-bold ${alert.severity === 'CRITICAL' ? 'text-red-400' : 'text-warning'}`}>{alert.type}</span>
                    <span className="text-textMuted">{alert.time}</span>
                  </div>
                  <div>{alert.region} is currently under advisory watch.</div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Decision Recommendations Panel */}
          <div className="flex-1 glass-panel rounded-xl p-4 flex flex-col justify-between overflow-hidden">
            <div>
              <span className="text-[10px] font-sans font-bold text-textPrimary tracking-wider uppercase block border-b border-[#0a1f3d]/60 pb-1.5 mb-2.5">
                💡 Policy Recommendations
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 max-h-[160px]">
              {recommendations.filter(r => r.status === 'PENDING').slice(0, 2).map((rec) => (
                <div key={rec.id} className="p-2.5 bg-bg/40 border border-gridBorder rounded flex flex-col space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="font-sans font-bold text-textPrimary text-[10px]">{rec.title}</span>
                    <span className="text-[8px] font-mono text-[#00d4ff] bg-cyan-950/40 px-1.5 py-0.5 rounded border border-cyan-800/30">{rec.confidenceScore}% conf</span>
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => {
                        approveRecommendation(rec.id);
                        addEvent('✓', `Approved Recommendation: ${rec.title}`);
                      }}
                      className="flex-1 py-1 bg-cyan-950/20 hover:bg-cyan-900/20 border border-cyan-800/30 text-cyan-400 font-bold font-mono text-[9px] rounded"
                    >
                      APPROVE
                    </button>
                    <button
                      onClick={() => deferRecommendation(rec.id)}
                      className="px-2 py-1 bg-bg hover:bg-bg/80 border border-gridBorder text-textMuted font-mono text-[9px] rounded"
                    >
                      DEFER
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* ROW 3: THREE BALANCED BOTTOM CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart 1: Temperature Forecast */}
        <div className="glass-panel rounded-xl p-4 h-[240px] flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-sans font-bold text-textPrimary uppercase tracking-wider">
              Temperature Forecast (7 Days)
            </span>
            <span className="text-[8px] font-mono text-textMuted">UNIT: °C</span>
          </div>
          <div className="flex-1 w-full text-[10px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 5, right: 10, left: -25, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#0a1f3d" />
                <XAxis dataKey="name" stroke="#4a7fa5" />
                <YAxis domain={[30, 48]} stroke="#4a7fa5" />
                <ChartTooltip contentStyle={{ backgroundColor: '#050d1a', borderColor: '#0a1f3d', color: '#e2f4ff' }} />
                <Line type="monotone" dataKey="Rajasthan" stroke="#ff3d5a" strokeWidth={1.5} dot={false} />
                <Line type="monotone" dataKey="Gujarat" stroke="#f59e0b" strokeWidth={1.5} dot={false} />
                <Line type="monotone" dataKey="Delhi" stroke="#7c3aed" strokeWidth={1.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Rainfall Forecast */}
        <div className="glass-panel rounded-xl p-4 h-[240px] flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-sans font-bold text-textPrimary uppercase tracking-wider">
              Rainfall vs Seasonal Norms
            </span>
            <span className="text-[8px] font-mono text-textMuted">UNIT: mm</span>
          </div>
          <div className="flex-1 w-full text-[10px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rainData} margin={{ top: 5, right: 10, left: -25, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#0a1f3d" />
                <XAxis dataKey="name" stroke="#4a7fa5" />
                <YAxis stroke="#4a7fa5" />
                <ChartTooltip contentStyle={{ backgroundColor: '#050d1a', borderColor: '#0a1f3d' }} />
                <Bar dataKey="2024" fill="#0a2a4a" radius={[2, 2, 0, 0]} />
                <Bar dataKey="2025" fill="#00d4ff" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Vegetation Index (NDVI) Trend */}
        <div className="glass-panel rounded-xl p-4 h-[240px] flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-sans font-bold text-textPrimary uppercase tracking-wider">
              Vegetation Index (NDVI) Trend
            </span>
            <span className="text-[8px] font-mono text-textMuted">UNIT: Index</span>
          </div>
          <div className="flex-1 w-full text-[10px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ndviData} margin={{ top: 5, right: 10, left: -25, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorNdvi" cx="0" cy="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#0a1f3d" />
                <XAxis dataKey="name" stroke="#4a7fa5" />
                <YAxis domain={[0.3, 0.7]} stroke="#4a7fa5" />
                <ChartTooltip contentStyle={{ backgroundColor: '#050d1a', borderColor: '#0a1f3d' }} />
                <Area type="monotone" dataKey="NDVI" stroke="#10b981" strokeWidth={1.5} fillOpacity={1} fill="url(#colorNdvi)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      {/* DISTRICT INSPECTOR MODAL */}
      {modalOpen && activeDistrict && (
        <div className="fixed inset-0 bg-[#020610]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-surface border border-[#0a1f3d] rounded-xl shadow-2xl overflow-hidden animate-[zoomIn_0.2s_ease-out]">
            
            {/* Modal Header */}
            <div className="p-4 border-b border-[#0a1f3d] bg-bg flex justify-between items-center">
              <div>
                <h3 className="font-orbitron font-extrabold text-sm text-textPrimary tracking-wide uppercase">
                  🛰 SENSOR GRID INSPECTOR: {activeDistrict.toUpperCase()}
                </h3>
                <p className="text-[10px] font-mono text-textMuted">SATELLITE POSITION: GRID IND-NW-29</p>
              </div>
              <button
                onClick={() => { setModalOpen(false); setActiveDistrict(null); }}
                className="text-textMuted hover:text-textPrimary text-xs font-mono border border-gridBorder px-2.5 py-1 rounded bg-surface hover:border-[#00d4ff]/30 transition-colors"
              >
                [CLOSE PANEL]
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-[#0a1f3d] bg-bg/50 px-2 font-mono text-xs">
              {(['overview', 'forecast', 'satellite', 'agriculture'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setModalTab(tab)}
                  className={`px-4 py-2.5 border-b-2 uppercase font-bold tracking-wide transition-all ${
                    modalTab === tab 
                      ? 'border-[#00d4ff] text-[#00d4ff]' 
                      : 'border-transparent text-textMuted hover:text-textPrimary'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Modal Content */}
            <div className="p-5 max-h-[350px] overflow-y-auto space-y-4">
              {modalTab === 'overview' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-sans text-xs font-bold text-textPrimary uppercase border-b border-[#0a1f3d] pb-1">
                      Current Ground Indicators
                    </h4>
                    <div className="space-y-1.5 font-mono text-xs">
                      <div className="flex justify-between text-textMuted">
                        <span>LST Soil Temperature:</span>
                        <span className="text-textPrimary font-bold">44.2°C</span>
                      </div>
                      <div className="flex justify-between text-textMuted">
                        <span>Precipitation (24h):</span>
                        <span className="text-textPrimary font-bold">3.1mm</span>
                      </div>
                      <div className="flex justify-between text-textMuted">
                        <span>AQI Level:</span>
                        <span className="text-danger font-bold">180 (CRITICAL)</span>
                      </div>
                      <div className="flex justify-between text-textMuted">
                        <span>Groundwater Index:</span>
                        <span className="text-textPrimary font-bold">54%</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-sans text-xs font-bold text-textPrimary uppercase border-b border-[#0a1f3d] pb-1">
                      AI Warning Summary
                    </h4>
                    <p className="text-xs text-textMuted leading-relaxed">
                      Barmer district is exhibiting anomalous land surface heating indices matching thermal thresholds. TFT prediction algorithms model high heat stress duration index (HSDI &gt; 4.0) over the immediate 72 hours. Regional agricultural yield risks stand at -22% due to water availability depletion.
                    </p>
                  </div>
                </div>
              )}

              {modalTab === 'forecast' && (
                <div className="space-y-3">
                  <h4 className="font-sans text-xs font-bold text-textPrimary uppercase pb-1">
                    Temporal Fusion Transformer (TFT) Forecast Overlay
                  </h4>
                  <div className="h-44 w-full text-xs">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={trendData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#0a1f3d" />
                        <XAxis dataKey="name" stroke="#4a7fa5" />
                        <YAxis stroke="#4a7fa5" />
                        <ChartTooltip contentStyle={{ backgroundColor: '#050d1a', borderColor: '#0a1f3d' }} />
                        <Line type="monotone" dataKey="Rajasthan" stroke="#ff3d5a" strokeWidth={2} name="Forecasted Temp" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {modalTab === 'satellite' && (
                <div className="space-y-3 text-xs">
                  <h4 className="font-sans text-xs font-bold text-textPrimary uppercase border-b border-[#0a1f3d] pb-1">
                    INSAT-3D Channel Feed Analysis
                  </h4>
                  <div className="grid grid-cols-3 gap-3 font-mono">
                    <div className="bg-bg p-2.5 rounded border border-gridBorder">
                      <div className="text-textMuted text-[9px]">LST INGEST</div>
                      <div className="text-cyan-400 font-bold text-sm">142ms</div>
                      <div className="text-textPrimary text-[9px] mt-1">ONLINE ●</div>
                    </div>
                    <div className="bg-bg p-2.5 rounded border border-gridBorder">
                      <div className="text-textMuted text-[9px]">SAR RESOLUTION</div>
                      <div className="text-cyan-400 font-bold text-sm">25m grid</div>
                      <div className="text-textPrimary text-[9px] mt-1">CALIBRATED ●</div>
                    </div>
                    <div className="bg-bg p-2.5 rounded border border-gridBorder">
                      <div className="text-textMuted text-[9px]">CLOUD RADIANCE</div>
                      <div className="text-warning font-bold text-sm">0.82 fraction</div>
                      <div className="text-warning text-[9px] mt-1">OBSCURED ⚠</div>
                    </div>
                  </div>
                </div>
              )}

              {modalTab === 'agriculture' && (
                <div className="space-y-3 text-xs">
                  <h4 className="font-sans text-xs font-bold text-textPrimary uppercase border-b border-[#0a1f3d] pb-1">
                    Agricultural Advisory & NDVI Index
                  </h4>
                  <p className="text-textMuted leading-relaxed mb-2">
                    NDVI index is recorded at 0.21, reflecting moderate to severe vegetative water stress. Soil moisture depletion index stands at 48%. Crop recommended: Bajra / short-duration sorghum. Implement drip irrigation controls.
                  </p>
                  <div className="w-full bg-[#0a1f3d]/40 border border-[#00d4ff]/10 p-3 rounded font-mono text-[10px] text-cyan-300">
                    💡 recommendation: issue local aquifer conservation order for irrigation grid BMR-S04.
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#0a1f3d] bg-bg flex justify-end space-x-2">
              <button
                onClick={() => { setModalOpen(false); setActiveDistrict(null); }}
                className="px-4 py-1.5 bg-[#00d4ff] hover:bg-cyan-400 text-bg font-bold font-mono text-xs rounded transition-colors"
              >
                PROCEED WITH AUDIT
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

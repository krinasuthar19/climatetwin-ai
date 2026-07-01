import React, { useState } from 'react';
import { useTelemetryStore } from '../../store/useTelemetryStore';
import { useNavigationStore } from '../../store/useNavigationStore';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as ChartTooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import {
  Thermometer,
  Droplets,
  Wind,
  Info,
  Calendar,
  AlertTriangle,
  Play,
  Layers,
  MapPin,
  TrendingUp
} from 'lucide-react';
import { indiaPaths } from '../../data/indiaPaths';

export const MissionDashboard: React.FC = () => {
  const { activeDistrict, setActiveDistrict } = useNavigationStore();

  const [layers, setLayers] = useState({
    temp: true,
    rain: true,
    wind: true,
    humidity: false,
    lst: false,
    sst: false,
    ndvi: false
  });

  const [chartTab, setChartTab] = useState<'temp' | 'rain'>('temp');
  const [isPlayingAnimation, setIsPlayingAnimation] = useState(false);

  // Toggle map layers
  const toggleLayer = (key: keyof typeof layers) => {
    setLayers(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Mock datasets for pilot regions
  const pilotData: Record<string, any> = {
    Rajasthan: {
      currTemp: '38.4°C',
      currTempChange: '+1.8°C vs yesterday',
      currTempTrend: 'up',
      currRain: '2.4 mm',
      currRainChange: '-6.3 mm vs yesterday',
      currRainTrend: 'down',
      predTemp: '39.2°C',
      predTempChange: '+0.9°C vs past 7-day avg',
      predTempTrend: 'up',
      predRain: '3.8 mm',
      predRainChange: '-1.2 mm vs past 7-day',
      predRainTrend: 'down',
      windSpeed: '18.6 km/h',
      windDir: 'WNW',
      humidity: '62%',
      humidityChange: '-2% vs yesterday',
      humidityTrend: 'down',
      // Stats block
      maxTempToday: '40.1°C',
      minTempToday: '28.6°C',
      rain24h: '2.4 mm',
      wind10m: '18.6 km/h R WNW',
      humidityVal: '62%',
      pressure: '1002 hPa',
      riskDistricts: [
        { name: 'Barmer', risk: 'HIGH', color: 'text-red-400 bg-red-950/20 border border-red-500/20' },
        { name: 'Jodhpur', risk: 'HIGH', color: 'text-red-400 bg-red-950/20 border border-red-500/20' },
        { name: 'Udaipur', risk: 'MEDIUM', color: 'text-amber-400 bg-amber-950/20 border border-amber-500/20' }
      ],
      forecast: [
        { day: '21 Jun', max: 40.1, min: 28.6, rain: 2.4 },
        { day: '22 Jun', max: 40.5, min: 28.9, rain: 1.2 },
        { day: '23 Jun', max: 41.2, min: 29.2, rain: 0.5 },
        { day: '24 Jun', max: 40.8, min: 28.8, rain: 0.0 },
        { day: '25 Jun', max: 39.9, min: 28.2, rain: 0.0 },
        { day: '26 Jun', max: 40.4, min: 28.5, rain: 1.0 },
        { day: '27 Jun', max: 41.0, min: 29.0, rain: 2.1 }
      ],
      mapColor: {
        Rajasthan: 'rgba(239, 68, 68, 0.7)',
        Assam: 'rgba(6, 182, 212, 0.4)',
        Gujarat: 'rgba(245, 158, 11, 0.5)'
      }
    },
    Assam: {
      currTemp: '31.2°C',
      currTempChange: '-0.5°C vs yesterday',
      currTempTrend: 'down',
      currRain: '62.5 mm',
      currRainChange: '+14.8 mm vs yesterday',
      currRainTrend: 'up',
      predTemp: '30.8°C',
      predTempChange: '-0.4°C vs past 7-day avg',
      predTempTrend: 'down',
      predRain: '59.8 mm',
      predRainChange: '+12.4 mm vs past 7-day',
      predRainTrend: 'up',
      windSpeed: '22.4 km/h',
      windDir: 'ENE',
      humidity: '85%',
      humidityChange: '+5% vs yesterday',
      humidityTrend: 'up',
      // Stats block
      maxTempToday: '32.5°C',
      minTempToday: '24.2°C',
      rain24h: '62.5 mm',
      wind10m: '22.4 km/h R ENE',
      humidityVal: '85%',
      pressure: '998 hPa',
      riskDistricts: [
        { name: 'Dhubri', risk: 'HIGH', color: 'text-cyan-400 bg-cyan-950/20 border border-cyan-500/20' },
        { name: 'Dhemaji', risk: 'HIGH', color: 'text-cyan-400 bg-cyan-950/20 border border-cyan-500/20' },
        { name: 'Lakhimpur', risk: 'MEDIUM', color: 'text-amber-400 bg-amber-950/20 border border-amber-500/20' }
      ],
      forecast: [
        { day: '21 Jun', max: 32.5, min: 24.2, rain: 62.5 },
        { day: '22 Jun', max: 31.8, min: 23.9, rain: 78.4 },
        { day: '23 Jun', max: 32.1, min: 24.1, rain: 92.1 },
        { day: '24 Jun', max: 30.5, min: 23.2, rain: 110.5 },
        { day: '25 Jun', max: 31.2, min: 23.8, rain: 88.2 },
        { day: '26 Jun', max: 32.0, min: 24.0, rain: 59.8 },
        { day: '27 Jun', max: 31.5, min: 23.6, rain: 45.0 }
      ],
      mapColor: {
        Rajasthan: 'rgba(245, 158, 11, 0.4)',
        Assam: 'rgba(6, 182, 212, 0.85)',
        Gujarat: 'rgba(10, 31, 61, 0.4)'
      }
    },
    WholeMap: {
      currTemp: '32.4°C',
      currTempChange: '+0.5°C vs yesterday',
      currTempTrend: 'up',
      currRain: '42.5 mm',
      currRainChange: '+1.8 mm vs yesterday',
      currRainTrend: 'up',
      predTemp: '32.8°C',
      predTempChange: '+0.4°C vs past 7-day avg',
      predTempTrend: 'up',
      predRain: '48.2 mm',
      predRainChange: '+5.7 mm vs past 7-day',
      predRainTrend: 'up',
      windSpeed: '14.2 km/h',
      windDir: 'SW',
      humidity: '72%',
      humidityChange: '+1% vs yesterday',
      humidityTrend: 'up',
      // Stats block
      maxTempToday: '35.2°C',
      minTempToday: '22.4°C',
      rain24h: '12.5 mm',
      wind10m: '14.2 km/h R SW',
      humidityVal: '72%',
      pressure: '1005 hPa',
      riskDistricts: [
        { name: 'Barmer', risk: 'HIGH', color: 'text-red-400 bg-red-950/20 border border-red-500/20' },
        { name: 'Dhubri', risk: 'HIGH', color: 'text-cyan-400 bg-cyan-950/20 border border-cyan-500/20' },
        { name: 'Marathwada', risk: 'HIGH', color: 'text-amber-400 bg-amber-950/20 border border-amber-500/20' }
      ],
      forecast: [
        { day: '21 Jun', max: 35.2, min: 22.4, rain: 12.5 },
        { day: '22 Jun', max: 35.5, min: 22.8, rain: 15.2 },
        { day: '23 Jun', max: 36.1, min: 23.1, rain: 18.4 },
        { day: '24 Jun', max: 35.8, min: 22.9, rain: 22.1 },
        { day: '25 Jun', max: 34.9, min: 22.3, rain: 14.5 },
        { day: '26 Jun', max: 35.3, min: 22.6, rain: 10.8 },
        { day: '27 Jun', max: 35.8, min: 22.9, rain: 8.5 }
      ],
      mapColor: {
        Rajasthan: 'rgba(245, 158, 11, 0.45)',
        Assam: 'rgba(6, 182, 212, 0.45)',
        Gujarat: 'rgba(10, 31, 61, 0.4)'
      }
    }
  };

  const currentRegion = activeDistrict === 'Assam' ? 'Assam' : activeDistrict === 'Rajasthan' ? 'Rajasthan' : 'WholeMap';
  const data = pilotData[currentRegion];

  // Helper map coloring logic
  const getMapColor = (stateName: string) => {
    if (stateName === 'Rajasthan') return data.mapColor.Rajasthan;
    if (stateName === 'Assam') return data.mapColor.Assam;
    if (stateName === 'Gujarat') return data.mapColor.Gujarat || 'rgba(10, 31, 61, 0.4)';
    
    // Other states color scheme
    const charSum = stateName.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    if (charSum % 3 === 0) return 'rgba(10, 31, 61, 0.3)';
    if (charSum % 3 === 1) return 'rgba(10, 31, 61, 0.4)';
    return 'rgba(2, 6, 16, 0.8)';
  };

  const handleStateClick = (stateName: string) => {
    if (stateName === 'Rajasthan' || stateName === 'Assam') {
      // Toggle selection or switch
      if (activeDistrict === stateName) {
        setActiveDistrict(null);
      } else {
        setActiveDistrict(stateName);
      }
    }
  };

  return (
    <div className="flex-1 w-full max-w-[1440px] mx-auto space-y-4 p-2 select-none font-sans">
      
      {/* LOCAL STYLES FOR ANIMATED MAP OVERLAYS */}
      <style>{`
        @keyframes windFlow {
          0% { stroke-dashoffset: 40; }
          100% { stroke-dashoffset: 0; }
        }
        .wind-flow-line {
          stroke-dasharray: 6 18;
          animation: windFlow 1.4s linear infinite;
        }
        @keyframes rainFall {
          0% {
            transform: translateY(-12px) translateX(-6px);
            opacity: 0;
          }
          30%, 70% {
            opacity: 0.9;
          }
          100% {
            transform: translateY(12px) translateX(6px);
            opacity: 0;
          }
        }
        .rain-drop-line {
          animation: rainFall 0.8s linear infinite;
        }
        @keyframes rainPulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.5; }
        }
        .rain-radar-overlay {
          animation: rainPulse 2.5s ease-in-out infinite;
        }
      `}</style>

      {/* ROW 1: 6 KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        
        {/* KPI 1: Current Temperature */}
        <div className="glass-panel rounded-xl p-3 flex flex-col justify-between relative overflow-hidden min-h-[92px]">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-semibold text-textMuted uppercase tracking-wider block">
              Current Temperature
            </span>
            <Thermometer className="h-4 w-4 text-red-400" />
          </div>
          <div className="mt-1">
            <span className="text-2xl font-mono font-bold text-textPrimary">{data.currTemp}</span>
            <div className="text-[9px] font-mono text-textMuted mt-0.5 flex items-center space-x-1">
              <span className={data.currTempTrend === 'up' ? 'text-red-400' : 'text-cyan-400'}>
                {data.currTempTrend === 'up' ? '↑' : '↓'} {data.currTempChange}
              </span>
            </div>
          </div>
        </div>

        {/* KPI 2: Current Rainfall */}
        <div className="glass-panel rounded-xl p-3 flex flex-col justify-between relative overflow-hidden min-h-[92px]">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-semibold text-textMuted uppercase tracking-wider block">
              Current Rainfall (24h)
            </span>
            <Droplets className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="mt-1">
            <span className="text-2xl font-mono font-bold text-textPrimary">{data.currRain}</span>
            <div className="text-[9px] font-mono text-textMuted mt-0.5 flex items-center space-x-1">
              <span className={data.currRainTrend === 'up' ? 'text-emerald-400' : 'text-amber-400'}>
                {data.currRainTrend === 'up' ? '↑' : '↓'} {data.currRainChange}
              </span>
            </div>
          </div>
        </div>

        {/* KPI 3: Predicted Temperature */}
        <div className="glass-panel rounded-xl p-3 flex flex-col justify-between relative overflow-hidden min-h-[92px]">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-semibold text-textMuted uppercase tracking-wider block">
              Predicted Temp (7-Day Avg)
            </span>
            <TrendingUp className="h-4 w-4 text-warning" />
          </div>
          <div className="mt-1">
            <span className="text-2xl font-mono font-bold text-warning">{data.predTemp}</span>
            <div className="text-[9px] font-mono text-textMuted mt-0.5 flex items-center space-x-1">
              <span className="text-warning">
                ↑ {data.predTempChange}
              </span>
            </div>
          </div>
        </div>

        {/* KPI 4: Predicted Rainfall */}
        <div className="glass-panel rounded-xl p-3 flex flex-col justify-between relative overflow-hidden min-h-[92px]">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-semibold text-textMuted uppercase tracking-wider block">
              Predicted Rain (7-Day Total)
            </span>
            <Droplets className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-1">
            <span className="text-2xl font-mono font-bold text-emerald-400">{data.predRain}</span>
            <div className="text-[9px] font-mono text-textMuted mt-0.5 flex items-center space-x-1">
              <span className="text-emerald-400">
                ↑ {data.predRainChange}
              </span>
            </div>
          </div>
        </div>

        {/* KPI 5: Wind Speed */}
        <div className="glass-panel rounded-xl p-3 flex flex-col justify-between relative overflow-hidden min-h-[92px]">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-semibold text-textMuted uppercase tracking-wider block">
              Wind Speed (10m)
            </span>
            <Wind className="h-4 w-4 text-violet-400" />
          </div>
          <div className="mt-1">
            <span className="text-2xl font-mono font-bold text-textPrimary">{data.windSpeed}</span>
            <div className="text-[9px] font-mono text-textMuted mt-0.5">
              <span className="text-violet-400">↗ {data.windDir} INSAT Derived</span>
            </div>
          </div>
        </div>

        {/* KPI 6: Humidity */}
        <div className="glass-panel rounded-xl p-3 flex flex-col justify-between relative overflow-hidden min-h-[92px]">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-semibold text-textMuted uppercase tracking-wider block">
              Humidity
            </span>
            <Info className="h-4 w-4 text-sky-400" />
          </div>
          <div className="mt-1">
            <span className="text-2xl font-mono font-bold text-textPrimary">{data.humidity}</span>
            <div className="text-[9px] font-mono text-textMuted mt-0.5 flex items-center space-x-1">
              <span className={data.humidityTrend === 'up' ? 'text-sky-400' : 'text-amber-400'}>
                {data.humidityTrend === 'up' ? '↑' : '↓'} {data.humidityChange}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* ROW 2: INDIA MAP (LEFT) & REGION STATS/FORECASTS (RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* LEFT COLUMN: INTERACTIVE MAP (LG: 8 Cols) */}
        <div className="lg:col-span-8 glass-panel rounded-xl p-4 flex flex-col justify-between h-[450px] relative">
          
          {/* Header row in map panel */}
          <div className="flex justify-between items-start z-10">
            <div>
              <h2 className="font-sans font-bold text-xs tracking-wider text-textPrimary uppercase">
                India Climate Overview
              </h2>
              <span className="text-[9px] text-textMuted font-mono">INTEGRATED VIEW OF TEMPERATURE, RAINFALL, WIND AND CLIMATE HOTSPOTS</span>
            </div>

            {/* Map layers select list */}
            <div className="bg-bg/60 border border-gridBorder/80 px-3 py-2 rounded-lg text-[9px] font-mono flex items-center space-x-4">
              <span className="text-textMuted font-bold border-r border-gridBorder pr-3 uppercase">MAP LAYERS</span>
              <div className="flex space-x-3">
                <label className="flex items-center space-x-1.5 cursor-pointer">
                  <input type="checkbox" checked={layers.temp} onChange={() => toggleLayer('temp')} className="accent-red-500 h-3 w-3 rounded" />
                  <span className="text-red-400 font-semibold">Temperature</span>
                </label>
                <label className="flex items-center space-x-1.5 cursor-pointer">
                  <input type="checkbox" checked={layers.rain} onChange={() => toggleLayer('rain')} className="accent-cyan-500 h-3 w-3 rounded" />
                  <span className="text-cyan-400 font-semibold">Rainfall</span>
                </label>
                <label className="flex items-center space-x-1.5 cursor-pointer">
                  <input type="checkbox" checked={layers.wind} onChange={() => toggleLayer('wind')} className="accent-violet-500 h-3 w-3 rounded" />
                  <span className="text-violet-400 font-semibold">Wind</span>
                </label>
              </div>
            </div>
          </div>

          {/* SVG Map centerpiece */}
          <div className="flex-1 flex items-center justify-center my-2 overflow-hidden relative">
            <svg 
              viewBox="0 0 612 696" 
              className="h-full w-full max-h-[300px] transition-transform duration-300 hover:scale-[1.02]"
            >
              <defs>
                <radialGradient id="heat-radial" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ff3d5a" stopOpacity="0.85" />
                  <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="rain-radial" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.85" />
                  <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#0a1f3d" stopOpacity="0" />
                </radialGradient>

                {/* High-tech Dotted telemetry mesh pattern */}
                <pattern id="grid-dots" width="8" height="8" patternUnits="userSpaceOnUse">
                  <circle cx="2.5" cy="2.5" r="0.6" fill="rgba(0, 212, 255, 0.15)" />
                </pattern>
              </defs>

              {/* Sea background vector lines */}
              <g stroke="rgba(10,31,61,0.15)" strokeWidth="0.5" fill="none">
                <line x1="100" y1="0" x2="100" y2="696" />
                <line x1="250" y1="0" x2="250" y2="696" />
                <line x1="400" y1="0" x2="400" y2="696" />
                <line x1="550" y1="0" x2="550" y2="696" />
                <line x1="0" y1="200" x2="612" y2="200" />
                <line x1="0" y1="450" x2="612" y2="450" />
              </g>

              {/* State Paths */}
              <g stroke="#050d1a" strokeWidth="0.8" fill="#020610">
                {indiaPaths.map((state) => {
                  const isSelected = activeDistrict === state.name;
                  return (
                    <path
                      key={state.id}
                      d={state.path}
                      fill={getMapColor(state.name)}
                      className={`cursor-pointer transition-all duration-300 hover:stroke-[#00d4ff] ${
                        isSelected ? 'stroke-[#00d4ff] stroke-2' : 'stroke-[#0a1f3d]'
                      }`}
                      onClick={() => handleStateClick(state.name)}
                    >
                      <title>{state.name}</title>
                    </path>
                  );
                })}
              </g>

              {/* Dotted Climatic Grid Mesh Overlay */}
              <g stroke="none" fill="url(#grid-dots)" pointerEvents="none">
                {indiaPaths.map((state) => (
                  <path key={`grid-${state.id}`} d={state.path} />
                ))}
              </g>

              {/* Temperature Heat Overlay (Radial Gradient) */}
              {layers.temp && (
                <circle cx={activeDistrict === 'Assam' ? '510' : '150'} cy={activeDistrict === 'Assam' ? '270' : '210'} r="140" fill="url(#heat-radial)" className="pointer-events-none transition-all duration-500 animate-pulse" style={{ opacity: 0.5 }} />
              )}

              {/* Rainfall Overlay (Pulsing Gradient) */}
              {layers.rain && (
                <circle cx={activeDistrict === 'Rajasthan' ? '150' : '510'} cy={activeDistrict === 'Rajasthan' ? '210' : '270'} r="110" fill="url(#rain-radial)" className="pointer-events-none rain-radar-overlay transition-all duration-500" />
              )}

              {/* Falling Raindrops animation lines (Filtered by Selected State) */}
              {layers.rain && (
                <g stroke="#00d4ff" strokeWidth="1" strokeLinecap="round" opacity="0.8" className="pointer-events-none">
                  
                  {/* Rajasthan Rain Drops */}
                  {(!activeDistrict || activeDistrict === 'Rajasthan') && (
                    <g>
                      <line x1="130" y1="190" x2="133" y2="198" className="rain-drop-line" style={{ animationDelay: '0.1s', animationDuration: '0.7s' }} />
                      <line x1="150" y1="180" x2="153" y2="188" className="rain-drop-line" style={{ animationDelay: '0.4s', animationDuration: '0.9s' }} />
                      <line x1="170" y1="195" x2="173" y2="203" className="rain-drop-line" style={{ animationDelay: '0.2s', animationDuration: '0.6s' }} />
                      <line x1="140" y1="220" x2="143" y2="228" className="rain-drop-line" style={{ animationDelay: '0.5s', animationDuration: '0.8s' }} />
                      <line x1="160" y1="210" x2="163" y2="218" className="rain-drop-line" style={{ animationDelay: '0.3s', animationDuration: '0.7s' }} />
                    </g>
                  )}

                  {/* Assam Rain Drops */}
                  {(!activeDistrict || activeDistrict === 'Assam') && (
                    <g>
                      <line x1="490" y1="250" x2="493" y2="258" className="rain-drop-line" style={{ animationDelay: '0.1s', animationDuration: '0.7s' }} />
                      <line x1="510" y1="250" x2="513" y2="258" className="rain-drop-line" style={{ animationDelay: '0.3s', animationDuration: '0.9s' }} />
                      <line x1="530" y1="230" x2="533" y2="238" className="rain-drop-line" style={{ animationDelay: '0.0s', animationDuration: '0.6s' }} />
                      <line x1="480" y1="270" x2="483" y2="278" className="rain-drop-line" style={{ animationDelay: '0.5s', animationDuration: '0.8s' }} />
                      <line x1="500" y1="280" x2="503" y2="288" className="rain-drop-line" style={{ animationDelay: '0.2s', animationDuration: '0.7s' }} />
                    </g>
                  )}
                  
                  {/* South Coast Rain Drops (Only visible on Whole Map) */}
                  {!activeDistrict && (
                    <g>
                      <line x1="280" y1="520" x2="283" y2="528" className="rain-drop-line" style={{ animationDelay: '0.2s', animationDuration: '0.8s' }} />
                      <line x1="300" y1="550" x2="303" y2="558" className="rain-drop-line" style={{ animationDelay: '0.4s', animationDuration: '0.7s' }} />
                      <line x1="320" y1="580" x2="323" y2="588" className="rain-drop-line" style={{ animationDelay: '0.1s', animationDuration: '0.9s' }} />
                      <line x1="340" y1="540" x2="343" y2="548" className="rain-drop-line" style={{ animationDelay: '0.6s', animationDuration: '0.8s' }} />
                    </g>
                  )}
                </g>
              )}

              {/* Wind Vector streamlines flow (Filtered by Selected State) */}
              {layers.wind && (
                <g stroke="rgba(0, 212, 255, 0.55)" strokeWidth="1.2" fill="none" className="pointer-events-none">
                  
                  {/* Rajasthan Wind Lines */}
                  {(!activeDistrict || activeDistrict === 'Rajasthan') && (
                    <g>
                      <path d="M 110,220 Q 140,200 170,180" className="wind-flow-line" style={{ animationDelay: '0.0s', animationDuration: '1.2s' }} />
                      <path d="M 120,240 Q 150,220 180,200" className="wind-flow-line" style={{ animationDelay: '0.3s', animationDuration: '1.5s' }} />
                      <path d="M 130,200 Q 160,190 190,170" className="wind-flow-line" style={{ animationDelay: '0.5s', animationDuration: '1.3s' }} />
                    </g>
                  )}

                  {/* Assam Wind Lines */}
                  {(!activeDistrict || activeDistrict === 'Assam') && (
                    <g>
                      <path d="M 470,280 Q 500,260 530,240" className="wind-flow-line" style={{ animationDelay: '0.1s', animationDuration: '1.4s' }} />
                      <path d="M 480,300 Q 510,280 540,260" className="wind-flow-line" style={{ animationDelay: '0.4s', animationDuration: '1.6s' }} />
                      <path d="M 490,260 Q 520,250 550,230" className="wind-flow-line" style={{ animationDelay: '0.2s', animationDuration: '1.2s' }} />
                    </g>
                  )}
                  
                  {/* General Whole Map wind paths */}
                  {!activeDistrict && (
                    <g>
                      <path d="M 60,520 Q 120,400 180,280" className="wind-flow-line" style={{ animationDelay: '0.0s', animationDuration: '1.3s' }} />
                      <path d="M 100,600 Q 200,460 300,320" className="wind-flow-line" style={{ animationDelay: '0.6s', animationDuration: '1.1s' }} />
                      <path d="M 420,580 Q 460,440 500,300" className="wind-flow-line" style={{ animationDelay: '0.1s', animationDuration: '1.8s' }} />
                      <path d="M 180,620 Q 240,500 300,380" className="wind-flow-line" style={{ animationDelay: '0.2s', animationDuration: '1.5s' }} />
                    </g>
                  )}
                </g>
              )}

              {/* Region highlight boundaries (Barmer, Assam vector pointers) */}
              <g pointerEvents="none" className="font-mono text-[9px] fill-[#e2f4ff] font-bold">
                <circle cx="150" cy="210" r="5" fill="#ff3d5a" />
                <circle cx="150" cy="210" r="12" fill="none" stroke="#ff3d5a" strokeWidth="1.2" className="animate-pulse" />
                <text x="160" y="208">Barmer</text>

                <circle cx="510" cy="270" r="5" fill="#00d4ff" />
                <circle cx="510" cy="270" r="12" fill="none" stroke="#00d4ff" strokeWidth="1.2" className="animate-pulse" />
                <text x="470" y="290">Assam Grid</text>
              </g>
            </svg>
          </div>

          {/* Map Legends */}
          <div className="bg-bg/40 border border-gridBorder/50 p-2 rounded-lg flex items-center justify-between z-10 text-[9px] font-mono">
            <div className="flex items-center space-x-2">
              <span className="text-textMuted uppercase">Temperature:</span>
              <div className="flex items-center space-x-1">
                <span>20°C</span>
                <div className="w-20 h-2 bg-gradient-to-r from-sky-500 via-yellow-500 to-red-500 rounded-sm"></div>
                <span>40°C</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-textMuted uppercase">Rainfall:</span>
              <div className="flex items-center space-x-1">
                <span>0 mm</span>
                <div className="w-20 h-2 bg-gradient-to-r from-yellow-950 via-cyan-900 to-cyan-400 rounded-sm"></div>
                <span>500+ mm</span>
              </div>
            </div>
            <div className="flex items-center space-x-1 text-textMuted">
              <span>Wind direction & Speed:</span>
              <span className="text-[#00d4ff] font-bold">10 km/h ➔</span>
            </div>
          </div>


        </div>

        {/* RIGHT COLUMN: REGION STATS & FORECAST CHART (LG: 4 Cols) */}
        <div className="lg:col-span-4 flex flex-col space-y-4 h-[450px]">
          
          {/* Selected Region stats card */}
          <div className="bg-bg/40 border border-gridBorder p-3 rounded-xl flex flex-col justify-between h-[210px]">
            <div className="flex justify-between items-start border-b border-[#0a1f3d] pb-1.5 mb-1.5">
              <div className="flex items-center space-x-1.5">
                <MapPin className="h-4 w-4 text-cyan-400" />
                <span className="font-sans font-bold text-xs text-textPrimary tracking-wide uppercase">
                  Selected Region: {activeDistrict ? activeDistrict : 'Whole India Map'}
                </span>
              </div>
              <button 
                onClick={() => setActiveDistrict(null)}
                disabled={!activeDistrict}
                className="text-[9px] font-mono text-[#00d4ff] border border-[#00d4ff]/20 disabled:text-textMuted disabled:border-gridBorder px-2.5 py-0.5 rounded bg-cyan-950/20 hover:border-[#00d4ff]/40"
              >
                Reset Map
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 font-mono text-[10px]">
              <div className="bg-[#050d1a] border border-[#0a1f3d] p-1.5 rounded text-center">
                <div className="text-textMuted uppercase text-[8px]">Max Temp</div>
                <div className="text-red-400 font-bold text-xs mt-0.5">{data.maxTempToday}</div>
              </div>
              <div className="bg-[#050d1a] border border-[#0a1f3d] p-1.5 rounded text-center">
                <div className="text-textMuted uppercase text-[8px]">Min Temp</div>
                <div className="text-cyan-400 font-bold text-xs mt-0.5">{data.minTempToday}</div>
              </div>
              <div className="bg-[#050d1a] border border-[#0a1f3d] p-1.5 rounded text-center">
                <div className="text-textMuted uppercase text-[8px]">Rainfall (24h)</div>
                <div className="text-textPrimary font-bold text-xs mt-0.5">{data.rain24h}</div>
              </div>
              <div className="bg-[#050d1a] border border-[#0a1f3d] p-1.5 rounded text-center">
                <div className="text-textMuted uppercase text-[8px]">Wind (10m)</div>
                <div className="text-textPrimary font-bold text-[9px] truncate mt-0.5">{data.wind10m.split(' R ')[0]}</div>
              </div>
              <div className="bg-[#050d1a] border border-[#0a1f3d] p-1.5 rounded text-center">
                <div className="text-textMuted uppercase text-[8px]">Humidity</div>
                <div className="text-textPrimary font-bold text-xs mt-0.5">{data.humidityVal}</div>
              </div>
              <div className="bg-[#050d1a] border border-[#0a1f3d] p-1.5 rounded text-center">
                <div className="text-textMuted uppercase text-[8px]">Pressure</div>
                <div className="text-textPrimary font-bold text-[9px] truncate mt-0.5">{data.pressure}</div>
              </div>
            </div>

            <div className="mt-2 space-y-1.5">
              <span className="text-[9px] text-[#00d4ff] font-sans font-bold uppercase block">Top Districts by Risk</span>
              <div className="grid grid-cols-3 gap-1.5">
                {data.riskDistricts.map((d: any, idx: number) => (
                  <div key={idx} className={`p-1 rounded text-center text-[9px] font-mono leading-tight ${d.color}`}>
                    <div className="font-bold truncate">{d.name}</div>
                    <div className="text-[7.5px] uppercase font-semibold mt-0.5">{d.risk} RISK</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 7-Day Forecast Overview Chart */}
          <div className="flex-1 bg-bg/40 border border-gridBorder p-3 rounded-xl flex flex-col justify-between min-h-[220px]">
            <div className="flex justify-between items-center border-b border-[#0a1f3d] pb-1.5 mb-1.5">
              <span className="font-sans font-bold text-xs text-textPrimary uppercase">7-Day Forecast Overview</span>
              
              <div className="flex p-0.5 bg-bg rounded border border-gridBorder font-mono text-[8px]">
                <button 
                  onClick={() => setChartTab('temp')} 
                  className={`px-2 py-0.5 rounded transition-colors ${chartTab === 'temp' ? 'bg-cyan-950/20 text-[#00d4ff] font-bold' : 'text-textMuted hover:text-textPrimary'}`}
                >
                  Temperature
                </button>
                <button 
                  onClick={() => setChartTab('rain')} 
                  className={`px-2 py-0.5 rounded transition-colors ${chartTab === 'rain' ? 'bg-cyan-950/20 text-[#00d4ff] font-bold' : 'text-textMuted hover:text-textPrimary'}`}
                >
                  Rainfall
                </button>
              </div>
            </div>

            <div className="flex-1 w-full text-[10px] min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                {chartTab === 'temp' ? (
                  <LineChart data={data.forecast} margin={{ top: 5, right: 10, left: -25, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#0a1f3d" />
                    <XAxis dataKey="day" stroke="#4a7fa5" />
                    <YAxis domain={['auto', 'auto']} stroke="#4a7fa5" />
                    <ChartTooltip contentStyle={{ backgroundColor: '#050d1a', borderColor: '#0a1f3d', color: '#e2f4ff' }} />
                    <Legend iconSize={8} wrapperStyle={{ fontSize: '9px' }} />
                    <Line type="monotone" dataKey="max" stroke="#ff3d5a" strokeWidth={1.5} dot={{ r: 2.5 }} name="Max Temp (°C)" />
                    <Line type="monotone" dataKey="min" stroke="#00d4ff" strokeWidth={1.5} dot={{ r: 2.5 }} name="Min Temp (°C)" />
                  </LineChart>
                ) : (
                  <LineChart data={data.forecast} margin={{ top: 5, right: 10, left: -25, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#0a1f3d" />
                    <XAxis dataKey="day" stroke="#4a7fa5" />
                    <YAxis domain={['auto', 'auto']} stroke="#4a7fa5" />
                    <ChartTooltip contentStyle={{ backgroundColor: '#050d1a', borderColor: '#0a1f3d', color: '#e2f4ff' }} />
                    <Legend iconSize={8} wrapperStyle={{ fontSize: '9px' }} />
                    <Line type="monotone" dataKey="rain" stroke="#00d4ff" strokeWidth={1.5} dot={{ r: 2.5 }} name="Rainfall (mm)" />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>

        </div>

      </div>

      {/* ROW 3: CLIMATE HOTSPOTS (TODAY) & WINDS ANIMATOR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Hotspots Panel (LG: 9 Cols) */}
        <div className="lg:col-span-9 glass-panel rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center space-x-1.5 border-b border-[#0a1f3d] pb-1.5 mb-2.5">
            <span className="h-2 w-2 rounded-full bg-red-500 animate-ping"></span>
            <span className="font-sans font-bold text-xs text-textPrimary uppercase">Climate Hotspots (Today)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            
            {/* Card 1: West Rajasthan */}
            <div className="bg-bg/40 border border-gridBorder p-2 rounded flex items-center space-x-2.5 hover:border-red-500/25 transition-all animate-[pulse_3s_infinite]">
              <div className="h-8 w-8 rounded-full bg-red-950/20 border border-red-500/20 flex items-center justify-center shrink-0">
                <Thermometer className="h-4.5 w-4.5 text-red-400 animate-pulse" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] text-textPrimary font-bold truncate">West Rajasthan</div>
                <div className="text-[8.5px] text-textMuted">Heatwave Zone (38°C - 42°C)</div>
                <span className="text-[8px] font-bold text-red-400 uppercase mt-0.5 block">HIGH</span>
              </div>
            </div>

            {/* Card 2: Brahmaputra Basin */}
            <div className="bg-bg/40 border border-gridBorder p-2 rounded flex items-center space-x-2.5 hover:border-cyan-500/25 transition-all">
              <div className="h-8 w-8 rounded-full bg-cyan-950/20 border border-cyan-500/20 flex items-center justify-center shrink-0">
                <Droplets className="h-4.5 w-4.5 text-cyan-400" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] text-textPrimary font-bold truncate">Brahmaputra Basin</div>
                <div className="text-[8.5px] text-textMuted">Heavy Rainfall (120 - 200 mm)</div>
                <span className="text-[8px] font-bold text-cyan-400 uppercase mt-0.5 block">HIGH</span>
              </div>
            </div>

            {/* Card 3: Assam Valley */}
            <div className="bg-bg/40 border border-gridBorder p-2 rounded flex items-center space-x-2.5 hover:border-cyan-500/25 transition-all">
              <div className="h-8 w-8 rounded-full bg-cyan-950/20 border border-cyan-500/20 flex items-center justify-center shrink-0">
                <Info className="h-4.5 w-4.5 text-cyan-400" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] text-textPrimary font-bold truncate">Assam Valley</div>
                <div className="text-[8.5px] text-textMuted">Flood Risk (High Probability)</div>
                <span className="text-[8px] font-bold text-cyan-400 uppercase mt-0.5 block">HIGH</span>
              </div>
            </div>

            {/* Card 4: Marathwada */}
            <div className="bg-bg/40 border border-gridBorder p-2 rounded flex items-center space-x-2.5 hover:border-amber-500/25 transition-all">
              <div className="h-8 w-8 rounded-full bg-amber-950/20 border border-amber-500/20 flex items-center justify-center shrink-0">
                <AlertTriangle className="h-4.5 w-4.5 text-warning" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] text-textPrimary font-bold truncate">Marathwada</div>
                <div className="text-[8.5px] text-textMuted">Drought Risk (Severe Conditions)</div>
                <span className="text-[8px] font-bold text-warning uppercase mt-0.5 block">HIGH</span>
              </div>
            </div>

          </div>
        </div>

        {/* Rain & Wind animation card (LG: 3 Cols) */}
        <div className="lg:col-span-3 glass-panel rounded-xl p-3 flex items-center justify-between min-h-[80px]">
          <div className="min-w-0">
            <span className="font-sans font-bold text-xs text-textPrimary block uppercase">Rainfall & Wind Animation</span>
            <span className="text-[9px] text-textMuted leading-tight block mt-0.5">
              Visualizing forecasted rainfall and wind direction for the next 7 days.
            </span>
          </div>

          <button
            onClick={() => {
              setIsPlayingAnimation(true);
              setLayers({ temp: true, rain: true, wind: true, humidity: false, lst: false, sst: false, ndvi: false });
              setTimeout(() => {
                setIsPlayingAnimation(false);
              }, 4000);
            }}
            disabled={isPlayingAnimation}
            className="flex items-center space-x-1 bg-[#00d4ff]/10 hover:bg-[#00d4ff]/20 text-[#00d4ff] border border-[#00d4ff]/30 px-3 py-1.5 rounded-lg text-[10px] font-mono transition-all font-bold shrink-0 shadow-lg cursor-pointer"
          >
            <Play className={`h-3 w-3 ${isPlayingAnimation ? 'animate-ping' : ''}`} />
            <span>{isPlayingAnimation ? 'PLAYING...' : 'Play Animation'}</span>
          </button>
        </div>

      </div>

    </div>
  );
};

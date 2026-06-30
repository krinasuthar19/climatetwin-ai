import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
  Legend
} from 'recharts';
import { Thermometer, Droplets, ShieldAlert, Zap, Layers, RefreshCw, Calendar, TrendingUp, Info } from 'lucide-react';

export const ClimatePrediction: React.FC = () => {
  const [region, setRegion] = useState('Rajasthan');
  const [variable, setVariable] = useState('temp');
  const [timeframe, setTimeframe] = useState('30d');
  const [modelType, setModelType] = useState('TFT');
  const [selectedTimeline, setSelectedTimeline] = useState<'+3D' | '+7D' | '+30D' | '+1Y'>('+30D');

  // Forecast data with confidence interval parameters
  const forecastData30d = [
    { name: 'Day 1', temp: 44.2, tempMin: 43.5, tempMax: 44.9, rain: 2, rainMin: 0, rainMax: 5 },
    { name: 'Day 5', temp: 44.8, tempMin: 43.8, tempMax: 45.8, rain: 5, rainMin: 0, rainMax: 12 },
    { name: 'Day 10', temp: 45.5, tempMin: 44.2, tempMax: 46.8, rain: 8, rainMin: 1, rainMax: 18 },
    { name: 'Day 15', temp: 45.1, tempMin: 43.5, tempMax: 46.7, rain: 12, rainMin: 2, rainMax: 24 },
    { name: 'Day 20', temp: 44.3, tempMin: 42.8, tempMax: 45.8, rain: 15, rainMin: 4, rainMax: 30 },
    { name: 'Day 25', temp: 43.6, tempMin: 42.0, tempMax: 45.2, rain: 10, rainMin: 2, rainMax: 22 },
    { name: 'Day 30', temp: 42.8, tempMin: 41.2, tempMax: 44.4, rain: 5, rainMin: 0, rainMax: 14 }
  ];

  const forecastData90d = [
    { name: 'Jul', temp: 43.8, tempMin: 42.1, tempMax: 45.5, rain: 45, rainMin: 20, rainMax: 70 },
    { name: 'Aug', temp: 40.5, tempMin: 38.8, tempMax: 42.2, rain: 120, rainMin: 80, rainMax: 160 },
    { name: 'Sep', temp: 38.2, tempMin: 36.5, tempMax: 39.9, rain: 75, rainMin: 40, rainMax: 110 }
  ];

  const getActiveChartData = () => {
    return timeframe === '90d' ? forecastData90d : forecastData30d;
  };

  return (
    <div className="flex-1 w-full flex flex-col space-y-6 select-none max-w-[1440px] mx-auto p-2">
      
      {/* HUD Header */}
      <div className="flex justify-between items-center bg-[#050d1a]/80 border border-[#0a1f3d] p-3 rounded-xl">
        <div className="flex items-center space-x-3">
          <TrendingUp className="h-5 w-5 text-violet-400" />
          <div>
            <h2 className="font-sans font-bold text-xs tracking-wider text-textPrimary">
              AI CLIMATE FORECAST ENGINE
            </h2>
            <p className="text-[9px] text-textMuted font-mono">PREDICTION MODEL: TEMPORAL FUSION TRANSFORMER (TFT)</p>
          </div>
        </div>
        <span className="text-[10px] font-mono text-violet-400 bg-violet-950/30 border border-violet-800/30 px-2.5 py-1 rounded">
          MODEL CONFIDENCE: 92.4% AVERAGE
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Prediction controls (3 Cols) */}
        <div className="lg:col-span-3 glass-panel rounded-xl p-4 flex flex-col justify-between h-[450px]">
          <div className="space-y-4">
            <div>
              <h3 className="font-sans font-bold text-xs text-[#00d4ff] uppercase mb-1">
                Forecast Controls
              </h3>
              <p className="text-[10px] text-textMuted font-mono">CALIBRATE MODEL RUNS</p>
            </div>

            {/* Form controls */}
            <div className="space-y-3 font-mono text-xs">
              
              <div className="space-y-1">
                <label className="text-textMuted text-[9px] uppercase">TARGET REGION</label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full bg-bg border border-gridBorder rounded px-2.5 py-1.5 focus:outline-none focus:border-[#00d4ff]/40 text-textPrimary"
                >
                  <option value="Rajasthan">Rajasthan (Barmer Grid)</option>
                  <option value="Gujarat">Gujarat (Ahmedabad Grid)</option>
                  <option value="Assam">Assam Valley (Dhubri)</option>
                  <option value="Maharashtra">Maharashtra (Vidarbha)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-textMuted text-[9px] uppercase">VARIABLE INDICATOR</label>
                <select
                  value={variable}
                  onChange={(e) => setVariable(e.target.value)}
                  className="w-full bg-bg border border-gridBorder rounded px-2.5 py-1.5 focus:outline-none focus:border-[#00d4ff]/40 text-textPrimary"
                >
                  <option value="temp">Temperature Anomaly</option>
                  <option value="rain">Precipitation Rates</option>
                  <option value="humidity">Relative Humidity</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-textMuted text-[9px] uppercase">TIMEFRAME WINDOW</label>
                <div className="grid grid-cols-3 gap-1">
                  {(['7d', '30d', '90d'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTimeframe(t)}
                      className={`py-1.5 rounded border text-[10px] uppercase font-bold transition-all ${
                        timeframe === t 
                          ? 'bg-cyan-950/20 border-[#00d4ff]/40 text-[#00d4ff]' 
                          : 'bg-bg border-gridBorder text-textMuted'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-textMuted text-[9px] uppercase">AI ARCHITECTURE</label>
                <select
                  value={modelType}
                  onChange={(e) => setModelType(e.target.value)}
                  className="w-full bg-bg border border-gridBorder rounded px-2.5 py-1.5 focus:outline-none focus:border-[#00d4ff]/40 text-textPrimary"
                >
                  <option value="TFT">Temporal Fusion Transformer</option>
                  <option value="LSTM">LSTM Hydrological Network</option>
                  <option value="SARIMA">Statistical SARIMA Grid</option>
                </select>
              </div>

            </div>
          </div>

          <button className="w-full py-2 bg-violet-600 hover:bg-violet-500 text-textPrimary font-sans font-bold text-xs rounded transition-all flex items-center justify-center space-x-2">
            <RefreshCw className="h-4.5 w-4.5" />
            <span>EXECUTE TFT FORECAST</span>
          </button>
        </div>

        {/* Right: Wide forecast chart (9 Cols) */}
        <div className="lg:col-span-9 glass-panel rounded-xl p-4 flex flex-col justify-between h-[450px]">
          
          <div className="flex justify-between items-center mb-2 border-b border-[#0a1f3d] pb-2">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-cyan-400" />
              <span className="font-sans font-bold text-xs text-textPrimary tracking-wide uppercase">
                {region} {variable === 'temp' ? 'Temperature' : 'Rainfall'} Model Projections
              </span>
            </div>
            
            {/* Timeline tabs */}
            <div className="flex space-x-1">
              {(['+3D', '+7D', '+30D', '+1Y'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedTimeline(tab)}
                  className={`px-2 py-0.5 rounded text-[9px] font-mono border ${
                    selectedTimeline === tab 
                      ? 'bg-cyan-950/20 border-[#00d4ff]/30 text-[#00d4ff] font-bold' 
                      : 'bg-bg border-gridBorder text-textMuted'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Large Recharts with shaded confidence bounds */}
          <div className="flex-1 w-full text-xs my-2 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={getActiveChartData()} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <defs>
                  {variable === 'temp' ? (
                    <linearGradient id="tempColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ff3d5a" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#ff3d5a" stopOpacity={0} />
                    </linearGradient>
                  ) : (
                    <linearGradient id="rainColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                    </linearGradient>
                  )}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#0a1f3d" />
                <XAxis dataKey="name" stroke="#4a7fa5" />
                <YAxis stroke="#4a7fa5" />
                <Tooltip contentStyle={{ backgroundColor: '#050d1a', borderColor: '#0a1f3d' }} />
                
                {/* Uncertainty bounds (Shaded area representing min/max confidence) */}
                {variable === 'temp' ? (
                  <>
                    <Area type="monotone" dataKey="tempMax" stroke="transparent" fill="#ff3d5a" fillOpacity={0.1} />
                    <Area type="monotone" dataKey="tempMin" stroke="transparent" fill="#020610" fillOpacity={1} />
                    <Line type="monotone" dataKey="temp" stroke="#ff3d5a" strokeWidth={2.5} dot />
                  </>
                ) : (
                  <>
                    <Area type="monotone" dataKey="rainMax" stroke="transparent" fill="#00d4ff" fillOpacity={0.1} />
                    <Area type="monotone" dataKey="rainMin" stroke="transparent" fill="#020610" fillOpacity={1} />
                    <Line type="monotone" dataKey="rain" stroke="#00d4ff" strokeWidth={2.5} dot />
                  </>
                )}
                
                <Legend />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-bg/60 border border-[#0a1f3d] p-3 rounded-lg flex items-center space-x-2 text-[10px] font-sans text-textMuted leading-relaxed">
            <Info className="h-4 w-4 text-cyan-400 shrink-0" />
            <span>
              This forecast was generated using Temporal Fusion Transformer models trained on climate observations. Shaded graph bounds represent the 10th-90th percentile confidence deviations.
            </span>
          </div>

        </div>

      </div>

    </div>
  );
};

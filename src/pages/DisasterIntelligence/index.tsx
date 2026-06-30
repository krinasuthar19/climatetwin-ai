import React, { useState } from 'react';
import { useTelemetryStore } from '../../store/useTelemetryStore';
import { ShieldAlert, Zap, AlertTriangle, Play, HelpCircle, Activity, Info } from 'lucide-react';

export const DisasterIntelligence: React.FC = () => {
  const { alerts, recommendations, approveRecommendation } = useTelemetryStore();
  const [selectedDisaster, setSelectedDisaster] = useState<string>('Flood');

  const disasters = [
    { type: 'Heatwave', risk: 81, color: 'text-red-500', bg: 'bg-red-500/10' },
    { type: 'Flood', risk: 73, color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
    { type: 'Drought', risk: 45, color: 'text-warning', bg: 'bg-amber-500/10' },
    { type: 'Cyclone', risk: 28, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { type: 'Landslide', risk: 22, color: 'text-slate-400', bg: 'bg-slate-500/10' },
    { type: 'Forest Fire', risk: 19, color: 'text-red-600', bg: 'bg-red-700/10' }
  ];

  return (
    <div className="flex-1 w-full flex flex-col space-y-4 select-none">
      
      {/* HUD Header */}
      <div className="flex justify-between items-center bg-[#050d1a]/80 border border-[#0a1f3d] p-3 rounded-xl">
        <div className="flex items-center space-x-3">
          <ShieldAlert className="h-5 w-5 text-red-500 animate-pulse" />
          <div>
            <h2 className="font-orbitron font-bold text-xs tracking-wider text-textPrimary">
              NATIONAL DISASTER RISK MONITOR
            </h2>
            <p className="text-[9px] text-textMuted font-mono">CRISIS MITIGATION COMMAND LAYER</p>
          </div>
        </div>
        <span className="text-[10px] font-mono text-red-400 bg-red-950/20 border border-red-500/20 px-2.5 py-1 rounded animate-pulse">
          EMERGENCY CODES ACTIVE
        </span>
      </div>

      {/* Row 1: 6 Disaster Type Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {disasters.map((dis, i) => (
          <button
            key={i}
            onClick={() => setSelectedDisaster(dis.type)}
            className={`glass-panel rounded-xl p-3 flex flex-col justify-between text-left transition-all ${
              selectedDisaster === dis.type 
                ? 'border-red-500 bg-red-950/10 shadow-[0_0_15px_rgba(239,68,68,0.15)]' 
                : 'hover:border-[#00d4ff]/30'
            }`}
          >
            <span className="text-[10px] font-mono text-textMuted uppercase">{dis.type}</span>
            <div className="my-2 flex items-baseline justify-between">
              <span className={`text-2xl font-mono font-extrabold ${dis.color}`}>{dis.risk}%</span>
              <span className="text-[8px] font-mono text-textMuted">RISK</span>
            </div>
            <div className="w-full bg-bg h-1 rounded overflow-hidden">
              <div className={`h-full ${dis.type === 'Flood' ? 'bg-cyan-400' : 'bg-red-500'}`} style={{ width: `${dis.risk}%` }}></div>
            </div>
          </button>
        ))}
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left: simulated map overlay of disasters (6 Cols) */}
        <div className="lg:col-span-6 glass-panel rounded-xl p-4 flex flex-col justify-between h-[340px] relative">
          
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-mono text-textMuted uppercase">
              Operational Threat Vector Map
            </span>
            <span className="text-[9px] font-mono text-red-500 animate-pulse font-bold">
              ACTIVE SECTORS: 2 CRITICAL
            </span>
          </div>

          {/* SVG Map of India with hazard zone grids */}
          <div className="flex-1 flex items-center justify-center my-3">
            <svg viewBox="0 0 500 400" className="h-full w-full max-h-[220px]">
              
              {/* grid lines */}
              <g stroke="rgba(10,31,61,0.2)" strokeWidth="0.5" fill="none">
                <line x1="100" y1="0" x2="100" y2="400" />
                <line x1="200" y1="0" x2="200" y2="400" />
                <line x1="300" y1="0" x2="300" y2="400" />
                <line x1="400" y1="0" x2="400" y2="400" />
                <line x1="0" y1="100" x2="500" y2="100" />
                <line x1="0" y1="200" x2="500" y2="200" />
                <line x1="0" y1="300" x2="500" y2="300" />
              </g>

              {/* Stylized boundaries */}
              <path
                d="M 120,80 L 180,60 L 200,120 L 140,140 Z"
                fill="none"
                stroke="rgba(0, 212, 255, 0.4)"
                strokeWidth="1.2"
              />

              <path
                d="M 330,80 L 380,75 L 390,110 L 350,115 Z"
                fill="none"
                stroke="rgba(0, 212, 255, 0.4)"
                strokeWidth="1.2"
              />

              {/* Danger zones overlay shapes */}
              {selectedDisaster === 'Heatwave' && (
                <path
                  d="M 120,80 L 180,60 L 200,120 L 140,140 Z"
                  fill="rgba(239, 68, 68, 0.35)"
                  className="animate-pulse"
                />
              )}

              {selectedDisaster === 'Flood' && (
                <path
                  d="M 330,80 L 380,75 L 390,110 L 350,115 Z"
                  fill="rgba(6, 182, 212, 0.35)"
                  className="animate-pulse"
                />
              )}

              {/* Pulsing rings */}
              <circle cx="160" cy="100" r="5" fill="#ff3d5a" />
              <circle cx="160" cy="100" r="15" fill="none" stroke="#ff3d5a" strokeWidth="0.8" className="animate-ping" />
              
              <circle cx="360" cy="95" r="5" fill="#ff3d5a" />
              <circle cx="360" cy="95" r="15" fill="none" stroke="#ff3d5a" strokeWidth="0.8" className="animate-ping" />

            </svg>
          </div>

          <div className="bg-bg/40 border border-[#0a1f3d] p-2.5 rounded-lg flex items-center space-x-2 text-[10px] font-mono text-red-400">
            <AlertTriangle className="h-4 w-4 shrink-0 text-red-500 animate-pulse" />
            <span>THREAT DETECTED IN GRID CELL RJ-BMR AND AS-DBR. RESPONSE FORCES STAGED.</span>
          </div>

        </div>

        {/* Right: Active Event Details & Recommendations (6 Cols) */}
        <div className="lg:col-span-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Active events panel */}
          <div className="glass-panel rounded-xl p-4 flex flex-col justify-between h-[340px]">
            <div>
              <h3 className="font-orbitron font-bold text-xs text-[#00d4ff] uppercase mb-2">Active Emergency Events</h3>
              <p className="text-[9px] text-textMuted font-mono uppercase mb-4">INGESTED REPORTS</p>
            </div>

            <div className="flex-1 space-y-2 overflow-y-auto max-h-[190px] pr-1 text-[10px] font-mono">
              {alerts.map((al) => (
                <div key={al.id} className="p-2.5 bg-bg/40 border border-gridBorder rounded flex flex-col justify-between">
                  <div className="flex justify-between items-center mb-1 font-bold text-textPrimary">
                    <span>{al.type} Emergency</span>
                    <span className="text-red-400 font-extrabold">{al.severity}</span>
                  </div>
                  <div className="text-textMuted leading-relaxed">{al.region} hazard sector flagged.</div>
                </div>
              ))}
            </div>

            <div className="border-t border-[#0a1f3d] pt-2 text-[9px] text-textMuted font-mono flex justify-between">
              <span>Total Active: {alerts.length} sectors</span>
              <span>NDMA Alert Mode: Active</span>
            </div>
          </div>

          {/* AI Decision Recommendations & Economic Loss */}
          <div className="glass-panel rounded-xl p-4 flex flex-col justify-between h-[340px]">
            <div className="space-y-4">
              <div>
                <h3 className="font-orbitron font-bold text-xs text-[#00d4ff] uppercase">Action Protocols</h3>
                <p className="text-[9px] text-textMuted font-mono">NDMA INTERVENTION FLOW</p>
              </div>

              {/* List of actions */}
              <div className="space-y-2.5 text-[10px] font-mono">
                <div>
                  <div className="flex justify-between text-textMuted font-bold mb-1">
                    <span>Deployment: NDRF Teams</span>
                    <span className="text-[#00d4ff]">94% Confidence</span>
                  </div>
                  <button 
                    onClick={() => approveRecommendation('rec-1')}
                    className="w-full py-1.5 bg-cyan-950/20 hover:bg-cyan-900/20 border border-cyan-800/30 hover:border-cyan-500/30 text-cyan-400 font-extrabold rounded transition-all"
                  >
                    DISPATCH NDRF UNITS
                  </button>
                </div>
                
                <div>
                  <div className="flex justify-between text-textMuted font-bold mb-1">
                    <span>Hydration: Hydration Tents</span>
                    <span className="text-[#00d4ff]">89% Confidence</span>
                  </div>
                  <button 
                    onClick={() => approveRecommendation('rec-3')}
                    className="w-full py-1.5 bg-cyan-950/20 hover:bg-cyan-900/20 border border-cyan-800/30 hover:border-cyan-500/30 text-cyan-400 font-extrabold rounded transition-all"
                  >
                    DEPLOY HYDRATION OUTPOSTS
                  </button>
                </div>
              </div>
            </div>

            {/* Economic loss stats */}
            <div className="border-t border-[#0a1f3d] pt-3">
              <span className="text-[9px] text-textMuted font-mono uppercase block">Estimated Crop & Property Loss</span>
              <span className="text-base font-mono font-extrabold text-[#ff3d5a] mt-0.5">₹340 Crores est. / day</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

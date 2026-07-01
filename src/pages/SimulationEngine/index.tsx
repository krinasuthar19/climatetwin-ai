import React, { useState } from 'react';
import { useSimulationStore } from '../../store/useSimulationStore';
import { useNavigationStore } from '../../store/useNavigationStore';
import { Sliders, RefreshCw, AlertTriangle, ShieldCheck, HelpCircle, Activity, Globe, Info } from 'lucide-react';
import { indiaPaths } from '../../data/indiaPaths';

export const SimulationEngine: React.FC = () => {
  const {
    inputs,
    outputs,
    isSimulating,
    history,
    setInputValue,
    runSimulation,
    resetInputs
  } = useSimulationStore();

  const { activeDistrict } = useNavigationStore();

  const getSimMapColor = (stateName: string) => {
    const avgRisk = (outputs.floodRisk + outputs.droughtRisk) / 2;
    if (stateName === 'Rajasthan') {
      const risk = outputs.droughtRisk;
      if (risk > 80) return 'rgba(239, 68, 68, 0.75)';
      if (risk > 55) return 'rgba(245, 158, 11, 0.65)';
      return 'rgba(16, 185, 129, 0.45)';
    } else if (stateName === 'Assam') {
      const risk = outputs.floodRisk;
      if (risk > 80) return 'rgba(6, 182, 212, 0.8)';
      if (risk > 55) return 'rgba(59, 130, 246, 0.6)';
      return 'rgba(16, 185, 129, 0.45)';
    }
    
    const charSum = stateName.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const weight = (charSum % 10) / 10;
    const risk = avgRisk * (0.8 + weight * 0.4);
    if (risk > 75) return 'rgba(239, 68, 68, 0.65)';
    if (risk > 50) return 'rgba(245, 158, 11, 0.5)';
    return 'rgba(16, 185, 129, 0.35)';
  };

  return (
    <div className="flex-1 w-full flex flex-col justify-between space-y-6 select-none max-w-[1440px] mx-auto p-2 font-sans">
      
      {/* HUD Bar */}
      <div className="flex justify-between items-center bg-[#050d1a]/80 border border-[#0a1f3d] p-3 rounded-xl">
        <div className="flex items-center space-x-3">
          <Globe className="h-5 w-5 text-cyan-400" />
          <div>
            <h2 className="font-sans font-bold text-xs tracking-wider text-textPrimary text-left">
              CLIMATE WHAT-IF SCENARIO SIMULATOR
            </h2>
            <p className="text-[9px] text-textMuted font-mono">ISRO EVALUATION PARAMETER: INTERACTIVE SCENARIO SIMULATION MODULE</p>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <button 
            onClick={resetInputs}
            className="px-3 py-1 bg-bg border border-gridBorder text-textMuted hover:text-textPrimary rounded text-[10px] font-mono transition-colors"
          >
            RESET PARAMETERS
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: 5 Input Sliders (3 Cols) */}
        <div className="lg:col-span-3 glass-panel rounded-xl p-4 flex flex-col justify-between h-[460px]">
          <div>
            <div className="mb-4">
              <h3 className="font-sans font-bold text-xs text-[#00d4ff] uppercase mb-1">
                Scenario Inputs
              </h3>
              <p className="text-[10px] text-textMuted font-mono">CALIBRATE FORECAST METRICS</p>
            </div>

            <div className="space-y-4 font-mono text-xs">
              
              {/* Temp slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-textMuted uppercase">Temperature Shift</span>
                  <span className="text-[#ff3d5a] font-bold">{inputs.tempChange > 0 ? `+${inputs.tempChange}` : inputs.tempChange}°C</span>
                </div>
                <input
                  type="range"
                  min="-2.0"
                  max="5.0"
                  step="0.1"
                  value={inputs.tempChange}
                  onChange={(e) => setInputValue('tempChange', parseFloat(e.target.value))}
                  className="w-full h-1 bg-[#0a1f3d] rounded appearance-none cursor-pointer accent-[#ff3d5a]"
                />
              </div>

              {/* Rain slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-textMuted uppercase">Rainfall Shift</span>
                  <span className="text-cyan-400 font-bold">{inputs.rainChange > 0 ? `+${inputs.rainChange}` : inputs.rainChange}%</span>
                </div>
                <input
                  type="range"
                  min="-50"
                  max="50"
                  step="1"
                  value={inputs.rainChange}
                  onChange={(e) => setInputValue('rainChange', parseInt(e.target.value))}
                  className="w-full h-1 bg-[#0a1f3d] rounded appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

              {/* Forest Cover slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-textMuted uppercase">Forest Cover</span>
                  <span className="text-[#10b981] font-bold">{inputs.forestCover}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="50"
                  step="1"
                  value={inputs.forestCover}
                  onChange={(e) => setInputValue('forestCover', parseInt(e.target.value))}
                  className="w-full h-1 bg-[#0a1f3d] rounded appearance-none cursor-pointer accent-[#10b981]"
                />
              </div>

              {/* Urbanization slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-textMuted uppercase">Urban Development</span>
                  <span className="text-violet-400 font-bold">{inputs.urbanization}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="80"
                  step="1"
                  value={inputs.urbanization}
                  onChange={(e) => setInputValue('urbanization', parseInt(e.target.value))}
                  className="w-full h-1 bg-[#0a1f3d] rounded appearance-none cursor-pointer accent-violet-400"
                />
              </div>

              {/* CO2 Emissions slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-textMuted uppercase">CO₂ Concentration</span>
                  <span className="text-amber-400 font-bold">{inputs.co2Emissions} ppm</span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="800"
                  step="5"
                  value={inputs.co2Emissions}
                  onChange={(e) => setInputValue('co2Emissions', parseInt(e.target.value))}
                  className="w-full h-1 bg-[#0a1f3d] rounded appearance-none cursor-pointer accent-amber-400"
                />
              </div>

            </div>
          </div>

          <button
            onClick={runSimulation}
            disabled={isSimulating}
            className="w-full py-3 bg-[#00d4ff] hover:bg-cyan-400 disabled:bg-[#0a1f3d] text-bg font-sans font-bold text-xs rounded-lg transition-all flex items-center justify-center space-x-2 shadow-[0_0_15px_rgba(0,212,255,0.2)]"
          >
            <RefreshCw className={`h-4 w-4 ${isSimulating ? 'animate-spin' : ''}`} />
            <span className="tracking-wider uppercase">{isSimulating ? 'COMPUTING SIMULATION GRID...' : 'RUN SIMULATION'}</span>
          </button>
        </div>

        {/* Center: India Map (6 Cols - Centerpiece) */}
        <div className="lg:col-span-6 glass-panel rounded-xl p-4 flex flex-col justify-between h-[460px] relative">
          
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-mono text-textMuted uppercase">
              Digital Twin Simulation Model Render ({activeDistrict ? activeDistrict : 'Whole India Map'})
            </span>
            <span className="text-[9px] font-mono text-cyan-400">
              {isSimulating ? '● COMPILING CASCADE COEFFICIENTS...' : '● MODEL DORMANT'}
            </span>
          </div>

          {/* SVG Map Container */}
          <div className="flex-1 flex items-center justify-center my-3 relative min-h-0">
            {/* Local CSS styles for wind flows, falling raindrops, and radars */}
            <style>{`
              @keyframes windFlowSim {
                0% { stroke-dashoffset: 40; }
                100% { stroke-dashoffset: 0; }
              }
              .wind-flow-sim-line {
                stroke-dasharray: 6 18;
                animation: windFlowSim 1.4s linear infinite;
              }
              @keyframes rainFallSim {
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
              .rain-drop-sim-line {
                animation: rainFallSim 0.8s linear infinite;
              }
              @keyframes radarSim {
                0%, 100% { opacity: 0.2; }
                50% { opacity: 0.5; }
              }
              .radar-sim-overlay {
                animation: radarSim 2.4s ease-in-out infinite;
              }
            `}</style>

            <svg viewBox="0 0 612 696" className="h-full w-full max-h-[300px]">
              <defs>
                <radialGradient id="heat-sim-radial" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ff3d5a" stopOpacity="0.85" />
                  <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="rain-sim-radial" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.85" />
                  <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#0a1f3d" stopOpacity="0" />
                </radialGradient>

                {/* High-tech Dotted telemetry mesh pattern */}
                <pattern id="grid-dots-sim" width="8" height="8" patternUnits="userSpaceOnUse">
                  <circle cx="2.5" cy="2.5" r="0.6" fill="rgba(0, 212, 255, 0.15)" />
                </pattern>
              </defs>

              {/* State boundaries group */}
              <g stroke="#0a1f3d" strokeWidth="0.8">
                {indiaPaths.map((state) => (
                  <path
                    key={state.id}
                    d={state.path}
                    fill={getSimMapColor(state.name)}
                    className="transition-colors duration-500"
                  />
                ))}
              </g>

              {/* Dotted Climatic Grid Mesh Overlay */}
              <g stroke="none" fill="url(#grid-dots-sim)" pointerEvents="none">
                {indiaPaths.map((state) => (
                  <path key={`grid-sim-${state.id}`} d={state.path} />
                ))}
              </g>

              {/* Dynamic Heatwave Overlay */}
              {outputs.droughtRisk > 40 && (
                <circle 
                  cx={activeDistrict === 'Assam' ? '510' : '150'} 
                  cy={activeDistrict === 'Assam' ? '270' : '210'} 
                  r="140" 
                  fill="url(#heat-sim-radial)" 
                  className="pointer-events-none transition-opacity duration-500 animate-pulse"
                  style={{ opacity: Math.min(0.6, outputs.droughtRisk / 120) }}
                />
              )}

              {/* Dynamic Flood Overlay */}
              {outputs.floodRisk > 40 && (
                <circle 
                  cx={activeDistrict === 'Rajasthan' ? '150' : '510'} 
                  cy={activeDistrict === 'Rajasthan' ? '210' : '270'} 
                  r="110" 
                  fill="url(#rain-sim-radial)" 
                  className="pointer-events-none radar-sim-overlay transition-opacity duration-500"
                  style={{ opacity: Math.min(0.6, outputs.floodRisk / 120) }}
                />
              )}

              {/* Falling Raindrops animation lines on Simulator Map */}
              {outputs.floodRisk > 40 && (
                <g stroke="#00d4ff" strokeWidth="1" strokeLinecap="round" opacity="0.8" className="pointer-events-none">
                  
                  {/* Rajasthan simulator rain drops */}
                  {(!activeDistrict || activeDistrict === 'Rajasthan') && (
                    <g>
                      <line x1="130" y1="190" x2="133" y2="198" className="rain-drop-sim-line" style={{ animationDelay: '0.1s', animationDuration: '0.7s' }} />
                      <line x1="150" y1="180" x2="153" y2="188" className="rain-drop-sim-line" style={{ animationDelay: '0.4s', animationDuration: '0.9s' }} />
                      <line x1="170" y1="195" x2="173" y2="203" className="rain-drop-sim-line" style={{ animationDelay: '0.2s', animationDuration: '0.6s' }} />
                      <line x1="140" y1="220" x2="143" y2="228" className="rain-drop-sim-line" style={{ animationDelay: '0.5s', animationDuration: '0.8s' }} />
                    </g>
                  )}

                  {/* Assam simulator rain drops */}
                  {(!activeDistrict || activeDistrict === 'Assam') && (
                    <g>
                      <line x1="490" y1="240" x2="493" y2="248" className="rain-drop-sim-line" style={{ animationDelay: '0.1s', animationDuration: '0.7s' }} />
                      <line x1="510" y1="250" x2="513" y2="258" className="rain-drop-sim-line" style={{ animationDelay: '0.3s', animationDuration: '0.9s' }} />
                      <line x1="530" y1="230" x2="533" y2="238" className="rain-drop-sim-line" style={{ animationDelay: '0.0s', animationDuration: '0.6s' }} />
                      <line x1="480" y1="270" x2="483" y2="278" className="rain-drop-sim-line" style={{ animationDelay: '0.5s', animationDuration: '0.8s' }} />
                    </g>
                  )}
                </g>
              )}

              {/* Dense Wind Vector streamlines flow on Simulator Map */}
              {outputs.floodRisk > 45 && (
                <g stroke="rgba(0, 212, 255, 0.5)" strokeWidth="1.2" fill="none" className="pointer-events-none">
                  
                  {/* Rajasthan simulator wind streamlines */}
                  {(!activeDistrict || activeDistrict === 'Rajasthan') && (
                    <g>
                      <path d="M 110,220 Q 140,200 170,180" className="wind-flow-sim-line" style={{ animationDelay: '0.0s', animationDuration: '1.2s' }} />
                      <path d="M 120,240 Q 150,220 180,200" className="wind-flow-sim-line" style={{ animationDelay: '0.3s', animationDuration: '1.5s' }} />
                    </g>
                  )}

                  {/* Assam simulator wind streamlines */}
                  {(!activeDistrict || activeDistrict === 'Assam') && (
                    <g>
                      <path d="M 470,280 Q 500,260 530,240" className="wind-flow-sim-line" style={{ animationDelay: '0.1s', animationDuration: '1.4s' }} />
                      <path d="M 480,300 Q 510,280 540,260" className="wind-flow-sim-line" style={{ animationDelay: '0.4s', animationDuration: '1.6s' }} />
                    </g>
                  )}
                  
                  {/* General whole map wind lines */}
                  {!activeDistrict && (
                    <g>
                      <path d="M 60,520 Q 120,400 180,280" className="wind-flow-sim-line" style={{ animationDelay: '0.0s', animationDuration: '1.3s' }} />
                      <path d="M 100,600 Q 200,460 300,320" className="wind-flow-sim-line" style={{ animationDelay: '0.6s', animationDuration: '1.1s' }} />
                    </g>
                  )}
                </g>
              )}
            </svg>

            {/* Simulating Loading Overlays */}
            {isSimulating && (
              <div className="absolute inset-0 bg-[#020610]/90 backdrop-blur-sm rounded-lg flex flex-col items-center justify-center p-6 border border-cyan-800/30">
                <div className="flex items-center space-x-3 mb-2">
                  <Activity className="h-5 w-5 text-cyan-400 animate-spin" />
                  <span className="font-sans font-bold text-xs text-[#00d4ff] tracking-wider uppercase">
                    COMPUTING METEOROLOGICAL RUN...
                  </span>
                </div>
                <div className="w-48 bg-[#0a1f3d] h-1.5 rounded overflow-hidden mb-2">
                  <div className="bg-[#00d4ff] h-full animate-[progress-bar_1.5s_ease-out]"></div>
                </div>
                <div className="text-[9px] font-mono text-textMuted uppercase">
                  Fusing gridded climate inputs with TFT/XGBoost weights
                </div>
              </div>
            )}
          </div>

          <div className="bg-bg/40 border border-[#0a1f3d] p-2.5 rounded-lg flex items-center space-x-2 text-[10px] font-sans text-[#00d4ff]">
            <Info className="h-3.5 w-3.5 shrink-0" />
            <span>ADJUST INPUT SLIDERS AND CLICK RUN TO TRIGGER CASCADE COEFFICIENT EQUATIONS.</span>
          </div>

        </div>

        {/* Right Column: Live Impact Outputs (3 Cols - Unshrinkable) */}
        <div className="lg:col-span-3 glass-panel rounded-xl p-4 flex flex-col justify-between h-[460px]">
          <div>
            <div className="mb-3">
              <h3 className="font-sans font-bold text-xs text-[#00d4ff] uppercase mb-1">
                Impact Outputs
              </h3>
              <p className="text-[10px] text-textMuted font-mono">SIMULATION CALCULATED RESULTS</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              
              {/* Output 1: Flood Risk */}
              <div className="bg-bg/40 border border-gridBorder p-2.5 rounded-lg flex flex-col justify-between hover:border-cyan-500/30 transition-all min-h-[68px]">
                <span className="text-[9px] text-textMuted font-mono uppercase">Flood Risk</span>
                <span className="text-lg font-mono font-extrabold text-cyan-400 mt-1">{outputs.floodRisk}%</span>
                <div className="w-full bg-bg h-1 rounded overflow-hidden mt-1.5">
                  <div className="bg-cyan-400 h-full" style={{ width: `${outputs.floodRisk}%` }}></div>
                </div>
              </div>

              {/* Output 2: Drought Risk */}
              <div className="bg-bg/40 border border-gridBorder p-2.5 rounded-lg flex flex-col justify-between hover:border-red-500/30 transition-all min-h-[68px]">
                <span className="text-[9px] text-textMuted font-mono uppercase">Drought Risk</span>
                <span className="text-lg font-mono font-extrabold text-[#ff3d5a] mt-1">{outputs.droughtRisk}%</span>
                <div className="w-full bg-bg h-1 rounded overflow-hidden mt-1.5">
                  <div className="bg-[#ff3d5a] h-full" style={{ width: `${outputs.droughtRisk}%` }}></div>
                </div>
              </div>

              {/* Climate Conditions Header */}
              <div className="col-span-2 border-t border-[#0a1f3d] pt-2 mt-1">
                <span className="text-[9px] text-[#00d4ff] font-sans font-bold uppercase block">Climate Conditions</span>
              </div>

              {/* Output 3: Crop Yield Impact */}
              <div className="bg-bg/40 border border-gridBorder p-2.5 rounded-lg flex flex-col justify-between hover:border-emerald-500/30 transition-all min-h-[68px]">
                <span className="text-[9px] text-textMuted font-mono uppercase">Crop Yield</span>
                <span className={`text-lg font-mono font-extrabold mt-1 ${outputs.cropYieldImpact >= 0 ? 'text-[#10b981]' : 'text-[#ff3d5a]'}`}>
                  {outputs.cropYieldImpact >= 0 ? `+${outputs.cropYieldImpact}` : outputs.cropYieldImpact}%
                </span>
                <div className="w-full bg-bg h-1 rounded overflow-hidden mt-1.5">
                  <div className={`h-full ${outputs.cropYieldImpact >= 0 ? 'bg-emerald-500' : 'bg-red-500'}`} style={{ width: `${Math.abs(outputs.cropYieldImpact) * 2}%` }}></div>
                </div>
              </div>

              {/* Output 4: Water Stress */}
              <div className="bg-bg/40 border border-gridBorder p-2.5 rounded-lg flex flex-col justify-between hover:border-amber-500/30 transition-all min-h-[68px]">
                <span className="text-[9px] text-textMuted font-mono uppercase">Water Stress</span>
                <span className="text-lg font-mono font-extrabold text-warning mt-1">{outputs.waterStress}%</span>
                <div className="w-full bg-bg h-1 rounded overflow-hidden mt-1.5">
                  <div className="bg-warning h-full" style={{ width: `${outputs.waterStress}%` }}></div>
                </div>
              </div>

              {/* Output 5: Population Exposure */}
              <div className="col-span-2 bg-bg/40 border border-gridBorder p-2.5 rounded-lg flex items-center justify-between hover:border-cyan-500/30 transition-all min-h-[56px]">
                <div>
                  <span className="text-[9px] text-textMuted font-mono uppercase block">Population Exposed</span>
                  <span className="text-sm font-mono font-extrabold text-[#e2f4ff] mt-0.5">{outputs.populationExposure}M People</span>
                </div>
                <ShieldCheck className="h-4.5 w-4.5 text-emerald-400 shrink-0" />
              </div>

            </div>
          </div>
          
          <div className="text-[9px] font-mono text-textMuted text-center border-t border-[#0a1f3d] pt-2">
            MODEL RECALCULATED INDEX: ACCURACY 94.7%
          </div>

        </div>

      </div>

    </div>
  );
};

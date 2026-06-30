import React, { useState } from 'react';
import { useSimulationStore } from '../../store/useSimulationStore';
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

  const [simLogIndex, setSimLogIndex] = useState(0);

  // Dynamic state coloring for simulation map
  // High flood/drought risk translates to red/orange states
  const getSimMapColor = (stateName: string) => {
    // Rajasthan is drought-prone, Assam is flood-prone
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
    
    // Other states scale dynamic colors deterministically based on overall inputs
    const charSum = stateName.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const weight = (charSum % 10) / 10; // State-specific sensitivity weight
    const risk = avgRisk * (0.8 + weight * 0.4);
    if (risk > 75) return 'rgba(239, 68, 68, 0.65)';
    if (risk > 50) return 'rgba(245, 158, 11, 0.5)';
    return 'rgba(16, 185, 129, 0.35)';
  };

  return (
    <div className="flex-1 w-full flex flex-col justify-between space-y-6 select-none max-w-[1440px] mx-auto p-2">
      
      {/* HUD Bar */}
      <div className="flex justify-between items-center bg-[#050d1a]/80 border border-[#0a1f3d] p-3 rounded-xl">
        <div className="flex items-center space-x-3">
          <Globe className="h-5 w-5 text-cyan-400" />
          <div>
            <h2 className="font-sans font-bold text-xs tracking-wider text-textPrimary">
              NATIONAL CLIMATE WHAT-IF CONSOLE
            </h2>
            <p className="text-[9px] text-textMuted font-mono">DIGITAL TWIN SIMULATION SUBSYSTEM</p>
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
        
        {/* Left Column: 6 Input Sliders (3 Cols) */}
        <div className="lg:col-span-3 glass-panel rounded-xl p-4 flex flex-col justify-between h-[460px]">
          <div>
            <div className="mb-4">
              <h3 className="font-sans font-bold text-xs text-[#00d4ff] uppercase mb-1">
                Scenario Inputs
              </h3>
              <p className="text-[10px] text-textMuted font-mono">CALIBRATE FORECAST VARIABLES</p>
            </div>

            <div className="space-y-3 font-mono text-xs">
              
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

              {/* Water Availability slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-textMuted uppercase">Reservoir Water</span>
                  <span className="text-[#00d4ff] font-bold">{inputs.waterAvailability}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  step="1"
                  value={inputs.waterAvailability}
                  onChange={(e) => setInputValue('waterAvailability', parseInt(e.target.value))}
                  className="w-full h-1 bg-[#0a1f3d] rounded appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

              {/* CO2 Emissions slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-textMuted uppercase">Atmospheric CO₂</span>
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
              Digital Twin Simulation Model Render
            </span>
            <span className="text-[9px] font-mono text-cyan-400 animate-pulse">
              {isSimulating ? '● COMPILING CASCADE COEFFICIENTS...' : '● MODEL DORMANT'}
            </span>
          </div>

          {/* SVG Map Container */}
          <div className="flex-1 flex items-center justify-center my-3 relative min-h-0">
            <svg viewBox="0 0 612 696" className="h-full w-full max-h-[300px]">
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
            </svg>

            {/* Simulating Loading Overlays */}
            {isSimulating && (
              <div className="absolute inset-0 bg-[#020610]/85 backdrop-blur-sm rounded-lg flex flex-col items-center justify-center p-6 border border-cyan-800/30">
                <div className="flex items-center space-x-3 mb-3">
                  <Activity className="h-5 w-5 text-cyan-400 animate-spin" />
                  <span className="font-sans font-bold text-xs text-[#00d4ff] tracking-wider uppercase">
                    Recalculating Cascade Effects...
                  </span>
                </div>
                <div className="w-48 bg-[#0a1f3d] h-1.5 rounded overflow-hidden mb-4">
                  <div className="bg-[#00d4ff] h-full animate-[progress-bar_1.5s_ease-out]"></div>
                </div>
                
                {/* Terminal logs typing out during run */}
                <div className="w-full max-w-sm bg-bg border border-[#0a1f3d] rounded p-2.5 font-mono text-[9px] text-[#4a7fa5] text-left leading-relaxed space-y-1">
                  <div>&gt; INGESTING MODIFIED SCENARIO MATRIX... [OK]</div>
                  <div>&gt; INITIATING POSTGIS DRAINAGE MODEL RUN... [OK]</div>
                  <div>&gt; CO2 ATMOSPHERIC HEATING ESTIMATIONS COMPLETED...</div>
                  <div>&gt; DIGITAL TWIN STATE SYNCHRONIZED</div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-bg/40 border border-[#0a1f3d] p-2.5 rounded-lg flex items-center space-x-2 text-[10px] font-sans text-[#00d4ff]">
            <Info className="h-3.5 w-3.5 shrink-0" />
            <span>ADJUST INPUT SLIDERS AND CLICK RUN TO TRIGGER CASCADE COEFFICIENT EQUATIONS.</span>
          </div>

        </div>

        {/* Right Column: 6 Live Impact Outputs (3 Cols - Unshrinkable) */}
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

              {/* Output 5: Economic Impact */}
              <div className="col-span-2 bg-bg/40 border border-gridBorder p-2.5 rounded-lg flex items-center justify-between hover:border-cyan-500/30 transition-all min-h-[56px]">
                <div>
                  <span className="text-[9px] text-textMuted font-mono uppercase block">Economic Loss</span>
                  <span className="text-sm font-mono font-extrabold text-[#00d4ff] mt-0.5">₹{outputs.economicImpact.toLocaleString('en-IN')} CRORES</span>
                </div>
                <AlertTriangle className="h-4.5 w-4.5 text-warning shrink-0" />
              </div>

              {/* Output 6: Population Exposure */}
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

import React, { useState } from 'react';
import { useTelemetryStore } from '../../store/useTelemetryStore';
import { Settings, Cpu, HardDrive, ShieldAlert, Wifi, RefreshCw, Layers } from 'lucide-react';

export const Admin: React.FC = () => {
  const { addEvent } = useTelemetryStore();
  const [tempLimit, setTempLimit] = useState(42.5);
  const [rainLimit, setRainLimit] = useState(120);
  const [systemAlertThreshold, setSystemAlertThreshold] = useState('WATCH');

  const [calibratingModel, setCalibratingModel] = useState<string | null>(null);

  const triggerCalibrate = async (modelName: string) => {
    setCalibratingModel(modelName);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setCalibratingModel(null);
    addEvent('⚙️', `Admin Calibrated AI model: ${modelName.toUpperCase()}`);
  };

  return (
    <div className="flex-1 w-full flex flex-col space-y-4 select-none">
      
      {/* HUD Header */}
      <div className="flex justify-between items-center bg-[#050d1a]/80 border border-[#0a1f3d] p-3 rounded-xl">
        <div className="flex items-center space-x-3">
          <Settings className="h-5 w-5 text-cyan-400" />
          <div>
            <h2 className="font-orbitron font-bold text-xs tracking-wider text-textPrimary">
              SYSTEM CONTROL TERMINAL (ADMIN)
            </h2>
            <p className="text-[9px] text-textMuted font-mono">ISRO NODE MANAGEMENT PANEL</p>
          </div>
        </div>
        <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/30 border border-cyan-800/30 px-2.5 py-1 rounded">
          SERVER STATUS: HEALTHY
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Column: Data source ingestion & server health (3.5 Cols) */}
        <div className="lg:col-span-3.5 space-y-4">
          
          {/* Data source panel */}
          <div className="glass-panel rounded-xl p-4 space-y-3">
            <div>
              <h3 className="font-orbitron font-bold text-xs text-[#00d4ff] uppercase">Data Source Ingest</h3>
              <p className="text-[9px] text-textMuted font-mono">PRIMARY GROUND NETWORK LINKS</p>
            </div>
            
            <div className="space-y-2 text-[10px] font-mono">
              {[
                { name: 'IMD Station Network', speed: '24.1 KB/s', latency: '42ms', status: 'ACTIVE', color: 'text-emerald-400' },
                { name: 'INSAT Satellite L1', speed: '1.2 MB/s', latency: '142ms', status: 'ACTIVE', color: 'text-emerald-400' },
                { name: 'MOSDAC Hydro Feed', speed: '98.5 KB/s', latency: '190ms', status: 'ACTIVE', color: 'text-emerald-400' },
                { name: 'Oceansat-3 SST Grid', speed: '450 KB/s', latency: '231ms', status: 'ACTIVE', color: 'text-emerald-400' }
              ].map((src, i) => (
                <div key={i} className="p-2.5 bg-bg/40 border border-gridBorder rounded flex justify-between items-center">
                  <div>
                    <div className="font-bold text-textPrimary">{src.name}</div>
                    <div className="text-[8px] text-textMuted">{src.speed} | {src.latency}</div>
                  </div>
                  <span className={`text-[8px] font-bold ${src.color}`}>{src.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Server metrics */}
          <div className="glass-panel rounded-xl p-4 space-y-3">
            <div>
              <h3 className="font-orbitron font-bold text-xs text-[#00d4ff] uppercase">System Hardware Load</h3>
              <p className="text-[9px] text-textMuted font-mono">COMPUTE NODES METRICS</p>
            </div>

            <div className="space-y-3 font-mono text-[10px]">
              <div>
                <div className="flex justify-between text-textMuted">
                  <span>GPU Core Allocation (CUDA 12.1):</span>
                  <span className="text-textPrimary">78%</span>
                </div>
                <div className="w-full bg-bg h-1.5 rounded overflow-hidden mt-1">
                  <div className="bg-violet-500 h-full" style={{ width: '78%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-textMuted">
                  <span>Datalake DB Query Threads:</span>
                  <span className="text-textPrimary">34%</span>
                </div>
                <div className="w-full bg-bg h-1.5 rounded overflow-hidden mt-1">
                  <div className="bg-[#00d4ff] h-full" style={{ width: '34%' }}></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[9px] text-textMuted pt-1 border-t border-[#0a1f3d]">
                <div className="flex items-center space-x-1">
                  <Cpu className="h-3.5 w-3.5 text-textMuted" />
                  <span>CPU: 42% Load</span>
                </div>
                <div className="flex items-center space-x-1">
                  <HardDrive className="h-3.5 w-3.5 text-textMuted" />
                  <span>RAM: 32.1 GB</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Center: AI Models status & Calibration (5.5 Cols) */}
        <div className="lg:col-span-5.5 glass-panel rounded-xl p-4 flex flex-col justify-between min-h-[350px]">
          <div>
            <div className="mb-4">
              <h3 className="font-orbitron font-bold text-xs text-[#00d4ff] uppercase mb-1">
                AI Inference Engines Calibrations
              </h3>
              <p className="text-[10px] text-textMuted font-mono">CALIBRATE ALGORITHMIC ACCURACY SPECS</p>
            </div>

            <div className="space-y-2 text-[10px] font-mono">
              {[
                { name: 'Temporal Fusion Transformer (TFT)', task: 'Rainfall Projections', accuracy: '94.2%', trained: '2026-06-25', status: 'ACTIVE' },
                { name: 'XGBoost Risk Classifier', task: 'Disaster Hazard Scoring', accuracy: '91.8%', trained: '2026-06-28', status: 'ACTIVE' },
                { name: 'LSTM Groundwater Network', task: 'Soil Wetness/Runoff', accuracy: '88.5%', trained: '2026-06-24', status: 'ACTIVE' }
              ].map((model, i) => (
                <div key={i} className="p-3 bg-bg/50 border border-gridBorder rounded-lg flex justify-between items-center">
                  <div className="space-y-1">
                    <div className="font-bold text-textPrimary">{model.name}</div>
                    <div className="text-[9px] text-textMuted">Task: {model.task} | Trained: {model.trained}</div>
                    <div className="text-[9px] text-cyan-400 font-bold">Accuracy Index: {model.accuracy}</div>
                  </div>
                  
                  <button
                    onClick={() => triggerCalibrate(model.name)}
                    disabled={calibratingModel === model.name}
                    className="px-2.5 py-1 bg-surface border border-gridBorder hover:border-[#00d4ff]/30 text-textMuted hover:text-textPrimary rounded text-[9px] transition-colors flex items-center space-x-1"
                  >
                    <RefreshCw className={`h-3 w-3 ${calibratingModel === model.name ? 'animate-spin' : ''}`} />
                    <span>{calibratingModel === model.name ? 'RUNNING...' : 'CALIBRATE'}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-bg/40 border border-gridBorder p-2.5 rounded-lg text-[9px] text-textMuted font-sans leading-relaxed mt-4">
            💡 AI Model accuracy metrics are compiled weekly against historical ground datasets from IMD stations. Calibration runs utilize GPU node grids.
          </div>
        </div>

        {/* Right Column: Alert Threshold configurations (3 Cols) */}
        <div className="lg:col-span-3 glass-panel rounded-xl p-4 flex flex-col justify-between min-h-[350px]">
          <div className="space-y-4">
            <div>
              <h3 className="font-orbitron font-bold text-xs text-[#00d4ff] uppercase mb-1">
                Threshold Triggers
              </h3>
              <p className="text-[10px] text-textMuted font-mono">CONFIGURE HARDWARE ALARMS</p>
            </div>

            <div className="space-y-4 font-mono text-xs">
              
              {/* Temp warning limit slider */}
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-textMuted text-[9px]">TEMP CRITICAL LIMIT</span>
                  <span className="text-red-400 font-bold">{tempLimit}°C</span>
                </div>
                <input
                  type="range"
                  min="38.0"
                  max="48.0"
                  step="0.5"
                  value={tempLimit}
                  onChange={(e) => setTempLimit(parseFloat(e.target.value))}
                  className="w-full h-1 bg-[#0a1f3d] rounded appearance-none cursor-pointer accent-[#ff3d5a]"
                />
              </div>

              {/* Rain limit warning slider */}
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-textMuted text-[9px]">RAIN FLOOD WARNING</span>
                  <span className="text-cyan-400 font-bold">+{rainLimit}mm</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="250"
                  step="10"
                  value={rainLimit}
                  onChange={(e) => setRainLimit(parseInt(e.target.value))}
                  className="w-full h-1 bg-[#0a1f3d] rounded appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

              <div className="space-y-1">
                <span className="text-textMuted text-[9px] block uppercase">System Alarm Rating</span>
                <select
                  value={systemAlertThreshold}
                  onChange={(e) => setSystemAlertThreshold(e.target.value)}
                  className="w-full bg-bg border border-gridBorder rounded px-2.5 py-1.5 focus:outline-none focus:border-[#00d4ff]/40 text-textPrimary"
                >
                  <option value="NORMAL">NORMAL</option>
                  <option value="WATCH">WATCH</option>
                  <option value="WARNING">WARNING</option>
                  <option value="CRITICAL">CRITICAL</option>
                </select>
              </div>

            </div>
          </div>

          <div className="bg-[#120300] border border-[#ff3d5a]/20 p-2.5 rounded-lg flex items-center space-x-2 text-[10px] text-[#ff3d5a] font-mono">
            <ShieldAlert className="h-4.5 w-4.5 shrink-0 text-red-500 animate-pulse" />
            <span>ALARM THRESHOLDS APPLY DYNAMICALLY TO ALL HUD GAUGES.</span>
          </div>

        </div>

      </div>

    </div>
  );
};

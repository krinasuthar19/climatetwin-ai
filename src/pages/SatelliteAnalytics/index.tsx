import React, { useState } from 'react';
import { useTelemetryStore } from '../../store/useTelemetryStore';
import { Radio, HardDrive, RefreshCw, Upload, Eye, Compass, Info } from 'lucide-react';

export const SatelliteAnalytics: React.FC = () => {
  const { addEvent } = useTelemetryStore();
  const [activeChannel, setActiveChannel] = useState<'lst' | 'sst' | 'ndvi' | 'sar'>('lst');
  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'completed'>('idle');
  const [detectedAnomaly, setDetectedAnomaly] = useState<string | null>(null);

  const handleUploadSim = async () => {
    setUploadState('uploading');
    setDetectedAnomaly(null);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setUploadState('completed');
    setDetectedAnomaly('AI Classification: Thermal Heatwave anomaly identified in Barmer Division, Rajasthan (Confidence: 96%).');
    addEvent('🛰', 'Satellite Image Uploaded. AI detection complete.');
  };

  return (
    <div className="flex-1 w-full flex flex-col space-y-4 select-none">
      
      {/* HUD Header */}
      <div className="flex justify-between items-center bg-[#050d1a]/80 border border-[#0a1f3d] p-3 rounded-xl">
        <div className="flex items-center space-x-3">
          <Radio className="h-5 w-5 text-cyan-400 animate-pulse" />
          <div>
            <h2 className="font-orbitron font-bold text-xs tracking-wider text-textPrimary">
              SATELLITE SPECTRAL ANALYTICS
            </h2>
            <p className="text-[9px] text-textMuted font-mono">FEED INGESTION: INSAT-3D & OCEANSAT-3</p>
          </div>
        </div>
        <span className="text-[10px] font-mono text-[#00d4ff] bg-cyan-950/30 border border-cyan-800/30 px-2.5 py-1 rounded">
          BANDWIDTH: 1.2 GBPS ACTIVE
        </span>
      </div>

      {/* Row 1: Satellite Status Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { name: 'INSAT-3D Met', orbit: 'Geostationary 82°E', status: 'ONLINE', latency: '142ms', rate: '850 Mbps' },
          { name: 'Resourcesat-2A', orbit: 'Sun-synchronous', status: 'ONLINE', latency: '198ms', rate: '450 Mbps' },
          { name: 'Oceansat-3 Ocean', orbit: 'Polar Orbit', status: 'ONLINE', latency: '231ms', rate: '280 Mbps' },
          { name: 'RISAT-2B Radar', orbit: 'Active SAR Orbit', status: 'DEGRADED', latency: '890ms', rate: '12 Mbps' }
        ].map((sat, i) => (
          <div key={i} className="glass-panel rounded-xl p-3 flex flex-col justify-between font-mono text-[10px]">
            <div className="flex justify-between items-center mb-1.5">
              <span className="font-bold text-textPrimary">{sat.name}</span>
              <span className={`text-[8px] px-1.5 py-0.5 rounded font-extrabold ${sat.status === 'ONLINE' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/20 text-warning border border-warning/20'}`}>
                {sat.status}
              </span>
            </div>
            <div className="text-textMuted">Orbit: {sat.orbit}</div>
            <div className="flex justify-between text-textMuted mt-1">
              <span>Latency: {sat.latency}</span>
              <span className="text-[#00d4ff]">{sat.rate}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid: Viewer + Channel Selector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left: simulated satellite image viewer (8 Cols) */}
        <div className="lg:col-span-8 glass-panel rounded-xl p-4 flex flex-col justify-between h-[360px] relative">
          
          <div className="flex justify-between items-center border-b border-[#0a1f3d] pb-2 mb-2">
            <span className="text-[10px] font-mono text-textMuted uppercase flex items-center space-x-1.5">
              <Compass className="h-4 w-4 text-cyan-400" />
              <span>Simulated Ingest Spectral Raster</span>
            </span>
            <span className="text-[9px] font-mono text-cyan-400 uppercase font-bold">
              CHANNEL: {activeChannel} (BAND 4)
            </span>
          </div>

          {/* Canvas box displaying channel colored meshes */}
          <div className="flex-1 bg-bg border border-[#0a1f3d] rounded-lg relative flex items-center justify-center overflow-hidden">
            
            {/* Outer space bounds */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(5,13,26,0.3)_0%,transparent_80%)] pointer-events-none"></div>

            {/* India shape colored map based on selected spectral channel */}
            <svg viewBox="0 0 400 250" className="h-full w-full max-h-[220px]">
              {/* Grid lines */}
              <g stroke="rgba(10,31,61,0.2)" strokeWidth="0.5" fill="none">
                <line x1="100" y1="0" x2="100" y2="250" />
                <line x1="200" y1="0" x2="200" y2="250" />
                <line x1="300" y1="0" x2="300" y2="250" />
                <line x1="0" y1="80" x2="400" y2="80" />
                <line x1="0" y1="160" x2="400" y2="160" />
              </g>

              {/* Main Landmass outlines */}
              <path
                d="M 140,40 L 220,10 L 240,60 L 180,100 L 150,80 Z"
                fill={
                  activeChannel === 'lst' ? 'rgba(239, 68, 68, 0.45)' :
                  activeChannel === 'sst' ? 'rgba(59, 130, 246, 0.2)' :
                  activeChannel === 'ndvi' ? 'rgba(16, 185, 129, 0.3)' :
                  'rgba(124, 58, 237, 0.25)' // sar
                }
                stroke={activeChannel === 'sar' ? 'rgba(124, 58, 237, 0.8)' : 'rgba(0, 212, 255, 0.3)'}
                strokeWidth={activeChannel === 'sar' ? '1.5' : '1'}
                strokeDasharray={activeChannel === 'sar' ? '2 2' : 'none'}
                className="transition-all duration-500"
              />

              {/* Ocean highlight for SST */}
              {activeChannel === 'sst' && (
                <path
                  d="M 0,150 L 140,160 L 180,240 L 0,250 Z"
                  fill="rgba(6, 182, 212, 0.65)"
                  className="transition-opacity animate-pulse"
                />
              )}

              {/* Thermal anomalies for LST */}
              {activeChannel === 'lst' && (
                <circle cx="170" cy="80" r="24" fill="url(#lstGlow)" className="animate-pulse" />
              )}

              {/* Vegetation indices for NDVI */}
              {activeChannel === 'ndvi' && (
                <g fill="rgba(16, 185, 129, 0.6)">
                  <circle cx="180" cy="50" r="10" />
                  <circle cx="210" cy="30" r="14" />
                </g>
              )}

              <defs>
                <radialGradient id="lstGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ff3d5a" stopOpacity="0.7" />
                  <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                </radialGradient>
              </defs>
            </svg>
            
            <div className="absolute bottom-3 right-3 bg-bg/85 border border-[#0a1f3d] px-2.5 py-1 rounded text-[9px] font-mono text-[#00d4ff]">
              SENSOR SWEEP RATE: 1.4 SECONDS
            </div>
          </div>

          <div className="text-[9px] font-mono text-textMuted flex items-center space-x-1 border-t border-[#0a1f3d] pt-2 mt-2">
            <Info className="h-3.5 w-3.5 text-cyan-400" />
            <span>SPECTRAL CHANNELS PERMIT REAL-TIME INTRUSION CALCULATION (THERMAL ANOMALIES & SOIL VEGETATION INDEX).</span>
          </div>

        </div>

        {/* Right: Channel selector and upload block (4 Cols) */}
        <div className="lg:col-span-4 space-y-4 flex flex-col justify-between h-[360px]">
          
          {/* Channel selector */}
          <div className="glass-panel rounded-xl p-4 space-y-3">
            <div>
              <h3 className="font-orbitron font-bold text-xs text-[#00d4ff] uppercase">Channel Selector</h3>
              <p className="text-[9px] text-textMuted font-mono">SELECT BAND RESOLUTION</p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              {[
                { id: 'lst' as const, label: 'LST Thermal', desc: 'Land Surface Temp' },
                { id: 'sst' as const, label: 'SST Oceans', desc: 'Sea Surface Temp' },
                { id: 'ndvi' as const, label: 'NDVI Crops', desc: 'Vegetation Health' },
                { id: 'sar' as const, label: 'SAR Radar', desc: 'Active Microwave' }
              ].map((ch) => (
                <button
                  key={ch.id}
                  onClick={() => setActiveChannel(ch.id)}
                  className={`p-2 rounded border text-left flex flex-col justify-between transition-all ${
                    activeChannel === ch.id 
                      ? 'bg-cyan-950/20 border-[#00d4ff]/40 text-[#00d4ff] font-bold' 
                      : 'bg-bg/40 border-gridBorder text-textMuted hover:text-textPrimary'
                  }`}
                >
                  <span className="font-semibold block">{ch.label}</span>
                  <span className="text-[8px] text-textMuted mt-0.5">{ch.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Ingest / Upload Section */}
          <div className="glass-panel rounded-xl p-4 space-y-3 flex-1 flex flex-col justify-between">
            <div>
              <h3 className="font-orbitron font-bold text-xs text-[#00d4ff] uppercase">AI Feature Detection</h3>
              <p className="text-[9px] text-textMuted font-mono">IMAGE INGESTION OVERLAYS</p>
            </div>

            {uploadState === 'idle' && (
              <button
                onClick={handleUploadSim}
                className="flex-1 border border-dashed border-gridBorder rounded-lg flex flex-col items-center justify-center p-4 text-textMuted hover:text-textPrimary hover:border-[#00d4ff]/30 transition-all cursor-pointer bg-bg/20"
              >
                <Upload className="h-6 w-6 mb-2 text-textMuted" />
                <span className="text-[10px] font-mono">Upload Satellite Raster Image</span>
                <span className="text-[8px] text-textMuted mt-1">HDF5 / GEOTIFF / NetCDF</span>
              </button>
            )}

            {uploadState === 'uploading' && (
              <div className="flex-1 border border-dashed border-gridBorder rounded-lg flex flex-col items-center justify-center p-4 bg-bg/20 text-[#4a7fa5] font-mono text-[9px]">
                <RefreshCw className="h-5 w-5 animate-spin mb-2 text-cyan-400" />
                <span>INTERPOLATING SENSORS GRIDS...</span>
              </div>
            )}

            {uploadState === 'completed' && (
              <div className="flex-1 bg-bg/60 border border-[#0a1f3d] rounded-lg p-3 text-[10px] font-mono text-cyan-300 flex flex-col justify-between">
                <div>
                  <div className="text-emerald-400 font-bold flex items-center space-x-1.5 mb-1.5 uppercase text-[9px]">
                    <Eye className="h-3.5 w-3.5" />
                    <span>Inference Analysis Complete</span>
                  </div>
                  <p className="text-textMuted leading-relaxed text-[9px]">
                    {detectedAnomaly}
                  </p>
                </div>
                <button
                  onClick={() => setUploadState('idle')}
                  className="mt-2 text-[9px] text-textMuted hover:text-textPrimary underline text-right"
                >
                  Clear scan
                </button>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};

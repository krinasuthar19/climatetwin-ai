import React, { useState } from 'react';
import { useTelemetryStore } from '../../store/useTelemetryStore';
import { FileText, Download, Play, RefreshCw, Layers, CheckCircle } from 'lucide-react';

export const Reports: React.FC = () => {
  const { addEvent } = useTelemetryStore();
  const [reportType, setReportType] = useState('national');
  const [isCompiling, setIsCompiling] = useState(false);
  const [reportDocGenerated, setReportDocGenerated] = useState(true);

  const triggerGenerate = async () => {
    setIsCompiling(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsCompiling(false);
    setReportDocGenerated(true);
    addEvent('📄', `Generated system PDF report: ${reportType.toUpperCase()} SUMMARY`);
  };

  return (
    <div className="flex-1 w-full flex flex-col space-y-4 select-none">
      
      {/* HUD Header */}
      <div className="flex justify-between items-center bg-[#050d1a]/80 border border-[#0a1f3d] p-3 rounded-xl">
        <div className="flex items-center space-x-3">
          <FileText className="h-5 w-5 text-cyan-400" />
          <div>
            <h2 className="font-orbitron font-bold text-xs tracking-wider text-textPrimary">
              METEOROLOGICAL REPORT GENERATOR
            </h2>
            <p className="text-[9px] text-textMuted font-mono">EXPORT UTILITY: NATIONAL ARCHIVES</p>
          </div>
        </div>
        
        <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/30 border border-cyan-800/30 px-2.5 py-1 rounded">
          SYSTEM: PDF INTERPOLATION ENGINE
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Column: Report templates (3.5 Cols) */}
        <div className="lg:col-span-3.5 glass-panel rounded-xl p-4 flex flex-col justify-between h-[360px]">
          <div className="space-y-4">
            <div>
              <h3 className="font-orbitron font-bold text-xs text-[#00d4ff] uppercase mb-1">
                Report Templates
              </h3>
              <p className="text-[10px] text-textMuted font-mono">SELECT PDF LAYOUT OUTLINE</p>
            </div>

            <div className="space-y-2">
              {[
                { id: 'national', label: 'National Climate Health Summary', code: 'NC-SUM-2026' },
                { id: 'disaster', label: 'State Disaster Alert Register', code: 'ST-DIS-REG' },
                { id: 'agricultural', label: 'Agricultural Soil & Crop Assessment', code: 'AG-SOIL-VAL' },
                { id: 'satellite', label: 'INSAT Satellite Radiance Metrics', code: 'SAT-RAD-INS' }
              ].map((template) => (
                <button
                  key={template.id}
                  onClick={() => setReportType(template.id)}
                  className={`w-full text-left p-3 rounded border text-xs font-mono transition-all duration-200 ${
                    reportType === template.id 
                      ? 'bg-cyan-950/20 border-[#00d4ff]/40 text-[#00d4ff] font-bold' 
                      : 'bg-bg/40 border-gridBorder text-textMuted hover:text-textPrimary'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span>{template.label}</span>
                  </div>
                  <div className="text-[9px] text-textMuted">{template.code}</div>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={triggerGenerate}
            disabled={isCompiling}
            className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-[#0a1f3d] text-bg font-orbitron font-extrabold text-xs rounded transition-all flex items-center justify-center space-x-2"
          >
            <RefreshCw className={`h-4 w-4 ${isCompiling ? 'animate-spin' : ''}`} />
            <span>{isCompiling ? 'COMPILING REPORT...' : 'COMPILE SYSTEM REPORT'}</span>
          </button>
        </div>

        {/* Center: Styled document preview (5.5 Cols) */}
        <div className="lg:col-span-5.5 glass-panel rounded-xl p-4 flex flex-col justify-between h-[360px] relative overflow-hidden">
          
          <div className="flex justify-between items-center border-b border-[#0a1f3d] pb-2 mb-2">
            <span className="text-[10px] font-mono text-textMuted uppercase">Document Preview Screen</span>
            <span className="text-[9px] font-mono text-[#00d4ff] bg-cyan-950/30 px-2 py-0.5 rounded">
              PAGES: 1 / 1
            </span>
          </div>

          {/* preview area */}
          <div className="flex-1 bg-bg/85 border border-[#0a1f3d] rounded-lg p-5 overflow-y-auto font-mono text-[9px] text-textPrimary leading-relaxed select-text space-y-4 max-h-[220px]">
            {isCompiling ? (
              <div className="h-full flex flex-col items-center justify-center space-y-3 text-[#4a7fa5]">
                <RefreshCw className="h-6 w-6 animate-spin text-cyan-400" />
                <div>DESERIALIZING DATA CHANNELS IN DATA LAKE...</div>
              </div>
            ) : reportDocGenerated ? (
              <div className="space-y-4">
                <div className="text-center border-b border-[#0a1f3d] pb-3">
                  <div className="text-xs font-bold text-[#00d4ff] font-orbitron uppercase">CLIMATETWIN AI REPORT</div>
                  <div className="text-[8px] text-textMuted">NATIONAL DECISION SUPPORT PLATFORM — SECRET</div>
                  <div className="text-[8px] text-textMuted">DATE GENERATED: 2026-06-29 18:20 IST</div>
                </div>

                <div className="space-y-2">
                  <div className="text-[10px] font-bold text-cyan-400">1. GENERAL METEOROLOGICAL ANOMALY ASSESSMENT</div>
                  <p className="font-sans leading-relaxed text-textMuted">
                    National Climate Health Index stands at 67/100, categorized as STRESSED. Severe heat anomalies are recorded across Rajasthan with peak land surface temperatures (LST) registered at 45.1°C in Barmer. Rainfall in the northeastern sector has reached +187mm above normal.
                  </p>
                </div>

                <div className="space-y-2 border-t border-[#0a1f3d] pt-3">
                  <div className="text-[10px] font-bold text-cyan-400">2. INTERPOLATED DISTRICT RISKS INDEX</div>
                  <div className="grid grid-cols-3 gap-2 border border-[#0a1f3d] p-2 bg-bg">
                    <div>
                      <div className="text-textMuted">BARMER (RJ):</div>
                      <div className="text-red-400 font-bold">TEMP 44.2°C</div>
                    </div>
                    <div>
                      <div className="text-textMuted font-bold">ASSAM (AS):</div>
                      <div className="text-[#00d4ff] font-bold">RAIN +187mm</div>
                    </div>
                    <div>
                      <div className="text-textMuted">VIDARBHA (MH):</div>
                      <div className="text-warning font-bold">SOIL stressed</div>
                    </div>
                  </div>
                </div>

                <div className="text-[8px] text-center text-textMuted uppercase pt-4 border-t border-dashed border-gridBorder">
                  --- END OF SYSTEM RETRIEVAL DOCUMENT ---
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-textMuted text-xs">
                No active document compiled. Click generate to compile metrics.
              </div>
            )}
          </div>

          <div className="text-[9px] font-mono text-textMuted flex items-center space-x-1 border-t border-[#0a1f3d] pt-2 mt-2">
            <CheckCircle className="h-3.5 w-3.5 text-[#10b981]" />
            <span>REPORT CRYPTOGRAPHIC CHECKSUM: D6A7B19F02C4E3D2</span>
          </div>

        </div>

        {/* Right Column: Download controls (3 Cols) */}
        <div className="lg:col-span-3 space-y-3 h-[360px]">
          
          <div className="glass-panel rounded-xl p-4 space-y-3">
            <span className="text-[10px] font-mono text-textMuted uppercase block">Download Report Package</span>
            
            <button className="w-full py-2 bg-bg hover:bg-cyan-950/20 border border-gridBorder hover:border-[#00d4ff]/30 text-textPrimary hover:text-[#00d4ff] font-mono font-bold text-xs rounded transition-all flex items-center justify-center space-x-2">
              <Download className="h-4.5 w-4.5" />
              <span>DOWNLOAD PDF PACKAGE</span>
            </button>
            
            <button className="w-full py-2 bg-bg hover:bg-cyan-950/20 border border-gridBorder hover:border-[#00d4ff]/30 text-textPrimary hover:text-[#00d4ff] font-mono font-bold text-xs rounded transition-all flex items-center justify-center space-x-2">
              <Download className="h-4.5 w-4.5" />
              <span>DOWNLOAD DATA SPREADSHEET</span>
            </button>
            
            <button className="w-full py-2 bg-bg hover:bg-cyan-950/20 border border-gridBorder hover:border-[#00d4ff]/30 text-textPrimary hover:text-[#00d4ff] font-mono font-bold text-xs rounded transition-all flex items-center justify-center space-x-2">
              <Download className="h-4.5 w-4.5" />
              <span>DOWNLOAD GEOJSON SHAPES</span>
            </button>
          </div>

          <div className="bg-bg/40 border border-gridBorder p-3 rounded-xl font-mono text-[9px] text-[#4a7fa5] leading-relaxed">
            💡 Export systems packages are pre-formatted for direct integration into ISRO and IMD meteorological systems dashboards database records.
          </div>

        </div>

      </div>

      {/* Reports history log at bottom */}
      <div className="glass-panel rounded-xl p-4 flex flex-col justify-between">
        <h3 className="font-orbitron font-bold text-xs tracking-wider text-textPrimary mb-3">
          HISTORICAL REPORT RUN ARCHIVE
        </h3>
        <div className="overflow-x-auto text-[10px] font-mono">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#0a1f3d] text-textMuted text-[9px] uppercase">
                <th className="pb-1.5">REPORT HASH</th>
                <th className="pb-1.5">Compilation Time</th>
                <th className="pb-1.5">Template Layout</th>
                <th className="pb-1.5">Data Range</th>
                <th className="pb-1.5">Generated By</th>
                <th className="pb-1.5 text-right">Size</th>
                <th className="pb-1.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0a1f3d]/45">
              {[
                { hash: 'REP-NC-291', time: '2026-06-29 18:20:42', type: 'National Summary', range: '24h ground survey', user: 'Officer ISRO', size: '2.4 MB', status: 'ARCHIVED', color: 'text-cyan-400' },
                { hash: 'REP-AS-287', time: '2026-06-29 15:12:08', type: 'State Disaster Reg', range: 'Assam watershed', user: 'System Task', size: '1.8 MB', status: 'ARCHIVED', color: 'text-cyan-400' },
                { hash: 'REP-RJ-282', time: '2026-06-28 11:05:42', type: 'Soil Crop Assess', range: 'Rajasthan grids', user: 'Researcher IMD', size: '4.2 MB', status: 'ARCHIVED', color: 'text-cyan-400' },
              ].map((row) => (
                <tr key={row.hash} className="hover:bg-cyan-950/10">
                  <td className="py-2.5 font-bold text-textPrimary">{row.hash}</td>
                  <td className="py-2.5 text-textMuted">{row.time}</td>
                  <td className="py-2.5 text-textPrimary font-semibold">{row.type}</td>
                  <td className="py-2.5 text-textMuted">{row.range}</td>
                  <td className="py-2.5 text-textMuted">{row.user}</td>
                  <td className="py-2.5 text-right text-[#00d4ff]">{row.size}</td>
                  <td className="py-2.5 text-center">
                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold bg-bg/50 border border-gridBorder ${row.color}`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

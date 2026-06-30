import React, { useState } from 'react';
import { Database, Cpu, Layers, GitFork, ShieldAlert, Code, Activity, Server, FileText } from 'lucide-react';

interface PipelineNode {
  id: string;
  label: string;
  category: 'ingest' | 'processing' | 'storage' | 'ai' | 'render';
  latency: string;
  dbSpec: string;
  desc: string;
  techStack: string;
  mathFormula?: string;
  codeSnippet?: string;
}

const pipelineNodes: PipelineNode[] = [
  {
    id: 'insat_imd',
    label: 'INSAT/IMD Ingest',
    category: 'ingest',
    latency: '142ms Ingest Delay',
    dbSpec: 'NetCDF / GRIB API',
    desc: 'Fetches raw telemetry arrays from ISRO INSAT-3D imaging channels and 4,892 ground IMD meteorological stations.',
    techStack: 'ISRO MOSDAC API, CWC Hydrology Sockets',
    mathFormula: 'Validation(X) = \\begin{cases} X & \\text{if } X_{min} \\le X \\le X_{max} \\\\ \\varnothing & \\text{otherwise} \\end{cases}',
    codeSnippet: '# INSAT Sensor Collection API\nimport requests\n\ndef pull_insat_l1_data():\n    url = "https://mosdac.gov.in/api/insat3d/lst"\n    res = requests.get(url, headers={"Authorization": "Bearer ISRO_KEY"})\n    return res.content'
  },
  {
    id: 'data_fusion',
    label: 'Data Fusion',
    category: 'processing',
    latency: '95ms Interpolation',
    dbSpec: 'Kriging Spatial Mesh',
    desc: 'Interpolates sparse IMD station point data into 0.05° gridded arrays, fusing them with satellite land surface observations.',
    techStack: 'SciPy Spatial, PostGIS Raster Math, GDAL',
    mathFormula: '\\hat{Z}(x_0) = \\sum_{i=1}^{n} \\lambda_i Z(x_i) \\quad \\text{where} \\quad \\sum_{i=1}^{n} \\lambda_i = 1',
    codeSnippet: '# Ordinary Kriging Interpolation\nfrom pykrige.ok import OrdinaryKriging\nimport numpy as np\n\ndef interpolate_grid(station_lons, station_lats, values):\n    OK = OrdinaryKriging(station_lons, station_lats, values, variogram_model="spherical")\n    z, ss = OK.execute("grid", np.arange(68, 97, 0.05), np.arange(8, 37, 0.05))\n    return z'
  },
  {
    id: 'ai_models',
    label: 'AI Models',
    category: 'ai',
    latency: '820ms TFT Inference',
    dbSpec: 'PyTorch / ONNX Weights',
    desc: 'Runs multi-horizon forecasts using Temporal Fusion Transformer (TFT) and XGBoost hazard probability models.',
    techStack: 'PyTorch, XGBoost, CUDA 12.1 GPU Acceleration',
    mathFormula: 'Attention(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V',
    codeSnippet: '# TFT Model Inference Run\nimport onnxruntime as ort\n\ndef run_tft_inference(historical_tensor):\n    session = ort.InferenceSession("tft_precipitation.onnx")\n    inputs = {session.get_inputs()[0].name: historical_tensor.numpy()}\n    return session.run(None, inputs)[0]'
  },
  {
    id: 'digital_twin',
    label: 'Digital Twin',
    category: 'render',
    latency: '14ms Sync Tick',
    dbSpec: 'Zustand Reactive State',
    desc: 'Consolidates real-time feeds, coordinates boundary indexes, and updates virtual state parameters dynamically.',
    techStack: 'Zustand React Stores, WebSocket Gateways',
    mathFormula: 'TwinState_{t+1} = f(Telemetry_t) \\cup f(AI\\_Forecast_t)',
    codeSnippet: '// Zustand synchronization router\nimport { create } from \'zustand\';\n\nexport const useTwinStore = create((set) => ({\n  gridState: {},\n  updateGrid: (newCellData) => set((state) => ({\n    gridState: { ...state.gridState, ...newCellData }\n  }))\n}));'
  },
  {
    id: 'simulator',
    label: 'Simulator',
    category: 'render',
    latency: '150ms Simulation',
    dbSpec: 'Scenario Simulation Engine',
    desc: 'Models cascade effects of what-if scenarios (temp changes, emissions, urbanization) on regional crop yields and water stress.',
    techStack: 'NumPy Grid Kernels, Hydrological Runoff Equations',
    mathFormula: 'Runoff = Precip \\times Coefficient_{urban} \\times (1 - Forest\\_Cover)',
    codeSnippet: '# Hydrological Runoff Calculations\ndef calc_runoff(precip, urban_pct, forest_pct):\n    coeff = 0.3 + (urban_pct / 100) * 0.5 - (forest_pct / 100) * 0.4\n    return precip * coeff'
  },
  {
    id: 'dashboard',
    label: 'Dashboard',
    category: 'render',
    latency: 'Client Render (<16ms)',
    dbSpec: 'Recharts visual overlays',
    desc: 'Presents national indexes, regional alerts, policy advice, and interactive timelines for agency audits.',
    techStack: 'Tailwind CSS Panels, SVG Renderers, Lucide Icons',
    mathFormula: 'National\\_Health = \\sum_{i} W_i \\times Score_{indicator}',
    codeSnippet: '// Recharts Line Rendering\n<LineChart data={trendData}>\n  <CartesianGrid strokeDasharray="3 3" />\n  <Line type="monotone" dataKey="temp" stroke="#ff3d5a" />\n</LineChart>'
  }
];

export const AIDataArchitecture: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<PipelineNode>(pipelineNodes[0]); // default is INSAT/IMD
  const [activeInspectorTab, setActiveInspectorTab] = useState<'math' | 'code'>('math');

  return (
    <div className="flex-1 w-full flex flex-col space-y-6 select-none max-w-[1440px] mx-auto p-2">
      
      {/* HUD Header */}
      <div className="flex justify-between items-center bg-[#050d1a]/80 border border-[#0a1f3d] p-3 rounded-xl">
        <div className="flex items-center space-x-3">
          <Database className="h-5 w-5 text-cyan-400" />
          <div>
            <h2 className="font-sans font-bold text-xs tracking-wider text-textPrimary text-left">
              AI & DATA PIPELINE ARCHITECTURE
            </h2>
            <p className="text-[9px] text-textMuted font-mono">ISRO CLIMATETWIN SCHEMATIC SCHEMA</p>
          </div>
        </div>
        <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/30 border border-cyan-800/30 px-2.5 py-1 rounded">
          SYSTEM: CLOUD METEOROLOGY DATA LAKE
        </span>
      </div>

      {/* PIPELINE FLOW CHART DIAGRAM */}
      <div className="glass-panel rounded-xl p-4 flex flex-col justify-between">
        <div className="mb-4">
          <h3 className="font-sans font-bold text-xs text-[#00d4ff] uppercase mb-1">
            Operational Pipeline Flowchart
          </h3>
          <p className="text-[10px] text-textMuted font-mono">CLICK AN ARCHITECTURE NODE TO INSPECT TELEMETRY DELAYS & DATABASE SPECS (READABLE IN UNDER 30 SECONDS)</p>
        </div>

        {/* Horizontal Pipeline Steps */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-2 lg:gap-4 p-4 bg-bg/40 border border-gridBorder rounded-lg relative overflow-x-auto">
          {pipelineNodes.map((node, i) => {
            const isSelected = selectedNode.id === node.id;
            return (
              <React.Fragment key={node.id}>
                {/* Arrow spacer between cards (hidden on final card) */}
                {i > 0 && (
                  <div className="hidden lg:flex items-center text-textMuted text-xs shrink-0 font-bold font-mono">
                    ─────&gt;
                  </div>
                )}
                
                <button
                  onClick={() => setSelectedNode(node)}
                  className={`w-full lg:w-40 text-left p-3 rounded-lg border transition-all duration-300 relative ${
                    isSelected 
                      ? 'bg-cyan-950/20 border-[#00d4ff] text-textPrimary shadow-[0_0_15px_rgba(0,212,255,0.15)]' 
                      : 'bg-surface border-gridBorder text-textMuted hover:border-textMuted/40 hover:text-textPrimary'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[9px] font-mono text-[#00d4ff] uppercase font-bold">STEP 0{i + 1}</span>
                    <span className={`h-1.5 w-1.5 rounded-full ${isSelected ? 'bg-cyan-400 animate-ping' : 'bg-textMuted'}`}></span>
                  </div>
                  <div className="font-sans font-bold text-xs truncate">{node.label}</div>
                  <div className="text-[9px] font-mono text-textMuted mt-1 leading-snug">{node.latency}</div>
                </button>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* LOWER GRID: DETAILED NODE METRICS & MODEL INSPECTOR */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Node Metrics Panel */}
        <div className="glass-panel rounded-xl p-4 flex flex-col justify-between min-h-[280px]">
          <div>
            <div className="flex justify-between items-center mb-3 border-b border-[#0a1f3d] pb-2">
              <h3 className="font-sans font-bold text-xs tracking-wider text-[#00d4ff] uppercase flex items-center space-x-2">
                <Server className="h-4.5 w-4.5 text-cyan-400" />
                <span>Node Specs: {selectedNode.label}</span>
              </h3>
              <span className="text-[9px] font-mono text-textMuted uppercase bg-[#0a1f3d] px-2 py-0.5 rounded">
                Category: {selectedNode.category}
              </span>
            </div>

            <div className="space-y-4 text-xs">
              <p className="text-textPrimary leading-relaxed font-sans">{selectedNode.desc}</p>
              
              <div className="grid grid-cols-2 gap-3 font-mono text-[11px] bg-bg/50 border border-gridBorder p-3 rounded">
                <div>
                  <span className="text-[9px] text-textMuted block uppercase">Processing Latency</span>
                  <span className="font-bold text-[#00d4ff]">{selectedNode.latency}</span>
                </div>
                <div>
                  <span className="text-[9px] text-textMuted block uppercase">Data Storage Type</span>
                  <span className="font-bold text-textPrimary">{selectedNode.dbSpec}</span>
                </div>
                <div className="col-span-2 border-t border-[#0a1f3d]/60 pt-2 mt-1">
                  <span className="text-[9px] text-textMuted block uppercase">Technology Frameworks</span>
                  <span className="font-bold text-textPrimary leading-relaxed">{selectedNode.techStack}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-[9px] font-mono text-textMuted flex items-center space-x-1 border-t border-[#0a1f3d] pt-2 mt-4">
            <Activity className="h-3 w-3 text-cyan-400" />
            <span>GRID TELEMETRIES MONITORED AT MISSION DATA CENTER</span>
          </div>
        </div>

        {/* Model Inspector (Code & Math Formulas) */}
        <div className="glass-panel rounded-xl p-4 flex flex-col justify-between min-h-[280px]">
          <div>
            <div className="flex justify-between items-center mb-3 border-b border-[#0a1f3d] pb-2">
              <h3 className="font-sans font-bold text-xs tracking-wider text-[#00d4ff] uppercase flex items-center space-x-2">
                <Code className="h-4.5 w-4.5 text-violet-400" />
                <span>AI Inspector Terminal</span>
              </h3>
              
              {/* Tab Toggles */}
              <div className="flex bg-bg p-0.5 rounded border border-gridBorder font-mono text-[9px]">
                <button
                  onClick={() => setActiveInspectorTab('math')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    activeInspectorTab === 'math' ? 'bg-[#0a1f3d] text-cyan-400 font-bold' : 'text-textMuted hover:text-textPrimary'
                  }`}
                >
                  FORMULAS
                </button>
                <button
                  onClick={() => setActiveInspectorTab('code')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    activeInspectorTab === 'code' ? 'bg-[#0a1f3d] text-cyan-400 font-bold' : 'text-textMuted hover:text-textPrimary'
                  }`}
                >
                  SOURCE API
                </button>
              </div>
            </div>

            {/* Content box */}
            {activeInspectorTab === 'math' ? (
              <div className="bg-bg/40 border border-gridBorder rounded-lg p-4 font-mono text-xs space-y-4">
                <div>
                  <span className="text-[9px] text-[#7c3aed] uppercase font-bold block mb-1">Mathematical Function</span>
                  <div className="p-3 bg-bg border border-gridBorder rounded text-center text-textPrimary text-sm select-text selection:bg-[#7c3aed]/30 font-sans">
                    <code>{selectedNode.mathFormula}</code>
                  </div>
                </div>

                <div className="text-[10px] text-textMuted leading-relaxed space-y-1.5">
                  <div className="font-bold text-[#00d4ff] uppercase">Algorithmic Breakdown:</div>
                  <p className="font-sans">
                    This step processes metadata variables using local matrix operations or neural weights to compute real-time climate state parameters.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-bg/70 border border-gridBorder rounded-lg p-3 font-mono text-[10px] text-emerald-400 leading-relaxed overflow-x-auto whitespace-pre select-text selection:bg-cyan-950/40 max-h-[170px]">
                {selectedNode.codeSnippet}
              </div>
            )}
          </div>

          <div className="text-[9px] font-mono text-textMuted flex items-center space-x-1.5 border-t border-[#0a1f3d] pt-2 mt-4">
            <GitFork className="h-3.5 w-3.5 text-violet-400" />
            <span>MODEL WEIGHTS EXPORTED IN COMPATIBLE ONNX SHAPES</span>
          </div>
        </div>

      </div>

    </div>
  );
};

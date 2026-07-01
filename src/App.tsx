import React, { useState, useEffect } from 'react';
import { useNavigationStore } from './store/useNavigationStore';
import { Layout } from './components/Layout';
import { MissionDashboard } from './pages/MissionDashboard';
import { DigitalTwinMap } from './pages/DigitalTwinMap';
import { DataPipeline } from './pages/DataPipeline';
import { ClimatePrediction } from './pages/ClimatePrediction';
import { SimulationEngine } from './pages/SimulationEngine';
import { AIDataArchitecture } from './pages/AIDataArchitecture';
import { AICopilot } from './pages/AICopilot';
import { Reports } from './pages/Reports';
import { Admin } from './pages/Admin';
import { SatelliteAnalytics } from './pages/SatelliteAnalytics';
import { DisasterIntelligence } from './pages/DisasterIntelligence';
import { AgricultureIntelligence } from './pages/AgricultureIntelligence';

export default function App() {
  const { activePage } = useNavigationStore();
  const [booting, setBooting] = useState(true);
  const [bootProgress, setBootProgress] = useState(0);
  const [bootLogs, setBootLogs] = useState<string[]>([]);

  // Streamlined 3.5s Boot Sequence
  useEffect(() => {
    const logs = [
      'INITIALIZING METEOROLOGICAL DATA WORKSPACE...',
      'VERIFYING IMD GRIDDED TEMPERATURE DATASET (1.0°x1.0°)... [✓ ONLINE]',
      'VERIFYING IMD GRIDDED PRECIPITATION DATASET (0.25°x0.25°)... [✓ ONLINE]',
      'VERIFYING INSAT-3D LAND SURFACE TEMPERATURE DATA... [✓ ONLINE]',
      'VERIFYING INSAT-3D SEA SURFACE TEMPERATURE DATA.... [✓ ONLINE]',
      'CONNECTING TO MOSDAC SATELLITE DATA REPOSITORY..... [✓ OK]',
      'CONNECTING TO NICES SPATIAL DATA ARCHIVE........... [✓ OK]',
      'COMPILING TEMPORAL FUSION TRANSFORMER (TFT) CORE... [✓ READY]',
      'COMPILING LSTM AND XGBOOST BENCHMARK MODELS........ [✓ READY]',
      'CLIMATE DIGITAL TWIN INTEGRITY CHECK SUCCESSFUL'
    ];

    let logIndex = 0;
    const logInterval = setInterval(() => {
      if (logIndex < logs.length) {
        setBootLogs((prev) => [...prev, logs[logIndex]]);
        logIndex++;
      }
    }, 250); // Tick logs sequentially

    const progressInterval = setInterval(() => {
      setBootProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 4;
      });
    }, 120); // 100% in ~3 seconds

    const bootTimeout = setTimeout(() => {
      clearInterval(logInterval);
      clearInterval(progressInterval);
      setBooting(false);
    }, 3500); // exactly 3.5s

    return () => {
      clearInterval(logInterval);
      clearInterval(progressInterval);
      clearTimeout(bootTimeout);
    };
  }, []);

  if (booting) {
    return (
      <div className="h-screen w-screen bg-[#020610] text-[#e2f4ff] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
        
        {/* Wireframe Rotating Globe background in CSS */}
        <div className="absolute opacity-20 pointer-events-none flex items-center justify-center">
          <div className="h-96 w-96 rounded-full border border-cyan-500/20 relative animate-[spin_40s_linear_infinite]">
            <div className="absolute inset-0 rounded-full border border-dashed border-cyan-500/10"></div>
            <div className="absolute top-1/2 left-0 w-full h-[0.5px] bg-cyan-500/15"></div>
            <div className="absolute left-1/2 top-0 w-[0.5px] h-full bg-cyan-500/15"></div>
          </div>
        </div>

        <div className="w-full max-w-xl flex flex-col items-center space-y-6 z-10">
          
          {/* Pulsing ISRO Logo representation */}
          <div className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="h-16 w-16 animate-pulse">
              <circle cx="50" cy="50" r="40" stroke="#00d4ff" strokeWidth="3.5" fill="none" />
              <path d="M 10,50 L 90,50 M 50,10 L 50,90" stroke="#00d4ff" strokeWidth="1.5" />
              <circle cx="50" cy="50" r="12" fill="#7c3aed" />
            </svg>
          </div>

          <div className="text-center space-y-1">
            <h1 className="font-sans font-black text-2xl tracking-widest text-[#e2f4ff]">
              ISRO CLIMATE DIGITAL TWIN
            </h1>
            <p className="font-sans text-xs text-textMuted tracking-wider">
              Bharatiya Antariksh Hackathon 2026 Proof-of-Concept
            </p>
          </div>

          {/* Connection Logs */}
          <div className="w-full bg-[#050d1a] border border-[#0a1f3d] rounded-lg p-4 font-mono text-[10px] text-[#4a7fa5] space-y-1 h-36 overflow-y-auto leading-relaxed select-none">
            {bootLogs.map((log, idx) => (
              <div key={idx} className={log?.includes('[✓') ? 'text-cyan-400' : log?.includes('[⚠') ? 'text-warning' : 'text-[#4a7fa5]'}>
                &gt; {log}
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div className="w-full space-y-1.5 font-mono text-[9px] text-textMuted">
            <div className="flex justify-between">
              <span>ESTABLISHING GROUND STATION HANDSHAKES...</span>
              <span className="text-[#00d4ff] font-bold">{bootProgress}%</span>
            </div>
            <div className="w-full bg-[#0a1f3d] h-1.5 rounded overflow-hidden">
              <div 
                className="bg-[#00d4ff] h-full transition-all duration-100 ease-out" 
                style={{ width: `${bootProgress}%` }}
              ></div>
            </div>
          </div>

        </div>

      </div>
    );
  }

  // Render Page Content
  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <MissionDashboard />;
      case 'data-pipeline':
        return <DataPipeline />;
      case 'digital-twin-map':
        return <DigitalTwinMap />;
      case 'satellite-analytics':
        return <SatelliteAnalytics />;
      case 'prediction':
        return <ClimatePrediction />;
      case 'disaster-intelligence':
        return <DisasterIntelligence />;
      case 'agriculture-intelligence':
        return <AgricultureIntelligence />;
      case 'simulator':
        return <SimulationEngine />;
      case 'ai-data-architecture':
        return <AIDataArchitecture />;
      case 'reports':
        return <Reports />;
      case 'admin':
        return <Admin />;
      default:
        return <MissionDashboard />;
    }
  };

  return (
    <Layout>
      <div className="flex-1 w-full page-transition animate-[fadeIn_0.3s_ease-out]">
        {renderPage()}
      </div>
    </Layout>
  );
}

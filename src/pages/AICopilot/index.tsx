import React, { useState, useRef, useEffect } from 'react';
import { useCopilotStore } from '../../store/useCopilotStore';
import { MessageSquare, Send, Mic, Trash2, Cpu, FileText, CheckCircle, Info, Thermometer, Droplets } from 'lucide-react';

export const AICopilot: React.FC = () => {
  const { messages, isThinking, aiStatus, sendMessage, clearChat } = useCopilotStore();
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  // Keep scroll focused at bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // Policy-focused suggested queries
  const suggestions = [
    { label: 'Rajasthan Drought Advisory', query: 'Draft a drought mitigation policy advisory for western Rajasthan districts based on current indicators.' },
    { label: 'Assam Flood Allocation Strategy', query: 'Recommend flood relief resource allocation plans for the Brahmaputra basin.' },
    { label: 'NDVI Yield Policy Impact', query: 'What crop insurance adjustment rates are recommended for Vidarbha based on current NDVI?' },
    { label: 'Groundwater Regulation Plan', query: 'Generate policy guidelines for groundwater extraction limits in critical aquifer zones.' }
  ];

  // Determine current active chat context for right-side visualization
  const getChatContext = () => {
    const text = messages[messages.length - 1]?.text.toLowerCase() || '';
    if (text.includes('rajasthan') || text.includes('drought') || text.includes('mitigation')) {
      return 'rajasthan';
    }
    if (text.includes('vidarbha') || text.includes('crop') || text.includes('ndvi')) {
      return 'vidarbha';
    }
    if (text.includes('flood') || text.includes('assam') || text.includes('resource')) {
      return 'flood';
    }
    if (text.includes('insat') || text.includes('groundwater') || text.includes('aquifer')) {
      return 'satellite';
    }
    return 'default';
  };

  const currentContext = getChatContext();

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    setInputText('');
    await sendMessage(text);
  };

  return (
    <div className="flex-1 w-full flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4 h-full min-h-0 select-none max-w-[1440px] mx-auto p-2">
      
      {/* Left Sidebar: Conversation History (2.5 Cols) */}
      <div className="lg:w-60 bg-surface border border-gridBorder rounded-xl p-4 flex flex-col justify-between shrink-0 h-[500px] lg:h-auto">
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-[#0a1f3d] pb-2">
            <h3 className="font-sans font-bold text-xs tracking-wider text-textPrimary flex items-center space-x-1.5">
              <MessageSquare className="h-4 w-4 text-cyan-400" />
              <span>ASSISTANT SESSIONS</span>
            </h3>
            <button 
              onClick={clearChat}
              className="text-textMuted hover:text-textPrimary"
              title="Clear active chat"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-2 font-mono text-[10px] text-textMuted">
            {[
              { id: '1', title: 'Barmer Policy Advisory', date: '18:05' },
              { id: '2', title: 'Brahmaputra Allocation', date: '17:52' },
              { id: '3', title: 'Vidarbha Yield Adjudication', date: '16:12' },
              { id: '4', title: 'Aquifer Extraction limits', date: 'Yesterday' }
            ].map((session) => (
              <button
                key={session.id}
                className="w-full text-left p-2 rounded hover:bg-[#0a1f3d] hover:text-[#00d4ff] flex justify-between items-center bg-[#020610]/40 border border-gridBorder/40 transition-colors"
              >
                <span className="truncate pr-2 font-semibold text-textPrimary">{session.title}</span>
                <span className="shrink-0">{session.date}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-bg border border-gridBorder rounded p-2.5 font-mono text-[9px] text-textMuted">
          🔒 SECURE GOVERNMENT DECISION SUPPORT ARCHIVES
        </div>
      </div>

      {/* Center Panel: Active Chat (6 Cols) */}
      <div className="flex-1 glass-panel rounded-xl p-4 flex flex-col justify-between min-w-0 h-[500px] lg:h-auto">
        
        {/* Chat Header */}
        <div className="flex justify-between items-center border-b border-[#0a1f3d] pb-2 mb-3">
          <div className="flex items-center space-x-2">
            <Cpu className="h-4.5 w-4.5 text-violet-400" />
            <span className="font-sans font-bold text-xs text-textPrimary uppercase tracking-wider">
              Climate Decision Assistant
            </span>
          </div>

          {/* AI Status Badge */}
          {isThinking || aiStatus !== 'IDLE' ? (
            <span className="px-2 py-0.5 rounded text-[8px] font-mono font-extrabold bg-violet-950/40 text-violet-300 border border-violet-800/40 animate-pulse">
              ● {aiStatus}...
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded text-[8px] font-mono font-semibold bg-bg text-textMuted">
              ● STANDBY
            </span>
          )}
        </div>

        {/* Message Feed */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4">
          {messages.map((m) => {
            const isAI = m.sender === 'assistant';
            return (
              <div
                key={m.id}
                className={`flex ${isAI ? 'justify-start' : 'justify-end'}`}
              >
                <div className={`w-full max-w-lg p-3 rounded-lg border text-xs leading-relaxed ${
                  isAI 
                    ? 'bg-[#050d1a]/60 border-gridBorder text-textPrimary' 
                    : 'bg-cyan-950/10 border-[#00d4ff]/20 text-[#e2f4ff] font-mono'
                }`}>
                  <div className="flex justify-between items-center text-[9px] text-textMuted font-mono mb-1.5 uppercase font-bold">
                    <span>{isAI ? '🤖 Decision Assistant' : '👤 Policy Analyst'}</span>
                    <span>{m.timestamp}</span>
                  </div>
                  <p className="whitespace-pre-line">{m.text}</p>
                </div>
              </div>
            );
          })}

          {isThinking && (
            <div className="flex justify-start">
              <div className="bg-[#050d1a]/60 border border-gridBorder p-3.5 rounded-lg w-28 flex justify-center space-x-1.5 items-center">
                <span className="h-1.5 w-1.5 bg-violet-400 rounded-full animate-bounce [animation-delay:0ms]"></span>
                <span className="h-1.5 w-1.5 bg-violet-400 rounded-full animate-bounce [animation-delay:150ms]"></span>
                <span className="h-1.5 w-1.5 bg-violet-400 rounded-full animate-bounce [animation-delay:300ms]"></span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Query Pills & Text Input area */}
        <div className="space-y-3">
          {/* Query Suggestions */}
          <div className="flex flex-wrap gap-1.5">
            {suggestions.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(s.query)}
                className="px-2 py-1 rounded text-[9px] font-mono bg-bg border border-gridBorder text-textMuted hover:text-[#00d4ff] hover:border-[#00d4ff]/30 transition-all uppercase"
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Form Ingest Text Area */}
          <div className="flex items-center space-x-2 bg-bg border border-[#0a1f3d] rounded-lg p-2 focus-within:border-[#00d4ff]/40">
            <textarea
              rows={1}
              placeholder="Inquire about policy advisories, aquifer extraction limits, or water stress..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(inputText);
                }
              }}
              className="bg-transparent border-none text-[#e2f4ff] placeholder-textMuted focus:outline-none w-full text-xs font-sans resize-none"
            />
            <button className="text-textMuted hover:text-[#00d4ff] transition-colors p-1 shrink-0">
              <Mic className="h-4.5 w-4.5" />
            </button>
            <button
              onClick={() => handleSend(inputText)}
              className="px-3.5 py-1.5 bg-[#00d4ff] hover:bg-cyan-400 text-bg font-sans font-bold text-[10px] rounded transition-colors shrink-0 flex items-center space-x-1"
            >
              <Send className="h-3 w-3" />
              <span>SEND</span>
            </button>
          </div>
        </div>

      </div>

      {/* Right Column: Context Visualization (3.5 Cols) */}
      <div className="lg:w-80 glass-panel rounded-xl p-4 flex flex-col justify-between shrink-0 h-[400px] lg:h-auto">
        <div>
          <h3 className="font-sans font-bold text-xs tracking-wider text-[#00d4ff] uppercase mb-2">
            Context Telemetry Chart
          </h3>
          <p className="text-[10px] text-textMuted font-mono uppercase mb-4">MATCHING ACTIVE DIALOGUE TOPICS</p>
        </div>

        {/* Dynamic Context Renderers */}
        <div className="flex-1 flex items-center justify-center bg-bg/50 border border-gridBorder/60 rounded-lg p-3 my-2">
          {currentContext === 'rajasthan' && (
            <div className="w-full text-center space-y-3 font-mono">
              <div className="flex justify-between items-center border-b border-[#0a1f3d] pb-1.5">
                <span className="text-[10px] text-red-400 font-bold">RAJASTHAN (BARMER GRID)</span>
                <Thermometer className="h-4 w-4 text-red-500" />
              </div>
              {/* Dynamic Rajasthan SVG */}
              <svg viewBox="0 0 100 100" className="h-28 w-28 mx-auto">
                <path d="M 10,10 L 80,10 L 90,60 L 30,90 Z" fill="rgba(239, 68, 68, 0.3)" stroke="#ff3d5a" strokeWidth="1.5" />
                <circle cx="50" cy="40" r="4" fill="#ff3d5a" />
                <circle cx="50" cy="40" r="10" fill="none" stroke="#ff3d5a" strokeWidth="0.5" className="animate-ping" />
              </svg>
              <div className="text-[9px] text-textMuted leading-relaxed">
                Land Surface Heat index anomaly active. 5-day cycle forecast is peak 45.1°C.
              </div>
            </div>
          )}

          {currentContext === 'vidarbha' && (
            <div className="w-full text-center space-y-3 font-mono">
              <div className="flex justify-between items-center border-b border-[#0a1f3d] pb-1.5">
                <span className="text-[10px] text-emerald-400 font-bold">VIDARBHA AGRI ZONE</span>
                <Droplets className="h-4 w-4 text-emerald-500" />
              </div>
              <div className="py-4 space-y-2">
                <div className="text-xs text-textPrimary">NDVI Vegetation Health:</div>
                <div className="text-xl font-extrabold text-warning">0.28 INDEX</div>
                <div className="text-[9px] text-textMuted">Soil Moisture depletion: -22% below norm.</div>
              </div>
            </div>
          )}

          {currentContext === 'flood' && (
            <div className="w-full text-center space-y-3 font-mono">
              <div className="flex justify-between items-center border-b border-[#0a1f3d] pb-1.5">
                <span className="text-[10px] text-cyan-400 font-bold">ASSAM WATERSHED LEVEL</span>
                <Info className="h-4 w-4 text-cyan-500" />
              </div>
              <div className="py-3 text-xs space-y-3">
                <div>Brahmaputra at Dhubri gauge:</div>
                <div className="text-2xl font-extrabold text-[#ff3d5a] animate-pulse">3.2m OVER DANGER</div>
                <div className="w-full bg-[#0a1f3d] h-2 rounded overflow-hidden">
                  <div className="bg-[#ff3d5a] h-full" style={{ width: '85%' }}></div>
                </div>
              </div>
            </div>
          )}

          {currentContext === 'satellite' && (
            <div className="w-full text-center space-y-3 font-mono">
              <div className="flex justify-between items-center border-b border-[#0a1f3d] pb-1.5">
                <span className="text-[10px] text-violet-400 font-bold">INSAT SCAN OVERLAY</span>
                <Info className="h-4 w-4 text-violet-500" />
              </div>
              <div className="py-4 space-y-2">
                <div className="text-xs text-textMuted">LST Anomaly Radiance:</div>
                <div className="text-xl font-extrabold text-[#7c3aed] animate-pulse">+3.2°C DELTA</div>
                <div className="text-[9px] text-textMuted">RISAT-2B SAR sensor degraded (890ms).</div>
              </div>
            </div>
          )}

          {currentContext === 'default' && (
            <div className="text-center text-textMuted text-xs font-mono py-8 max-w-[200px]">
              No active threat tags discovered in the prompt matrix. Standby for sensor reference mapping.
            </div>
          )}
        </div>

        <div className="bg-bg border border-gridBorder rounded p-2.5 font-mono text-[9px] text-textMuted flex items-center space-x-1.5">
          <CheckCircle className="h-3.5 w-3.5 text-[#10b981]" />
          <span>CITING IMD WEATHER RECORD GRIDS (2026)</span>
        </div>

      </div>

    </div>
  );
};

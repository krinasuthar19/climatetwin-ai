import React, { useEffect, useState } from 'react';
import { useNavigationStore, PageId } from '../store/useNavigationStore';
import { useTelemetryStore, ThemeId } from '../store/useTelemetryStore';
import {
  Globe,
  Map,
  TrendingUp,
  Sliders,
  MessageSquare,
  Database,
  FileText,
  Settings,
  Bell,
  Search,
  Cpu,
  Volume2,
  VolumeX,
  Clock,
  LogOut,
  ChevronRight,
  Maximize2,
  Terminal,
  Activity,
  Radio,
  ShieldAlert,
  Sprout,
  ChevronDown
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const {
    activePage,
    setActivePage,
    searchOpen,
    setSearchOpen,
    paletteOpen,
    setPaletteOpen,
    notificationsOpen,
    setNotificationsOpen,
  } = useNavigationStore();

  const {
    theme,
    setTheme,
    syncStatus,
    events,
    alerts,
    isMuted,
    toggleMute,
    initialize,
  } = useTelemetryStore();

  const [time, setTime] = useState<string>('');
  const [themeDropdown, setThemeDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [paletteQuery, setPaletteQuery] = useState('');
  const [selectedPaletteIndex, setSelectedPaletteIndex] = useState(0);
  const [advancedOpen, setAdvancedOpen] = useState(false);

  // Initialize live telemetries
  useEffect(() => {
    const cleanUp = initialize();
    return cleanUp;
  }, [initialize]);

  // IST Clock tick
  useEffect(() => {
    const updateTime = () => {
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      };
      setTime(new Intl.DateTimeFormat('en-US', options).format(new Date()) + ' IST');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !searchOpen && !paletteOpen && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        setSearchOpen(true);
        setSearchQuery('');
      } else if (e.key === 'Escape') {
        setSearchOpen(false);
        setPaletteOpen(false);
        setNotificationsOpen(false);
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen(true);
        setPaletteQuery('');
        setSelectedPaletteIndex(0);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen, paletteOpen, setSearchOpen, setPaletteOpen, setNotificationsOpen]);

  // Core primary workflow pages
  const primaryMenuItems = [
    { id: 'dashboard' as PageId, label: 'Dashboard', icon: Globe },
    { id: 'digital-twin-map' as PageId, label: 'Digital Twin Map', icon: Map },
    { id: 'prediction' as PageId, label: 'AI Forecasting', icon: TrendingUp },
    { id: 'simulator' as PageId, label: 'Scenario Simulator', icon: Sliders },
    { id: 'copilot' as PageId, label: 'Decision Assistant', icon: MessageSquare },
    { id: 'ai-data-architecture' as PageId, label: 'AI & Data Architecture', icon: Database },
  ];

  // Secondary tools (advanced and admin tools)
  const advancedMenuItems = [
    { id: 'satellite-analytics' as PageId, label: 'Satellite Analytics', icon: Radio },
    { id: 'disaster-intelligence' as PageId, label: 'Disaster Intel', icon: ShieldAlert },
    { id: 'agriculture-intelligence' as PageId, label: 'Agriculture Intel', icon: Sprout },
    { id: 'reports' as PageId, label: 'Reports Manager', icon: FileText },
    { id: 'admin' as PageId, label: 'Admin Terminal', icon: Settings },
  ];

  // Theme style mapping
  const getThemeClasses = () => {
    switch (theme) {
      case 'thermal':
        return 'border-orange-500/20 text-orange-200 bg-[#120300]';
      case 'earth':
        return 'border-emerald-500/20 text-emerald-200 bg-[#001004]';
      case 'satellite':
        return 'border-violet-500/20 text-violet-200 bg-[#060012]';
      default:
        return 'border-cyan-500/20 text-cyan-200 bg-[#020610]';
    }
  };

  const getThemeTextGlow = () => {
    switch (theme) {
      case 'thermal': return 'text-orange-400 drop-shadow-[0_0_8px_rgba(249,115,22,0.4)]';
      case 'earth': return 'text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]';
      case 'satellite': return 'text-violet-400 drop-shadow-[0_0_8px_rgba(124,58,237,0.4)]';
      default: return 'text-[#00d4ff] drop-shadow-[0_0_8px_rgba(0,212,255,0.4)]';
    }
  };

  const getThemeButtonActive = (active: boolean) => {
    if (!active) return 'text-textMuted hover:text-textPrimary';
    switch (theme) {
      case 'thermal': return 'text-orange-400 border-l-2 border-orange-500 bg-orange-950/20 shadow-[inset_4px_0_12px_rgba(249,115,22,0.1)]';
      case 'earth': return 'text-emerald-400 border-l-2 border-emerald-500 bg-emerald-950/20 shadow-[inset_4px_0_12px_rgba(16,185,129,0.1)]';
      case 'satellite': return 'text-violet-400 border-l-2 border-violet-500 bg-violet-950/20 shadow-[inset_4px_0_12px_rgba(124,58,237,0.1)]';
      default: return 'text-[#00d4ff] border-l-2 border-[#00d4ff] bg-cyan-950/20 shadow-[inset_4px_0_12px_rgba(0,212,255,0.1)]';
    }
  };

  // Commands palette list
  const commandPaletteItems = [
    { title: 'Predict Flood Risk', shortcut: 'Ctrl+F', action: () => setActivePage('prediction') },
    { title: 'Open Gujarat Analysis', shortcut: 'Ctrl+G', action: () => { setActivePage('dashboard'); useNavigationStore.getState().setActiveDistrict('Gujarat'); } },
    { title: 'Generate Climate Report', shortcut: 'Ctrl+R', action: () => setActivePage('reports') },
    { title: 'Run What-If Simulation', shortcut: 'Ctrl+W', action: () => setActivePage('simulator') },
    { title: 'Open Satellite View', shortcut: 'Ctrl+S', action: () => setActivePage('dashboard') },
    { title: 'Configure Threshold Alerts', shortcut: 'Ctrl+E', action: () => setActivePage('admin') },
    { title: 'Launch AI Copilot', shortcut: 'Ctrl+C', action: () => setActivePage('copilot') },
    { title: 'AI & Data Architecture Map', shortcut: 'Ctrl+A', action: () => setActivePage('ai-data-architecture') }
  ];

  const filteredCommands = commandPaletteItems.filter(item =>
    item.title.toLowerCase().includes(paletteQuery.toLowerCase())
  );

  // Search Results
  const searchResults = [
    { name: 'Rajasthan', type: 'State Dashboard', category: 'States', action: () => { setActivePage('dashboard'); useNavigationStore.getState().setActiveDistrict('Rajasthan'); } },
    { name: 'Assam Zone', type: 'Flood Alert Zone', category: 'Events', action: () => { setActivePage('dashboard'); useNavigationStore.getState().setActiveDistrict('Assam'); } },
    { name: 'Barmer', type: 'Critical Heat Wave', category: 'Districts', action: () => { setActivePage('dashboard'); useNavigationStore.getState().setActiveDistrict('Barmer'); } },
    { name: 'INSAT-3D LST Sensor', type: 'Satellite Stream', category: 'Satellites', action: () => setActivePage('admin') },
    { name: 'Oceansat-3 SST Grid', type: 'Satellite Stream', category: 'Satellites', action: () => setActivePage('admin') },
    { name: 'Temporal Fusion Transformer model', type: 'AI Prediction', category: 'Models', action: () => setActivePage('ai-data-architecture') },
  ].filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.type.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className={`h-screen w-screen flex flex-col font-sans overflow-hidden select-none bg-[#020610] text-[#e2f4ff] border-t-2 ${getThemeClasses()}`}>
      
      {/* Scanline Effect */}
      <div className="scanline-effect"></div>

      {/* TOP STATUS BAR (48px) */}
      <header className="h-12 w-full flex items-center justify-between px-4 border-b border-[#0a1f3d] bg-[#050d1a]/90 backdrop-blur-md z-30 shrink-0 select-none">
        
        {/* Left Section */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="h-6 w-6 animate-pulse">
              <circle cx="50" cy="50" r="40" stroke="#00d4ff" strokeWidth="4" fill="none" />
              <path d="M10 50 h80 M50 10 v80" stroke="#00d4ff" strokeWidth="2" />
              <circle cx="50" cy="50" r="10" fill="#7c3aed" />
            </svg>
            <span className={`font-orbitron font-extrabold text-lg tracking-wider ${getThemeTextGlow()}`}>
              CLIMATETWIN AI
            </span>
          </div>
          <span className="text-[10px] text-textMuted border border-[#0a1f3d] px-2 py-0.5 rounded font-mono tracking-widest bg-bg">
            PROTOTYPE v1.1
          </span>
        </div>

        {/* Center Section: Telemetry Clock & Status */}
        <div className="flex items-center space-x-6 font-mono text-xs">
          <div className="flex items-center space-x-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-emerald-500 font-bold tracking-wider">LIVE DATA FEED</span>
          </div>
          
          <div className="flex items-center space-x-2 bg-bg px-3 py-1 rounded border border-[#0a1f3d]">
            <Clock className="h-3.5 w-3.5 text-textMuted" />
            <span className="text-textPrimary font-semibold">{time || '00:00:00 IST'}</span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-textMuted">SYSTEM ALERT PROFILE:</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-warning border border-amber-500/30 animate-pulse">
              ⚠ WATCH
            </span>
          </div>
        </div>

        {/* Right Section: Satellite States, Bell, Profile, Settings */}
        <div className="flex items-center space-x-4">
          {/* Satellite Telemetries */}
          <div className="hidden xl:flex items-center space-x-3 text-[10px] font-mono border-r border-[#0a1f3d] pr-4 text-textMuted">
            <span className="flex items-center space-x-1">
              <span>INSAT-3D</span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            </span>
            <span className="flex items-center space-x-1">
              <span>IMD</span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            </span>
            <span className="flex items-center space-x-1">
              <span>MOSDAC</span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            </span>
          </div>

          {/* Volume Control */}
          <button 
            onClick={toggleMute}
            className="text-textMuted hover:text-[#00d4ff] transition-colors p-1"
            title={isMuted ? 'Unmute alerts' : 'Mute alerts'}
          >
            {isMuted ? <VolumeX className="h-4 w-4 text-danger" /> : <Volume2 className="h-4 w-4" />}
          </button>

          {/* Notification Bell */}
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className={`relative p-1.5 rounded hover:bg-[#0a1f3d] transition-colors ${notificationsOpen ? 'bg-[#0a1f3d] text-[#00d4ff]' : 'text-textMuted'}`}
          >
            <Bell className="h-4.5 w-4.5" />
            <span className="absolute top-0.5 right-0.5 h-2 w-2 bg-danger rounded-full animate-pulse"></span>
          </button>

          {/* Theme Dropdown Toggle */}
          <div className="relative">
            <button
              onClick={() => setThemeDropdown(!themeDropdown)}
              className="flex items-center space-x-1.5 px-2.5 py-1 rounded border border-[#0a1f3d] bg-bg hover:border-[#00d4ff]/40 text-textMuted text-xs font-mono"
            >
              <span className="h-2 w-2 rounded-full bg-[#00d4ff]"></span>
              <span className="uppercase text-[10px] tracking-wider">{theme}</span>
            </button>

            {themeDropdown && (
              <div className="absolute right-0 mt-1.5 w-40 bg-surface border border-[#0a1f3d] rounded-md shadow-2xl z-50 p-1 font-mono text-[11px]">
                <div className="px-2 py-1 text-[9px] text-textMuted uppercase border-b border-[#0a1f3d] mb-1">
                  Alert Aesthetics
                </div>
                {(['control', 'thermal', 'earth', 'satellite'] as ThemeId[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setTheme(t);
                      setThemeDropdown(false);
                    }}
                    className={`w-full text-left px-2 py-1.5 rounded hover:bg-[#0a1f3d] capitalize flex items-center space-x-2 ${theme === t ? 'text-[#00d4ff]' : 'text-textMuted'}`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${
                      t === 'control' ? 'bg-[#00d4ff]' :
                      t === 'thermal' ? 'bg-orange-500' :
                      t === 'earth' ? 'bg-emerald-500' : 'bg-violet-500'
                    }`}></span>
                    <span>{t === 'control' ? 'Mission Control' : `${t} Mode`}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Role Badge */}
          <div className="flex items-center space-x-2 border-l border-[#0a1f3d] pl-4">
            <div className="h-6 w-6 rounded bg-[#0a1f3d] flex items-center justify-center font-bold text-xs text-[#00d4ff]">
              IS
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-[10px] font-bold text-textPrimary leading-none">ISRO SCIENTIST</div>
              <div className="text-[8px] text-textMuted uppercase font-mono">Mission Officer</div>
            </div>
          </div>
        </div>

      </header>

      {/* BODY CONTAINER */}
      <div className="flex-1 w-full flex overflow-hidden relative">
        
        {/* LEFT HOVER SIDEBAR (64px to 200px) */}
        <aside className="group w-16 hover:w-52 h-full flex flex-col justify-between border-r border-[#0a1f3d] bg-[#050d1a]/95 transition-all duration-300 ease-in-out z-20 shrink-0">
          
          {/* Menu Items */}
          <nav className="flex-1 py-4 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)]">
            {primaryMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  className={`w-full flex items-center h-10 px-5 transition-all duration-200 ${getThemeButtonActive(isActive)}`}
                >
                  <Icon className={`h-5 w-5 shrink-0 ${isActive ? '' : 'text-textMuted group-hover:text-textPrimary'} transition-transform group-hover:scale-105`} />
                  <span className={`ml-4 text-xs font-sans font-medium tracking-normal text-left transition-all duration-300 group-hover:opacity-100 opacity-0 group-hover:translate-x-0 -translate-x-3 whitespace-nowrap ${isActive ? 'font-bold' : 'text-textMuted'}`}>
                    {item.label}
                  </span>
                  {isActive && (
                    <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronRight className="h-3 w-3 text-cyan-400" />
                    </div>
                  )}
                </button>
              );
            })}

            {/* Divider */}
            <div className="border-t border-[#0a1f3d] my-2 mx-4 group-hover:block hidden"></div>

            {/* Advanced Operations Collapsible Header */}
            <button
              onClick={() => setAdvancedOpen(!advancedOpen)}
              className="w-full flex items-center h-10 px-5 text-textMuted hover:text-textPrimary transition-all duration-200"
            >
              <Cpu className="h-5 w-5 shrink-0" />
              <span className="ml-4 text-xs font-sans font-semibold tracking-normal text-left group-hover:opacity-100 opacity-0 transition-all duration-300 whitespace-nowrap">
                Advanced Tools
              </span>
              <div className="ml-auto group-hover:opacity-100 opacity-0 transition-opacity">
                {advancedOpen ? <ChevronDown className="h-3 w-3 text-textMuted" /> : <ChevronRight className="h-3 w-3 text-textMuted" />}
              </div>
            </button>

            {/* Advanced Items */}
            {advancedOpen && advancedMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  className={`w-full flex items-center h-9 px-8 transition-all duration-200 ${getThemeButtonActive(isActive)}`}
                >
                  <Icon className={`h-4.5 w-4.5 shrink-0 ${isActive ? '' : 'text-textMuted group-hover:text-textPrimary'} transition-transform group-hover:scale-105`} />
                  <span className={`ml-3.5 text-[11px] font-sans font-medium tracking-normal text-left transition-all duration-300 group-hover:opacity-100 opacity-0 group-hover:translate-x-0 -translate-x-3 whitespace-nowrap ${isActive ? 'font-bold' : 'text-textMuted'}`}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Bottom Globe Widget */}
          <div className="p-3 border-t border-[#0a1f3d] flex flex-col items-center group-hover:items-start transition-all overflow-hidden bg-bg/50">
            <div className="flex items-center space-x-3 w-full pl-2">
              <div className="h-8 w-8 rounded-full border border-[#0a1f3d] flex items-center justify-center animate-spin [animation-duration:15s] bg-[#050d1a] relative shrink-0">
                <div className="absolute inset-0.5 rounded-full border border-dashed border-[#00d4ff]/40"></div>
                <Globe className="h-4.5 w-4.5 text-[#00d4ff]" />
              </div>
              <div className="hidden group-hover:block transition-all duration-300">
                <div className="text-[9px] font-mono text-emerald-400 font-bold">SYSTEM ONLINE</div>
                <div className="text-[8px] font-mono text-textMuted leading-tight">LATENCY: {syncStatus.dataLatencyMs}ms</div>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN PAGE WRAPPER */}
        <main className="flex-1 h-full overflow-y-auto relative bg-[#020610] p-4 flex flex-col min-w-0">
          {children}
        </main>

        {/* RIGHT NOTIFICATION SLIDE DRAWER (320px) */}
        {notificationsOpen && (
          <aside className="absolute right-0 top-0 h-full w-80 bg-surface/95 border-l border-[#0a1f3d] backdrop-blur-md shadow-2xl z-40 flex flex-col transition-all duration-300 animate-[slideIn_0.2s_ease-out]">
            <div className="p-4 border-b border-[#0a1f3d] flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bell className="h-4 text-[#00d4ff]" />
                <span className="font-sans font-bold text-xs text-textPrimary tracking-wide">ACTIVE NOTIFICATIONS</span>
              </div>
              <button
                onClick={() => setNotificationsOpen(false)}
                className="text-textMuted hover:text-textPrimary text-xs font-mono"
              >
                [CLOSE]
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <div className="text-[10px] text-textMuted font-mono uppercase tracking-wider mb-2">Meteorological Alerts</div>
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3 rounded border text-xs leading-relaxed ${
                    alert.severity === 'CRITICAL' ? 'bg-red-950/20 border-red-500/30 text-red-200' :
                    alert.severity === 'HIGH' ? 'bg-amber-950/20 border-amber-500/30 text-amber-200' :
                    'bg-slate-900/40 border-[#0a1f3d] text-textPrimary'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1 font-mono text-[10px]">
                    <span className={`font-bold ${alert.severity === 'CRITICAL' ? 'text-[#ff3d5a]' : 'text-warning'}`}>{alert.type}</span>
                    <span className="text-textMuted">{alert.time}</span>
                  </div>
                  <div className="font-sans">{alert.region} alert status active. Monitoring feeds closely.</div>
                </div>
              ))}
            </div>
          </aside>
        )}
      </div>

      {/* BOTTOM WARNING TICKER BAR (32px) */}
      <footer className="h-8 w-full bg-[#120300] border-t border-[#ff3d5a]/20 flex items-center overflow-hidden shrink-0 z-30 font-mono text-xs select-none">
        <div className="h-full bg-red-950/40 border-r border-[#ff3d5a]/30 px-4 text-[#ff3d5a] flex items-center space-x-1.5 shrink-0 font-bold">
          <span className="h-2 w-2 rounded-full bg-red-500 animate-ping"></span>
          <span>CRITICAL SYSTEM ALERTS</span>
        </div>
        <div className="flex-1 overflow-hidden relative flex items-center h-full">
          <div className="absolute whitespace-nowrap text-[#ff3d5a] font-semibold tracking-wider flex space-x-20 animate-[ticker-scroll_40s_linear_infinite]">
            <span>[18:14] HEATWAVE WARNING: Rajasthan districts (Barmer, Jaisalmer) exceeding 44°C+ temperature anomaly. Immediate response suggested.</span>
            <span>[18:10] FLOOD WATCH: Brahmaputra River level at Dhubri gauge recorded at 3.2m above danger threshold. Active evacuation grids flagged.</span>
            <span>[17:58] CYCLONE WATCH: Low-pressure formation detected in Bay of Bengal region. Tracking path vector models.</span>
            <span>[17:34] DROUGHT ADVISORY: Vidarbha agricultural zones reports critical soil moisture depletion. NDVI index degraded.</span>
          </div>
        </div>
      </footer>

      {/* GLOBAL SEARCH MODAL ("/") */}
      {searchOpen && (
        <div className="fixed inset-0 bg-[#020610]/85 backdrop-blur-sm z-50 flex items-start justify-center pt-24">
          <div className="w-full max-w-xl bg-surface border border-[#0a1f3d] rounded-lg shadow-2xl overflow-hidden animate-[zoomIn_0.15s_ease-out]">
            <div className="p-4 border-b border-[#0a1f3d] flex items-center space-x-3 bg-bg">
              <Search className="h-5 w-5 text-[#00d4ff]" />
              <input
                autoFocus
                type="text"
                placeholder="Search states, districts, meteorological stations, AI models..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none text-[#e2f4ff] placeholder-textMuted focus:outline-none w-full text-sm font-sans"
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="text-textMuted hover:text-textPrimary text-[10px] font-mono border border-[#0a1f3d] px-2 py-1 rounded bg-surface"
              >
                ESC
              </button>
            </div>
            
            <div className="max-h-96 overflow-y-auto p-2">
              {searchResults.length > 0 ? (
                <div className="space-y-1">
                  {searchResults.map((res, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        res.action();
                        setSearchOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 rounded hover:bg-cyan-950/20 hover:text-[#00d4ff] flex items-center justify-between text-xs transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <Terminal className="h-3.5 w-3.5 text-textMuted" />
                        <div>
                          <div className="font-semibold text-textPrimary">{res.name}</div>
                          <div className="text-[10px] text-textMuted">{res.type}</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono uppercase bg-[#0a1f3d] px-2 py-0.5 rounded text-textMuted">
                        {res.category}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-textMuted text-xs font-mono">
                  No matching telemetry channels discovered
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* COMMAND PALETTE MODAL (Ctrl+K) */}
      {paletteOpen && (
        <div className="fixed inset-0 bg-[#020610]/85 backdrop-blur-sm z-50 flex items-start justify-center pt-24">
          <div className="w-full max-w-lg bg-surface border border-[#0a1f3d] rounded-lg shadow-2xl overflow-hidden animate-[zoomIn_0.15s_ease-out]">
            <div className="p-4 border-b border-[#0a1f3d] bg-bg flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Cpu className="h-4.5 w-4.5 text-[#7c3aed]" />
                <span className="font-sans text-xs tracking-wide font-bold text-textPrimary">⌘ CLIMATE COMMAND CENTER</span>
              </div>
              <button
                onClick={() => setPaletteOpen(false)}
                className="text-textMuted hover:text-textPrimary text-[10px] font-mono"
              >
                [ESC TO CLOSE]
              </button>
            </div>
            
            <div className="p-3 bg-surface/50 border-b border-[#0a1f3d]">
              <input
                autoFocus
                type="text"
                placeholder="Trigger policy simulation, model forecast overlays..."
                value={paletteQuery}
                onChange={(e) => {
                  setPaletteQuery(e.target.value);
                  setSelectedPaletteIndex(0);
                }}
                className="bg-bg border border-[#0a1f3d] rounded px-3 py-2 text-xs font-mono w-full focus:outline-none focus:border-[#00d4ff]/40 text-[#e2f4ff]"
              />
            </div>

            <div className="max-h-80 overflow-y-auto p-2">
              {filteredCommands.length > 0 ? (
                <div className="space-y-0.5">
                  {filteredCommands.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        item.action();
                        setPaletteOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 rounded hover:bg-violet-950/20 hover:text-violet-300 flex items-center justify-between text-xs transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <Activity className="h-4 w-4 text-textMuted" />
                        <span className="font-mono text-textPrimary">{item.title}</span>
                      </div>
                      <span className="text-[10px] font-mono text-violet-400 bg-violet-950/30 border border-violet-800/30 px-1.5 py-0.5 rounded">
                        {item.shortcut}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-textMuted text-xs font-mono">
                  No execution routines match the query
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

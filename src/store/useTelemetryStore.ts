import { create } from 'zustand';
import { SyncStatus, StationMetric, Recommendation, Alert, MissionEvent, ClimateHealth } from '../types/telemetry';

export type ThemeId = 'control' | 'thermal' | 'earth' | 'satellite';

interface TelemetryState {
  theme: ThemeId;
  setTheme: (theme: ThemeId) => void;
  syncStatus: SyncStatus;
  metrics: {
    maxTemp: number;
    maxTempLoc: string;
    rainAnomaly: number;
    rainAnomalyLoc: string;
    floodRiskIndex: number;
    activeAlertsCount: number;
    predictionsReadyCount: number;
  };
  alerts: Alert[];
  events: MissionEvent[];
  recommendations: Recommendation[];
  climateHealth: ClimateHealth;
  isMuted: boolean;
  toggleMute: () => void;
  
  initialize: () => void;
  fluctuate: () => void;
  approveRecommendation: (id: string) => void;
  deferRecommendation: (id: string) => void;
  addEvent: (icon: string, text: string) => void;
  triggerSync: () => void;
}

export const useTelemetryStore = create<TelemetryState>((set, get) => ({
  theme: 'control',
  setTheme: (theme) => set({ theme }),
  isMuted: false,
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
  syncStatus: {
    syncPercentage: 98.4,
    lastSyncSecondsAgo: 14,
    aiConfidence: 96,
    satelliteCoverage: 98,
    dataLatencyMs: 142,
    twinAccuracyPercentage: 94.7
  },

  metrics: {
    maxTemp: 44.2,
    maxTempLoc: "Barmer, Rajasthan",
    rainAnomaly: 187,
    rainAnomalyLoc: "Assam Zone — Above Normal",
    floodRiskIndex: 73,
    activeAlertsCount: 4,
    predictionsReadyCount: 7
  },
  alerts: [
    { id: '1', type: 'Heatwave', region: 'Barmer, Rajasthan', severity: 'CRITICAL', time: '2m ago' },
    { id: '2', type: 'Flood', region: 'Assam', severity: 'HIGH', time: '8m ago' },
    { id: '3', type: 'Drought', region: 'Vidarbha, Maharashtra', severity: 'MODERATE', time: '1h ago' },
    { id: '4', type: 'Cyclone', region: 'Bay of Bengal', severity: 'HIGH', time: '3h ago' },
    { id: '5', type: 'AQI Alert', region: 'Delhi NCR', severity: 'CRITICAL', time: '4h ago' }
  ],
  events: [
    { id: 'event-1', time: '18:05', icon: '🛰', text: 'INSAT-3D LST Data Ingested' },
    { id: 'event-2', time: '18:08', icon: '🤖', text: 'Temporal Fusion Transformer model executed for precipitation projections' },
    { id: 'event-3', time: '18:12', icon: '🔴', text: 'District Barmer exceeded critical 44.0°C temperature threshold' },
    { id: 'event-4', time: '18:15', icon: '✅', text: 'AI recommendation approved: Open 180 cooling centers' },
    { id: 'event-5', time: '18:20', icon: '🔄', text: 'Digital Twin synchronized with real world' }
  ],
  recommendations: [
    {
      id: 'rec-1',
      priority: 'CRITICAL',
      title: 'Deploy 8 NDRF Teams',
      description: 'Pre-position emergency rescue teams to Barmer & Jaisalmer due to impending heat and flash water risks.',
      confidenceScore: 94,
      engine: 'DisasterIntelligence',
      status: 'PENDING'
    },
    {
      id: 'rec-2',
      priority: 'HIGH',
      title: 'Issue Red Alert: School Closure',
      description: 'Recommend closures for 430 institutions across Jaipur and Jodhpur divisions. Affects 2.1M students.',
      confidenceScore: 91,
      engine: 'ClimatePrediction',
      status: 'PENDING'
    },
    {
      id: 'rec-3',
      priority: 'HIGH',
      title: 'Open 180 Cooling Centers',
      description: 'Establish climate hydration centers in Jaipur division. Target capacity: 340,000 people.',
      confidenceScore: 89,
      engine: 'ClimatePrediction',
      status: 'PENDING'
    },
    {
      id: 'rec-4',
      priority: 'MODERATE',
      title: 'Increase Release — Bisalpur Dam',
      description: 'Controlled hydro-discharge to buffer upstream reservoir accumulation. Downstream flood hazard remains LOW.',
      confidenceScore: 78,
      engine: 'DisasterIntelligence',
      status: 'PENDING'
    }
  ],
  climateHealth: {
    score: 67,
    status: 'STRESSED',
    subScores: [
      { name: 'Heat Resilience', value: 62 },
      { name: 'Water Security', value: 54 },
      { name: 'Agriculture Index', value: 78 },
      { name: 'Disaster Prep', value: 65 },
      { name: 'Carbon Balance', value: 51 }
    ]
  },

  initialize: () => {
    // Attempt to load initial data from backend if running
    const loadBackendData = async () => {
      try {
        const resTelemetry = await fetch('/api/v1/telemetry/live');
        if (resTelemetry.ok) {
          const telemetryData = await resTelemetry.json();
          // Map station indices to telemetry metrics
          const barmer = telemetryData.find((s: any) => s.stationId === 'IMD-BMR-01');
          const assam = telemetryData.find((s: any) => s.stationId === 'CWC-ASM-04');
          if (barmer && assam) {
            set((state) => ({
              metrics: {
                ...state.metrics,
                maxTemp: barmer.value,
                rainAnomaly: assam.value
              }
            }));
          }
        }

        const resSync = await fetch('/api/v1/twin/sync-status');
        if (resSync.ok) {
          const syncData = await resSync.json();
          set((state) => ({
            syncStatus: {
              syncPercentage: syncData.sync_percentage,
              lastSyncSecondsAgo: syncData.last_sync_seconds_ago,
              aiConfidence: syncData.ai_confidence,
              satelliteCoverage: syncData.satellite_coverage,
              dataLatencyMs: syncData.data_latency_ms,
              twinAccuracyPercentage: syncData.twin_accuracy_percentage
            }
          }));
        }
      } catch (e) {
        // Fallback silently to client-side mock data loops if backend server is offline
      }
    };
    loadBackendData();

    // 1-second sync timer count
    const interval1 = setInterval(() => {
      set((state) => {
        const nextSec = state.syncStatus.lastSyncSecondsAgo + 1;
        if (nextSec >= 15) {
          setTimeout(() => {
            get().triggerSync();
          }, 0);
          return {
            syncStatus: {
              ...state.syncStatus,
              lastSyncSecondsAgo: 0,
              syncPercentage: parseFloat((98.4 + (Math.random() * 0.2 - 0.1)).toFixed(1))
            }
          };
        }
        return {
          syncStatus: {
            ...state.syncStatus,
            lastSyncSecondsAgo: nextSec
          }
        };
      });
    }, 1000);

    // 3-second data fluctuations
    const interval3 = setInterval(() => {
      get().fluctuate();
    }, 3000);

    return () => {
      clearInterval(interval1);
      clearInterval(interval3);
    };
  },

  fluctuate: () => {
    set((state) => {
      const deltaTemp = (Math.random() * 0.4 - 0.2);
      const deltaRain = Math.floor(Math.random() * 6 - 3);
      const deltaLat = Math.floor(Math.random() * 10 - 5);
      
      return {
        metrics: {
          ...state.metrics,
          maxTemp: parseFloat((state.metrics.maxTemp + deltaTemp).toFixed(1)),
          rainAnomaly: state.metrics.rainAnomaly + deltaRain,
          floodRiskIndex: Math.max(50, Math.min(95, state.metrics.floodRiskIndex + Math.floor(Math.random() * 2 - 1))),
        },
        syncStatus: {
          ...state.syncStatus,
          dataLatencyMs: Math.max(120, Math.min(180, state.syncStatus.dataLatencyMs + deltaLat))
        }
      };
    });
  },

  approveRecommendation: (id) => {
    set((state) => {
      const rec = state.recommendations.find((r) => r.id === id);
      if (!rec) return {};
      
      const newRecs = state.recommendations.map((r) =>
        r.id === id ? { ...r, status: 'APPROVED' as const } : r
      );
      
      // Log to timeline
      setTimeout(() => {
        get().addEvent('✅', `AI recommendation approved: ${rec.title}`);
      }, 0);

      return {
        recommendations: newRecs
      };
    });
  },

  deferRecommendation: (id) => {
    set((state) => {
      const rec = state.recommendations.find((r) => r.id === id);
      if (!rec) return {};
      
      const newRecs = state.recommendations.map((r) =>
        r.id === id ? { ...r, status: 'DEFERRED' as const } : r
      );
      
      // Log to timeline
      setTimeout(() => {
        get().addEvent('⏸', `AI recommendation deferred: ${rec.title}`);
      }, 0);

      return {
        recommendations: newRecs
      };
    });
  },

  addEvent: (icon, text) => {
    set((state) => {
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const newEvent = {
        id: `event-${Math.random()}`,
        time: timeStr,
        icon,
        text
      };
      // Keep max 8 events
      return {
        events: [newEvent, ...state.events.slice(0, 7)]
      };
    });
  },

  triggerSync: () => {
    get().addEvent('🔄', 'Digital Twin Synchronized with Satellite Networks');
  }
}));
export type TelemetryStore = ReturnType<typeof useTelemetryStore.getState>;

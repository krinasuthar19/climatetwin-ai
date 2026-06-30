export interface StationMetric {
  stationId: string;
  name: string;
  source: 'IMD' | 'CWC' | 'MOSDAC';
  timestamp: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  status: 'NORMAL' | 'WATCH' | 'WARNING' | 'CRITICAL';
}

export interface SyncStatus {
  syncPercentage: number;
  lastSyncSecondsAgo: number;
  aiConfidence: number;
  satelliteCoverage: number;
  dataLatencyMs: number;
  twinAccuracyPercentage: number;
}

export interface Recommendation {
  id: string;
  priority: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  title: string;
  description: string;
  confidenceScore: number;
  engine: 'DisasterIntelligence' | 'ClimatePrediction' | 'Agriculture';
  status: 'PENDING' | 'APPROVED' | 'DEFERRED';
}

export interface Alert {
  id: string;
  type: string;
  region: string;
  severity: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  time: string;
}

export interface MissionEvent {
  id: string;
  time: string;
  icon: string;
  text: string;
}

export interface SubScore {
  name: string;
  value: number;
  icon?: string;
}

export interface ClimateHealth {
  score: number;
  status: 'STRESSED' | 'NORMAL' | 'CRITICAL';
  subScores: SubScore[];
}

from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

# 1. Telemetry & Stations Schemas
class StationMetricSchema(BaseModel):
  stationId: str = Field(..., alias="station_id")
  name: str
  source: str # 'IMD', 'CWC', 'MOSDAC'
  timestamp: datetime
  value: float
  unit: str
  trend: str # 'up', 'down', 'stable'
  status: str # 'NORMAL', 'WATCH', 'WARNING', 'CRITICAL'
  
  class Config:
    populate_by_name = True
    from_attributes = True

class SyncStatusSchema(BaseModel):
  syncPercentage: float = Field(..., alias="sync_percentage")
  lastSyncSecondsAgo: int = Field(..., alias="last_sync_seconds_ago")
  aiConfidence: float = Field(..., alias="ai_confidence")
  satelliteCoverage: float = Field(..., alias="satellite_coverage")
  dataLatencyMs: int = Field(..., alias="data_latency_ms")
  twinAccuracyPercentage: float = Field(..., alias="twin_accuracy_percentage")

  class Config:
    populate_by_name = True

# 2. Recommendations Schema
class RecommendationSchema(BaseModel):
  id: str
  priority: str # 'CRITICAL', 'HIGH', 'MODERATE', 'LOW'
  title: str
  description: str
  confidenceScore: float = Field(..., alias="confidence_score")
  engine: str # 'DisasterIntelligence', 'ClimatePrediction', etc.
  status: str # 'PENDING', 'APPROVED', 'DEFERRED'

  class Config:
    populate_by_name = True
    from_attributes = True

# 3. Scenario Simulation Schemas
class SimulationInputsSchema(BaseModel):
  tempChange: float = Field(..., ge=-2.0, le=5.0, description="Temperature Change in Celsius")
  rainChange: int = Field(..., ge=-50, le=50, description="Rainfall Change in Percentage")
  forestCover: int = Field(..., ge=10, le=50, description="Forest Cover Percentage")
  urbanization: int = Field(..., ge=10, le=80, description="Urbanization Percentage")
  waterAvailability: int = Field(..., ge=20, le=100, description="Water Availability Percentage")
  co2Emissions: int = Field(..., ge=200, le=800, description="CO2 Emissions in ppm")

class SimulationOutputsSchema(BaseModel):
  floodRisk: float
  droughtRisk: float
  cropYieldImpact: float
  waterStress: float
  economicImpact: int
  populationExposure: float

# 4. AI Copilot Chat Schemas
class ChatRequestSchema(BaseModel):
  text: str

class ChatResponseSchema(BaseModel):
  id: str
  sender: str
  text: str
  timestamp: str
  status: str

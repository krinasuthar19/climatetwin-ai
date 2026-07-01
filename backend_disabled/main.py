from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import random
import datetime
from schemas import (
    StationMetricSchema,
    SyncStatusSchema,
    RecommendationSchema,
    SimulationInputsSchema,
    SimulationOutputsSchema,
    ChatRequestSchema,
    ChatResponseSchema
)

app = FastAPI(
    title="ClimateTwin AI — Ingestion & Decision Support Backend",
    version="1.1.0",
    description="Operational API layer for ISRO, IMD and NDMA decision platform."
)

# Enable CORS for frontend react server dev environments
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict to ['http://localhost:5173']
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simulated recommendation cache
recommendations_db = [
    {
      "id": "rec-1",
      "priority": "CRITICAL",
      "title": "Deploy 8 NDRF Teams",
      "description": "Pre-position emergency rescue teams to Barmer & Jaisalmer due to impending heat and flash water risks.",
      "confidence_score": 94.0,
      "engine": "DisasterIntelligence",
      "status": "PENDING"
    },
    {
      "id": "rec-2",
      "priority": "HIGH",
      "title": "Issue Red Alert: School Closure",
      "description": "Recommend closures for 430 institutions across Jaipur and Jodhpur divisions. Affects 2.1M students.",
      "confidence_score": 91.0,
      "engine": "ClimatePrediction",
      "status": "PENDING"
    },
    {
      "id": "rec-3",
      "priority": "HIGH",
      "title": "Open 180 Cooling Centers",
      "description": "Establish climate hydration centers in Jaipur division. Target capacity: 340,000 people.",
      "confidence_score": 89.0,
      "engine": "ClimatePrediction",
      "status": "PENDING"
    },
    {
      "id": "rec-4",
      "priority": "MODERATE",
      "title": "Increase Release — Bisalpur Dam",
      "description": "Controlled hydro-discharge to buffer upstream reservoir accumulation. Downstream flood hazard remains LOW.",
      "confidence_score": 78.0,
      "engine": "DisasterIntelligence",
      "status": "PENDING"
    }
]

@app.get("/health")
def health_check():
    return {"status": "HEALTHY", "timestamp": datetime.datetime.now().isoformat()}

@app.get("/api/v1/telemetry/live", response_model=List[StationMetricSchema])
def get_live_telemetry():
    # Returns simulated telemetry readouts for weather stations
    now = datetime.datetime.now()
    return [
        {
            "station_id": "IMD-BMR-01",
            "name": "Barmer",
            "source": "IMD",
            "timestamp": now,
            "value": round(44.2 + (random.random() * 0.4 - 0.2), 1),
            "unit": "°C",
            "trend": "up",
            "status": "CRITICAL"
        },
        {
            "station_id": "CWC-ASM-04",
            "name": "Assam Zone",
            "source": "CWC",
            "timestamp": now,
            "value": 187.0 + random.randint(-2, 2),
            "unit": "mm",
            "trend": "up",
            "status": "WATCH"
        },
        {
            "station_id": "MOS-MDB-08",
            "name": "MOSDAC Hub",
            "source": "MOSDAC",
            "timestamp": now,
            "value": 0.82,
            "unit": "fraction",
            "trend": "stable",
            "status": "NORMAL"
        }
    ]

@app.get("/api/v1/twin/sync-status", response_model=SyncStatusSchema)
def get_twin_sync():
    # Returns dynamic synchronization rates of physical sensors
    return {
        "sync_percentage": round(98.4 + (random.random() * 0.2 - 0.1), 1),
        "last_sync_seconds_ago": random.randint(1, 14),
        "ai_confidence": 96.0,
        "satellite_coverage": 98.0,
        "data_latency_ms": random.randint(130, 160),
        "twin_accuracy_percentage": 94.7
    }

@app.get("/api/v1/recommendations", response_model=List[RecommendationSchema])
def get_recommendations():
    return recommendations_db

@app.post("/api/v1/recommendations/{id}/approve")
def approve_recommendation(id: str):
    for rec in recommendations_db:
        if rec["id"] == id:
            rec["status"] = "APPROVED"
            return {"status": "APPROVED", "rec_id": id}
    raise HTTPException(status_code=404, detail="Recommendation ID not found")

@app.post("/api/v1/recommendations/{id}/defer")
def defer_recommendation(id: str):
    for rec in recommendations_db:
        if rec["id"] == id:
            rec["status"] = "DEFERRED"
            return {"status": "DEFERRED", "rec_id": id}
    raise HTTPException(status_code=404, detail="Recommendation ID not found")

@app.post("/api/v1/simulation/run", response_model=SimulationOutputsSchema)
def run_simulation(inputs: SimulationInputsSchema):
    # Calculates cascading impact indices mapping inputs to outputs
    # 1. Flood Risk (%)
    base_flood = 45
    rain_effect = inputs.rainChange * 0.8
    urb_effect = (inputs.urbanization - 30) * 0.5
    forest_effect = (inputs.forestCover - 25) * -0.6
    flood_risk = max(5.0, min(99.0, float(round(base_flood + rain_effect + urb_effect + forest_effect))))

    # 2. Drought Risk (%)
    base_drought = 40
    temp_effect = inputs.tempChange * 8
    rain_dry_effect = -inputs.rainChange * 0.6
    water_effect = (inputs.waterAvailability - 70) * -0.5
    drought_risk = max(5.0, min(99.0, float(round(base_drought + temp_effect + rain_dry_effect + water_effect))))

    # 3. Crop Yield Impact (%)
    temp_dev = abs(inputs.tempChange - 0.5)
    rain_dev = abs(inputs.rainChange)
    crop_yield = 0.0 - (temp_dev * 8.0) - (rain_dev * 0.3) + ((inputs.forestCover - 20) * 0.2)
    crop_yield_impact = max(-50.0, min(30.0, float(round(crop_yield, 1))))

    # 4. Water Stress (%)
    base_stress = 50
    stress_temp = inputs.tempChange * 5
    stress_urb = (inputs.urbanization - 30) * 0.4
    stress_rain = -inputs.rainChange * 0.4
    stress_water = (inputs.waterAvailability - 70) * -0.8
    water_stress = max(10.0, min(100.0, float(round(base_stress + stress_temp + stress_urb + stress_rain + stress_water))))

    # 5. Economic Impact (Crores)
    risk_index = (flood_risk + drought_risk) / 200.0
    asset_value = inputs.urbanization * 220
    economic_impact = int(risk_index * risk_index * asset_value * 5)

    # 6. Population Exposure (Millions)
    exposure_base = (inputs.urbanization * 0.8) + 10.0
    hazard_factor = (flood_risk * 0.4 + drought_risk * 0.3) / 100.0
    population_exposure = float(round(exposure_base * hazard_factor, 1))

    return {
        "floodRisk": flood_risk,
        "droughtRisk": drought_risk,
        "cropYieldImpact": crop_yield_impact,
        "waterStress": water_stress,
        "economicImpact": economic_impact,
        "populationExposure": population_exposure
    }

@app.post("/api/v1/copilot/chat", response_model=ChatResponseSchema)
def copilot_chat(request: ChatRequestSchema):
    search_key = request.text.lower()
    
    mock_qa = {
      'rajasthan': 'Based on our Temporal Fusion Transformer (TFT) prediction models and current IMD telemetry, the Barmer and Jaisalmer districts in Rajasthan are projected to sustain a severe heatwave over the next 5 days. Temperatures are estimated to peak at 45.1°C. Recommended NDMA protocol: Deploy local hydration tents and issue school closures.',
      'vidarbha': 'LSTM networks indicate root-zone soil wetness in the Vidarbha region is 22% below the 10-year seasonal average (NDVI = 0.28). This indicates high agricultural stress. Immediate irrigation release from the local reservoir system is recommended to offset crop yield losses.',
      'insat': 'INSAT-3D Land Surface Temperature (LST) datasets ingested 14 minutes ago show an average heat anomaly of +3.2°C across northwest India. Sea Surface Temperature (SST) from Oceansat-3 is normal. Note that RISAT-2B SAR sensor signal is currently DEGRADED (890ms latency), requiring data interpolation from Cartosat grids.',
      'flood': 'Rainfall in the Assam valley has reached +187mm above the weekly normal, causing the Brahmaputra River level at Dhubri to rise to 3.2m above danger level. XGBoost risk classifiers assign a 79% probability of severe district flooding in the next 48 hours. Emergency recommendations are active for NDMA deployment.',
    }

    response_text = "My models have analyzed the query. Overall Climate Health is 67 (STRESSED). Active danger hotspots are Rajasthan (Heatwave) and Assam (Floods). What specific telemetry parameters should we run in the simulator?"
    
    for key, val in mock_qa.items():
        if key in search_key:
            response_text = val
            break

    return {
        "id": f"a-{random.random()}",
        "sender": "assistant",
        "text": response_text,
        "timestamp": datetime.datetime.now().strftime("%H:%M"),
        "status": "done"
    }

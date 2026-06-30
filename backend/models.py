from sqlalchemy import Column, Integer, String, Numeric, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from geoalchemy2 import Geometry
from database import Base

class AdministrativeRegion(Base):
    __tablename__ = "administrative_regions"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    parent_id = Column(Integer, ForeignKey("administrative_regions.id"), nullable=True)
    level = Column(String(20), nullable=False) # 'STATE' or 'DISTRICT'
    
    # PostGIS geometry column for MultiPolygon boundaries
    boundary = Column(Geometry(geometry_type="MULTIPOLYGON", srid=4326), nullable=True)
    
    parent = relationship("AdministrativeRegion", remote_side=[id])

class MonitoringStation(Base):
    __tablename__ = "monitoring_stations"
    
    id = Column(String(50), primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    source = Column(String(50), nullable=False) # 'IMD', 'CWC', 'MOSDAC'
    elevation = Column(Numeric(6, 2), nullable=True)
    status = Column(String(20), default="ACTIVE")
    last_reported = Column(DateTime(timezone=True), nullable=True)
    
    # Point location mapping using PostGIS geometry
    location = Column(Geometry(geometry_type="POINT", srid=4326), nullable=False)
    
    telemetries = relationship("StationTelemetry", back_populates="station")

class StationTelemetry(Base):
    __tablename__ = "station_telemetry"
    
    id = Column(Integer, primary_key=True, index=True)
    station_id = Column(String(50), ForeignKey("monitoring_stations.id", onDelete="CASCADE"))
    timestamp = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    temperature = Column(Numeric(4, 2), nullable=True)
    rainfall_accumulated = Column(Numeric(6, 2), nullable=True)
    humidity = Column(Numeric(5, 2), nullable=True)
    wind_speed = Column(Numeric(5, 2), nullable=True)
    wind_direction = Column(Integer, nullable=True)
    soil_moisture = Column(Numeric(5, 2), nullable=True)
    water_level = Column(Numeric(6, 2), nullable=True)
    
    station = relationship("MonitoringStation", back_populates="telemetries")

class GridCellMetric(Base):
    __tablename__ = "grid_cell_metrics"
    
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime(timezone=True), nullable=False)
    lst_temp = Column(Numeric(4, 2), nullable=True)
    ndvi = Column(Numeric(3, 2), nullable=True)
    soil_wetness = Column(Numeric(3, 2), nullable=True)
    cloud_fraction = Column(Numeric(3, 2), nullable=True)
    
    # Cell polygon coordinates spatial mapping
    cell_geom = Column(Geometry(geometry_type="POLYGON", srid=4326), nullable=False)

class DisasterEvent(Base):
    __tablename__ = "disaster_events"
    
    id = Column(Integer, primaryKey=True, index=True)
    type = Column(String(50), nullable=False) # 'FLOOD', 'HEATWAVE', 'CYCLONE', 'DROUGHT'
    severity = Column(String(20), nullable=False) # 'LOW', 'WATCH', 'WARNING', 'CRITICAL'
    region_id = Column(Integer, ForeignKey("administrative_regions.id"), nullable=True)
    description = Column(Text, nullable=True)
    started_at = Column(DateTime(timezone=True), nullable=False)
    ended_at = Column(DateTime(timezone=True), nullable=True)
    
    # Spatial boundary polygon of hazard zone
    geom = Column(Geometry(geometry_type="GEOMETRY", srid=4326), nullable=True)

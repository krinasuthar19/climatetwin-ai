export interface SimulationInputs {
  tempChange: number;          // Range: -2.0 to +5.0 °C
  rainChange: number;          // Range: -50 to +50 %
  forestCover: number;         // Range: 10 to 50 %
  urbanization: number;        // Range: 10 to 80 %
  waterAvailability: number;   // Range: 20 to 100 %
  co2Emissions: number;        // Range: 200 to 800 ppm
}

export interface SimulationOutputs {
  floodRisk: number;           // 0 to 100 %
  droughtRisk: number;         // 0 to 100 %
  cropYieldImpact: number;     // -50 to +30 %
  waterStress: number;         // 0 to 100 %
  economicImpact: number;      // index or estimate (Crores)
  populationExposure: number;  // Millions of people
}

import { create } from 'zustand';
import { SimulationInputs, SimulationOutputs } from '../types/simulation';
import { useTelemetryStore } from './useTelemetryStore';

interface SimulationState {
  inputs: SimulationInputs;
  outputs: SimulationOutputs;
  isSimulating: boolean;
  history: Array<{ timestamp: string; inputs: SimulationInputs; outputs: SimulationOutputs }>;
  setInputValue: (key: keyof SimulationInputs, value: number) => void;
  runSimulation: () => Promise<void>;
  resetInputs: () => void;
}

const defaultInputs: SimulationInputs = {
  tempChange: 1.5,
  rainChange: 10,
  forestCover: 23,
  urbanization: 38,
  waterAvailability: 75,
  co2Emissions: 418,
};

const calculateOutputs = (inp: SimulationInputs): SimulationOutputs => {
  // 1. Flood Risk (%) - Driven by rainfall increases, urbanization, and lack of forest cover.
  const baseFlood = 45;
  const rainEffect = inp.rainChange * 0.8;
  const urbEffect = (inp.urbanization - 30) * 0.5;
  const forestEffect = (inp.forestCover - 25) * -0.6;
  const floodRisk = Math.max(5, Math.min(99, Math.round(baseFlood + rainEffect + urbEffect + forestEffect)));

  // 2. Drought Risk (%) - Driven by temperature increases, negative rainfall, and lack of water availability.
  const baseDrought = 40;
  const tempEffect = inp.tempChange * 8;
  const rainDryEffect = -inp.rainChange * 0.6;
  const waterEffect = (inp.waterAvailability - 70) * -0.5;
  const droughtRisk = Math.max(5, Math.min(99, Math.round(baseDrought + tempEffect + rainDryEffect + waterEffect)));

  // 3. Crop Yield Impact (%) - Optimal around tempChange = 0.5, rainChange = 0.
  // Negatively impacted by extreme temp, drought, or floods.
  const optimalTemp = 0.5;
  const tempDev = Math.abs(inp.tempChange - optimalTemp);
  const rainDev = Math.abs(inp.rainChange);
  
  let cropYieldImpact = 0;
  cropYieldImpact -= tempDev * 8; // -8% yield per degree deviation
  cropYieldImpact -= rainDev * 0.3; // -0.3% yield per % rainfall deviation
  // Mitigated slightly by high forest cover
  cropYieldImpact += (inp.forestCover - 20) * 0.2;
  cropYieldImpact = Math.max(-50, Math.min(30, parseFloat(cropYieldImpact.toFixed(1))));

  // 4. Water Stress (%) - High temp, urbanization, low rainfall, low water availability.
  const baseStress = 50;
  const stressTemp = inp.tempChange * 5;
  const stressUrb = (inp.urbanization - 30) * 0.4;
  const stressRain = -inp.rainChange * 0.4;
  const stressWater = (inp.waterAvailability - 70) * -0.8;
  const waterStress = Math.max(10, Math.min(100, Math.round(baseStress + stressTemp + stressUrb + stressRain + stressWater)));

  // 5. Economic Impact (Crores) - Scaling with disasters (Flood & Drought) and urbanization value exposure.
  const riskIndex = (floodRisk + droughtRisk) / 200; // 0 to 1
  const assetValue = inp.urbanization * 220; // proxy for urban value
  const economicImpact = Math.round(riskIndex * riskIndex * assetValue * 5); // quadratic risk scaling

  // 6. Population Exposure (Millions of people) - Scales with urbanization density and hazards.
  const exposureBase = (inp.urbanization * 0.8) + 10; // proxy for urban pop density
  const hazardFactor = (floodRisk * 0.4 + droughtRisk * 0.3) / 100;
  const populationExposure = parseFloat((exposureBase * hazardFactor).toFixed(1));

  return {
    floodRisk,
    droughtRisk,
    cropYieldImpact,
    waterStress,
    economicImpact,
    populationExposure,
  };
};

export const useSimulationStore = create<SimulationState>((set, get) => ({
  inputs: defaultInputs,
  outputs: calculateOutputs(defaultInputs),
  isSimulating: false,
  history: [],

  setInputValue: (key, value) => {
    set((state) => {
      const newInputs = { ...state.inputs, [key]: value };
      return { inputs: newInputs };
    });
  },

  runSimulation: async () => {
    set({ isSimulating: true });
    
    // Simulate computing cascade delays (1.5 seconds)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    try {
      const response = await fetch('/api/v1/simulation/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(get().inputs)
      });
      if (response.ok) {
        const data = await response.json();
        set((state) => {
          const outputsMapped = {
            floodRisk: data.floodRisk,
            droughtRisk: data.droughtRisk,
            cropYieldImpact: data.cropYieldImpact,
            waterStress: data.waterStress,
            economicImpact: data.economicImpact,
            populationExposure: data.populationExposure
          };
          
          setTimeout(() => {
            useTelemetryStore.getState().addEvent(
              '🎮',
              `Simulation executed via FastAPI. Temp: ${state.inputs.tempChange}°C, CO2: ${state.inputs.co2Emissions}ppm.`
            );
          }, 0);

          const timestamp = new Date().toLocaleTimeString();
          return {
            isSimulating: false,
            outputs: outputsMapped,
            history: [{ timestamp, inputs: state.inputs, outputs: outputsMapped }, ...state.history.slice(0, 4)]
          };
        });
        return;
      }
    } catch (e) {
      // Fallback silently to client-side calculations if API server is offline
    }

    set((state) => {
      const calculated = calculateOutputs(state.inputs);
      
      // Log simulation completion to mission event timeline
      setTimeout(() => {
        useTelemetryStore.getState().addEvent(
          '🎮',
          `Simulation executed (Local Sandbox). Temp: ${state.inputs.tempChange}°C, CO2: ${state.inputs.co2Emissions}ppm.`
        );
      }, 0);

      const timestamp = new Date().toLocaleTimeString();
      return {
        isSimulating: false,
        outputs: calculated,
        history: [{ timestamp, inputs: state.inputs, outputs: calculated }, ...state.history.slice(0, 4)]
      };
    });
  },

  resetInputs: () => {
    set({
      inputs: defaultInputs,
      outputs: calculateOutputs(defaultInputs),
    });
  }
}));
export type SimulationStore = ReturnType<typeof useSimulationStore.getState>;


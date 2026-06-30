import { create } from 'zustand';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  status?: 'thinking' | 'analyzing' | 'done';
}

interface CopilotState {
  messages: ChatMessage[];
  isThinking: boolean;
  aiStatus: 'IDLE' | 'THINKING' | 'ANALYZING' | 'RESPONDING';
  sendMessage: (text: string) => Promise<void>;
  clearChat: () => void;
}

const initialMessages: ChatMessage[] = [
  {
    id: 'm-1',
    sender: 'assistant',
    text: 'Welcome to ClimateTwin Copilot. I have access to real-time telemetry from INSAT-3D, IMD weather stations, and CWC reservoirs. How can I assist your climate decision workflow today?',
    timestamp: '18:05'
  }
];

const mockQAPairs: Record<string, string> = {
  'rajasthan': 'Based on our Temporal Fusion Transformer (TFT) prediction models and current IMD telemetry, the Barmer and Jaisalmer districts in Rajasthan are projected to sustain a severe heatwave over the next 5 days. Temperatures are estimated to peak at 45.1°C. Recommended NDMA protocol: Deploy local hydration tents and issue school closures.',
  'vidarbha': 'LSTM networks indicate root-zone soil wetness in the Vidarbha region is 22% below the 10-year seasonal average (NDVI = 0.28). This indicates high agricultural stress. Immediate irrigation release from the local reservoir system is recommended to offset crop yield losses.',
  'insat': 'INSAT-3D Land Surface Temperature (LST) datasets ingested 14 minutes ago show an average heat anomaly of +3.2°C across northwest India. Sea Surface Temperature (SST) from Oceansat-3 is normal. Note that RISAT-2B SAR sensor signal is currently DEGRADED (890ms latency), requiring data interpolation from Cartosat grids.',
  'flood': 'Rainfall in the Assam valley has reached +187mm above the weekly normal, causing the Brahmaputra River level at Dhubri to rise to 3.2m above danger level. XGBoost risk classifiers assign a 79% probability of severe district flooding in the next 48 hours. Emergency recommendations are active for NDMA deployment.',
};

export const useCopilotStore = create<CopilotState>((set, get) => ({
  messages: initialMessages,
  isThinking: false,
  aiStatus: 'IDLE',

  sendMessage: async (text) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: `u-${Math.random()}`,
      sender: 'user',
      text,
      timestamp
    };

    set((state) => ({
      messages: [...state.messages, userMsg],
      isThinking: true,
      aiStatus: 'THINKING'
    }));

    // Stage 1: THINKING (1s)
    await new Promise((resolve) => setTimeout(resolve, 1000));
    set({ aiStatus: 'ANALYZING' });

    // Stage 2: ANALYZING (1s)
    await new Promise((resolve) => setTimeout(resolve, 1000));
    set({ aiStatus: 'RESPONDING' });

    // Match response
    const searchKey = text.toLowerCase();
    let responseText = "My models have analyzed the query. Overall Climate Health is 67 (STRESSED). Active danger hotspots are Rajasthan (Heatwave) and Assam (Floods). What specific telemetry parameters should we run in the simulator?";
    
    for (const [key, val] of Object.entries(mockQAPairs)) {
      if (searchKey.includes(key)) {
        responseText = val;
        break;
      }
    }

    const aiMsgId = `a-${Math.random()}`;
    const aiMsg: ChatMessage = {
      id: aiMsgId,
      sender: 'assistant',
      text: '', // Start empty for typing animation effect
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    set((state) => ({
      messages: [...state.messages, aiMsg],
      isThinking: false
    }));

    // Typing effect implementation
    let currentText = '';
    const speed = 15; // ms per char
    const textLength = responseText.length;
    
    return new Promise<void>((resolve) => {
      let index = 0;
      const interval = setInterval(() => {
        if (index < textLength) {
          currentText += responseText.charAt(index);
          set((state) => ({
            messages: state.messages.map((m) =>
              m.id === aiMsgId ? { ...m, text: currentText } : m
            )
          }));
          index++;
        } else {
          clearInterval(interval);
          set({ aiStatus: 'IDLE' });
          resolve();
        }
      }, speed);
    });
  },

  clearChat: () => {
    set({ messages: initialMessages, isThinking: false, aiStatus: 'IDLE' });
  }
}));
export type CopilotStore = ReturnType<typeof useCopilotStore.getState>;

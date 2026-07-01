import { create } from 'zustand';

export type PageId =
  | 'dashboard'
  | 'data-pipeline'
  | 'digital-twin-map'
  | 'satellite-analytics'
  | 'prediction'
  | 'disaster-intelligence'
  | 'agriculture-intelligence'
  | 'simulator'
  | 'ai-data-architecture'
  | 'reports'
  | 'admin';

interface NavigationState {
  activePage: PageId;
  setActivePage: (page: PageId) => void;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  paletteOpen: boolean;
  setPaletteOpen: (open: boolean) => void;
  notificationsOpen: boolean;
  setNotificationsOpen: (open: boolean) => void;
  activeDistrict: string | null;
  setActiveDistrict: (district: string | null) => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  activePage: 'dashboard',
  setActivePage: (page) => set({ activePage: page }),
  searchOpen: false,
  setSearchOpen: (open) => set({ searchOpen: open }),
  paletteOpen: false,
  setPaletteOpen: (open) => set({ paletteOpen: open }),
  notificationsOpen: false,
  setNotificationsOpen: (open) => set({ notificationsOpen: open }),
  activeDistrict: null,
  setActiveDistrict: (district) => set({ activeDistrict: district }),
}));

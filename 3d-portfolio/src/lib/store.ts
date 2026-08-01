import { create } from 'zustand';

interface AppState {
  focusedFrame: string | null;
  setFocusedFrame: (frame: string | null) => void;
  footerVisible: boolean;
  setFooterVisible: (visible: boolean) => void;
}

export const useStore = create<AppState>((set) => ({
  focusedFrame: null,
  setFocusedFrame: (frame) => set({ focusedFrame: frame }),
  footerVisible: false,
  setFooterVisible: (visible) => set({ footerVisible: visible }),
}));

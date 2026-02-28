import { create } from "zustand";

interface TimerState {
  startTime: number | null;          // 15-min session clock
  countdownStartTime: number | null; // 10-min countdown clock (persists across pages)
  setStartTime: (time: number) => void;
  setCountdownStartTime: (time: number) => void;
  clearTimer: () => void;
}

export const useTimerStore = create<TimerState>((set) => ({
  startTime: null,
  countdownStartTime: null,
  setStartTime: (time) => set({ startTime: time }),
  setCountdownStartTime: (time) => set({ countdownStartTime: time }),
  clearTimer: () => set({ startTime: null, countdownStartTime: null }),
}));
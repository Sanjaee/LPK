"use client";

import { create } from "zustand";

export interface FilterState {
  filters: Record<string, unknown>;
  setFilter: (key: string, value: unknown) => void;
  resetFilters: () => void;
}

export const useFilterStore = create<FilterState>()((set) => ({
  filters: {},
  setFilter: (key, value) =>
    set((state) => ({
      filters: {
        ...state.filters,
        [key]: value,
      },
    })),
  resetFilters: () => set({ filters: {} }),
}));

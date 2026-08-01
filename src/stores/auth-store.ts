"use client";

import { create } from "zustand";

export interface AuthState {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    roleId?: string | null;
  } | null;
  setUser: (
    user: AuthState["user"]
  ) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clear: () => set({ user: null }),
}));

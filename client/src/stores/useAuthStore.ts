import type { User } from "@/types/auth";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  loading: boolean;
  setAuth: (token: string, user: User) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      token: null,
      user: null,
      loading: false,
      setAuth: (token: string, user: User) =>
        set({
          isAuthenticated: true,
          token,
          user: user,
          loading: false,
        }),
      clearAuth: () =>
        set({
          isAuthenticated: false,
          token: null,
          user: null,
          loading: false,
        }),
      setLoading: (loading: boolean) => set({ loading }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        token: state.token,
        user: state.user,
      }),
    }
  )
);

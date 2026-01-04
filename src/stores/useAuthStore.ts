import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AuthState {
  token: string | null;
  _hasHydrated: boolean;
  setToken: (token: string | null) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
  hasHydrated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      _hasHydrated: false,
      setToken: (token) => set({ token }),
      logout: () => set({ token: null }),
      isAuthenticated: () => get().token !== null,
      hasHydrated: () => get()._hasHydrated,
    }),
    {
      name: "staff-auth-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        // Mark that hydration is complete
        // The persist middleware automatically restores the token, so we don't need to call setToken
        if (state) {
          state._hasHydrated = true;
        }
      },
    },
  ),
);

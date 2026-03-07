import { create } from "zustand";
import { UserProfile } from "@/shared/schemas";

interface AuthState {
  // データ
  userProfile: UserProfile | null;

  // 状態管理
  isLoading: boolean;
  error: string | null;

  // アクション
  setUserProfile: (profile: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
  reset: () => void;
}

const initialState = {
  userProfile: null,
  isLoading: false,
  error: null,
};

export const useAuthStore = create<AuthState>((set) => ({
  ...initialState,

  setUserProfile: (profile) => set({ userProfile: profile }),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  logout: () => {
    localStorage.removeItem("token");
    set({ userProfile: null });
  },

  reset: () => set(initialState),
}));

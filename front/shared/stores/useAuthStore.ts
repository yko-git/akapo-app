import { create } from "zustand";
import { UserProfile } from "@/shared/schemas";
import { devtools } from "zustand/middleware";

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

export const useAuthStore = create<AuthState>()(
  devtools(
    (set) => ({
      ...initialState,

      setUserProfile: (profile) =>
        set({ userProfile: profile }, false, "auth/setUserProfile"),

      setLoading: (loading) =>
        set({ isLoading: loading }, false, "auth/setLoading"),

      setError: (error) => set({ error }, false, "auth/setError"),

      logout: () => {
        localStorage.removeItem("token");
        set({ userProfile: null }, false, "auth/logout");
      },

      reset: () => set(initialState, false, "auth/reset"),
    }),
    { name: "AuthStore" },
  ),
);

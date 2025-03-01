import { create } from "zustand";
import { AuthResponse, User } from "../types/types";
import { signin } from "../services/api";

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
}

const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem("token"),
  isAuthenticated: !!localStorage.getItem("token"),
  isLoading: false,
  error: null,
  login: async (username: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await signin(username, password);
      const { access_token } = response.data;

      if (access_token) {
        localStorage.setItem("token", access_token);
        set({
          token: access_token,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        throw new Error("No access token received");
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "An error occurred",
        isLoading: false,
        isAuthenticated: false,
      });
      throw error; // Re-throw to allow the component to catch it
    }
  },
}));

export default useAuthStore;

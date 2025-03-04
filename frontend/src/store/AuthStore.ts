import { create } from "zustand";
import { AuthResponse } from "../types/types";
import { signin, signup } from "../services/api";

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  registrationSuccessful: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  resetRegistrationState: () => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem("token"),
  isAuthenticated: !!localStorage.getItem("token"),
  isLoading: false,
  error: null,
  registrationSuccessful: false,
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
      throw error;
    }
  },
  register: async (username: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await signup(username, password);
      const data = response.data;
      if (data.userId) {
        set({
          isLoading: false,
          registrationSuccessful: true,
        });
      } else {
        throw new Error("Registration failed");
      }
    } catch (err: any) {
      console.error("Registration error:", err);
      set({
        error: err.response?.data?.message || "Registration failed",
        isLoading: false,
      });
      throw err;
    }
  },
  resetRegistrationState: () => set({ registrationSuccessful: false }),
  logout: () => {
    localStorage.removeItem("token");
    set({
      token: null,
      isAuthenticated: false,
    });
  },
}));

export default useAuthStore;

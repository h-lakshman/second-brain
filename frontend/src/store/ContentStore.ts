import { create } from "zustand";
import { createContent } from "../services/api";
import { Content } from "../types/types";
import axios from "axios";

interface ContentState {
  contents: Content[];
  shareLink: string | null;
  loading: boolean;
  error: string | null;
  //   fetchContents: () => Promise<void>;
  addContent: (content: {
    link: string;
    title: string;
    type: string;
    tags: string[];
  }) => Promise<void>;
  //   removeContent: (contentId: string) => Promise<void>;
  //   createShareLink: () => Promise<string>;
  //   removeShareLink: () => Promise<void>;
  //   shareContent: (share: boolean) => Promise<string | void>;
  //   fetchSharedContents: (shareLink: string) => Promise<void>;
  clearError: () => void;
}

const useContentStore = create<ContentState>((set) => ({
  contents: [],
  shareLink: null,
  loading: false,
  error: null,
  addContent: async (content) => {
    try {
      set({ loading: true, error: null });
      const response = await createContent(content);
      set({ loading: false });
    } catch (error) {
      let errorMessage = "Failed to create content";

      if (axios.isAxiosError(error)) {
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.response?.status === 400) {
          errorMessage = "Invalid input. Please check your form values.";
        } else if (error.response?.status === 401) {
          errorMessage = "Please log in to add content.";
        } else if (error.response?.status === 500) {
          errorMessage = "Server error. Please try again later.";
        }
      }

      set({
        loading: false,
        error: errorMessage,
      });
      throw error;
    }
  },
  clearError: () => set({ error: null }),
}));

export default useContentStore;

import { create } from "zustand";
import {
  createContent,
  deleteContent,
  getContent,
  getSharedContent,
  shareContent,
  createShareLink,
} from "../services/api";
import { Content, ContentResponse, ShareLinkResponse } from "../types/types";
import axios from "axios";

interface ContentState {
  contents: Content[];
  shareLink: string | null;
  loading: boolean;
  error: string | null;
  sharedContents: Content[];
  fetchContents: () => Promise<void>;
  addContent: (content: {
    link: string;
    title: string;
    type: string;
    tags: string[];
  }) => Promise<void>;
  removeContent: (contentId: string) => Promise<void>;
  createShareLink: () => Promise<ShareLinkResponse>;
  removeShareLink: () => Promise<void>;
  shareContent: (share: boolean) => Promise<void>;
  fetchSharedContents: (shareLink: string) => Promise<void>;
  clearError: () => void;
}

const useContentStore = create<ContentState>((set) => ({
  contents: [],
  shareLink: null,
  loading: false,
  error: null,
  sharedContents: [],

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
  fetchContents: async () => {
    set({ loading: true, error: null });
    try {
      const response = await getContent();
      const data = response.data as ContentResponse;
      if (data.content) {
        set({ contents: data.content, loading: false });
      } else {
        set({ contents: [], loading: false });
      }
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to fetch content",
        loading: false,
      });
    }
  },
  createShareLink: async () => {
    try {
      set({ loading: true, error: null });
      const response = await createShareLink();
      const data = response.data as ShareLinkResponse;
      set({ shareLink: data.hash, loading: false });
      return data;
    } catch (error) {
      set({
        loading: false,
        error: "Failed to create share link",
      });
      throw error;
    }
  },

  removeShareLink: async () => {
    set({ loading: true, error: null });
    try {
      await shareContent(false);
      set({ shareLink: null, loading: false });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to remove share link",
        loading: false,
      });
      throw err;
    }
  },
  shareContent: async (share: boolean) => {
    set({ loading: true, error: null });
    try {
      const response = await shareContent(share);
      const data = response.data as ShareLinkResponse;

      if (share) {
        set({ shareLink: data.hash, loading: false });
      } else {
        set({ shareLink: null, loading: false });
      }

      set({ loading: false });
    } catch (err: any) {
      const errorMessage = share
        ? "Failed to create share link"
        : "Failed to remove share link";

      set({
        error: err.response?.data?.message || errorMessage,
        loading: false,
      });
      throw err;
    }
  },
  removeContent: async (contentId: string) => {
    set({ loading: true, error: null });
    try {
      await deleteContent(contentId);
      // Update the local state by filtering out the deleted content
      set((state) => ({
        contents: state.contents.filter((content) => content._id !== contentId),
        loading: false,
      }));
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to delete content",
        loading: false,
      });
      throw err;
    }
  },
  fetchSharedContents: async (shareLink) => {
    set({ loading: true, error: null });
    try {
      const response = await getSharedContent(shareLink);
      const data = response.data as ContentResponse;
      if (data.content) {
        set({ sharedContents: data.content, loading: false });
      } else {
        set({ sharedContents: [], loading: false });
      }
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to fetch shared content",
        loading: false,
      });
      throw err;
    }
  },
  clearError: () => set({ error: null }),
}));

export default useContentStore;

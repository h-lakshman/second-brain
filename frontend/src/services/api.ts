import axios from "axios";

const API_URL = "http://localhost:3000/api/v1";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const signin = (username: string, password: string) => {
  return api.post("/signin", { username, password });
};

export const signup = (username: string, password: string) => {
  return api.post("/signup", { username, password });
};

// Content API
export const createContent = (content: {
  link: string;
  title: string;
  type: string;
  tags: string[];
}) => {
  return api.post("/content", content);
};

export const getContent = () => {
  return api.get("/content");
};

export const deleteContent = (contentId: string) => {
  return api.delete("/content", { data: { contentId } });
};

export const shareContent = (share: boolean) => {
  return api.post("/brain/share", { share });
};

export const createShareLink = () => {
  return api.post("/brain/share");
};

export const getSharedContent = (shareLink: string) => {
  return api.get(`/brain/${shareLink}`);
};

export default api;

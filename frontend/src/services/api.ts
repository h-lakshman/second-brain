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

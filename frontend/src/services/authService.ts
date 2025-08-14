import axios, { AxiosInstance, AxiosError } from "axios";
import { useAuthStore } from "@/stores/auth";

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 20000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (import.meta.env.DEV) {
      console.group("🔴 Axios Error");
      console.log("Status:", error.response?.status ?? 0);
      console.log("Data:", error.response?.data);
      console.log("URL:", error.config?.url);
      console.groupEnd();
    }

    const status = error.response?.status ?? 0;
    const code = (error.response?.data as any)?.code;

    if (status === 401 || code === "UNAUTHENTICATED") {
      const auth = useAuthStore();
      auth.logout();
    }

    return Promise.reject(error);
  }
);

export default api;
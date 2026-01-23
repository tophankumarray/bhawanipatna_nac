// @ts-nocheck
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5900/api",
  timeout: 10000,
});

// ✅ Request interceptor (Auth)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // ✅ IMPORTANT: if FormData, don't force JSON
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          localStorage.removeItem("token");
          window.location.href = "/login";
          break;
        case 403:
          console.error("Forbidden");
          break;
        case 404:
          console.error("Not Found");
          break;
        case 500:
          console.error("Server Error");
          break;
        default:
          console.error("API Error:", error.response.data);
      }
    } else {
      console.error("Network / Server unreachable");
    }
    return Promise.reject(error);
  }
);

export default api;

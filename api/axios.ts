import axios from "axios";
import { toast } from "react-toastify";

// const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL =process.env.NEXT_PUBLIC_BASE_URL;

export const publicApi = axios.create({
  baseURL: BASE_URL,
});

export const privateApi = axios.create({
  baseURL: BASE_URL,
});

privateApi.interceptors.request.use(
  (config) => {
    const sessionToken = sessionStorage.getItem("token");
    if (!sessionToken) {
      return config;
    }
    if (sessionToken) {
      if (config.headers) {
        config.headers.Authorization = `Bearer ${sessionToken}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

privateApi.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem("token");
      toast.info("Session timeout", {
        toastId: "info1",
      });
      window.location.replace("/login");
      // Handle error refreshing refresh token
      // Log the user out and redirect to login page
      // Example:
    }
    return Promise.reject(error);
  }
);

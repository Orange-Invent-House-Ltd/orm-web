import axios from "axios";

// const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = import.meta.env.VITE_BASE_URL;
const BASE_URL_TWO = import.meta.env.VITE_BASE_URL_TWO;

export const publicApi = axios.create({
    baseURL: BASE_URL,
});

export const privateApi = axios.create({
    baseURL: BASE_URL_TWO,
});

privateApi.interceptors.request.use(
    (config) => {
        const sessionToken = sessionStorage.getItem("user_id");

        // Add API key only if user_id is available
        if (sessionToken) {
        //   config.headers["X-API-Key"] = API_KEY;
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
            sessionStorage.removeItem("user_id");
            if (window.location) window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);
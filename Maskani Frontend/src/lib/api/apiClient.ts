import axios from "axios";
import { tokenService } from "../auth/tokenStorage";

const api = axios.create({
    baseURL: "http://localhost:5236/api",
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use((config) => {

    const token = tokenService.getToken();

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default api;
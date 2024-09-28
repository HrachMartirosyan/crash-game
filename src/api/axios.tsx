import axios from "axios";
import { ENV_CONFIG } from "../configs/env.config.tsx";

export const instance = axios.create({
  baseURL: ENV_CONFIG.API_BASE_URL,
});

instance.interceptors.request.use((config) => {
  const result = URL.parse(window.location.href);
  const sessionID = result?.searchParams.get("s");

  if (sessionID) {
    config.headers["Session-Id"] = sessionID;
  }
  return config;
});

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  },
);

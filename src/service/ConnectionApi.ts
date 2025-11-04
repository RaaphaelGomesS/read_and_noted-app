import * as Storage from "@/service/Storage";
import axios from "axios";

let globalSignOut: () => void;

export const setSignOutCallback = (signOut: () => void) => {
  globalSignOut = signOut;
};

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
});

api.interceptors.request.use(
  async (config) => {
    const token = await Storage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    if (error.response?.status == 401 && globalSignOut) {
      console.log("401: Token expirado ou inválido. Deslogando...");
      await globalSignOut();
    }
    return Promise.reject(error);
  }
);

export default api;

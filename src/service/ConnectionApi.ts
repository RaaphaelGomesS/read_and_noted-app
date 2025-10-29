import * as Storage from "@/service/Storage";
import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.2.104:8080",
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
    if (error.response?.status == 401) {
      console.log("401: Token expirado ou inválido.");
      await Storage.removeItem("token");
    }
    return Promise.reject(error);
  }
);

export default api;

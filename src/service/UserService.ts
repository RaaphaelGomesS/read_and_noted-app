import { UserRequestDTO } from "@/@types/auth.types";
import * as HandlerError from "@/service/HandlerApiException";
import api from "./ConnectionApi";

export const register = async (reqData: UserRequestDTO) => {
  try {
    const response = await api.post("/auth/register", reqData);
    return response.data;
  } catch (error) {
    throw HandlerError.handleApiError(error, "Não foi possível criar a conta.");
  }
};

export const login = async (reqData: UserRequestDTO) => {
  try {
    const response = await api.post("/auth/login", reqData);
    return response.data.token;
  } catch (error) {
    throw HandlerError.handleApiError(error, "Não foi possível realizar o login.");
  }
};

export const getUser = async () => {
  try {
    const response = await api.get("/user");
    return response.data;
  } catch (error) {
    throw HandlerError.handleApiError(error, "Não foi possível consultar as informações do usuário.");
  }
};

export const updateUser = async (userData: UserRequestDTO) => {
  try {
    const response = await api.put("/user", userData);
    return response.data;
  } catch (error) {
    throw HandlerError.handleApiError(error, "Não foi possível atualizar o usuário.");
  }
};

export const deleteUser = async (userId: number) => {
  try {
    await api.delete(`/user/${userId}`);
  } catch (error) {
    throw HandlerError.handleApiError(error, "Não foi possível deletar o usuário.");
  }
};

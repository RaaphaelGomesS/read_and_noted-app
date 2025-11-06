import { Library, LibraryRequestDTO, LibraryResponsePageDTO } from "@/@types/library.types";
import * as HandlerError from "@/service/HandlerApiException";
import api from "./ConnectionApi";

export const getAllLibraries = async (page = 0, pageSize = 10, direction = "DESC"): Promise<LibraryResponsePageDTO> => {
  try {
    const response = await api.get<LibraryResponsePageDTO>("/library/", {
      params: { page, pageSize, direction },
    });
    return response.data;
  } catch (error) {
    throw HandlerError.handleApiError(error, "Não foi possível buscar as bibliotecas.");
  }
};

export const getLibraryById = async (id: number): Promise<Library> => {
  try {
    const response = await api.get<Library>(`/library/${id}`);
    return response.data;
  } catch (error) {
    throw HandlerError.handleApiError(error, "Não foi possível buscar a biblioteca.");
  }
};

export const createLibrary = async (data: LibraryRequestDTO): Promise<Library> => {
  try {
    const response = await api.post<Library>("/library/", data);
    return response.data;
  } catch (error) {
    throw HandlerError.handleApiError(error, "Não foi possível criar a biblioteca.");
  }
};

export const updateLibrary = async (data: LibraryRequestDTO): Promise<Library> => {
  if (!data.id) {
    throw new Error("ID da biblioteca é necessário para atualização.");
  }
  try {
    const requestData = {
      id: data.id,
      name: data.name,
      description: data.description,
    };
    const response = await api.put<Library>("/library/", requestData);
    return response.data;
  } catch (error) {
    throw HandlerError.handleApiError(error, "Não foi possível atualizar a biblioteca.");
  }
};

export const deleteLibrary = async (id: number): Promise<void> => {
  try {
    await api.delete(`/library/${id}`);
  } catch (error) {
    throw HandlerError.handleApiError(error, "Não foi possível excluir a biblioteca.");
  }
};

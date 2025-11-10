import { SuggestionDetails, SuggestionPageDTO } from "@/@types/suggestion.type";
import { BookTemplate, BookTemplatePageDTO, BookTemplateRequest } from "@/@types/template.types";
import * as HandlerError from "@/service/HandlerApiException";
import { Platform } from "react-native";
import api from "./ConnectionApi";

export const getSuggestions = async (status: string, page = 0): Promise<SuggestionPageDTO> => {
  try {
    const response = await api.get<SuggestionPageDTO>("/suggestion/", {
      params: { status, page, pageSize: 10 },
    });
    return response.data;
  } catch (error) {
    throw HandlerError.handleApiError(error, "Não foi possível buscar as sugestões.");
  }
};

export const getSuggestionDetails = async (id: number): Promise<SuggestionDetails> => {
  try {
    const response = await api.get<SuggestionDetails>(`/suggestion/${id}`);
    return response.data;
  } catch (error) {
    throw HandlerError.handleApiError(error, "Não foi possível buscar os detalhes da sugestão.");
  }
};

export const approveSuggestion = async (id: number): Promise<void> => {
  try {
    await api.post(`/suggestion/approve/${id}`);
  } catch (error) {
    throw HandlerError.handleApiError(error, "Não foi possível aprovar a sugestão.");
  }
};

export const declineSuggestion = async (id: number, justification: string): Promise<void> => {
  try {
    await api.post(`/suggestion/decline/`, { id, justification });
  } catch (error) {
    throw HandlerError.handleApiError(error, "Não foi possível recusar a sugestão.");
  }
};

export const getTemplates = async (status: string, page = 0): Promise<BookTemplatePageDTO> => {
  try {
    const response = await api.get<BookTemplatePageDTO>("/template/", {
      params: { status, page, pageSize: 10 },
    });
    return response.data;
  } catch (error) {
    throw HandlerError.handleApiError(error, "Não foi possível buscar os templates.");
  }
};

export const getTemplateDetails = async (id: number): Promise<BookTemplate> => {
  try {
    const response = await api.get<BookTemplate>(`/template/${id}`);
    return response.data;
  } catch (error) {
    throw HandlerError.handleApiError(error, "Não foi possível buscar os detalhes do template.");
  }
};

export const approveTemplate = async (id: number): Promise<void> => {
  try {
    await api.post(`/template/approve/${id}`);
  } catch (error) {
    throw HandlerError.handleApiError(error, "Não foi possível aprovar o template.");
  }
};

export const deactivateTemplate = async (id: number): Promise<void> => {
  try {
    await api.post(`/template/inactive/${id}`);
  } catch (error) {
    throw HandlerError.handleApiError(error, "Não foi possível desativar o template.");
  }
};

export const updateTemplate = async (templateData: BookTemplateRequest, imageUri?: string): Promise<BookTemplate> => {
  try {
    const formData = new FormData();
    const templateBlob = new Blob([JSON.stringify(templateData)], {
      type: "application/json",
    });
    formData.append("template", templateBlob);

    if (imageUri && !imageUri.startsWith("http")) {
      const file = {
        uri: Platform.OS === "android" ? imageUri : imageUri.replace("file://", ""),
        name: "cover.jpg",
        type: "image/jpeg",
      };
      // @ts-ignore
      formData.append("coverImg", file);
    }

    const response = await api.put<BookTemplate>("/template/fix", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    throw HandlerError.handleApiError(error, "Não foi possível atualizar o template.");
  }
};

import { BookTemplatePageDTO, BookTemplateSearchFilter } from "@/@types/template.types";
import * as HandlerError from "@/service/HandlerApiException";
import api from "./ConnectionApi";

export const searchTemplates = async (filter: BookTemplateSearchFilter): Promise<BookTemplatePageDTO> => {
  try {
    const response = await api.get<BookTemplatePageDTO>("/template/search", {
      params: filter,
    });
    return response.data;
  } catch (error) {
    throw HandlerError.handleApiError(error, "Não foi possível buscar os templates.");
  }
};

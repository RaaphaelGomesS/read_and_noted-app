import { BookPageDTO } from "@/@types/auth.types";
import * as HandlerError from "@/service/HandlerApiException";
import api from "./ConnectionApi";

const getBooksByStatus = async (
  statusEndpoint: string,
  libraryId: number,
  page = 0,
  pageSize = 10,
  direction = 'DESC'
): Promise<BookPageDTO> => {
  try {
    const response = await api.get<BookPageDTO>(
      `/book/${statusEndpoint}/${libraryId}`,
      {
        params: { page, pageSize, direction },
      }
    );
    return response.data;
  } catch (error) {
    throw HandlerError.handleApiError(error, `Não foi possível buscar os livros com status ${statusEndpoint}.`);
  }
};

export const getReadingBooks = (libraryId: number, page?: number, pageSize?: number) => {
  return getBooksByStatus('reading', libraryId, page, pageSize);
};

export const getFinishedBooks = (libraryId: number, page?: number, pageSize?: number) => {
  return getBooksByStatus('finished', libraryId, page, pageSize);
};

export const getAwaitingBooks = (libraryId: number, page?: number, pageSize?: number) => {
  return getBooksByStatus('awaited', libraryId, page, pageSize);
};

export const getDroppedBooks = (libraryId: number, page?: number, pageSize?: number) => {
  return getBooksByStatus('dropped', libraryId, page, pageSize);
};
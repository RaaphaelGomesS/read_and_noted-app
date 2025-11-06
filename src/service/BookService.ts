import * as BookTypes from "@/@types/book.types";
import { SuggestionRequest } from "@/@types/suggestion.type";
import * as HandlerError from "@/service/HandlerApiException";
import { Platform } from "react-native";
import api from "./ConnectionApi";

const getBooksByStatus = async (
  statusEndpoint: string,
  libraryId: number,
  page = 0,
  pageSize = 10,
  direction = "DESC"
): Promise<BookTypes.BookPageDTO> => {
  try {
    const response = await api.get<BookTypes.BookPageDTO>(`/book/${statusEndpoint}/${libraryId}`, {
      params: { page, pageSize, direction },
    });
    return response.data;
  } catch (error) {
    throw HandlerError.handleApiError(error, `Não foi possível buscar os livros com status ${statusEndpoint}.`);
  }
};

export const getReadingBooks = (libraryId: number, page?: number, pageSize?: number) => {
  return getBooksByStatus("reading", libraryId, page, pageSize);
};

export const getFinishedBooks = (libraryId: number, page?: number, pageSize?: number) => {
  return getBooksByStatus("finished", libraryId, page, pageSize);
};

export const getAwaitingBooks = (libraryId: number, page?: number, pageSize?: number) => {
  return getBooksByStatus("awaited", libraryId, page, pageSize);
};

export const getDroppedBooks = (libraryId: number, page?: number, pageSize?: number) => {
  return getBooksByStatus("dropped", libraryId, page, pageSize);
};

export const getBookById = async (id: number): Promise<BookTypes.FullBookResponse> => {
  try {
    const response = await api.get<BookTypes.FullBookResponse>(`/book/${id}`);
    return response.data;
  } catch (error) {
    throw HandlerError.handleApiError(error, "Não foi possível buscar o livro.");
  }
};

export const updateBook = async (data: BookTypes.BookRequest): Promise<BookTypes.BookResponse> => {
  try {
    const response = await api.put<BookTypes.BookResponse>("/book/", data);
    return response.data;
  } catch (error) {
    throw HandlerError.handleApiError(error, "Não foi possível atualizar o livro.");
  }
};

export const deleteBook = async (id: number): Promise<void> => {
  try {
    await api.delete(`/book/${id}`);
  } catch (error) {
    throw HandlerError.handleApiError(error, "Não foi possível excluir o livro.");
  }
};

export const createBook = async (request: BookTypes.BookCreateRequest, imageUri?: string) => {
  try {
    const formData = new FormData();

    formData.append("book", JSON.stringify(request));

    if (imageUri && !imageUri.startsWith("http")) {
      const uriParts = imageUri.split(".");
      const fileType = uriParts[uriParts.length - 1];

      const file = {
        uri: Platform.OS === "android" ? imageUri : imageUri.replace("file://", ""),
        name: `cover.${fileType}`,
        type: `image/${fileType}`,
      };

      // @ts-ignore
      formData.append("coverImg", file);
    }

    const response = await api.post("/book/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    throw HandlerError.handleApiError(error, "Não foi possível criar o livro.");
  }
};

export const createSuggestion = async (request: SuggestionRequest, imageUri?: string) => {
  try {
    const formData = new FormData();
    formData.append("suggestion", JSON.stringify(request));

    if (imageUri && !imageUri.startsWith("http")) {
      const uriParts = imageUri.split(".");
      const fileType = uriParts[uriParts.length - 1];
      const file = {
        uri: Platform.OS === "android" ? imageUri : imageUri.replace("file://", ""),
        name: `cover.${fileType}`,
        type: `image/${fileType}`,
      };
      // @ts-ignore
      formData.append("coverImg", file);
    }

    const response = await api.post("/suggestion/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    throw HandlerError.handleApiError(error, "Não foi possível enviar a sugestão.");
  }
};
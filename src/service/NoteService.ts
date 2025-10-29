import { NoteCategory, NoteFilter, NoteFull, NoteRequest, NoteSummary } from "@/@types/auth.types";
import * as HandlerError from "@/service/HandlerApiException";
import api from "./ConnectionApi";

type NoteResponsePageDTO = {
  page: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
  data: NoteSummary[];
};

export const getNotes = async (filter: NoteFilter): Promise<NoteResponsePageDTO> => {
  try {
    const response = await api.get<NoteResponsePageDTO>('/note/', { params: filter });
    return response.data;
  } catch (error) {
    throw HandlerError.handleApiError(error, "Não foi possível buscar as anotações.");
  }
};

export const getNoteById = async (id: number): Promise<NoteFull> => {
  try {
    const response = await api.get<NoteFull>(`/note/${id}`);
    return response.data;
  } catch (error) {
    throw HandlerError.handleApiError(error, "Não foi possível buscar a anotação.");
  }
};

export const createNote = async (data: NoteRequest): Promise<NoteSummary> => {
  try {
    const response = await api.post<NoteSummary>('/note/', data);
    return response.data;
  } catch (error) {
    throw HandlerError.handleApiError(error, "Não foi possível criar a anotação.");
  }
};

export const updateNote = async (data: NoteRequest): Promise<NoteSummary> => {
  try {
    const response = await api.put<NoteSummary>('/note/', data);
    return response.data;
  } catch (error) {
    throw HandlerError.handleApiError(error, "Não foi possível atualizar a anotação.");
  }
};

export const deleteNote = async (id: number): Promise<void> => {
  try {
    await api.delete(`/note/${id}`);
  } catch (error) {
    throw HandlerError.handleApiError(error, "Não foi possível excluir a anotação.");
  }
};

export const getNoteCategories = async (): Promise<NoteCategory[]> => {
  try {
    const response = await api.get<NoteCategory[]>('/category/');
    return response.data;
  } catch (error) {
    throw HandlerError.handleApiError(error, "Não foi possível buscar as categorias.");
  }
};

export const createNoteCategory = async (name: string): Promise<NoteCategory> => {
    try {
        const response = await api.post<NoteCategory>('/category/', { name });
        return response.data;
    } catch (error) {
        throw HandlerError.handleApiError(error, "Não foi possível criar a categoria.");
    }
};

export const deleteNoteCategory = async (id: number): Promise<void> => {
    try {
        await api.delete(`/category/${id}`);
    } catch (error) {
        throw HandlerError.handleApiError(error, "Não foi possível excluir a categoria.");
    }
};
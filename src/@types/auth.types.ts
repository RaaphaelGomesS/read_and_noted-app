export interface User {
  id: string;
  username: string;
  email: string;
  role: 'ADMIN' | 'DEFAULT';
}

export type UserRequestDTO = {
  email?: string;
  username?: string;
  password?: string;
};

export type UserResponseDTO = {
  id: number;
  email: string;
  username: string;
};

export type BookStatus = 'lendo' | 'aguardando' | 'finalizado' | 'parado';

export type Book = {
  id: number;
  title: string;
  author: string;
  img: string;
  readPages: number;
  totalPages: number;
};

export type Library = {
  id: number;
  name: string;
  description?: string;
};

export type NoteType = 'Rápida' | 'Referência' | 'Permanente';

export type NoteSummary = {
  id: number;
  title: string;
  category: string;
  type: NoteType;
  bookReference: number | null;
  createdDate: string;
  updatedDate: string;
};

export type NoteFull = {
  id: number;
  title: string;
  content: string;
  category: string;
  type: NoteType;
  bookReference: number | null;
  createdDate: string;
  linkedNotes: { id: number; title: string }[];
};

export type NoteCategory = {
  id: number;
  name: string;
};

export type NoteFilter = {
  title?: string;
  categoryId?: number;
  bookId?: number;
  type?: NoteType;
  page?: number;
  pageSize?: number;
};

export type NoteRequest = {
  id?: number;
  reference?: number;
  category?: string;
  type?: NoteType;
  title: string;
  content: string;
};
export interface User {
  id: string;
  username: string;
  email: string;
  role: "ADMIN" | "DEFAULT";
}

export type UserRequestDTO = {
  identifier?: string;
  password?: string;
};

export type UserResponseDTO = {
  id: number;
  email: string;
  username: string;
};

export type BookStatus = "lendo" | "aguardando" | "finalizado" | "parado";

export type Book = {
  id: number;
  title: string;
  author: string;
  img: string;
  readPages: number;
  totalPages: number;
  rating?: number;
  startedDate?: string;
  finishedDate?: string;
  status?: string;
};

export type Library = {
  id: number;
  name: string;
  description?: string;
};

export type NoteType = "Rápida" | "Referência" | "Permanente";

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

export type BookResponse = {
  id: number;
  img: string;
  title: string;
  author: string;
  status: string;
  pages: number;
  rating: number;
  startedDate: string | null;
  finishedDate: string | null;
  totalPages: number;
};

export type BookPageDTO = {
  page: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
  data: BookResponse[];
};

export type BookTemplate = {
  id: number;
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  edition: string;
  description: string;
  year: number;
  pages: number;
  img: string;
  status: string;
  categories: string[];
};

export type BookTemplateSearchFilter = {
  title?: string;
  author?: string;
  ISBN?: string;
  page?: number;
  pageSize?: number;
};

export type BookTemplatePageDTO = {
  page: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
  data: BookTemplate[];
};

export type BookRequest = {
  id?: number;
  status: string;
  pages: number;
  rating: number;
  startedDate: string | null;
  finishedDate: string | null;
  libraryId: number;
};

export type BookTemplateRequest = {
  templateId?: number;
  isbn?: string;
  title?: string;
  author?: string;
  publisher?: string;
  edition?: string;
  description?: string;
  year?: number;
  pages?: number;
  categories?: string[];
};

export type BookCreateRequest = {
  book: BookRequest;
  template: BookTemplateRequest;
};

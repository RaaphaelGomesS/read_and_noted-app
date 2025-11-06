import { BookTemplate, BookTemplateRequest } from "./template.types";

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

export type FullBookResponse = {
  book: BookResponse;
  template: BookTemplate;
};

export type BookResponse = {
  id: number;
  libraryId: number;
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

export type BookRequest = {
  id?: number;
  status: string;
  pages: number;
  rating: number;
  startedDate: string | null;
  finishedDate: string | null;
  libraryId: number;
};

export type BookCreateRequest = {
  book: BookRequest;
  template: BookTemplateRequest;
};

import { BookTemplate } from "./template.types";

export type Suggestion = {
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
  reason: string;
  justification: string | null;
  status: string;
  categories: string[];
  suggesterUsername: string;
};

export type SuggestionRequest = {
  templateId: number;
  suggestedISBN?: string;
  suggestedTitle: string;
  suggestedAuthor: string;
  suggestedPublisher?: string;
  suggestedEdition?: string;
  suggestedReason: string;
  suggestedDescription?: string;
  suggestedYear?: number;
  suggestedPages?: number;
  suggestedCategories?: string[];
};

export type SuggestionPageDTO = {
  page: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
  data: Suggestion[];
};

export type SuggestionDetails = {
  updated: Suggestion;
  template: BookTemplate;
};

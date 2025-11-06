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
